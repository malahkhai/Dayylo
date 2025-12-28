import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";
import { HabitProvider } from '../context/HabitContext';
import { PrivacyProvider } from '../context/PrivacyContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PrivacyProvider>
                <HabitProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
                        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="add" options={{ presentation: 'formSheet' }} />
                        <Stack.Screen name="habit/[id]" options={{ presentation: 'card' }} />
                    </Stack>
                </HabitProvider>
            </PrivacyProvider>
        </SafeAreaProvider>
    );
}
