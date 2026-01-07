import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../../context/HabitContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

const SUGGESTED_BUILD = [
    { name: 'Read Daily', icon: 'BookOpen', color: '#3b82f6', category: 'Mindfulness', metric: '30 mins' },
    { name: 'Exercise', icon: 'Zap', color: '#f97316', category: 'Health', metric: '45 mins' },
    { name: 'Meditate', icon: 'Waves', color: '#30e8ab', category: 'Mindfulness', metric: '15 mins' },
    { name: 'Drink Water', icon: 'Droplet', color: '#3b82f6', category: 'Health', metric: '2 Liters' },
    { name: 'Sleep Early', icon: 'Moon', color: '#8b5cf6', category: 'Health', metric: '8 hours' },
    { name: 'Gratitude', icon: 'Heart', color: '#ef4444', category: 'Mindfulness', metric: '3 things' },
];

const SUGGESTED_BREAK = [
    { name: 'No Sugar', icon: 'CandyOff', color: '#f97316', category: 'Health' },
    { name: 'Limit Social', icon: 'Smartphone', color: '#3b82f6', category: 'Productivity' },
    { name: 'Quit Smoking', icon: 'Ban', color: '#ef4444', category: 'Health' },
    { name: 'No Alcohol', icon: 'Wine', color: '#f97316', category: 'Health' },
    { name: 'Limit Coffee', icon: 'Coffee', color: '#8b5cf6', category: 'Health' },
];

export default function AddHabitScreen() {
    const router = useRouter();
    const { addHabit } = useHabits();
    const [habitType, setHabitType] = useState<'build' | 'break'>('build');
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');

    const handleSuggestedAdd = async (item: any) => {
        const success = await addHabit({
            name: item.name,
            type: habitType,
            icon: item.icon,
            color: item.color,
            isPrivate: false,
            frequency: ['Daily'],
            reminderTime: '09:00',
            difficulty: 5,
        });
        if (success) router.replace('/(tabs)');
        else router.push('/paywall');
    };

    const suggestions = habitType === 'build' ? SUGGESTED_BUILD : SUGGESTED_BREAK;
    const filtered = suggestions.filter(s =>
        (category === 'All' || s.category === category) &&
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="pt-8 pb-6 flex-row justify-between items-center">
                    <Text className="text-3xl font-black text-white tracking-tight">
                        {habitType === 'build' ? 'Build Habits' : 'Break Habits'}
                    </Text>
                    <Pressable onPress={() => router.back()}>
                        <Text className="text-primary font-black text-sm uppercase">Done</Text>
                    </Pressable>
                </View>

                {/* Habit Type Toggle (Custom addition to spec to handle both) */}
                <View className="bg-white/5 p-1 rounded-2xl flex-row mb-6">
                    <Pressable
                        onPress={() => setHabitType('build')}
                        className={`flex-1 py-3 items-center rounded-xl ${habitType === 'build' ? 'bg-primary' : ''}`}
                    >
                        <Text className={`text-xs font-black uppercase ${habitType === 'build' ? 'text-black' : 'text-white/40'}`}>Build</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setHabitType('break')}
                        className={`flex-1 py-3 items-center rounded-xl ${habitType === 'break' ? 'bg-accent-orange' : ''}`}
                    >
                        <Text className={`text-xs font-black uppercase ${habitType === 'break' ? 'text-black' : 'text-white/40'}`}>Break</Text>
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View className="bg-white/5 rounded-2xl p-4 flex-row items-center mb-6 border border-white/5">
                    <LucideIcons.Search size={18} color="rgba(255,255,255,0.2)" />
                    <TextInput
                        placeholder="Find a habit..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        className="ml-3 flex-1 text-white font-bold"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 h-10 flex-none">
                    {['All', 'Health', 'Mindfulness', 'Productivity'].map(c => (
                        <Pressable
                            key={c}
                            onPress={() => setCategory(c)}
                            className={`px-6 py-2 rounded-full mr-2 h-10 justify-center ${category === c ? 'bg-white' : 'bg-white/5 border border-white/5'}`}
                        >
                            <Text className={`text-[11px] font-black uppercase ${category === c ? 'text-black' : 'text-white/40'}`}>{c}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <Text className="text-white/20 font-black text-xs uppercase tracking-widest mb-6">Suggested Routines</Text>

                    <View className="flex-row flex-wrap justify-between">
                        {filtered.map((item, i) => {
                            const IconComp = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
                            return (
                                <Pressable
                                    key={i}
                                    onPress={() => handleSuggestedAdd(item)}
                                    className="mb-3 bg-surface-dark border border-white/5 rounded-[32px] p-5 justify-between"
                                    style={{ width: CARD_WIDTH, height: CARD_WIDTH + 10 }}
                                >
                                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                                        <IconComp size={20} color={item.color} />
                                    </View>
                                    <View>
                                        <Text className="text-[15px] font-black text-white mb-1" numberOfLines={1}>{item.name}</Text>
                                        <Text className="text-[11px] font-bold text-white/30 uppercase">{(item as any).metric || 'Daily'}</Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Pressable
                        onPress={() => router.push('/add-habit')}
                        className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex-row items-center justify-between mt-6 mb-32"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center mr-4">
                                <LucideIcons.Plus size={20} color="white" opacity={0.4} />
                            </View>
                            <View>
                                <Text className="text-[15px] font-black text-white">Create Custom Habit</Text>
                                <Text className="text-[11px] font-bold text-white/30 uppercase">Design your own routine</Text>
                            </View>
                        </View>
                        <LucideIcons.ChevronRight size={20} color="rgba(255,255,255,0.2)" />
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
