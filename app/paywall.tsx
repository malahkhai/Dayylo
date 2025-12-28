import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function Paywall() {
    const router = useRouter();

    const features = [
        {
            title: 'Unlimited Habits',
            desc: 'Track as many goals as you want',
            icon: 'Infinity',
            color: '#ec4899',
            bg: 'rgba(236, 72, 153, 0.1)'
        },
        {
            title: 'Advanced Analytics',
            desc: 'Detailed charts and trend insights',
            icon: 'LineChart',
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.1)'
        },
        {
            title: 'Cloud Sync',
            desc: 'Backup and sync across devices',
            icon: 'Cloud',
            color: '#f97316',
            bg: 'rgba(249, 115, 22, 0.1)'
        },
        {
            title: 'Custom Themes',
            desc: 'Personalize with premium colors',
            icon: 'Palette',
            color: '#a855f7',
            bg: 'rgba(168, 85, 247, 0.1)'
        }
    ];

    return (
        <View className="flex-1 bg-background-light dark:bg-background-dark">
            <LinearGradient
                colors={['rgba(48, 232, 171, 0.15)', 'transparent']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}
            />

            <SafeAreaView className="flex-1">
                <View className="flex-row justify-end p-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 items-center justify-center"
                    >
                        <LucideIcons.X size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 pb-40" showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-8 mt-4">
                        <View className="w-32 h-32 rounded-[24px] bg-indigo-500/10 items-center justify-center shadow-inner">
                            <LucideIcons.Diamond size={64} color="#30e8ab" />
                        </View>
                    </View>

                    <View className="items-center mb-8">
                        <Text className="text-3xl font-black text-center text-slate-900 dark:text-white leading-tight">
                            Level Up {'\n'} Your Habits
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-center mt-3 text-base leading-relaxed px-4">
                            Unlock your full potential with advanced tools designed for growth.
                        </Text>
                    </View>

                    {/* Pricing Toggle Mockup */}
                    <View className="bg-white/50 dark:bg-surface-dark-alt rounded-[16px] p-1 mb-8 flex-row border border-slate-100 dark:border-white/5">
                        <View className="flex-1 py-2 items-center">
                            <Text className="text-sm font-medium text-slate-400">Free</Text>
                        </View>
                        <View className="flex-1 py-2 items-center bg-white dark:bg-surface-dark rounded-[12px] shadow-sm">
                            <Text className="text-sm font-bold text-slate-900 dark:text-white">Premium</Text>
                        </View>
                    </View>

                    {/* Feature List */}
                    <View className="gap-3 mb-8">
                        {features.map((f, i) => {
                            const Icon = (LucideIcons as any)[f.icon];
                            return (
                                <View key={i} className="flex-row items-center p-4 bg-white dark:bg-surface-dark-alt rounded-[20px] border border-slate-100 dark:border-white/5 shadow-sm">
                                    <View className="w-10 h-10 rounded-[12px] items-center justify-center" style={{ backgroundColor: f.bg }}>
                                        <Icon size={24} color={f.color} />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="font-bold text-slate-900 dark:text-white text-sm">{f.title}</Text>
                                        <Text className="text-xs text-slate-500">{f.desc}</Text>
                                    </View>
                                    <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                                        <LucideIcons.Check size={14} color="black" strokeWidth={3} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Social Proof */}
                    <View className="items-center mb-20 opacity-80">
                        <Text className="text-xs text-slate-500 font-medium">Join 10k+ Premium Users</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Sticky Bottom CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 p-6 pb-12 border-t border-slate-100 dark:border-white/5">
                <View className="flex-row justify-between items-baseline mb-4 px-2">
                    <Text className="text-sm font-medium text-slate-500">Total today</Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white">$4.99</Text>
                        <Text className="text-sm text-slate-500 font-medium ml-1">/ month</Text>
                    </View>
                </View>
                <TouchableOpacity className="w-full bg-primary rounded-[20px] py-5 items-center shadow-lg">
                    <Text className="text-black font-bold text-lg">Start 7-Day Free Trial</Text>
                    <Text className="text-black/60 text-xs font-medium mt-0.5">Then $4.99/mo. Cancel anytime.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
