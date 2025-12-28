import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const { habits } = useHabits();
    const { isUnlocked, authenticate } = usePrivacy();
    const router = useRouter();

    const buildHabits = habits.filter(h => h.type === 'build');
    const breakHabits = habits.filter(h => h.type === 'break');

    const totalDone = habits.filter(h => h.completedToday).length;
    const progressPercent = habits.length > 0 ? Math.round((totalDone / habits.length) * 100) : 0;

    const handlePrivacyPress = async () => {
        if (!isUnlocked) await authenticate();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="pt-8 pb-6 flex-row justify-between items-start">
                    <View>
                        <Text className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Text>
                        <Text className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</Text>
                    </View>
                    <Pressable className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
                            className="w-full h-full"
                        />
                    </Pressable>
                </View>

                {/* Daily Progress Card */}
                <View className="bg-white rounded-[32px] p-8 mb-6 border border-slate-100 shadow-sm">
                    <View className="flex-row justify-between items-start mb-6">
                        <View>
                            <Text className="text-[15px] font-black text-slate-900">Daily Progress</Text>
                            <Text className="text-[13px] font-bold text-slate-400">Keep up the momentum!</Text>
                        </View>
                        <Text className="text-3xl font-black text-accent-blue">{progressPercent}%</Text>
                    </View>

                    <View className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden mb-6">
                        <View
                            className="h-full bg-accent-blue rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </View>

                    <View className="flex-row justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                        <Text className="text-slate-400 font-bold text-xs">{totalDone} of {habits.length} Habits Completed</Text>
                        <View className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                            <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                            <Text className="text-[10px] font-black text-green-600 uppercase">On Track</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.Flame size={16} color="#f97316" fill="#f97316" />
                            <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Build Streak</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-2xl font-black text-slate-900">
                                {Math.max(...buildHabits.map(h => h.streak), 0)}
                            </Text>
                            <Text className="text-[13px] font-bold text-slate-400 ml-1">Days</Text>
                        </View>
                    </View>

                    <View className="flex-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.Shield size={16} color="#3b82f6" />
                            <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Break Streak</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-2xl font-black text-slate-900">
                                {isUnlocked ? Math.max(...breakHabits.map(h => h.streak), 0) : '--'}
                            </Text>
                            <Text className="text-[13px] font-bold text-slate-400 ml-1">Days</Text>
                        </View>
                    </View>
                </View>

                {/* Your Habits Section */}
                <View className="mb-8">
                    <Text className="text-[13px] font-black text-slate-900 mb-4 px-1">Your Habits</Text>

                    {/* Build Habits Block */}
                    <View className="bg-blue-50/50 rounded-[32px] p-6 mb-4 border border-blue-100/50 flex-row items-center">
                        <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                            <LucideIcons.TrendingUp size={24} color="#3b82f6" />
                        </View>
                        <View className="ml-5 flex-1">
                            <Text className="text-lg font-black text-slate-900">Build Habits</Text>
                            <Text className="text-[13px] font-bold text-slate-400">
                                {buildHabits.length} Active • {buildHabits.filter(h => h.completedToday).length} Completed Today
                            </Text>
                        </View>
                        <LucideIcons.ChevronRight size={20} color="#cbd5e1" />
                    </View>

                    {/* Break Habits Block */}
                    <View className="bg-orange-50/50 rounded-[32px] p-6 mb-8 border border-orange-100/50 flex-row items-center">
                        <View className={`w-14 h-14 rounded-2xl items-center justify-center shadow-sm ${isUnlocked ? 'bg-white' : 'bg-slate-900'}`}>
                            {isUnlocked ? (
                                <LucideIcons.ShieldCheck size={24} color="#f97316" />
                            ) : (
                                <LucideIcons.Lock size={24} color="#ffffff" opacity={0.6} />
                            )}
                        </View>
                        <View className="ml-5 flex-1">
                            <Text className="text-lg font-black text-slate-900">Break Habits</Text>
                            <Text className="text-[13px] font-bold text-slate-400">
                                {isUnlocked ? `${breakHabits.length} Active` : 'Protected View'}
                            </Text>
                        </View>
                        {!isUnlocked ? (
                            <Pressable
                                onPress={handlePrivacyPress}
                                className="bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100"
                            >
                                <Text className="text-[10px] font-black text-slate-900 uppercase">Unlock</Text>
                            </Pressable>
                        ) : (
                            <LucideIcons.ChevronRight size={20} color="#cbd5e1" />
                        )}
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="pb-32">
                    <Text className="text-[13px] font-black text-slate-900 mb-4 px-1">Quick Actions</Text>
                    <View className="flex-row justify-between">
                        {[
                            { icon: 'Plus', label: 'Add Habit', onPress: () => router.push('/add') },
                            { icon: 'Bell', label: 'Reminders' },
                            { icon: 'EyeOff', label: 'Privacy', onPress: handlePrivacyPress }
                        ].map((action, i) => {
                            const Icon = (LucideIcons as any)[action.icon];
                            return (
                                <View key={i} className="items-center" style={{ width: (width - 48) / 3 }}>
                                    <Pressable
                                        onPress={action.onPress}
                                        className="w-16 h-16 bg-accent-blue rounded-full items-center justify-center shadow-lg shadow-blue-500/30 active:opacity-80"
                                    >
                                        <Icon size={24} color="white" />
                                    </Pressable>
                                    <Text className="mt-3 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                                        {action.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
