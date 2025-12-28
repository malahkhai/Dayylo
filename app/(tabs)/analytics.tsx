import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { INITIAL_HABITS } from '../../constants';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'All'>('7D');

    // Mock data for heatmap
    const heatmapDays = Array.from({ length: 35 }, (_, i) => ({
        id: i,
        score: Math.floor(Math.random() * 100),
    }));

    const getScoreColor = (score: number) => {
        if (score >= 100) return '#22c55e'; // Green
        if (score >= 70) return '#facc15'; // Yellow
        if (score >= 40) return '#f59e0b'; // Amber
        return '#ef4444'; // Muted red
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-6">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white">Analytics</Text>
                    <Text className="text-slate-400 font-medium mt-1">Measuring what matters</Text>
                </View>

                {/* Daily Balance Score */}
                <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-8 mb-6 shadow-sm border border-slate-50 dark:border-white/5 items-center">
                    <Text className="text-xs font-black uppercase tracking-[2px] text-slate-400 mb-4">Daily Balance Score</Text>
                    <View className="w-40 h-40 rounded-full border-[10px] border-slate-50 dark:border-white/5 items-center justify-center relative">
                        {/* Progress ring placeholder */}
                        <View className="absolute inset-0 rounded-full border-[10px] border-primary" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '45deg' }] }} />
                        <Text className="text-5xl font-black text-slate-900 dark:text-white">84%</Text>
                    </View>
                    <View className="flex-row gap-8 mt-6">
                        <View className="items-center">
                            <Text className="text-slate-400 text-[10px] font-black uppercase mb-1">Build</Text>
                            <Text className="text-slate-900 dark:text-white font-black">92%</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-slate-400 text-[10px] font-black uppercase mb-1">Break</Text>
                            <Text className="text-slate-900 dark:text-white font-black">76%</Text>
                        </View>
                    </View>
                </View>

                {/* Calendar Heatmap Section */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Activity Heatmap</Text>
                        <LucideIcons.Calendar size={16} color="#94a3b8" />
                    </View>
                    <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] p-5 shadow-sm border border-slate-50 dark:border-white/5">
                        <View className="flex-row flex-wrap justify-between gap-2">
                            {heatmapDays.map((day) => (
                                <View
                                    key={day.id}
                                    className="w-8 h-8 rounded-lg"
                                    style={{ backgroundColor: getScoreColor(day.score), opacity: 0.8 }}
                                />
                            ))}
                        </View>
                        <View className="flex-row justify-between mt-4 px-1">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                <Text key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Summary Cards */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-white dark:bg-surface-dark-alt rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-white/5">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Build Rate</Text>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">94.2%</Text>
                        <View className="flex-row items-center mt-1">
                            <LucideIcons.ArrowUpRight size={12} color="#22c55e" />
                            <Text className="text-[10px] font-bold text-green-500 ml-0.5">+2.4%</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-white dark:bg-surface-dark-alt rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-white/5">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Break Rate</Text>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">68.5%</Text>
                        <View className="flex-row items-center mt-1">
                            <LucideIcons.ArrowDownRight size={12} color="#ef4444" />
                            <Text className="text-[10px] font-bold text-red-500 ml-0.5">-1.2%</Text>
                        </View>
                    </View>
                </View>

                {/* Trends (Premium) */}
                <View className="bg-slate-900 dark:bg-black rounded-[32px] p-7 mb-32 shadow-xl overflow-hidden relative">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-lg font-black tracking-tight">Trends</Text>
                        <View className="bg-primary px-2 py-1 rounded-md">
                            <Text className="text-[9px] font-black uppercase">Premium</Text>
                        </View>
                    </View>

                    {/* Mock chart placeholder */}
                    <View className="h-40 items-center justify-center">
                        <View className="w-full flex-row items-end justify-between px-4 gap-2 h-24">
                            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                <View key={i} className="flex-1 bg-primary/20 rounded-t-lg" style={{ height: `${h}%` }}>
                                    <View className="w-full bg-primary rounded-t-lg" style={{ height: '30%' }} />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="flex-row justify-between mt-4 px-2">
                        {['7D', '30D', 'All'].map(t => (
                            <Pressable
                                key={t}
                                onPress={() => setTimeframe(t as any)}
                                className={`px-4 py-1.5 rounded-full ${timeframe === t ? 'bg-white' : 'bg-white/10'}`}
                            >
                                <Text className={`text-[10px] font-black ${timeframe === t ? 'text-black' : 'text-white/60'}`}>{t}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
