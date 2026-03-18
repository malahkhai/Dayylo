import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases from 'react-native-purchases';
import "../global.css";
import { HabitProvider } from '../context/HabitContext';
import { PrivacyProvider } from '../context/PrivacyContext';
import { AuthProvider } from '../context/AuthContext';

import Constants from 'expo-constants';

export default function RootLayout() {
    useEffect(() => {
        if (Platform.OS === 'ios') {
            try {
                const apiKey = Constants.expoConfig?.extra?.revenueCatApiKey;
                if (apiKey) {
                    Purchases.configure({ apiKey });
                }
            } catch (e) {
                console.log('RevenueCat native module not available:', e);
            }
        }
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
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
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
