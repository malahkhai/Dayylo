import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Switch, Alert, TextInput, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppleColors } from '../../constants/AppleTheme';
import { useHabits } from '../../context/HabitContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { isPremium, level, userName, updateUserName, notificationsEnabled, setNotificationsEnabled } = useHabits();
    const { logout, deleteAccount } = useAuth();

    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [nameInput, setNameInput] = useState(userName);

    const getLevelTitle = (l: number) => {
        if (l >= 10) return "Master Gardener";
        if (l >= 5) return "Sapling Guardian";
        if (l >= 2) return "Sprout Tender";
        return "Seed Planter";
    };

    const handleLevelTap = () => {
        Alert.alert("Your Dayylo Journey 🌱", `You are level ${level}.\nComplete habits consistently to grow your tree and level up!`);
    };

    const SupportItems = [
        { icon: 'HelpCircle', label: 'Support Email', color: '#94a3b8', url: 'mailto:support@dayylo.com?subject=Dayylo Support Request' },
        { icon: 'Star', label: 'Rate on App Store', color: '#94a3b8', action: 'rate' },
        { icon: 'RefreshCw', label: 'Restore Purchases', color: '#94a3b8', action: 'restore' },
        { icon: 'FileText', label: 'Terms of Service', color: '#94a3b8', url: 'https://www.notion.so/Privacy-Policy-Dayylo-31792d45fcc58005beeaf9c6208d9cd5?source=copy_link' },
        { icon: 'Shield', label: 'Privacy Policy', color: '#94a3b8', url: 'https://malahkhai.notion.site/Privacy-Policy-Dayylo-31792d45fcc58005beeaf9c6208d9cd5' },
    ];

    const handleSaveName = async () => {
        if (nameInput.trim().length > 0) {
            await updateUserName(nameInput.trim());
        }
        setProfileModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="pt-10 pb-12 items-center">
                    <Pressable
                        onPress={() => { setNameInput(userName); setProfileModalVisible(true); }}
                        className="items-center"
                    >
                        <View 
                            className="w-24 h-24 rounded-full items-center justify-center mb-6 border-4 border-white/5"
                            style={{ 
                                backgroundColor: '#007AFF',
                                shadowColor: '#007AFF',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 15,
                                elevation: 12
                            }}
                        >
                            <Text className="text-4xl font-black text-white">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </Text>
                            <View className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full items-center justify-center border-2 border-surface-dark">
                                <LucideIcons.Pencil size={12} color="white" />
                            </View>
                        </View>
                        
                        <Text className="text-2xl font-black text-white">{userName}</Text>
                        <Text className="text-white/40 font-bold mt-1 text-sm uppercase tracking-widest">
                            Level {level} • {getLevelTitle(level)}
                        </Text>
                    </Pressable>

                    {!isPremium && (
                        <Pressable
                            onPress={() => router.push('/paywall')}
                            className="mt-8 bg-[#007AFF15] border border-[#007AFF30] px-6 py-3 rounded-2xl flex-row items-center"
                        >
                            <LucideIcons.Crown size={16} color="#007AFF" />
                            <Text className="text-[#007AFF] font-black text-xs uppercase tracking-widest ml-2">Upgrade to Premium</Text>
                        </Pressable>
                    )}
                </View>

                {/* Account */}
                <View className="mb-8">
                    <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-4 ml-1">Account</Text>
                    <View className="bg-surface-dark rounded-[32px] overflow-hidden border border-white/5">
                        <Pressable
                            onPress={() => router.push('/paywall')}
                            className="flex-row items-center p-5 active:bg-white/5 border-b border-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#f9731615' }}>
                                <LucideIcons.Crown size={20} color="#f97316" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Dayylo Premium</Text>
                            <Text className="text-[13px] font-bold text-white/30 mr-2">{isPremium ? 'Active ✓' : 'Upgrade'}</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>

                        <Pressable
                            onPress={() => { setNameInput(userName); setProfileModalVisible(true); }}
                            className="flex-row items-center p-5 active:bg-white/5 border-b border-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#3b82f615' }}>
                                <LucideIcons.User size={20} color="#3b82f6" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Profile Settings</Text>
                            <Text className="text-[13px] font-bold text-white/30 mr-2 max-w-[100px]" numberOfLines={1}>{userName}</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>

                        {/* Notifications toggle */}
                        <View className="flex-row items-center p-5 border-b border-white/5">
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#007AFF15' }}>
                                <LucideIcons.Bell size={20} color="#007AFF" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Notifications</Text>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#007AFF' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <Pressable
                            onPress={() => router.push('/daily-wrapup')}
                            className="flex-row items-center p-5 active:bg-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#007AFF15' }}>
                                <LucideIcons.History size={20} color="#007AFF" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Daily Wrap-up</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>
                    </View>
                </View>

                {/* Preferences */}
                <View className="mb-8">
                    <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-4 ml-1">Preferences</Text>
                    <View className="bg-surface-dark rounded-[32px] overflow-hidden border border-white/5">
                        <Pressable
                            onPress={() => Alert.alert("Appearance", "Dayylo is currently optimized for Dark Mode. Light Mode will be available in a future update.")}
                            className="flex-row items-center p-5 border-b border-white/5 active:bg-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#64748b15' }}>
                                <LucideIcons.Moon size={20} color="#64748b" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Appearance</Text>
                            <Text className="text-[13px] font-bold text-white/30 mr-2">Dark</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>
                        <Pressable
                            onPress={() => Alert.alert("Privacy", "Your habit data is stored securely in the cloud and is only accessible by you.")}
                            className="flex-row items-center p-5 border-b border-white/5 active:bg-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#FF950015' }}>
                                <LucideIcons.Lock size={20} color="#FF9500" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Privacy & Security</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>
                        <Pressable
                            onPress={() => Alert.alert("Language", "Dayylo is currently available in English. More languages coming soon.")}
                            className="flex-row items-center p-5 active:bg-white/5 border-b border-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#007AFF15' }}>
                                <LucideIcons.Globe size={20} color="#007AFF" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Language</Text>
                            <Text className="text-[13px] font-bold text-white/30 mr-2">English</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/archived-habits')}
                            className="flex-row items-center p-5 active:bg-white/5"
                        >
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#64748b15' }}>
                                <LucideIcons.Archive size={20} color="#64748b" />
                            </View>
                            <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">Archived Habits</Text>
                            <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                        </Pressable>
                    </View>
                </View>

                {/* Support */}
                <View className="mb-8">
                    <Text className="text-[11px] font-black text-white/30 uppercase tracking-[2px] mb-4 ml-1">Support</Text>
                    <View className="bg-surface-dark rounded-[32px] overflow-hidden border border-white/5">
                        {SupportItems.map((item, i, arr) => {
                            const Icon = (LucideIcons as any)[item.icon];
                            return (
                                <Pressable
                                    key={i}
                                    onPress={() => {
                                        if (item.url) {
                                            Linking.openURL(item.url);
                                        } else if (item.action === 'restore') {
                                            const { restorePurchases } = useHabits();
                                            restorePurchases();
                                        } else if (item.action === 'rate') {
                                            // Trigger Store Review
                                            try {
                                                const StoreReview = require('expo-store-review');
                                                StoreReview.isAvailableAsync().then((available: boolean) => {
                                                    if (available) {
                                                        StoreReview.requestReview();
                                                    } else {
                                                        Alert.alert("Available on App Store", "This feature is only available on physical devices with an App Store account.");
                                                    }
                                                });
                                            } catch (e) {
                                                console.log('[Review] Native module not available');
                                                Alert.alert("Available on App Store", "This feature is only available on physical devices.");
                                            }
                                        }
                                    }}
                                    className={`flex-row items-center p-5 active:bg-white/5 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                                        <Icon size={20} color={item.color} />
                                    </View>
                                    <Text className="flex-1 ml-4 text-[15px] font-black text-white/90">{item.label}</Text>
                                    <LucideIcons.ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Account Actions */}
                <View className="mb-20 mt-2 gap-4">
                    <Pressable
                        onPress={() => {
                            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Sign Out", style: "destructive", onPress: async () => {
                                        await logout();
                                        router.replace('/(auth)/login');
                                    }
                                }
                            ]);
                        }}
                        className="bg-surface-dark border border-white/5 py-4 rounded-2xl flex-row items-center justify-center active:bg-white/5"
                    >
                        <LucideIcons.LogOut size={18} color="rgba(255,255,255,0.7)" />
                        <Text className="text-white/70 font-bold text-[15px] ml-2">Sign Out</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            Alert.alert(
                                "Delete Account",
                                "Are you sure you want to delete your account? This action is permanent and your data will be erased immediately.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Delete Permanently", style: "destructive", onPress: async () => {
                                            try {
                                                await deleteAccount();
                                                router.replace('/(auth)/login');
                                            } catch (e) {
                                                Alert.alert("Error", "Failed to delete account. You might need to re-authenticate first.");
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                        className="bg-red-500/10 border border-red-500/20 py-4 rounded-2xl flex-row items-center justify-center active:bg-red-500/20"
                    >
                        <LucideIcons.Trash2 size={18} color="#ef4444" />
                        <Text className="text-[#ef4444] font-bold text-[15px] ml-2">Delete Account</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Edit Name Modal */}
            <Modal visible={profileModalVisible} transparent animationType="slide" onRequestClose={() => setProfileModalVisible(false)}>
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
                    onPress={() => setProfileModalVisible(false)}
                >
                    <View style={{
                        backgroundColor: '#1C1C1E', borderTopLeftRadius: 24, borderTopRightRadius: 24,
                        padding: 24, paddingBottom: 40,
                    }}>
                        <View style={{ width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 20, textAlign: 'center' }}>Edit Profile</Text>

                        <Text style={{ fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                            Display Name
                        </Text>
                        <TextInput
                            value={nameInput}
                            onChangeText={setNameInput}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: 12, padding: 16, color: '#fff',
                                fontSize: 16, fontWeight: '600', marginBottom: 20,
                                borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
                            }}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            placeholder="Your name"
                            returnKeyType="done"
                            onSubmitEditing={handleSaveName}
                        />
                        <Pressable
                            onPress={handleSaveName}
                            style={{ backgroundColor: '#007AFF', borderRadius: 16, padding: 16, alignItems: 'center' }}
                        >
                            <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Save Changes
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
