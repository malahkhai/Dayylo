import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
import { HabitProvider } from '../context/HabitContext';
import { PrivacyProvider } from '../context/PrivacyContext';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PrivacyProvider>
                    <HabitProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
                            <Stack.Screen name="(auth)/onboarding" options={{ animation: 'slide_from_right' }} />
                            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                            <Stack.Screen name="add-habit" options={{ presentation: 'formSheet' }} />
                            <Stack.Screen name="habit/[id]" options={{ presentation: 'card' }} />
                        </Stack>
                    </HabitProvider>
                </PrivacyProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
