import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function HabitDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <View className="flex-1 bg-white dark:bg-background-dark p-6 justify-center items-center">
            <Text className="text-2xl font-bold mb-4 dark:text-white">Habit Detail: {id}</Text>
            <TouchableOpacity
                onPress={() => router.back()}
                className="bg-primary p-4 rounded-xl"
            >
                <Text className="text-white font-bold">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
