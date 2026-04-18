import React from 'react';
import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';
import { CalendarHeatmap } from '../../components/CalendarHeatmap';
import { HabitGrid, GridRow } from '../../components/HabitGrid';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { habits, isPremium, dailyBalanceScore, balanceVsLastWeek } = useHabits();
    const router = useRouter();

    // Build combined history for heatmap (any habit completed on that day = true)
    const overallHistory: Record<string, boolean> = {};
    habits.forEach(h => {
        Object.entries(h.history || {}).forEach(([date, val]) => {
            if (val) overallHistory[date] = true;
        });
    });

    const scoreColor =
        dailyBalanceScore >= 80 ? '#30e8ab' :
            dailyBalanceScore >= 50 ? '#f97316' : '#ef4444';

    const vsSign = balanceVsLastWeek >= 0 ? '+' : '';
    const vsColor = balanceVsLastWeek >= 0 ? '#30e8ab' : '#ef4444';

    if (habits.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="pt-8 pb-10 px-6">
                    <Text className="text-[11px] font-black uppercase tracking-[2px] text-white/40 mb-1">
                        Performance
                    </Text>
                    <Text className="text-3xl font-black text-white tracking-tight">Insights</Text>
                </View>
                <View className="flex-1 items-center justify-center px-10 pb-32">
                    <Text className="text-[64px] mb-6">🔍</Text>
                    <Text className="text-xl font-black text-white mb-2 text-center">Insights Locked</Text>
                    <Text className="text-white/40 font-bold text-center mb-8">Start tracking habits to unlock deep performance insights and calendar data.</Text>
                    <Pressable
                        className="bg-primary py-4 px-8 rounded-[16px]"
                        onPress={() => router.push('/add')}
                    >
                        <Text className="text-black font-black uppercase text-xs tracking-widest">
                            Add a Habit
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-10">
                    <Text className="text-[11px] font-black uppercase tracking-[2px] text-white/40 mb-1">
                        Performance
                    </Text>
                    <Text className="text-3xl font-black text-white tracking-tight">Insights</Text>
                </View>

                {/* Daily Balance Score */}
                <View className="bg-surface-dark rounded-[40px] p-8 mb-8 border border-white/5 items-center">
                    <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest mb-6">
                        Daily Balance Score
                    </Text>

                    {/* Circular score ring */}
                    <View
                        className="w-40 h-40 rounded-full items-center justify-center mb-4"
                        style={{
                            borderWidth: 10,
                            borderColor: habits.length === 0 ? 'rgba(255,255,255,0.05)' : scoreColor + '30',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                        }}
                    >
                        {habits.length === 0 ? (
                            <View className="items-center">
                                <Text className="text-4xl font-black text-white/20">—</Text>
                                <Text className="text-white/20 font-bold text-xs mt-1">No habits yet</Text>
                            </View>
                        ) : (
                            <View className="items-center">
                                <Text className="text-5xl font-black text-white">{dailyBalanceScore}</Text>
                                {balanceVsLastWeek !== 0 && (
                                    <Text className="font-black text-xs uppercase mt-1" style={{ color: vsColor }}>
                                        {vsSign}{balanceVsLastWeek}% vs LW
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Score descriptor */}
                    {habits.length > 0 && (
                        <Text className="font-bold text-xs uppercase tracking-widest" style={{ color: scoreColor }}>
                            {dailyBalanceScore >= 80 ? 'Excellent' :
                                dailyBalanceScore >= 50 ? 'On Track' :
                                    dailyBalanceScore > 0 ? 'Needs Work' : 'Not Started'}
                        </Text>
                    )}
                </View>

                {/* Aggregated Weekly Grid */}
                {(() => {
                    const days = eachDayOfInterval({
                        start: subDays(new Date(), 30), // Calculate for enough buffer
                        end: new Date(),
                    });

                    const buildHabits = habits.filter(h => {
                        const type = (h.type || '').toLowerCase();
                        const color = (h.color || '').toLowerCase();
                        const isGood = (h as any).isGood;
                        return type === 'build' || isGood === true || ['#007aff', '#3b82f6', '#30e8ab', '#8b5cf6', '#34c759'].includes(color);
                    });
                    const breakHabits = habits.filter(h => {
                        const type = (h.type || '').toLowerCase();
                        const color = (h.color || '').toLowerCase();
                        const isGood = (h as any).isGood;
                        return type === 'break' || isGood === false || ['#ff9500', '#f97316', '#ef4444', '#ff3b30', '#ff2d55'].includes(color);
                    });

                    const buildHistory: Record<string, boolean> = {};
                    const breakHistory: Record<string, boolean> = {};

                    days.forEach(d => {
                        const dateStr = format(d, 'yyyy-MM-dd');
                        
                        // Build Aggregation
                        const buildStates = buildHabits.map(h => h.history?.[dateStr]).filter(v => v !== undefined);
                        if (buildStates.some(v => v === true)) {
                            buildHistory[dateStr] = true;
                        } else if (buildStates.some(v => v === false)) {
                            buildHistory[dateStr] = false;
                        }

                        // Break Aggregation
                        const breakStates = breakHabits.map(h => h.history?.[dateStr]).filter(v => v !== undefined);
                        if (breakStates.length > 0) {
                            if (breakStates.every(v => v === true)) {
                                breakHistory[dateStr] = true;
                            } else if (breakStates.some(v => v === false)) {
                                breakHistory[dateStr] = false;
                            }
                        }
                    });

                    const rows: GridRow[] = [];
                    if (buildHabits.length > 0) {
                        rows.push({
                            id: 'cat-build',
                            name: 'Build Habits',
                            icon: 'Sparkles',
                            color: '#007AFF', // Growth Blue
                            history: buildHistory,
                        });
                    }
                    if (breakHabits.length > 0) {
                        rows.push({
                            id: 'cat-break',
                            name: 'Break Habits',
                            icon: 'ShieldAlert', // Stronger icon for discipline
                            color: '#FF9500', // Discipline Orange
                            history: breakHistory,
                        });
                    }

                    return <HabitGrid rows={rows} />;
                })()}

                {/* Monthly Calendar (Overall Activity) */}
                <View className="mb-8">
                    <Text className="text-[13px] font-black text-white mb-4 px-1">Activity Calendar</Text>
                    <CalendarHeatmap history={overallHistory} color="#007AFF" />
                </View>

                {/* Premium Trend Lock / Trend Analysis */}
                <View className="mb-32">
                    <Text className="text-[13px] font-black text-white mb-4 px-1">Trend Analysis</Text>
                    <View className="bg-surface-dark rounded-[40px] p-8 border border-white/5 items-center">
                        <View className="w-16 h-16 bg-white/5 rounded-[20px] items-center justify-center mb-6">
                            <LucideIcons.BarChart
                                size={32}
                                color={isPremium ? '#007AFF' : 'rgba(255,255,255,0.2)'}
                            />
                        </View>
                        <Text className="text-white font-black text-lg mb-2 text-center">
                            {isPremium ? 'Consistency Trends' : 'Unlock Premium Insights'}
                        </Text>
                        <Text className="text-white/40 font-bold text-xs text-center mb-8 px-4">
                            Get deep dives into your habit loops and lifetime progression metrics.
                        </Text>

                        {isPremium ? (
                            // Show a simple consistency metric for premium users
                            <View className="w-full">
                                {habits.slice(0, 3).map(h => {
                                    const completions = Object.values(h.history || {}).filter(Boolean).length;
                                    const total = Object.keys(h.history || {}).length;
                                    const rate = total > 0 ? Math.round(completions / total * 100) : 0;
                                    return (
                                        <View key={h.id} className="flex-row items-center mb-3">
                                            <Text className="text-white/60 text-xs font-bold w-24" numberOfLines={1}>{h.name}</Text>
                                            <View className="flex-1 h-2 bg-white/5 rounded-full mx-3 overflow-hidden">
                                                <View style={{ width: `${rate}%`, height: '100%', backgroundColor: h.color, borderRadius: 4 }} />
                                            </View>
                                            <Text className="text-white/40 text-xs font-bold w-10 text-right">{rate}%</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <Pressable
                                className="bg-primary py-4 px-8 rounded-[16px]"
                                onPress={() => router.push('/paywall')}
                            >
                                <Text className="text-white font-black uppercase text-xs tracking-widest">
                                    Upgrade to View
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
