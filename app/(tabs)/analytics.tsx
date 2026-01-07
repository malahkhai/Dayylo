import React from 'react';
import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';
import { CalendarHeatmap } from '../../components/CalendarHeatmap';
import { HabitGrid } from '../../components/HabitGrid';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { habits, isPremium } = useHabits();
    const router = useRouter();

    const overallHistory: Record<string, boolean> = {};
    if (habits.length > 0) {
        habits.forEach(h => {
            if (h.history) {
                Object.keys(h.history).forEach(date => {
                    if (h.history[date]) overallHistory[date] = true;
                });
            }
        });
    }

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
                    </View>
                </View>

                {/* Weekly Grid */}
                <HabitGrid habits={habits} />

                {/* Monthly Calendar (Overall Activity) */}
                <View className="mb-8">
                    <Text className="text-[13px] font-black text-white mb-4 px-1">Activity Calendar</Text>
                    <CalendarHeatmap history={overallHistory} color="#30e8ab" />
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
