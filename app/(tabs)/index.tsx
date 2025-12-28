import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';
import * as LucideIcons from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TILE_WIDTH = (width - 48 - 16) / 2;

export default function DailyActionsScreen() {
    const router = useRouter();
    const [activeType, setActiveType] = useState<'build' | 'break'>('build');
    const { habits, toggleHabit, updateHabitValue } = useHabits();
    const { isUnlocked, authenticate } = usePrivacy();

    const filteredHabits = habits.filter(h => h.type === activeType);
    const completedCount = filteredHabits.filter(h => h.completedToday).length;
    const remainingCount = filteredHabits.length - completedCount;

    const handleHabitPress = async (habitId: string, isPrivate: boolean) => {
        if (isPrivate && !isUnlocked) {
            const success = await authenticate();
            if (success) toggleHabit(habitId);
        } else {
            toggleHabit(habitId);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="pt-8 pb-6 flex-row justify-between items-start">
                    <View>
                        <Text className="text-[11px] font-black uppercase tracking-[2px] text-white/40 mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Text>
                        <Text className="text-3xl font-black text-white tracking-tight">Good Morning,{"\n"}Alex</Text>
                    </View>
                    <Pressable
                        onPress={() => router.push('/add')}
                        className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center border border-white/5 active:opacity-70"
                    >
                        <LucideIcons.Plus size={24} color="#30e8ab" />
                    </Pressable>
                </View>

                {/* Segmented Control */}
                <View className="bg-white/5 p-1.5 rounded-[24px] flex-row mb-6">
                    <Pressable
                        onPress={() => setActiveType('build')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${activeType === 'build' ? 'bg-white shadow-lg' : ''}`}
                    >
                        <Text className={`text-[13px] font-black ${activeType === 'build' ? 'text-black' : 'text-white/40'}`}>Build</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveType('break')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${activeType === 'break' ? 'bg-white shadow-lg' : ''}`}
                    >
                        <Text className={`text-[13px] font-black ${activeType === 'break' ? 'text-black' : 'text-white/40'}`}>Break</Text>
                    </Pressable>
                </View>

                <View className="mb-6 flex-row items-center">
                    <Text className="text-white/60 font-bold text-lg">You have </Text>
                    <Text className="text-primary font-black text-lg">{remainingCount === 0 ? 'all' : remainingCount} </Text>
                    <Text className="text-white/60 font-bold text-lg">habits {remainingCount === 0 ? 'completed' : 'left'} today</Text>
                </View>

                {/* Habit Grid */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="flex-row flex-wrap justify-between pb-32">
                        {filteredHabits.map((habit, index) => {
                            const IconComp = (LucideIcons as any)[habit.icon] || LucideIcons.Circle;
                            const isDone = habit.completedToday;
                            const isLocked = habit.isPrivate && !isUnlocked;

                            return (
                                <Animated.View
                                    key={habit.id}
                                    entering={FadeInDown.delay(index * 50)}
                                    style={{ width: TILE_WIDTH, height: TILE_WIDTH + 20 }}
                                    className="mb-4"
                                >
                                    <Pressable
                                        onPress={() => handleHabitPress(habit.id, habit.isPrivate)}
                                        className={`flex-1 rounded-[32px] p-6 items-center justify-between border-2 ${isDone ? 'bg-primary/5 border-primary/20' : 'bg-surface-dark border-transparent'}`}
                                    >
                                        <View
                                            className={`w-14 h-14 rounded-full items-center justify-center ${isDone ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-white/5'}`}
                                        >
                                            <IconComp size={28} color={isDone ? 'black' : (habit.color || 'white')} />
                                        </View>

                                        <View className="items-center">
                                            <Text className={`text-[15px] font-black text-center mb-1 ${isDone ? 'text-white' : 'text-white/80'}`} numberOfLines={1}>
                                                {isLocked ? '••••••••' : habit.name}
                                            </Text>
                                            <View className="flex-row items-center">
                                                <LucideIcons.Flame size={12} color={isDone ? '#30e8ab' : '#f97316'} fill={isDone ? '#30e8ab' : 'transparent'} />
                                                <Text className={`text-[11px] font-black ml-1 ${isDone ? 'text-primary' : 'text-white/30'}`}>
                                                    {isLocked ? '??' : habit.streak} Days
                                                </Text>
                                            </View>
                                        </View>

                                        {isLocked && (
                                            <View className="absolute inset-0 items-center justify-center bg-black/60 rounded-[32px]">
                                                <LucideIcons.Lock size={20} color="white" opacity={0.6} />
                                            </View>
                                        )}
                                    </Pressable>
                                </Animated.View>
                            );
                        })}

                        {filteredHabits.length === 0 && (
                            <View className="w-full py-20 items-center">
                                <Text className="text-white/20 font-black text-xl">No {activeType} habits yet</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
