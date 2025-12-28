import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function AddHabitScreen() {
    const router = useRouter();
    return (
        <View className="flex-1 bg-white dark:bg-background-dark p-6 justify-center items-center">
            <Text className="text-2xl font-bold mb-4 dark:text-white">Add New Habit</Text>
            <TouchableOpacity
                onPress={() => router.back()}
                className="bg-primary p-4 rounded-xl"
            >
                <Text className="text-white font-bold">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
