import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Habit } from '../types';
import { useRouter, Link } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface HabitTileProps {
    habit: Habit;
    onToggle: (id: string) => void;
    onUpdateValue?: (id: string, delta: number) => void;
    isLocked?: boolean;
}

const HabitTile: React.FC<HabitTileProps> = ({ habit, onToggle, onUpdateValue, isLocked }: HabitTileProps) => {
    const IconComponent = (LucideIcons as any)[habit.icon] || LucideIcons.Circle;

    const isCompleted = habit.completedToday || (habit.targetValue && habit.currentValue && habit.currentValue >= habit.targetValue);
    const hasStepper = habit.targetValue !== undefined && habit.unit !== 'min';

    const animatedCheckStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(isCompleted ? 1 : 0) }],
            opacity: withTiming(isCompleted ? 1 : 0),
        };
    });

    const animatedBgStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(isCompleted ? 'rgba(48, 232, 171, 0.1)' : 'rgba(241, 245, 249, 1)'),
            borderColor: withTiming(isCompleted ? 'rgba(48, 232, 171, 0.2)' : 'rgba(241, 245, 249, 1)'),
        };
    });

    return (
        <Link
            href={{ pathname: '/habit/[id]', params: { id: habit.id } }}
            asChild
        >
            <Pressable
                className="relative flex-row items-center bg-white dark:bg-surface-dark-alt rounded-[24px] p-4 mb-3 border border-slate-50 dark:border-white/5 shadow-sm active:opacity-70"
            >
                {/* Icon Area */}
                <View className="items-center justify-center w-12 h-12 rounded-[16px] bg-slate-50 dark:bg-white/5">
                    <IconComponent size={24} color={habit.color} />
                </View>

                {/* Text Info */}
                <View className="ml-4 flex-1">
                    <Text className="text-[16px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                        {habit.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        {habit.targetValue && (
                            <Text className="text-[13px] font-medium text-slate-400 mr-2.5">
                                {habit.currentValue ?? 0} {habit.unit}
                            </Text>
                        )}
                        <View className="flex-row items-center">
                            <Text className="text-[14px] mr-1">🔥</Text>
                            <Text className="text-[13px] font-bold text-orange-500">{habit.streak} Days</Text>
                        </View>
                    </View>
                </View>

                {/* Action Area */}
                <View className="flex-row items-center ml-2">
                    {hasStepper ? (
                        <View className="flex-row items-center bg-slate-50 dark:bg-white/5 rounded-[16px] p-1 border border-slate-100 dark:border-white/10">
                            <TouchableOpacity
                                onPress={() => onUpdateValue?.(habit.id, -1)}
                                className="w-8 h-8 items-center justify-center rounded-[8px]"
                            >
                                <LucideIcons.Minus size={18} color="#94a3b8" />
                            </TouchableOpacity>
                            <Text className="min-w-[24px] text-center text-[15px] font-bold text-slate-800 dark:text-slate-200 mx-1">
                                {habit.currentValue}
                            </Text>
                            <TouchableOpacity
                                onPress={() => onUpdateValue?.(habit.id, 1)}
                                className="w-8 h-8 items-center justify-center rounded-[8px]"
                            >
                                <LucideIcons.Plus size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => onToggle(habit.id)}
                            activeOpacity={0.8}
                        >
                            {/* @ts-ignore */}
                            <Animated.View
                                style={animatedBgStyle}
                                className="w-10 h-10 rounded-[16px] items-center justify-center border"
                            >
                                {/* @ts-ignore */}
                                <Animated.View style={animatedCheckStyle}>
                                    <LucideIcons.Check size={20} color="#30e8ab" strokeWidth={3} />
                                </Animated.View>
                            </Animated.View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Locked Overlay */}
                {isLocked && (
                    <View className="absolute inset-0 bg-white/40 dark:bg-black/40 rounded-[24px] flex-row items-center justify-end pr-5">
                        <LucideIcons.Lock size={20} color="#94a3b8" opacity={0.5} />
                    </View>
                )}
            </Pressable>
        </Link>
    );
};

export default HabitTile;
