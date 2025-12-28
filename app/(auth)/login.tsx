import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';

const { width } = Dimensions.get('window');

type AuthMode = 'splash' | 'signup' | 'signin';

export default function AuthScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('splash');

    const handleGetStarted = () => setMode('signup');
    const handleLoginLink = () => setMode('signin');
    const handleBackToSplash = () => setMode('splash');

    const handleAuthAction = () => {
        // Mock auth
        router.replace('/(auth)/onboarding');
    };

    if (mode === 'splash') {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-1 px-8 justify-between pb-12">
                    <View className="flex-1 items-center justify-center">
                        <View className="w-20 h-20 bg-focus-dark rounded-[24px] items-center justify-center mb-6 shadow-2xl">
                            <LucideIcons.Flame size={40} color="#f97316" fill="#f97316" />
                        </View>
                        <Text className="text-4xl font-black text-white tracking-tighter mb-2">Dayylo</Text>
                        <Text className="text-white/60 font-bold text-center text-[15px] px-4 leading-6">
                            Your daily path to better habits.{"\n"}Stay consistent, stay focused.
                        </Text>
                    </View>

                    <View>
                        <Pressable
                            onPress={handleGetStarted}
                            className="bg-accent-blue py-5 rounded-[20px] items-center flex-row justify-center shadow-lg active:opacity-90"
                        >
                            <Text className="text-white text-lg font-black uppercase tracking-widest mr-2">Get Started</Text>
                            <LucideIcons.ArrowRight size={18} color="white" />
                        </Pressable>

                        <Pressable
                            onPress={handleLoginLink}
                            className="py-6 items-center"
                        >
                            <Text className="text-white/40 font-bold text-xs uppercase tracking-[1.5px]">
                                I already have an account <Text className="text-accent-blue font-black underline">Log In</Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'signup') {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 px-8 pb-12">
                    <Pressable onPress={handleBackToSplash} className="pt-6">
                        <LucideIcons.ChevronLeft size={24} color="black" />
                    </Pressable>

                    <View className="items-center mt-12 mb-12">
                        <View className="w-12 h-12 bg-accent-blue/10 rounded-xl items-center justify-center mb-6">
                            <LucideIcons.CheckCircle2 size={24} color="#3b82f6" />
                        </View>
                        <Text className="text-3xl font-black text-slate-900 tracking-tight">Create Account</Text>
                        <Text className="text-slate-400 font-bold mt-2">Start building better habits today.</Text>
                    </View>

                    <View className="gap-4">
                        <Pressable className="flex-row items-center justify-center py-4 bg-black rounded-2xl">
                            <LucideIcons.Apple size={20} color="white" />
                            <Text className="text-white font-black ml-2">Continue with Apple</Text>
                        </Pressable>
                        <Pressable className="flex-row items-center justify-center py-4 bg-white border border-slate-200 rounded-2xl">
                            <LucideIcons.Chrome size={20} color="black" />
                            <Text className="text-slate-900 font-black ml-2">Continue with Google</Text>
                        </Pressable>

                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-[1px] bg-slate-100" />
                            <Text className="mx-4 text-slate-300 text-[10px] font-black uppercase">Or sign up with email</Text>
                            <View className="flex-1 h-[1px] bg-slate-100" />
                        </View>

                        <TextInput
                            placeholder="Email address"
                            className="bg-slate-50 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            className="bg-slate-50 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry
                            className="bg-slate-50 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
                        />

                        <Pressable
                            onPress={handleAuthAction}
                            className="bg-accent-blue py-4 rounded-2xl items-center mt-4 shadow-blue-500/20 shadow-lg"
                        >
                            <Text className="text-white font-black">Sign Up</Text>
                        </Pressable>

                        <Text className="text-[11px] text-slate-400 text-center mt-4">
                            By signing up, you agree to our <Text className="underline font-bold">Terms</Text> and <Text className="underline font-bold">Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Sign In Mode
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-8 pb-12">
                <Pressable onPress={handleBackToSplash} className="pt-6">
                    <LucideIcons.ChevronLeft size={24} color="black" />
                </Pressable>

                <View className="items-center mt-20 mb-12">
                    <View className="w-12 h-12 bg-accent-blue/10 rounded-xl items-center justify-center mb-6">
                        <LucideIcons.LogIn size={24} color="#3b82f6" />
                    </View>
                    <Text className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</Text>
                    <Text className="text-slate-400 font-bold mt-2">Let's get you focused.</Text>
                </View>

                <View className="gap-4">
                    <Pressable className="flex-row items-center justify-center py-4 bg-black rounded-2xl">
                        <LucideIcons.Apple size={20} color="white" />
                        <Text className="text-white font-black ml-2">Continue with Apple</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center justify-center py-4 bg-white border border-slate-200 rounded-2xl">
                        <LucideIcons.Chrome size={20} color="black" />
                        <Text className="text-slate-900 font-black ml-2">Continue with Google</Text>
                    </Pressable>

                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-[1px] bg-slate-100" />
                        <Text className="mx-4 text-slate-300 text-[10px] font-black uppercase">Or log in with email</Text>
                        <View className="flex-1 h-[1px] bg-slate-100" />
                    </View>

                    <TextInput
                        placeholder="Email address"
                        value="you@example.com"
                        className="bg-slate-50 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
                    />
                    <TextInput
                        placeholder="Password"
                        value="********"
                        secureTextEntry
                        className="bg-slate-50 p-4 rounded-xl text-slate-900 font-bold border border-slate-100"
                    />

                    <Pressable className="items-end">
                        <Text className="text-accent-blue font-bold text-xs">Forgot password?</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleAuthAction}
                        className="bg-accent-blue py-4 rounded-2xl items-center mt-4 shadow-blue-500/20 shadow-lg"
                    >
                        <Text className="text-white font-black">Sign In</Text>
                    </Pressable>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-slate-400 font-bold text-xs">New here? </Text>
                        <Pressable onPress={() => setMode('signup')}>
                            <Text className="text-accent-blue font-black text-xs underline">Create an account</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    }
});
