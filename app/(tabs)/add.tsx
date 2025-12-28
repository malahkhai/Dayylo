import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';

export default function AddHabitScreen() {
    const router = useRouter();
    const { addHabit } = useHabits();

    const [habitType, setHabitType] = useState<'build' | 'break'>('build');
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [color, setColor] = useState('#3b82f6');
    const [icon, setIcon] = useState('Activity');

    const handleCreate = async () => {
        if (!name) return;

        const success = await addHabit({
            name,
            type: habitType,
            icon,
            color,
            isPrivate: habitType === 'break' ? isPrivate : false,
            frequency: ['Daily'], // Simplified for now
            reminderTime: '09:00',
        });

        if (success) {
            router.push('/(tabs)');
        } else {
            router.push('/paywall');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-6 flex-row justify-between items-center">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white">New Habit</Text>
                    <Pressable onPress={() => router.back()} className="p-2">
                        <LucideIcons.X size={24} color="#94a3b8" />
                    </Pressable>
                </View>

                {/* Habit Type Selector */}
                <View className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-[20px] flex-row border border-white/5 mb-8">
                    <Pressable
                        onPress={() => setHabitType('build')}
                        className={`flex-1 py-3 items-center rounded-[16px] ${habitType === 'build' ? 'bg-white shadow-md' : ''}`}
                    >
                        <Text className={`text-[13px] font-black ${habitType === 'build' ? 'text-black' : 'text-slate-500'}`}>
                            Build Habit
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setHabitType('break')}
                        className={`flex-1 py-3 items-center rounded-[16px] ${habitType === 'break' ? 'bg-white shadow-md' : ''}`}
                    >
                        <Text className={`text-[13px] font-black ${habitType === 'break' ? 'text-black' : 'text-slate-500'}`}>
                            Break Habit
                        </Text>
                    </Pressable>
                </View>

                <View className="mb-8">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Habit Name</Text>
                    <TextInput
                        className="bg-white dark:bg-surface-dark-alt p-5 rounded-[24px] text-lg font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-white/5"
                        placeholder="e.g. Read 20 pages"
                        placeholderTextColor="#94a3b8"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Privacy Toggle (Break only) */}
                {habitType === 'break' && (
                    <View className="bg-white dark:bg-surface-dark-alt p-6 rounded-[32px] border border-slate-100 dark:border-white/5 flex-row justify-between items-center mb-8">
                        <View className="flex-1 mr-4">
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Private Habit</Text>
                            <Text className="text-sm font-medium text-slate-400">Require Face ID / PIN to view</Text>
                        </View>
                        <Pressable
                            onPress={() => setIsPrivate(!isPrivate)}
                            className={`w-14 h-8 rounded-full p-1 ${isPrivate ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <View className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                        </Pressable>
                    </View>
                )}

                {/* Color Picker Placeholder */}
                <View className="mb-8">
                    <Text className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Color</Text>
                    <View className="flex-row gap-3">
                        {['#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#30e8ab'].map(c => (
                            <Pressable
                                key={c}
                                onPress={() => setColor(c)}
                                className={`w-10 h-10 rounded-full items-center justify-center ${color === c ? 'border-2 border-slate-900 dark:border-white' : ''}`}
                                style={{ backgroundColor: c }}
                            >
                                {color === c && <LucideIcons.Check size={16} color="white" />}
                            </Pressable>
                        ))}
                    </View>
                </View>

                <Pressable
                    onPress={handleCreate}
                    className="bg-primary py-5 rounded-[24px] items-center shadow-lg active:opacity-90 mb-20"
                >
                    <Text className="text-black text-lg font-black uppercase tracking-wider">Create Habit</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
