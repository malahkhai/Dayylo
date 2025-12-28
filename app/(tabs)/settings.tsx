import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { isPremium } = useHabits();

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: 'Crown', label: 'FocusStreak Premium', value: isPremium ? 'Active' : 'Upgrade', color: '#f97316', onPress: () => router.push('/paywall') },
                { icon: 'User', label: 'Profile Settings', color: '#3b82f6' },
                { icon: 'Bell', label: 'Notifications', color: '#8b5cf6' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'Moon', label: 'Appearance', value: 'System', color: '#64748b' },
                { icon: 'Lock', label: 'Privacy & Security', color: '#30e8ab' },
                { icon: 'Globe', label: 'Language', value: 'English', color: '#3b82f6' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: 'HelpCircle', label: 'Help Center', color: '#94a3b8' },
                { icon: 'FileText', label: 'Terms of Service', color: '#94a3b8' },
                { icon: 'Shield', label: 'Privacy Policy', color: '#94a3b8' },
            ]
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-10 items-center">
                    <View className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-primary/20 p-1 mb-4">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
                            className="w-full h-full rounded-[28px]"
                        />
                    </View>
                    <Text className="text-2xl font-black text-white">Alex Johnson</Text>
                    <Text className="text-white/40 font-bold mt-1 text-sm uppercase tracking-widest">Achiever Level</Text>

                    {!isPremium && (
                        <Pressable
                            onPress={() => router.push('/paywall')}
                            className="mt-6 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex-row items-center"
                        >
                            <LucideIcons.Crown size={16} color="#30e8ab" />
                            <Text className="text-primary font-black text-xs uppercase tracking-widest ml-2">Upgrade to Premium</Text>
                        </Pressable>
                    )}
                </View>

                {sections.map((section, idx) => (
                    <View key={idx} className="mb-8">
                        <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-4 ml-1">
                            {section.title}
                        </Text>
                        <View className="bg-surface-dark rounded-[32px] overflow-hidden border border-white/5">
                            {section.items.map((item, i) => {
                                const Icon = (LucideIcons as any)[item.icon];
                                return (
                                    <Pressable
                                        key={i}
                                        onPress={item.onPress}
                                        className={`flex-row items-center p-5 active:bg-white/5 ${i !== section.items.length - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                                            <Icon size={20} color={item.color} />
                                        </View>
                                        <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">{item.label}</Text>
                                        {item.value && (
                                            <Text className="text-[13px] font-bold text-white/30 mr-2">{item.value}</Text>
                                        )}
                                        <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <Pressable
                    onPress={() => router.replace('/(auth)/login')}
                    className="flex-row items-center justify-center py-6 mb-20"
                >
                    <LucideIcons.LogOut size={20} color="#ef4444" />
                    <Text className="text-[#ef4444] font-black text-[15px] ml-2">Sign Out</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
