import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { INITIAL_HABITS } from '../../constants';
import HabitTile from '../../components/HabitTile';
import { User, Habit } from '../../types';
import * as LucideIcons from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Dashboard() {
    const router = useRouter();
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
    const [user, setUser] = useState<User>({
        name: 'User',
        email: '',
        isLoggedIn: true,
        isUnlocked: false,
        onboardingStep: 3
    });

    const [activeDate, setActiveDate] = useState(11);
    const [showBuildList, setShowBuildList] = useState(true);
    const [showBreakList, setShowBreakList] = useState(false);

    const buildHabits = habits.filter((h: Habit) => h.type === 'build');
    const breakHabits = habits.filter((h: Habit) => h.type === 'break');

    const totalCompleted = habits.filter((h: Habit) => {
        if (h.completedToday) return true;
        if (h.targetValue !== undefined && h.currentValue !== undefined && h.currentValue >= h.targetValue) return true;
        return false;
    }).length;

    const progressPercent = habits.length > 0 ? (totalCompleted / habits.length) * 100 : 0;

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(`${progressPercent}%`, { damping: 15 }),
        };
    });

    const dates = [
        { label: 'SA', num: 9 },
        { label: 'SU', num: 10 },
        { label: 'MO', num: 11 },
        { label: 'TU', num: 12 },
        { label: 'WE', num: 13 },
    ];

    const onToggleHabit = (id: string) => {
        setHabits((prev: Habit[]) => prev.map((h: Habit) =>
            h.id === id ? { ...h, completedToday: !h.completedToday } : h
        ));
    };

    const onUpdateHabitValue = (id: string, delta: number) => {
        setHabits((prev: Habit[]) => prev.map((h: Habit) => {
            if (h.id === id && h.currentValue !== undefined) {
                const newVal = Math.max(0, h.currentValue + delta);
                return { ...h, currentValue: newVal };
            }
            return h;
        }));
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="pt-8 pb-6 flex-row justify-between items-start">
                    <View>
                        <Text className="text-[11px] font-black uppercase tracking-[2px] text-slate-400">Tuesday, Oct 24</Text>
                        <Text className="text-4xl font-black text-slate-900 dark:text-white">Dashboard</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }}
                            className="w-full h-full"
                        />
                    </View>
                </View>

                {/* Daily Progress Card */}
                <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-7 mb-6 shadow-sm border border-slate-50 dark:border-white/5">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Daily Progress</Text>
                            <Text className="text-sm font-medium text-slate-400">Keep up the momentum!</Text>
                        </View>
                        <Text className="text-4xl font-black text-[#137fec]">{progressPercent}%</Text>
                    </View>

                    <View className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-5">
                        {/* @ts-ignore */}
                        <Animated.View
                            className="h-full bg-[#137fec] rounded-full"
                            style={progressStyle}
                        />
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">
                            {totalCompleted} of {habits.length} Habits
                        </Text>
                        <View className="flex-row items-center">
                            <LucideIcons.TrendingUp size={16} color="#137fec" />
                            <Text className="ml-1 text-[11px] font-black uppercase text-[#137fec]">On Track</Text>
                        </View>
                    </View>
                </View>

                {/* Streaks Grid */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-[#fff9f2] dark:bg-orange-950/20 rounded-[32px] p-6 border border-orange-100 dark:border-orange-500/10">
                        <View className="flex-row items-center mb-4">
                            <Text className="mr-2">🔥</Text>
                            <Text className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Build</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-4xl font-black text-slate-900 dark:text-white">12</Text>
                            <Text className="text-xs font-bold text-slate-400 ml-1">Days</Text>
                        </View>
                    </View>

                    <View className="flex-1 bg-[#f0f7ff] dark:bg-blue-950/20 rounded-[32px] p-6 border border-blue-100 dark:border-blue-500/10">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.Shield size={16} color="#3b82f6" />
                            <Text className="ml-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">Break</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-4xl font-black text-slate-900 dark:text-white">5</Text>
                            <Text className="text-xs font-bold text-slate-400 ml-1">Days</Text>
                        </View>
                    </View>
                </View>

                {/* Calendar Strip */}
                <View className="bg-[#1c1c1e] p-4 rounded-[32px] mb-10">
                    <View className="flex-row justify-between">
                        {dates.map((d) => (
                            <TouchableOpacity
                                key={d.num}
                                onPress={() => setActiveDate(d.num)}
                                className={`items-center justify-center w-12 h-16 rounded-[16px] ${activeDate === d.num ? 'bg-white' : 'bg-white/5'}`}
                            >
                                <Text className={`text-[9px] font-black uppercase mb-1 ${activeDate === d.num ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {d.label}
                                </Text>
                                <Text className={`text-base font-black ${activeDate === d.num ? 'text-black' : 'text-slate-400'}`}>{d.num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Your Habits */}
                <Text className="text-xl font-black text-slate-900 dark:text-white mb-6">Your Habits</Text>

                {/* Build Habits */}
                <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-5 mb-4 shadow-sm border border-slate-100 dark:border-white/5">
                    <TouchableOpacity
                        onPress={() => setShowBuildList(!showBuildList)}
                        className="flex-row items-center"
                    >
                        <View className="w-16 h-16 rounded-[20px] bg-[#f0f7ff] dark:bg-blue-500/10 items-center justify-center">
                            <LucideIcons.Activity size={32} color="#137fec" />
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Build Habits</Text>
                            <Text className="text-sm font-bold text-slate-400">
                                {buildHabits.length} Active • {buildHabits.filter(h => h.completedToday).length} Done
                            </Text>
                        </View>
                        <LucideIcons.ChevronDown size={20} color="#137fec" style={{ transform: [{ rotate: showBuildList ? '0deg' : '-90deg' }] }} />
                    </TouchableOpacity>

                    {showBuildList && (
                        <View className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5">
                            {buildHabits.map((habit: Habit) => (
                                <HabitTile key={habit.id} habit={habit} onToggle={onToggleHabit} onUpdateValue={onUpdateHabitValue} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Break Habits */}
                <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-5 mb-20 shadow-sm border border-slate-100 dark:border-white/5">
                    <TouchableOpacity
                        onPress={() => user.isUnlocked ? setShowBreakList(!showBreakList) : router.push('/paywall')}
                        className="flex-row items-center"
                    >
                        <View className="w-16 h-16 rounded-[20px] bg-orange-100 dark:bg-orange-500/10 items-center justify-center">
                            <LucideIcons.Lock size={32} color="#f97316" />
                        </View>
                        <View className="flex-1 ml-4">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-black text-slate-900 dark:text-white">Break Habits</Text>
                                {!user.isUnlocked && (
                                    <View className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded ml-2">
                                        <Text className="text-[10px] font-black text-slate-400 uppercase">Locked</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-sm font-bold text-slate-400">
                                {breakHabits.length} Active • Protected
                            </Text>
                        </View>
                        <LucideIcons.ChevronDown size={20} color="#f97316" style={{ transform: [{ rotate: showBreakList ? '0deg' : '-90deg' }] }} />
                    </TouchableOpacity>

                    {showBreakList && user.isUnlocked && (
                        <View className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5">
                            {breakHabits.map((habit: Habit) => (
                                <HabitTile key={habit.id} habit={habit} onToggle={onToggleHabit} onUpdateValue={onUpdateHabitValue} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                onPress={() => router.push('/add')}
                className="absolute bottom-8 right-8 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
            >
                <LucideIcons.Plus size={32} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
