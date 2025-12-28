import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                <Stack.Screen name="add" options={{ presentation: 'formSheet' }} />
                <Stack.Screen name="habit/[id]" options={{ presentation: 'card' }} />
            </Stack>
        </SafeAreaProvider>
    );
}
