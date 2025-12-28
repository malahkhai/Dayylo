import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Step = 'grow' | 'define';

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('grow');
    const [selectedType, setSelectedType] = useState<'build' | 'break' | null>(null);

    const handleContinue = () => {
        if (step === 'grow') setStep('define');
        else router.replace('/(tabs)');
    };

    if (step === 'grow') {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-1 px-8 pt-12 pb-12">
                    {/* Progress Bar */}
                    <View className="flex-row gap-2 mb-12">
                        <View className="flex-1 h-1 bg-primary rounded-full" />
                        <View className="flex-1 h-1 bg-white/10 rounded-full" />
                        <View className="flex-1 h-1 bg-white/10 rounded-full" />
                    </View>

                    <Text className="text-4xl font-black text-white leading-tight mb-4">How do you want{"\n"}to grow?</Text>
                    <Text className="text-white/40 font-bold text-lg mb-12">Choose the path that fits your goals. You can always add more later.</Text>

                    <View className="gap-6 flex-1">
                        <Pressable
                            onPress={() => setSelectedType('build')}
                            className={`p-6 rounded-[32px] overflow-hidden ${selectedType === 'build' ? 'bg-primary/20 border-2 border-primary' : 'bg-surface-dark border-2 border-transparent'}`}
                        >
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-black text-white">Build Habits</Text>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedType === 'build' ? 'border-primary bg-primary' : 'border-white/20'}`}>
                                    {selectedType === 'build' && <LucideIcons.Check size={14} color="black" />}
                                </View>
                            </View>
                            <View className="h-40 bg-white/10 rounded-2xl overflow-hidden mb-4">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' }}
                                    className="w-full h-full opacity-60"
                                />
                            </View>
                            <Pressable
                                onPress={() => { setSelectedType('build'); handleContinue(); }}
                                className="bg-primary py-4 rounded-2xl items-center"
                            >
                                <Text className="text-black font-black uppercase text-xs tracking-widest">Start Building</Text>
                            </Pressable>
                        </Pressable>

                        <Pressable
                            onPress={() => setSelectedType('break')}
                            className={`p-6 rounded-[32px] overflow-hidden ${selectedType === 'break' ? 'bg-accent-orange/20 border-2 border-accent-orange' : 'bg-surface-dark border-2 border-transparent'}`}
                        >
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-black text-white">Break Habits</Text>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedType === 'break' ? 'border-accent-orange bg-accent-orange' : 'border-white/20'}`}>
                                    {selectedType === 'break' && <LucideIcons.Check size={14} color="black" />}
                                </View>
                            </View>
                            <View className="h-40 bg-white/10 rounded-2xl overflow-hidden mb-4">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1493723843671-1d655e7d98f0?q=80&w=400&auto=format&fit=crop' }}
                                    className="w-full h-full opacity-60"
                                />
                            </View>
                            <Pressable
                                onPress={() => { setSelectedType('break'); handleContinue(); }}
                                className="bg-accent-orange py-4 rounded-2xl items-center"
                            >
                                <Text className="text-black font-black uppercase text-xs tracking-widest">Start Breaking</Text>
                            </Pressable>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-8 pt-12 pb-12">
                <Pressable onPress={() => setStep('grow')} className="mb-6">
                    <LucideIcons.ChevronLeft size={24} color="white" />
                </Pressable>

                {/* Progress Bar */}
                <View className="flex-row gap-2 mb-12">
                    <View className="flex-1 h-1 bg-primary rounded-full" />
                    <View className="flex-1 h-1 bg-primary rounded-full" />
                    <View className="flex-1 h-1 bg-white/10 rounded-full" />
                </View>

                <Text className="text-4xl font-black text-white leading-tight mb-4">Define your path</Text>
                <Text className="text-white/40 font-bold text-lg mb-8">Select the type of habits you want to track. You can choose both.</Text>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="bg-white/5 p-6 rounded-[32px] mb-6">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.TrendingUp size={18} color="#30e8ab" />
                            <Text className="text-white font-black text-lg ml-2">Build Habits</Text>
                        </View>
                        <View className="gap-3">
                            {['Drink Water', 'Meditate', 'Run'].map(h => (
                                <View key={h} className="bg-white/5 p-4 rounded-2xl flex-row justify-between items-center">
                                    <Text className="text-white/80 font-bold">{h}</Text>
                                    <LucideIcons.CheckCircle2 size={18} color="#30e8ab" fill="#30e8ab" opacity={0.2} />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="bg-white/5 p-6 rounded-[32px] mb-8">
                        <View className="flex-row items-center mb-4">
                            <LucideIcons.Shield size={18} color="#f97316" />
                            <Text className="text-white font-black text-lg ml-2">Break Habits</Text>
                        </View>
                        <View className="gap-3">
                            {['No Sugar', 'Limit Social', 'Quit Smoking'].map(h => (
                                <View key={h} className="bg-white/5 p-4 rounded-2xl flex-row justify-between items-center">
                                    <Text className="text-white/80 font-bold">{h}</Text>
                                    <LucideIcons.Circle size={18} color="white" opacity={0.1} />
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <Pressable
                    onPress={handleContinue}
                    className="bg-primary py-5 rounded-[24px] items-center flex-row justify-center mt-6"
                >
                    <Text className="text-black text-lg font-black uppercase tracking-widest mr-2">Continue</Text>
                    <LucideIcons.ArrowRight size={18} color="black" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
