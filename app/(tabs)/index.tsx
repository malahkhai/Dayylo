import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';
import HabitTile from '../../components/HabitTile';
import * as LucideIcons from 'lucide-react-native';

export default function DailyActionsScreen() {
    const router = useRouter();
    const [activeType, setActiveType] = useState<'build' | 'break'>('build');
    const { habits, toggleHabit, updateHabitValue } = useHabits();
    const { isUnlocked, authenticate } = usePrivacy();

    const filteredHabits = habits.filter(h => h.type === activeType);
    const completedCount = filteredHabits.filter(h => h.completedToday).length;
    const remainingCount = filteredHabits.length - completedCount;

    const handleHabitPress = async (isPrivate: boolean) => {
        if (isPrivate && !isUnlocked) {
            await authenticate();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="pt-8 pb-6">
                    <Text className="text-[11px] font-black uppercase tracking-[2px] text-slate-400">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-4xl font-black text-slate-900 dark:text-white">Actions</Text>
                        <Text className="text-sm font-black text-primary mb-1">{remainingCount} Left</Text>
                    </View>
                </View>

                {/* Segmented Control */}
                <View className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-[24px] flex-row mb-8">
                    <Pressable
                        onPress={() => setActiveType('build')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${activeType === 'build' ? 'bg-white shadow-md' : ''}`}
                    >
                        <View className="flex-row items-center">
                            <LucideIcons.TrendingUp size={16} color={activeType === 'build' ? '#000' : '#94a3b8'} />
                            <Text className={`ml-2 text-[13px] font-black ${activeType === 'build' ? 'text-black' : 'text-slate-500'}`}>
                                Build
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveType('break')}
                        className={`flex-1 py-4 items-center rounded-[20px] ${activeType === 'break' ? 'bg-white shadow-md' : ''}`}
                    >
                        <View className="flex-row items-center">
                            <LucideIcons.Shield size={16} color={activeType === 'break' ? '#000' : '#94a3b8'} />
                            <Text className={`ml-2 text-[13px] font-black ${activeType === 'break' ? 'text-black' : 'text-slate-500'}`}>
                                Break
                            </Text>
                        </View>
                    </Pressable>
                </View>

                {/* Habit Grid */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pb-32">
                        {filteredHabits.length > 0 ? (
                            filteredHabits.map((habit) => (
                                <Pressable
                                    key={habit.id}
                                    onPress={() => handleHabitPress(habit.isPrivate)}
                                >
                                    <HabitTile
                                        habit={habit}
                                        onToggle={toggleHabit}
                                        onUpdateValue={updateHabitValue}
                                        isLocked={habit.isPrivate && !isUnlocked}
                                    />
                                </Pressable>
                            ))
                        ) : (
                            <View className="items-center justify-center py-20">
                                <View className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full items-center justify-center mb-4">
                                    <LucideIcons.Plus size={32} color="#94a3b8" />
                                </View>
                                <Text className="text-slate-400 font-bold">No {activeType} habits yet</Text>
                                <Pressable
                                    onPress={() => router.push('/add')}
                                    className="mt-4 px-6 py-3 bg-slate-900 dark:bg-white rounded-full"
                                >
                                    <Text className="text-white dark:text-black font-black text-xs uppercase tracking-widest">Add First</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
