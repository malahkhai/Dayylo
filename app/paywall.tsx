import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

export default function PaywallScreen() {
    const router = useRouter();
    const { setPremium } = useHabits();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const handleSubscribe = async () => {
        // Mock purchase
        await setPremium(true);
        router.back();
    };

    const features = [
        { icon: 'Infinity', text: 'Unlimited Habits', subtext: 'Break the 3-habit limit' },
        { icon: 'Lock', text: 'Privacy Mode', subtext: 'Face ID & PIN protection' },
        { icon: 'BarChart3', text: 'Advanced Analytics', subtext: 'Heatmaps & Trend insights' },
        { icon: 'Cloud', text: 'Cloud Sync', subtext: 'Backup across all devices' },
        { icon: 'Bell', text: 'Custom Reminders', subtext: 'Smart nudge notifications' }
    ];

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="pt-10 items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="absolute top-0 right-0 p-2 bg-white/10 rounded-full"
                    >
                        <LucideIcons.X size={20} color="white" />
                    </Pressable>

                    <View className="w-16 h-16 bg-primary rounded-[20px] items-center justify-center shadow-2xl mb-6 shadow-primary/50">
                        <LucideIcons.Crown size={32} color="black" />
                    </View>
                    <Text className="text-4xl font-black text-white tracking-tight">Dayylo Premium</Text>
                    <Text className="text-white/60 font-bold mt-2 text-center text-[15px]">
                        Master your habits with total clarity.
                    </Text>
                </View>

                {/* Features List */}
                <View className="mt-12 space-y-6">
                    {features.map((f, i) => {
                        const Icon = (LucideIcons as any)[f.icon];
                        return (
                            <View key={i} className="flex-row items-center mb-6">
                                <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-4">
                                    <Icon size={20} color="#30e8ab" />
                                </View>
                                <View>
                                    <Text className="text-[15px] font-black text-white">{f.text}</Text>
                                    <Text className="text-[12px] font-medium text-white/40">{f.subtext}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Pricing Toggles */}
                <View className="mt-8 bg-white/5 p-1 rounded-[24px] flex-row mb-6 border border-white/5">
                    <Pressable
                        onPress={() => setBillingCycle('monthly')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${billingCycle === 'monthly' ? 'bg-white' : ''}`}
                    >
                        <Text className={`text-[13px] font-black ${billingCycle === 'monthly' ? 'text-black' : 'text-white/60'}`}>
                            Monthly
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setBillingCycle('yearly')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${billingCycle === 'yearly' ? 'bg-white' : ''}`}
                    >
                        <View className="flex-row items-center">
                            <Text className={`text-[13px] font-black ${billingCycle === 'yearly' ? 'text-black' : 'text-white/60'}`}>
                                Yearly
                            </Text>
                            <View className="ml-2 bg-primary px-1.5 py-0.5 rounded">
                                <Text className="text-[9px] font-black uppercase text-black">Save 40%</Text>
                            </View>
                        </View>
                    </Pressable>
                </View>

                {/* Final Price & CTA */}
                <View className="items-center">
                    <Text className="text-white/40 text-[13px] font-bold mb-4">
                        {billingCycle === 'yearly' ? '$29.99 / year' : '$4.99 / month'}
                    </Text>

                    <Pressable
                        onPress={handleSubscribe}
                        className="w-full bg-primary py-5 rounded-[24px] items-center shadow-lg shadow-primary/20"
                    >
                        <Text className="text-black text-lg font-black uppercase tracking-widest">Upgrade Now</Text>
                    </Pressable>

                    <Text className="text-white/30 text-[10px] text-center mt-6 leading-4 font-medium px-4">
                        By continuing, you agree to the Terms of Use and Privacy Policy. Subscriptions automatically renew unless cancelled 24h before end of period.
                    </Text>
                </View>

                {/* Legal Links */}
                <View className="flex-row justify-center gap-6 mt-10 mb-20">
                    <Text className="text-[11px] text-white/50 font-bold underline">Terms of Service</Text>
                    <Text className="text-[11px] text-white/50 font-bold underline">Privacy Policy</Text>
                    <Text className="text-[11px] text-white/50 font-bold underline">Restore</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
