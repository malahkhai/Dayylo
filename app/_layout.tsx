import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add" options={{ presentation: 'formSheet' }} />
            <Stack.Screen name="habit/[id]" options={{ presentation: 'card' }} />
        </Stack>
    );
}
