import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types';
import { INITIAL_HABITS } from '../constants';

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday'>) => Promise<boolean>;
    toggleHabit: (id: string) => Promise<void>;
    updateHabitValue: (id: string, delta: number) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    recordHabitResult: (id: string, success: boolean) => Promise<void>;
    isPremium: boolean;
    setPremium: (val: boolean) => void;
    loading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHabits();
        AsyncStorage.getItem('daylo_premium').then(val => setIsPremium(val === 'true'));
    }, []);

    const loadHabits = async () => {
        try {
            const stored = await AsyncStorage.getItem('daylo_habits');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Basic reset logic for "completedToday" based on last open date could go here
                setHabits(parsed);
            } else {
                // First time load
                setHabits(INITIAL_HABITS);
                await AsyncStorage.setItem('daylo_habits', JSON.stringify(INITIAL_HABITS));
            }
        } catch (e) {
            console.error('Failed to load habits', e);
        } finally {
            setLoading(false);
        }
    };

    const saveHabits = async (newHabits: Habit[]) => {
        setHabits(newHabits);
        await AsyncStorage.setItem('daylo_habits', JSON.stringify(newHabits));
    };

    const setPremium = async (val: boolean) => {
        await AsyncStorage.setItem('daylo_premium', val.toString());
        setIsPremium(val);
    };

    const addHabit = async (h: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday'>) => {
        if (!isPremium && habits.length >= 3) {
            return false;
        }

        const newHabit: Habit = {
            ...h,
            id: Math.random().toString(36).substr(2, 9),
            streak: 0,
            longestStreak: 0,
            completedToday: false,
        };
        await saveHabits([...habits, newHabit]);
        return true;
    };

    const toggleHabit = async (id: string) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                const isNowCompleted = !h.completedToday;
                const newStreak = isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
                return {
                    ...h,
                    completedToday: isNowCompleted,
                    streak: newStreak,
                    longestStreak: Math.max(h.longestStreak, newStreak)
                };
            }
            return h;
        });
        await saveHabits(newHabits);
    };

    const updateHabitValue = async (id: string, delta: number) => {
        const newHabits = habits.map(h => {
            if (h.id === id && h.currentValue !== undefined) {
                const newVal = Math.max(0, h.currentValue + delta);
                const wasCompleted = h.targetValue !== undefined && h.currentValue >= h.targetValue;
                const isCompleted = h.targetValue !== undefined && newVal >= h.targetValue;

                let newStreak = h.streak;
                if (!wasCompleted && isCompleted) newStreak += 1;
                else if (wasCompleted && !isCompleted) newStreak = Math.max(0, newStreak - 1);

                return {
                    ...h,
                    currentValue: newVal,
                    streak: newStreak,
                    longestStreak: Math.max(h.longestStreak, newStreak),
                    completedToday: isCompleted
                };
            }
            return h;
        });
        await saveHabits(newHabits);
    };

    const deleteHabit = async (id: string) => {
        await saveHabits(habits.filter(h => h.id !== id));
    };

    const recordHabitResult = async (id: string, success: boolean) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                if (success) {
                    const newStreak = h.streak + 1;
                    return {
                        ...h,
                        completedToday: true,
                        streak: newStreak,
                        longestStreak: Math.max(h.longestStreak, newStreak)
                    };
                } else {
                    return {
                        ...h,
                        completedToday: false,
                        streak: 0
                    };
                }
            }
            return h;
        });
        await saveHabits(newHabits);
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabit, updateHabitValue, deleteHabit, recordHabitResult, isPremium, setPremium, loading }}>
            {children}
        </HabitContext.Provider>
    );
}

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within a HabitProvider');
    return context;
};
