import React from 'react';
import { View, Text, ScrollView, Image, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();

    const openLegal = (url: string) => {
        // In a real app, use Linking or a WebView
        // Spec says "Apple-approved external browser opening"
        // Linking.openURL(url);
        console.log('Opening legal:', url);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="pt-12 pb-8 items-center">
                    <View className="relative">
                        <View className="w-28 h-28 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="absolute -bottom-2 -right-2 bg-primary w-10 h-10 rounded-[14px] items-center justify-center border-4 border-white shadow-lg">
                            <LucideIcons.Camera size={18} color="black" />
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-slate-900 dark:text-white mt-6 tracking-tight">Emma Jackson</Text>
                    <Text className="text-[12px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Member Since April 2024</Text>
                </View>

                {/* Account Section */}
                <View className="mb-8">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Account & Plan</Text>
                    <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5">
                        <Pressable
                            onPress={() => router.push('/paywall')}
                            className="p-6 flex-row justify-between items-center border-b border-slate-50 dark:border-white/5"
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                                    <LucideIcons.Crown size={20} color="#f59e0b" />
                                </View>
                                <View className="ml-4">
                                    <Text className="text-[15px] font-bold text-slate-900 dark:text-white">Daylo Premium</Text>
                                    <Text className="text-xs font-medium text-slate-400">Manage Subscription</Text>
                                </View>
                            </View>
                            <LucideIcons.ChevronRight size={18} color="#94a3b8" />
                        </Pressable>
                        <Pressable className="p-6 flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 items-center justify-center">
                                    <LucideIcons.Settings size={20} color="#64748b" />
                                </View>
                                <View className="ml-4">
                                    <Text className="text-[15px] font-bold text-slate-900 dark:text-white">Profile Settings</Text>
                                    <Text className="text-xs font-medium text-slate-400">Edit Name, Email</Text>
                                </View>
                            </View>
                            <LucideIcons.ChevronRight size={18} color="#94a3b8" />
                        </Pressable>
                    </View>
                </View>

                {/* Preferences */}
                <View className="mb-8">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Preferences</Text>
                    <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5">
                        <Pressable className="p-6 flex-row justify-between items-center border-b border-slate-50 dark:border-white/5">
                            <View className="flex-row items-center">
                                <LucideIcons.Bell size={20} color="#64748b" />
                                <Text className="ml-4 text-[15px] font-bold text-slate-900 dark:text-white">Reminders</Text>
                            </View>
                            <Text className="text-xs font-bold text-slate-400">Global On</Text>
                        </Pressable>
                        <Pressable className="p-6 flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <LucideIcons.Moon size={20} color="#64748b" />
                                <Text className="ml-4 text-[15px] font-bold text-slate-900 dark:text-white">Appearance</Text>
                            </View>
                            <Text className="text-xs font-bold text-slate-400">Dynamic</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Legal Section */}
                <View className="mb-8">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Legal & Support</Text>
                    <View className="bg-white dark:bg-surface-dark-alt rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5">
                        <Pressable
                            onPress={() => openLegal('https://daylo.app/terms')}
                            className="p-6 flex-row justify-between items-center border-b border-slate-50 dark:border-white/5"
                        >
                            <Text className="text-[15px] font-bold text-slate-900 dark:text-white">Terms of Service</Text>
                            <LucideIcons.ExternalLink size={16} color="#94a3b8" />
                        </Pressable>
                        <Pressable
                            onPress={() => openLegal('https://daylo.app/privacy')}
                            className="p-6 flex-row justify-between items-center border-b border-slate-50 dark:border-white/5"
                        >
                            <Text className="text-[15px] font-bold text-slate-900 dark:text-white">Privacy Policy</Text>
                            <LucideIcons.ExternalLink size={16} color="#94a3b8" />
                        </Pressable>
                        <Pressable className="p-6 flex-row justify-between items-center">
                            <Text className="text-[15px] font-bold text-slate-900 dark:text-white">Contact Support</Text>
                            <LucideIcons.ChevronRight size={18} color="#94a3b8" />
                        </Pressable>
                    </View>
                </View>

                {/* Sign Out */}
                <Pressable className="bg-slate-50 dark:bg-white/5 py-5 rounded-[24px] items-center mb-32 border border-slate-100 dark:border-white/10 active:opacity-70">
                    <View className="flex-row items-center">
                        <LucideIcons.LogOut size={18} color="#ef4444" />
                        <Text className="text-red-500 font-black text-xs uppercase tracking-widest ml-2">Sign Out</Text>
                    </View>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
