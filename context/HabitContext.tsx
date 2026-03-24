import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import { useAuth } from './AuthContext';
import { FirestoreService } from '../services/firestore';
import { Habit } from '../types';
import { INITIAL_HABITS } from '../constants';
import { requestPermissionsAsync, scheduleDailyReminder, cancelDailyReminder, registerForPushNotificationsAsync } from '../utils/notifications';

// ─── Derived Stat Types ───────────────────────────────────────────────────────

export interface WeekDayData {
    day: string;
    label: string;
    date: string;
    completion: number; // 0–1
}

export interface MonthlyData {
    month: string;
    value: number; // 0–100
}

// ─── Context Type ─────────────────────────────────────────────────────────────

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'trackedToday'>) => Promise<boolean>;
    editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    updateHabitValue: (id: string, delta: number) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    recordHabitResult: (id: string, success: boolean) => Promise<void>;
    isPremium: boolean;
    setPremium: (val: boolean) => void;
    loading: boolean;
    totalDiscipline: number;
    globalStreak: number;
    level: number;
    // ── Real computed stats ──────────────────────────────────────────────────
    totalCompletions: number;
    totalTracked: number;
    successRate: number; // 0–100
    avgPerDay: number;
    weeklyData: WeekDayData[];
    monthlyData: MonthlyData[];
    dailyBalanceScore: number; // 0–100
    balanceVsLastWeek: number; // delta percentage points
    // ── User profile ─────────────────────────────────────────────────────────
    userName: string;
    updateUserName: (name: string) => Promise<void>;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (val: boolean) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const getDateNDaysAgo = (n: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

const QUOTES = [
    "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
    "Your future is created by what you do today, not tomorrow. — Robert Kiyosaki",
    "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
    "The secret of your future is hidden in your daily routine. — Mike Murdock",
    "Small daily improvements over time lead to stunning results. — Robin Sharma",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "Discipline is the bridge between goals and accomplishment. — Jim Rohn",
    "Consistency is the true foundation of trust. — Roy T. Bennett",
    "It's not what we do once in a while that shapes our lives. It's what we do consistently. — Tony Robbins",
];

export const getDailyQuote = (): string => {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isPremium, setIsPremium] = useState(false);
    const [totalDiscipline, setTotalDiscipline] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');
    const [notificationsEnabled, setNotifications] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            // Unauthenticated state
            setHabits([]);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading && user) {
            if (notificationsEnabled) {
                requestPermissionsAsync().then(granted => {
                    if (granted) scheduleDailyReminder(20, 0); // 8:00 PM
                });

                // Fetch push token and save it to Firestore
                registerForPushNotificationsAsync().then(token => {
                    if (token) {
                        firestore().collection('users').doc(user.uid).set({ pushToken: token }, { merge: true });
                    }
                });
            } else {
                cancelDailyReminder();
                // Optionally remove the token from Firestore when they disable it
                firestore().collection('users').doc(user.uid).set({ pushToken: firestore.FieldValue.delete() }, { merge: true });
            }
        }
    }, [notificationsEnabled, loading, user]);

    // ── Persist + Reset ─────────────────────────────────────────────────────

    const loadData = async () => {
        if (!user) return;
        try {
            const data = await FirestoreService.getUserData(user.uid);

            const isDemoAccount = user.email === 'demo@dayylo.com';
            let parsedHabits: Habit[] = data?.habits || (isDemoAccount ? INITIAL_HABITS : []);

            // Daily reset logic
            const today = getTodayDate();
            const lastResetDate = data?.lastResetDate || '';

            if (lastResetDate !== today) {
                parsedHabits = parsedHabits.map(h => ({
                    ...h,
                    completedToday: false,
                    trackedToday: false,
                }));
                // Save reset habits (async, don't block UI)
                saveHabits(parsedHabits, today);
            }

            // Batch multiple state updates
            // React 18 automatically batches these in async functions, 
            // but we ensure only necessary updates happen.
            
            if (JSON.stringify(parsedHabits) !== JSON.stringify(habits)) {
                setHabits(parsedHabits);
            }

            const newIsPremium = data?.isPremium || false;
            if (newIsPremium !== isPremium) setIsPremium(newIsPremium);

            if (data?.totalDiscipline !== undefined) {
                const parsedXp = data.totalDiscipline;
                if (parsedXp !== totalDiscipline) {
                    setTotalDiscipline(parsedXp);
                    setLevel(Math.floor(parsedXp / 100) + 1);
                }
            }
            
            if (data?.userName && data.userName !== userName) setUserName(data.userName);
            if (data?.notificationsEnabled !== undefined && data.notificationsEnabled !== notificationsEnabled) {
                setNotifications(data.notificationsEnabled);
            }

            // Secure validation with RevenueCat
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                try {
                    const customerInfo = await Purchases.getCustomerInfo();
                    const hasPremium = Object.keys(customerInfo.entitlements.active).length > 0;
                    if (hasPremium && !newIsPremium) {
                        setIsPremium(true);
                        await FirestoreService.setPremiumStatus(user.uid, true);
                    }
                } catch (e) {
                    console.log('RC check failed', e);
                }
            }

        } catch (e: any) {
            console.error('Failed to load data', e);
            crashlytics().recordError(e, 'loadData');
        } finally {
            setLoading(false);
        }
    };

    const saveHabits = async (newHabits: Habit[], resetDate?: string) => {
        setHabits(newHabits);
        if (user) {
            try {
                // We use set for full habit array sync for now to keep it simple and consistent
                await firestore().collection('users').doc(user.uid).set({
                    habits: newHabits,
                    ...(resetDate ? { lastResetDate: resetDate } : {})
                }, { merge: true });
            } catch (error: any) {
                console.error("Error saving habits:", error);
                crashlytics().recordError(error, 'saveHabits');
            }
        }
    };

    // ── XP / Level ──────────────────────────────────────────────────────────

    const addXp = async (amount: number) => {
        const newXp = totalDiscipline + amount;
        setTotalDiscipline(newXp);
        setLevel(Math.floor(newXp / 100) + 1);
        if (user) {
            await firestore().collection('users').doc(user.uid).set({ totalDiscipline: newXp }, { merge: true });
        }
    };

    // ── Actions ─────────────────────────────────────────────────────────────

    const setPremium = async (val: boolean) => {
        setIsPremium(val);
        if (user) {
            await FirestoreService.setPremiumStatus(user.uid, val);
            await analytics().logEvent('premium_updated', { is_premium: val });
        }
    };

    const updateUserName = async (name: string) => {
        setUserName(name);
        if (user) {
            await firestore().collection('users').doc(user.uid).set({ userName: name }, { merge: true });
        }
    };

    const setNotificationsEnabled = async (val: boolean) => {
        setNotifications(val);
        if (user) {
            await firestore().collection('users').doc(user.uid).set({ notificationsEnabled: val }, { merge: true });
        }
    };

    const addHabit = async (
        h: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'trackedToday'>
    ): Promise<boolean> => {
        if (!isPremium && habits.length >= 3) return false;

        const newHabit: Habit = {
            ...h,
            id: Math.random().toString(36).substr(2, 9),
            streak: 0,
            longestStreak: 0,
            completedToday: false,
            trackedToday: false,
            history: {},
        };
        await saveHabits([...habits, newHabit]);
        await analytics().logEvent('habit_added', {
            type: h.type,
            difficulty: h.difficulty
        });
        return true;
    };

    const editHabit = async (id: string, updates: Partial<Habit>) => {
        const newHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
        await saveHabits(newHabits);
    };

    const toggleHabit = async (id: string) => {
        const today = getTodayDate();
        let xpGained = 0;
        const newHabits = habits.map(h => {
            if (h.id !== id) return h;
            const isNowCompleted = !h.completedToday;
            const newStreak = isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);

            if (isNowCompleted) {
                const diffPoints = h.difficulty === 'hard' ? 50 : h.difficulty === 'medium' ? 25 : 10;
                xpGained = h.type === 'break' ? diffPoints * 2 : diffPoints;
            }

            return {
                ...h,
                completedToday: isNowCompleted,
                trackedToday: true,
                streak: newStreak,
                longestStreak: Math.max(h.longestStreak, newStreak),
                history: { ...(h.history || {}), [today]: isNowCompleted },
            };
        });
        await saveHabits(newHabits);
        if (xpGained > 0) {
            await addXp(xpGained);
            await analytics().logEvent('habit_completed', {
                id,
                xp_gained: xpGained
            });
        }
    };

    const updateHabitValue = async (id: string, delta: number) => {
        const today = getTodayDate();
        const newHabits = habits.map(h => {
            if (h.id !== id || h.currentValue === undefined) return h;
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
                completedToday: isCompleted,
                trackedToday: true,
                history: { ...(h.history || {}), [today]: isCompleted },
            };
        });
        await saveHabits(newHabits);
    };

    const deleteHabit = async (id: string) => {
        await saveHabits(habits.filter(h => h.id !== id));
    };

    const recordHabitResult = async (id: string, success: boolean) => {
        const today = getTodayDate();
        let xpGained = 0;
        const newHabits = habits.map(h => {
            if (h.id !== id) return h;
            if (success) {
                const newStreak = h.streak + 1;
                const diffPoints = h.difficulty === 'hard' ? 50 : h.difficulty === 'medium' ? 25 : 10;
                xpGained = h.type === 'break' ? diffPoints * 2 : diffPoints;

                return {
                    ...h,
                    completedToday: true,
                    trackedToday: true,
                    streak: newStreak,
                    longestStreak: Math.max(h.longestStreak, newStreak),
                    history: { ...(h.history || {}), [today]: true },
                };
            } else {
                return {
                    ...h,
                    completedToday: false,
                    trackedToday: true,
                    streak: 0,
                    history: { ...(h.history || {}), [today]: false },
                };
            }
        });
        await saveHabits(newHabits);
        if (xpGained > 0) await addXp(xpGained);
    };

    // ── Computed Stats (Memoized) ─────────────────────────────────────────────
    
    // Global Streak: Count consecutive days where AT LEAST ONE habit was completed.
    const globalStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        
        const today = getTodayDate();
        let currentStreak = 0;
        let d = new Date();

        // Check today first
        const todayStr = d.toISOString().split('T')[0];
        const hasActivityToday = habits.some(h => h.history && h.history[todayStr] === true);

        // If no activity today, look at yesterday to determine if streak is still alive
        if (!hasActivityToday) {
            d.setDate(d.getDate() - 1);
        }

        // Optimization: Create a set of all active dates first
        const activeDates = new Set<string>();
        habits.forEach(h => {
            if (h.history) {
                Object.entries(h.history).forEach(([date, val]) => {
                    if (val) activeDates.add(date);
                });
            }
        });

        while (true) {
            const dateStr = d.toISOString().split('T')[0];
            if (activeDates.has(dateStr)) {
                currentStreak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }

            // Safety break
            if (currentStreak > 3650) break;
        }
        return currentStreak;
    }, [habits]);

    const totalCompletions = useMemo(() => {
        return habits.reduce((acc, h) => {
            const hist = h.history || {};
            return acc + Object.values(hist).filter(Boolean).length;
        }, 0);
    }, [habits]);

    const totalTracked = useMemo(() => {
        return habits.reduce((acc, h) => {
            const hist = h.history || {};
            return acc + Object.keys(hist).length;
        }, 0);
    }, [habits]);

    const successRate = useMemo(() => 
        totalTracked > 0 ? Math.round((totalCompletions / totalTracked) * 100) : 0
    , [totalCompletions, totalTracked]);

    const avgPerDay = useMemo(() => {
        const dates = new Set<string>();
        habits.forEach(h => Object.keys(h.history || {}).forEach(d => dates.add(d)));
        if (dates.size === 0) return 0;
        return Math.round((totalCompletions / dates.size) * 10) / 10;
    }, [habits, totalCompletions]);

    // Last 7 days completion data
    const weeklyData: WeekDayData[] = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const daysAgo = 6 - i;
        const date = getDateNDaysAgo(daysAgo);
        const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(date + 'T12:00:00').getDay()];
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date + 'T12:00:00').getDay()];

        const tracked = habits.filter(h => h.history && date in h.history).length;
        const completed = habits.filter(h => h.history && h.history[date] === true).length;
        const completion = tracked > 0 ? completed / tracked : 0;

        return { day: dayName, label: dayLabel, date, completion };
    }), [habits]);

    // Monthly data: last 4 months
    const monthlyData: MonthlyData[] = useMemo(() => Array.from({ length: 4 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (3 - i));
        const year = d.getFullYear();
        const month = d.getMonth();
        const monthStr = d.toLocaleString('default', { month: 'short' });
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;

        let tracked = 0, completed = 0;
        habits.forEach(h => {
            Object.entries(h.history || {}).forEach(([date, val]) => {
                if (date.startsWith(prefix)) {
                    tracked++;
                    if (val) completed++;
                }
            });
        });
        const value = tracked > 0 ? Math.round((completed / tracked) * 100) : 0;
        return { month: monthStr, value };
    }), [habits]);

    // Today's balance score
    const dailyBalanceScore = useMemo(() => {
        const completedToday = habits.filter(h => h.completedToday).length;
        return habits.length > 0
            ? Math.round((completedToday / habits.length) * 100)
            : 0;
    }, [habits]);

    // Compare today vs last-week avg
    const balanceVsLastWeek = useMemo(() => {
        const lastWeekAvg = (() => {
            const scores = weeklyData.slice(0, 6).map(d => Math.round(d.completion * 100));
            if (scores.length === 0) return 0;
            return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        })();
        return dailyBalanceScore - lastWeekAvg;
    }, [dailyBalanceScore, weeklyData]);

    // ── Render ───────────────────────────────────────────────────────────────

    const contextValue = useMemo(() => ({
        habits,
        addHabit,
        editHabit,
        toggleHabit,
        updateHabitValue,
        deleteHabit,
        recordHabitResult,
        isPremium,
        setPremium,
        loading,
        totalDiscipline,
        globalStreak,
        level,
        totalCompletions,
        totalTracked,
        successRate,
        avgPerDay,
        weeklyData,
        monthlyData,
        dailyBalanceScore,
        balanceVsLastWeek,
        userName,
        updateUserName,
        notificationsEnabled,
        setNotificationsEnabled,
    }), [
        habits, isPremium, loading, totalDiscipline, globalStreak, level,
        totalCompletions, totalTracked, successRate, avgPerDay,
        weeklyData, monthlyData, dailyBalanceScore, balanceVsLastWeek,
        userName, notificationsEnabled
    ]);

    return (
        <HabitContext.Provider value={contextValue}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within a HabitProvider');
    return context;
};
