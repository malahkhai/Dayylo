import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();

    const handleAppleSignIn = () => {
        // Mock sign in
        console.log('Apple Sign In');
        router.replace('/(tabs)');
    };

    const handleGoogleSignIn = () => {
        // Mock sign in
        console.log('Google Sign In');
        router.replace('/(tabs)');
    };

    const handleGuestMode = () => {
        console.log('Guest Mode');
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-8 justify-between pb-12">
                {/* Brand Logo / Hero Area */}
                <View className="pt-20 items-center">
                    <View className="w-20 h-20 bg-slate-900 rounded-[24px] items-center justify-center shadow-2xl mb-6">
                        <View className="w-8 h-8 rounded-full bg-primary" />
                    </View>
                    <Text className="text-5xl font-black text-slate-900 tracking-tighter">Daylo</Text>
                    <Text className="text-slate-400 font-bold mt-2 text-center text-[15px]">
                        Build what matters.{"\n"}Break what holds you back.
                    </Text>
                </View>

                {/* Login Buttons Area */}
                <View>
                    <View className="gap-4">
                        {/* Apple Sign In - HIG Compliant */}
                        <Pressable
                            onPress={handleAppleSignIn}
                            style={styles.appleButton}
                        >
                            <LucideIcons.Apple size={20} color="white" />
                            <Text style={styles.appleButtonText}>Continue with Apple</Text>
                        </Pressable>

                        {/* Google Sign In - Branding Compliant */}
                        <Pressable
                            onPress={handleGoogleSignIn}
                            style={styles.googleButton}
                        >
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                style={{ width: 18, height: 18, marginRight: 12 }}
                                resizeMode="contain"
                            />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleGuestMode}
                            className="py-5 items-center mt-2"
                        >
                            <Text className="text-slate-400 font-black text-xs uppercase tracking-[2px]">
                                Continue as Guest
                            </Text>
                        </Pressable>
                    </View>

                    {/* Legal Links */}
                    <View className="mt-12 flex-row flex-wrap justify-center gap-x-2 gap-y-1">
                        <Text className="text-[11px] text-slate-400 font-medium">By continuing, you agree to our</Text>
                        <Pressable><Text className="text-[11px] text-slate-900 font-bold underline">Terms</Text></Pressable>
                        <Text className="text-[11px] text-slate-400 font-medium">&</Text>
                        <Pressable><Text className="text-[11px] text-slate-900 font-bold underline">Privacy Policy</Text></Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appleButton: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    appleButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        marginLeft: 10,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    googleButtonText: {
        color: '#1f2937',
        fontSize: 16,
        fontWeight: '900',
    }
});
