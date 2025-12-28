import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<'Stats' | 'Habits'>('Stats');

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const buildActivity = [80, 60, 100, 40, 90, 70, 85];

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="items-center pt-8 pb-8">
                    <Text className="text-[14px] font-black uppercase tracking-[0.2em] mb-8 text-slate-400">Profile</Text>

                    <View className="relative mb-6">
                        <View className="w-32 h-32 rounded-full border-4 border-white dark:border-white/10 shadow-lg overflow-hidden">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop' }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white dark:bg-surface-dark items-center justify-center shadow-lg border border-slate-100 dark:border-white/10">
                            <Text className="text-xl">🔥</Text>
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Emma Jackson</Text>
                    <Text className="text-[12px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Member Since April 2024</Text>
                </View>

                <View className="px-6 mb-8">
                    <View className="bg-surface-dark p-1.5 rounded-[20px] flex-row border border-white/5">
                        {['Stats', 'Habits'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab as any)}
                                className={`flex-1 py-3 items-center rounded-[16px] ${activeTab === tab ? 'bg-white shadow-md' : ''}`}
                            >
                                <Text className={`text-[13px] font-black ${activeTab === tab ? 'text-black' : 'text-slate-500'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {activeTab === 'Stats' && (
                    <View className="px-6 gap-8 mb-32">
                        <View className="bg-[#ff5b22] rounded-[32px] p-7 shadow-lg relative overflow-hidden">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-row items-center">
                                    <LucideIcons.Flame size={20} color="rgba(255,255,255,0.8)" />
                                    <Text className="text-[12px] font-black uppercase tracking-widest text-white/70 ml-2">
                                        Longest Streak
                                    </Text>
                                </View>
                                <Text className="text-5xl font-black text-white tracking-tighter">78</Text>
                            </View>
                            <View className="flex-row justify-between items-end mt-4">
                                <Text className="text-base font-bold text-white/90 max-w-[180px]">Reading consistency</Text>
                                <Text className="text-[11px] font-black uppercase text-white/50">Days</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Weekly Activity</Text>
                            <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-white/5">
                                <View className="flex-row justify-between items-end h-20 gap-3">
                                    {buildActivity.map((val, i) => (
                                        <View key={i} className="flex-1 items-center gap-2">
                                            <View className="w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden flex-1 justify-end">
                                                <View className="w-full bg-primary rounded-full" style={{ height: `${val}%` }} />
                                            </View>
                                            <Text className="text-[10px] font-black text-slate-400">{weekDays[i]}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View className="flex-row flex-wrap gap-4">
                            {[
                                { label: 'Books Read', value: '12', icon: 'Book' },
                                { label: 'Workouts', value: '45', icon: 'Dumbbell' }
                            ].map((stat, i) => (
                                <View key={i} className="bg-white dark:bg-surface-dark-alt rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-white/5 items-center justify-center flex-1 min-w-[140px]">
                                    <Text className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</Text>
                                    <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity className="bg-white dark:bg-surface-dark-alt rounded-[24px] py-5 items-center justify-center border border-slate-100 dark:border-white/5">
                            <View className="flex-row items-center">
                                <LucideIcons.LogOut size={18} color="#94a3b8" />
                                <Text className="text-slate-400 font-black text-xs uppercase tracking-widest ml-2">Sign Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
