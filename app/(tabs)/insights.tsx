import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { Svg, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function Insights() {
    const [timeFilter, setTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');

    const insights = [
        { title: 'Morning Momentum', description: 'You complete 80% of your habits before 10 AM.', icon: 'Sunrise' },
        { title: 'Weekend Dip', description: 'Consistency drops by 15% on Saturdays.', icon: 'Calendar' }
    ];

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="pt-8 pb-6 flex-row justify-between items-center">
                    <Text className="text-2xl font-black text-white">Insights</Text>
                    <View className="h-10 w-10 rounded-full bg-surface-dark items-center justify-center border border-white/10">
                        <LucideIcons.User size={20} color="#94a3b8" />
                    </View>
                </View>

                {/* Segmented Control */}
                <View className="bg-surface-dark p-1 rounded-[16px] flex-row mb-8 border border-white/5">
                    {(['Weekly', 'Monthly', 'Yearly'] as const).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setTimeFilter(filter)}
                            className={`flex-1 py-2.5 items-center rounded-[12px] ${timeFilter === filter ? 'bg-white/10' : ''
                                }`}
                        >
                            <Text className={`text-sm font-bold ${timeFilter === filter ? 'text-white' : 'text-slate-500'}`}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Total Progress */}
                <View className="mb-8">
                    <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Progress</Text>
                    <View className="flex-row items-center gap-4">
                        <Text className="text-6xl font-black text-white tracking-tighter">85%</Text>
                        <View className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <LucideIcons.TrendingUp size={12} color="#30e8ab" />
                            <Text className="text-[12px] font-black text-primary ml-1">+12%</Text>
                        </View>
                    </View>
                    <Text className="text-sm text-slate-400 mt-2 font-medium">
                        You're more consistent than <Text className="text-white font-bold">92%</Text> of your previous weeks.
                    </Text>
                </View>

                {/* Consistency Trend Card */}
                <View className="bg-surface-dark rounded-[32px] p-7 mb-8 border border-white/5 shadow-lg">
                    <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Consistency Trend</Text>
                    <View className="h-32 w-full">
                        <Svg height="100%" width="100%" viewBox="0 0 300 100">
                            <Defs>
                                <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.4" />
                                    <Stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                                </SvgLinearGradient>
                            </Defs>
                            <Path
                                d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35 L300,100 L0,100 Z"
                                fill="url(#grad)"
                            />
                            <Path
                                d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <Circle cx="110" cy="62" r="4" fill="#3b82f6" stroke="#1c1c1e" strokeWidth="2" />
                            <Circle cx="280" cy="38" r="4" fill="#3b82f6" stroke="#1c1c1e" strokeWidth="2" />
                        </Svg>
                    </View>
                    <View className="flex-row justify-between mt-4">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <Text key={i} className="text-[10px] text-slate-500 font-black uppercase">{day}</Text>
                        ))}
                    </View>
                </View>

                {/* AI Performance Review */}
                <View className="bg-[#13231f] rounded-[24px] p-6 mb-8 border border-primary/20">
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 rounded-lg bg-primary/20 items-center justify-center">
                            <LucideIcons.Sparkles size={16} color="#30e8ab" />
                        </View>
                        <Text className="text-[10px] font-black uppercase text-primary tracking-widest ml-3">AI Review</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-100 leading-relaxed italic">
                        "Your discipline with meditation is impressive, but your hydration levels dip significantly during work hours. Focus on your water habit to maintain energy."
                    </Text>
                </View>

                {/* Summary Grid */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-surface-dark rounded-[24px] p-5 border border-white/5 shadow-sm">
                        <View className="w-10 h-10 rounded-[12px] bg-primary/10 items-center justify-center mb-4">
                            <LucideIcons.CheckCircle2 size={24} color="#30e8ab" />
                        </View>
                        <Text className="text-3xl font-black text-white tracking-tighter">15</Text>
                        <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Build Success</Text>
                    </View>

                    <View className="flex-1 bg-surface-dark rounded-[24px] p-5 border border-white/5 shadow-sm">
                        <View className="w-10 h-10 rounded-[12px] bg-orange-500/10 items-center justify-center mb-4">
                            <LucideIcons.Ban size={24} color="#f97316" />
                        </View>
                        <Text className="text-3xl font-black text-white tracking-tighter">3</Text>
                        <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Resisted</Text>
                    </View>
                </View>

                {/* Deep Dive */}
                <Text className="text-2xl font-black text-white mb-6">Deep Dive</Text>
                <View className="gap-4 mb-32">
                    {insights.map((insight, i) => {
                        const Icon = (LucideIcons as any)[insight.icon];
                        return (
                            <View key={i} className="flex-row items-start p-6 rounded-[24px] bg-surface-dark border border-white/5 shadow-md">
                                <View className="w-12 h-12 rounded-[16px] bg-white/5 items-center justify-center">
                                    <Icon size={26} color="#30e8ab" />
                                </View>
                                <View className="flex-1 ml-5">
                                    <Text className="text-lg font-black text-slate-100 tracking-tight">{insight.title}</Text>
                                    <Text className="text-sm text-slate-500 font-bold mt-1 leading-relaxed">{insight.description}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
