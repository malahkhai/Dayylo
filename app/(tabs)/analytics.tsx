import React from 'react';
import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useHabits } from '../../context/HabitContext';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { habits, isPremium } = useHabits();

    // Mock data for heatmap
    const days = Array.from({ length: 35 }, (_, i) => ({
        id: i,
        intensity: Math.floor(Math.random() * 4), // 0 to 3
    }));

    const getHeatmapColor = (intensity: number) => {
        const colors = ['rgba(255,255,255,0.05)', '#065f46', '#059669', '#30e8ab'];
        return colors[intensity];
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-10">
                    <Text className="text-[11px] font-black uppercase tracking-[2px] text-white/40 mb-1">Performance</Text>
                    <Text className="text-3xl font-black text-white tracking-tight">Insights</Text>
                </View>

                {/* Daily Balance Score */}
                <View className="bg-surface-dark rounded-[32px] p-8 mb-8 border border-white/5 items-center">
                    <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest mb-6">Daily Balance Score</Text>
                    <View className="w-40 h-40 rounded-full border-[12px] border-white/5 items-center justify-center">
                        <View className="items-center">
                            <Text className="text-5xl font-black text-white">84</Text>
                            <Text className="text-primary font-black text-xs uppercase mt-1">+12% vs LW</Text>
                        </View>
                        {/* Simple SVG ring could go here for better visual */}
                    </View>
                    <View className="flex-row gap-8 mt-10">
                        <View className="items-center">
                            <Text className="text-white text-lg font-black">28</Text>
                            <Text className="text-white/30 text-[10px] font-black uppercase">Days</Text>
                        </View>
                        <View className="w-[1px] h-8 bg-white/10" />
                        <View className="items-center">
                            <Text className="text-white text-lg font-black">92%</Text>
                            <Text className="text-white/30 text-[10px] font-black uppercase">Goal</Text>
                        </View>
                    </View>
                </View>

                {/* Heatmap Section */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-end mb-6 px-1">
                        <View>
                            <Text className="text-lg font-black text-white">Activity Heatmap</Text>
                            <Text className="text-xs font-bold text-white/40">Your consistency over 35 days</Text>
                        </View>
                        <Text className="text-primary font-black text-[11px] uppercase">Details</Text>
                    </View>
                    <View className="bg-surface-dark rounded-[32px] p-6 border border-white/5">
                        <View className="flex-row flex-wrap gap-2 justify-center">
                            {days.map(day => (
                                <View
                                    key={day.id}
                                    className="w-6 h-6 rounded-md"
                                    style={{ backgroundColor: getHeatmapColor(day.intensity) }}
                                />
                            ))}
                        </View>
                        <View className="flex-row justify-between mt-6 px-2">
                            <Text className="text-[10px] font-black text-white/20 uppercase">Less</Text>
                            <View className="flex-row gap-1">
                                {[0, 1, 2, 3].map(i => (
                                    <View key={i} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getHeatmapColor(i) }} />
                                ))}
                            </View>
                            <Text className="text-[10px] font-black text-white/20 uppercase">More</Text>
                        </View>
                    </View>
                </View>

                {/* Premium Trend Lock */}
                <View className="mb-32">
                    <Text className="text-[13px] font-black text-white mb-4 px-1">Trend Analysis</Text>
                    <View className="bg-surface-dark rounded-[32px] p-8 border border-white/5 items-center">
                        <View className="w-16 h-16 bg-white/5 rounded-2xl items-center justify-center mb-6">
                            <LucideIcons.BarChart size={32} color={isPremium ? "#30e8ab" : "rgba(255,255,255,0.2)"} />
                        </View>
                        <Text className="text-white font-black text-lg mb-2 text-center">
                            {isPremium ? 'Consistency Trends' : 'Unlock Premium Insights'}
                        </Text>
                        <Text className="text-white/40 font-bold text-xs text-center mb-8 px-4">
                            Get deep dives into your habit loops and lifetime progression metrics.
                        </Text>

                        {!isPremium && (
                            <Pressable
                                className="bg-primary py-4 px-8 rounded-2xl"
                                onPress={() => router.push('/paywall')}
                            >
                                <Text className="text-black font-black uppercase text-xs tracking-widest">Upgrade to View</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
