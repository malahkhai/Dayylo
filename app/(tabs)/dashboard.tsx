import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
    const { habits } = useHabits();
    const { isUnlocked, authenticate } = usePrivacy();
    const router = useRouter();

    const buildHabits = habits.filter(h => h.type === 'build');
    const breakHabits = habits.filter(h => h.type === 'break');

    const completedBuild = buildHabits.filter(h => h.completedToday).length;
    const avoidedBreak = breakHabits.filter(h => h.completedToday).length;
    const totalHabits = habits.length;
    const totalDone = habits.filter(h => h.completedToday).length;

    const progressPercent = Math.round((totalDone / totalHabits) * 100) || 0;

    const getStatusColor = (percent: number) => {
        if (percent === 100) return '#22c55e'; // Green
        if (percent >= 70) return '#f59e0b'; // Amber
        return '#ef4444'; // Muted red
    };

    const handleBreakPress = async () => {
        if (!isUnlocked) {
            await authenticate();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-6">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white">Dashboard</Text>
                    <Text className="text-slate-400 font-medium mt-1">Your progress at a glance</Text>
                </View>

                {/* Daily Status Card */}
                <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-7 mb-6 shadow-sm border border-slate-50 dark:border-white/5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Daily Status</Text>
                            <Text className="text-sm font-medium text-slate-400">{totalDone} / {totalHabits} habits completed</Text>
                        </View>
                        <Text className="text-4xl font-black" style={{ color: getStatusColor(progressPercent) }}>
                            {progressPercent}%
                        </Text>
                    </View>
                    <View className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <View
                            className="h-full rounded-full"
                            style={{ width: `${progressPercent}%`, backgroundColor: getStatusColor(progressPercent) }}
                        />
                    </View>
                </View>

                {/* Habit Overview Cards */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-blue-50 dark:bg-blue-950/20 rounded-[32px] p-6 border border-blue-100 dark:border-blue-500/10">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.TrendingUp size={16} color="#3b82f6" />
                            <Text className="ml-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">Build</Text>
                        </View>
                        <Text className="text-3xl font-black text-slate-900 dark:text-white">{buildHabits.length}</Text>
                        <Text className="text-xs font-bold text-slate-400">{completedBuild} Done today</Text>
                    </View>

                    <Pressable
                        onPress={handleBreakPress}
                        className="flex-1 bg-orange-50 dark:bg-orange-950/20 rounded-[32px] p-6 border border-orange-100 dark:border-orange-500/10 active:opacity-80"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-row items-center">
                                <LucideIcons.Shield size={16} color="#f97316" />
                                <Text className="ml-2 text-[10px] font-black text-orange-500 uppercase tracking-widest">Break</Text>
                            </View>
                            {!isUnlocked && <LucideIcons.Lock size={14} color="#f97316" />}
                        </View>
                        <Text className="text-3xl font-black text-slate-900 dark:text-white">
                            {isUnlocked ? breakHabits.length : '--'}
                        </Text>
                        <Text className="text-xs font-bold text-slate-400">
                            {isUnlocked ? `${avoidedBreak} Avoided` : 'Locked'}
                        </Text>
                    </Pressable>
                </View>

                {/* Streak Pulse */}
                <View className="bg-slate-900 dark:bg-black rounded-[32px] p-7 mb-6 shadow-xl">
                    <Text className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-4">Streak Pulse</Text>
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-white text-sm font-bold">Longest Build</Text>
                            <View className="flex-row items-baseline mt-1">
                                <Text className="text-white text-3xl font-black">
                                    {Math.max(...buildHabits.map(h => h.longestStreak), 0)}
                                </Text>
                                <Text className="text-white/40 text-xs font-bold ml-1">Days</Text>
                            </View>
                        </View>
                        <View className="h-10 w-[1px] bg-white/10" />
                        <View className="items-end">
                            <Text className="text-white text-sm font-bold">Longest Break</Text>
                            <View className="flex-row items-baseline mt-1">
                                <Text className="text-white text-3xl font-black">
                                    {isUnlocked ? Math.max(...breakHabits.map(h => h.longestStreak), 0) : '--'}
                                </Text>
                                <Text className="text-white/40 text-xs font-bold ml-1">Days</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="mb-32">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Quick Actions</Text>
                    <View className="flex-row gap-4 mb-4">
                        <Pressable className="flex-1 bg-white dark:bg-surface-dark-alt p-5 rounded-[24px] border border-slate-100 dark:border-white/5 items-center">
                            <LucideIcons.Bell size={24} color="#94a3b8" />
                            <Text className="text-[11px] font-black text-slate-600 dark:text-slate-400 mt-2">Reminders</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleBreakPress}
                            className="flex-1 bg-white dark:bg-surface-dark-alt p-5 rounded-[24px] border border-slate-100 dark:border-white/5 items-center"
                        >
                            <LucideIcons.EyeOff size={24} color={isUnlocked ? "#30e8ab" : "#94a3b8"} />
                            <Text className="text-[11px] font-black text-slate-600 dark:text-slate-400 mt-2">
                                {isUnlocked ? 'Unlocked' : 'Privacy'}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/add')}
                            className="flex-1 bg-white dark:bg-surface-dark-alt p-5 rounded-[24px] border border-slate-100 dark:border-white/5 items-center"
                        >
                            <LucideIcons.Plus size={24} color="#94a3b8" />
                            <Text className="text-[11px] font-black text-slate-600 dark:text-slate-400 mt-2">Add New</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
