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
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="pt-8 pb-10 flex-row justify-between items-center">
                    <View>
                        <Text className="text-[11px] font-black uppercase tracking-[2px] text-white/40 mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Text>
                        <Text className="text-3xl font-black text-white tracking-tight">Dashboard</Text>
                    </View>
                    <Pressable className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 p-1">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
                            className="w-full h-full rounded-xl"
                        />
                    </Pressable>
                </View>

                {/* Daily Progress Card */}
                <View className="bg-surface-dark rounded-[40px] p-8 mb-8 border border-white/5 shadow-2xl">
                    <View className="flex-row justify-between items-start mb-6">
                        <View>
                            <Text className="text-[15px] font-black text-white">Daily Progress</Text>
                            <Text className="text-[13px] font-bold text-white/40">Keep up the momentum!</Text>
                        </View>
                        <Text className="text-3xl font-black text-primary">{progressPercent}%</Text>
                    </View>

                    <View className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
                        <View
                            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(48,232,171,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </View>

                    <View className="flex-row justify-between items-center bg-white/5 p-5 rounded-3xl">
                        <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest">{totalDone} of {habits.length} COMPLETED</Text>
                        <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center border border-primary/20">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            <Text className="text-[10px] font-black text-primary uppercase">On Track</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-row gap-4 mb-10">
                    <View className="flex-1 bg-surface-dark rounded-[32px] p-6 border border-white/5 shadow-lg">
                        <View className="flex-row items-center mb-4">
                            <View className="p-2 bg-orange-500/10 rounded-lg">
                                <LucideIcons.Flame size={14} color="#f97316" fill="#f97316" />
                            </View>
                            <Text className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-2">Build</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-3xl font-black text-white">
                                {Math.max(...buildHabits.map(h => h.streak), 0)}
                            </Text>
                            <Text className="text-[13px] font-bold text-white/40 ml-1">Days</Text>
                        </View>
                    </View>

                    <View className="flex-1 bg-surface-dark rounded-[32px] p-6 border border-white/5 shadow-lg">
                        <View className="flex-row items-center mb-4">
                            <View className="p-2 bg-primary/10 rounded-lg">
                                <LucideIcons.Shield size={14} color="#30e8ab" />
                            </View>
                            <Text className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-2">Break</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-3xl font-black text-white">
                                {isUnlocked ? Math.max(...breakHabits.map(h => h.streak), 0) : '--'}
                            </Text>
                            <Text className="text-[13px] font-bold text-white/40 ml-1">Days</Text>
                        </View>
                    </View>
                </View>

                {/* Your Habits Section */}
                <View className="mb-12">
                    <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-6 ml-1">Your Categories</Text>

                    {/* Build Habits Block */}
                    <Pressable className="bg-surface-dark rounded-[32px] p-6 mb-4 border border-white/5 flex-row items-center active:bg-white/5">
                        <View className="w-14 h-14 bg-white/5 rounded-2xl items-center justify-center">
                            <LucideIcons.TrendingUp size={24} color="#3b82f6" />
                        </View>
                        <View className="ml-5 flex-1">
                            <Text className="text-lg font-black text-white">Build Habits</Text>
                            <Text className="text-[13px] font-bold text-white/40">
                                {buildHabits.length} Active • {buildHabits.filter(h => h.completedToday).length} Done
                            </Text>
                        </View>
                        <LucideIcons.ChevronRight size={20} color="rgba(255,255,255,0.1)" />
                    </Pressable>

                    {/* Break Habits Block */}
                    <Pressable className="bg-surface-dark rounded-[32px] p-6 mb-8 border border-white/5 flex-row items-center active:bg-white/5">
                        <View className={`w-14 h-14 rounded-2xl items-center justify-center ${isUnlocked ? 'bg-white/5' : 'bg-primary/20'}`}>
                            {isUnlocked ? (
                                <LucideIcons.ShieldCheck size={24} color="#f97316" />
                            ) : (
                                <LucideIcons.Lock size={24} color="#30e8ab" />
                            )}
                        </View>
                        <View className="ml-5 flex-1">
                            <Text className="text-lg font-black text-white">Break Habits</Text>
                            <Text className="text-[13px] font-bold text-white/40">
                                {isUnlocked ? `${breakHabits.length} Active` : 'Protected View'}
                            </Text>
                        </View>
                        {!isUnlocked ? (
                            <Pressable
                                onPress={handlePrivacyPress}
                                className="bg-primary py-2 px-4 rounded-xl"
                            >
                                <Text className="text-[10px] font-black text-black uppercase">Unlock</Text>
                            </Pressable>
                        ) : (
                            <LucideIcons.ChevronRight size={20} color="rgba(255,255,255,0.1)" />
                        )}
                    </Pressable>
                </View>

                {/* Quick Actions */}
                <View className="pb-32">
                    <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-6 ml-1">Quick Actions</Text>
                    <View className="flex-row justify-between px-1">
                        {[
                            { icon: 'Plus', label: 'Add', onPress: () => router.push('/add'), color: '#30e8ab' },
                            { icon: 'Bell', label: 'Alerts', color: '#8b5cf6' },
                            { icon: 'EyeOff', label: 'Privacy', onPress: handlePrivacyPress, color: '#f97316' }
                        ].map((action, i) => {
                            const Icon = (LucideIcons as any)[action.icon];
                            return (
                                <View key={i} className="items-center" style={{ width: (width - 64) / 3 }}>
                                    <Pressable
                                        onPress={action.onPress}
                                        className="w-16 h-16 bg-surface-dark rounded-[24px] items-center justify-center border border-white/5 shadow-xl active:bg-white/5"
                                    >
                                        <Icon size={24} color={action.color} />
                                    </Pressable>
                                    <Text className="mt-3 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">
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
