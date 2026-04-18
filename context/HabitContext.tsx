import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Platform, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { Analytics } from '../services/analytics';
import { useAuth } from './AuthContext';
import { FirestoreService } from '../services/firestore';
import { Habit } from '../types';
import { INITIAL_HABITS } from '../constants';
import { requestPermissionsAsync, scheduleHabitReminders, cancelDailyReminder, registerForPushNotificationsAsync } from '../utils/notifications';

console.log('[Heartbeat] HabitContext.tsx module loaded');

// ─── Derived Stat Types ───────────────────────────────────────────────────────

export interface WeekDayData {
    day: string;
    label: string;
    date: string;
    completion: number; // 0–1
    missedCount: number;
    trackedCount: number;
}

export interface MonthlyData {
    month: string;
    value: number; // 0–100
}

// ─── Context Type ─────────────────────────────────────────────────────────────

interface HabitContextType {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'trackedToday'>) => Promise<boolean>;
    addHabits: (habits: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'trackedToday'>[]) => Promise<boolean>;
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
    totalMissedThisWeek: number;
    archiveHabit: (id: string, shouldArchive: boolean) => Promise<void>;
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
    
    console.log('[Heartbeat] HabitProvider mounted. Auth User loaded:', !!user);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            console.log('[Heartbeat] HabitContext: User is null, clearing habits');
            setHabits([]);
            setLoading(false);
        }
    }, [user]);

    // Handle AppState changes (e.g. returning to foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active' && user) {
                console.log('[Heartbeat] HabitContext: App returned to active. Refreshing data...');
                loadData();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [user]);

    useEffect(() => {
        if (!loading && user) {
            if (notificationsEnabled) {
                requestPermissionsAsync().then(granted => {
                    if (granted) scheduleHabitReminders(habits);
                });

                registerForPushNotificationsAsync().then(token => {
                    if (token) {
                        firestore().collection('users').doc(user.uid).set({ pushToken: token }, { merge: true });
                    }
                });
            } else {
                cancelDailyReminder();
                firestore().collection('users').doc(user.uid).set({ pushToken: firestore.FieldValue.delete() }, { merge: true });
            }
        }
    }, [notificationsEnabled, loading, user]);

    // ── Persist + Reset ─────────────────────────────────────────────────────

    const loadData = async () => {
        if (!user) return;
        try {
            console.log('[Heartbeat] HabitContext: Loading user data for uid:', user.uid);
            const data = await FirestoreService.getUserData(user.uid);

            const isDemoAccount = user.email === 'demo@dayylo.com';
            let parsedHabits: Habit[] = data?.habits || (isDemoAccount ? INITIAL_HABITS : []);

            const today = getTodayDate();
            const lastResetDate = data?.lastResetDate || '';

            if (lastResetDate !== today) {
                console.log('[Heartbeat] HabitContext: Performing daily reset');
                parsedHabits = parsedHabits.map(h => ({
                    ...h,
                    completedToday: false,
                    trackedToday: false,
                }));
                saveHabits(parsedHabits, today);
            }

            if (JSON.stringify(parsedHabits) !== JSON.stringify(habits)) {
                // SMART GUARD: If Firestore gives us an empty list but we ALREADY have habits locally
                // (e.g. from a storyboard auto-save or onboarding that just happened), ignore the empty sync.
                if (parsedHabits.length === 0 && habits.length > 0) {
                    console.log('[Heartbeat] HabitContext: Ignoring empty sync to protect local/onboarding habits');
                } else {
                    setHabits(parsedHabits);
                }
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

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                try {
                    // ── Initial Check ───────────────────────────────────────
                    const customerInfo = await Purchases.getCustomerInfo();
                    const hasPremium = Object.keys(customerInfo.entitlements.active).length > 0;
                    if (hasPremium && !newIsPremium) {
                        setIsPremium(true);
                        await FirestoreService.setPremiumStatus(user.uid, true);
                    }

                    // ── Real-Time Listener ──────────────────────────────────
                    Purchases.addCustomerInfoUpdateListener((info) => {
                        const isEntitled = Object.keys(info.entitlements.active).length > 0;
                        if (isEntitled !== isPremium) {
                            console.log('[Heartbeat] RevenueCat: Entitlement state changed to:', isEntitled);
                            setIsPremium(isEntitled);
                            FirestoreService.setPremiumStatus(user.uid, isEntitled);
                            Analytics.logEvent('premium_status_changed', { isPremium: isEntitled });
                        }
                    });
                } catch (e) {
                    console.log('[Heartbeat] RC init/check failed (safe ignored)', e);
                }
            }

        } catch (e: any) {
            console.error('[Heartbeat] HabitContext: Failed to load data', e);
            crashlytics().recordError(e, 'loadData');
        } finally {
            setLoading(false);
        }
    };

    const saveHabits = async (newHabits: Habit[], resetDate?: string) => {
        setHabits(newHabits);
        if (user) {
            try {
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
        const oldLevel = level;
        const newXp = totalDiscipline + amount;
        setTotalDiscipline(newXp);
        const newLevel = Math.floor(newXp / 100) + 1;
        setLevel(newLevel);
        
        if (newLevel > oldLevel) {
            Analytics.logEvent('level_up', { level: newLevel });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        if (user) {
            await firestore().collection('users').doc(user.uid).set({ totalDiscipline: newXp }, { merge: true });
        }
    };

    // ── Purchase Restoration ────────────────────────────────────────────────
    
    const restorePurchases = async () => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            try {
                const customerInfo = await Purchases.restorePurchases();
                const isEntitled = Object.keys(customerInfo.entitlements.active).length > 0;
                setIsPremium(isEntitled);
                if (user) {
                    await FirestoreService.setPremiumStatus(user.uid, isEntitled);
                }
                Analytics.logEvent('purchases_restored', { hasPremium: isEntitled });
                if (isEntitled) {
                    Alert.alert("Success", "Your premium features have been restored!");
                } else {
                    Alert.alert("No Purchases Found", "We couldn't find any active subscriptions for this account.");
                }
            } catch (e: any) {
                console.error("Restore failed:", e);
                Alert.alert("Error", e.message || "Failed to restore purchases.");
                crashlytics().recordError(e, 'restorePurchases');
            }
        }
    };

    // ── Actions ─────────────────────────────────────────────────────────────

    const setPremium = async (val: boolean) => {
        setIsPremium(val);
        if (user) {
            await FirestoreService.setPremiumStatus(user.uid, val);
            await Analytics.logEvent('premium_updated', { is_premium: val });
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
        await Analytics.logEvent('habit_added', {
            type: h.type,
            difficulty: h.difficulty
        });
        return true;
    };

    const addHabits = async (
        newHabitsList: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'trackedToday'>[]
    ): Promise<boolean> => {
        if (!isPremium && (habits.length + newHabitsList.length) > 5) {
            // Cap at 5 for free users during onboarding
            newHabitsList = newHabitsList.slice(0, 5 - habits.length);
        }

        const processedHabits: Habit[] = newHabitsList.map(h => ({
            ...h,
            id: Math.random().toString(36).substr(2, 9),
            streak: 0,
            longestStreak: 0,
            completedToday: false,
            trackedToday: false,
            history: {},
        }));

        console.log(`[Heartbeat] HabitContext: Batch adding ${processedHabits.length} habits`);
        await saveHabits([...habits, ...processedHabits]);
        
        await Analytics.logEvent('habits_weighted_added', {
            count: processedHabits.length
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
            await Analytics.logEvent('habit_completed', {
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
        const habitToDelete = habits.find(h => h.id === id);
        await saveHabits(habits.filter(h => h.id !== id));
        if (habitToDelete) {
            await Analytics.logEvent('habit_deleted', {
                name: habitToDelete.name,
                type: habitToDelete.type
            });
        }
    };

    const recordHabitResult = async (id: string, success: boolean) => {
        const today = getTodayDate();
        let xpGained = 0;
        let habitType: 'build' | 'break' | undefined;

        const newHabits = habits.map(h => {
            if (h.id !== id) return h;
            habitType = h.type;
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
        
        if (success) {
            if (xpGained > 0) await addXp(xpGained);
        } else {
            await Analytics.logEvent('habit_missed', {
                id,
                type: habitType
            });
        }
    };

    const archiveHabit = async (id: string, shouldArchive: boolean) => {
        const newHabits = habits.map(h => h.id === id ? { ...h, isArchived: shouldArchive } : h);
        await saveHabits(newHabits);
        
        await Analytics.logEvent(shouldArchive ? 'habit_archived' : 'habit_unarchived', {
            id,
            name: habits.find(h => h.id === id)?.name
        });

        if (shouldArchive) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    // ── Computed Stats (Memoized) ─────────────────────────────────────────────
    
    const globalStreak = useMemo(() => {
        if (habits.length === 0) return 0;
        
        const d = new Date();
        const activeDates = new Set<string>();
        habits.forEach(h => {
            if (h.history) {
                Object.entries(h.history).forEach(([date, val]) => {
                    if (val) activeDates.add(date);
                });
            }
        });

        if (activeDates.size === 0) return 0;

        let currentStreak = 0;
        const todayStr = d.toISOString().split('T')[0];
        const hasActivityToday = activeDates.has(todayStr);

        if (!hasActivityToday) {
            d.setDate(d.getDate() - 1);
        }

        while (true) {
            const dateStr = d.toISOString().split('T')[0];
            if (activeDates.has(dateStr)) {
                currentStreak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
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

    const weeklyData: WeekDayData[] = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const daysAgo = 6 - i;
        const date = getDateNDaysAgo(daysAgo);
        const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(date + 'T12:00:00').getDay()];
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date + 'T12:00:00').getDay()];

        const tracked = habits.filter(h => h.history && date in h.history).length;
        const completed = habits.filter(h => h.history && h.history[date] === true).length;
        const missed = habits.filter(h => h.history && h.history[date] === false).length;
        const completion = tracked > 0 ? completed / tracked : 0;

        return { day: dayName, label: dayLabel, date, completion, missedCount: missed, trackedCount: tracked };
    }), [habits]);

    const totalMissedThisWeek = useMemo(() => {
        return weeklyData.reduce((acc, d) => acc + d.missedCount, 0);
    }, [weeklyData]);

    const monthlyData: MonthlyData[] = useMemo(() => Array.from({ length: 4 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (3 - i));
        const monthStr = d.toLocaleString('default', { month: 'short' });
        const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

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

    const dailyBalanceScore = useMemo(() => {
        const completedToday = habits.filter(h => h.completedToday).length;
        return habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
    }, [habits]);

    const balanceVsLastWeek = useMemo(() => {
        const lastWeekAvg = (() => {
            const scores = weeklyData.slice(0, 6).map(d => Math.round(d.completion * 100));
            if (scores.length === 0) return 0;
            return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        })();
        return dailyBalanceScore - lastWeekAvg;
    }, [dailyBalanceScore, weeklyData]);

    const contextValue = useMemo(() => ({
        habits, addHabit, addHabits, editHabit, toggleHabit, updateHabitValue, deleteHabit, recordHabitResult,
        isPremium, setPremium, loading, totalDiscipline, globalStreak, level,
        totalCompletions, totalTracked, successRate, avgPerDay,
        weeklyData, monthlyData, dailyBalanceScore, balanceVsLastWeek, totalMissedThisWeek,
        userName, updateUserName, notificationsEnabled, setNotificationsEnabled, restorePurchases, archiveHabit,
    }), [
        habits, isPremium, loading, totalDiscipline, globalStreak, level,
        totalCompletions, totalTracked, successRate, avgPerDay,
        weeklyData, monthlyData, dailyBalanceScore, balanceVsLastWeek, totalMissedThisWeek,
        userName, notificationsEnabled, restorePurchases, archiveHabit
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
