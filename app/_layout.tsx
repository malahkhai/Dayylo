import { Stack } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases from 'react-native-purchases';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeOut } from 'react-native-reanimated';
import "../global.css";
import { HabitProvider } from '../context/HabitContext';
import { PrivacyProvider } from '../context/PrivacyContext';
import { AuthProvider } from '../context/AuthContext';

import Constants from 'expo-constants';

import { Analytics } from '../services/analytics';

import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { CelebrationProvider } from '../context/CelebrationContext';
import { DayyloSplashScreen } from '../components/DayyloSplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [splashVisible, setSplashVisible] = useState(true);

    useEffect(() => {
        const initApp = async () => {
            try {
                // 1. Request Tracking Permissions (iOS only)
                if (Platform.OS === 'ios') {
                    try {
                        console.log('[Init] Requesting ATT permissions...');
                        await requestTrackingPermissionsAsync();
                        console.log('[Init] ATT permissions handled.');
                    } catch (e) {
                        console.log('[Init] Tracking transparency crash avoided:', e);
                    }
                }

                // 2. Initialize Analytics (GA4 + AppsFlyer)
                try {
                    console.log('[Init] Initializing Analytics...');
                    Analytics.init();
                    console.log('[Init] Analytics initialized.');
                } catch (e) {
                    console.log('[Init] Analytics init failed:', e);
                }

                // 3. Configure RevenueCat
                if (Platform.OS === 'ios') {
                    try {
                        const apiKey = Constants.expoConfig?.extra?.revenueCatApiKey;
                        if (apiKey) {
                            console.log('[Init] Checking RevenueCat...');
                            try {
                                const isConfigured = await Purchases.isConfigured();
                                if (!isConfigured) {
                                    console.log('[Init] Configuring RevenueCat...');
                                    Purchases.configure({ apiKey });
                                    console.log('[Init] RevenueCat configured.');
                                } else {
                                    console.log('[Init] RevenueCat already configured.');
                                }
                            } catch (e) {
                                // Fallback for older RC versions or if check fails
                                console.log('[Init] Configuring RevenueCat (fallback)...');
                                Purchases.configure({ apiKey });
                            }
                        }
                    } catch (e) {
                        console.log('[Init] RevenueCat init failed:', e);
                    }
                }
            } catch (e) {
                console.error('[Init] Critical initialization error:', e);
            } finally {
                console.log('[Init] Finalizing app readiness...');
                // Mark app as ready but keep custom splash visible for its animation
                setAppIsReady(true);
                // Hide native splash immediately since we have our custom one
                await SplashScreen.hideAsync();
            }
        };

        initApp();
    }, []);

    const handleSplashComplete = useCallback(() => {
        setSplashVisible(false);
    }, []);

    if (!appIsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <PrivacyProvider>
                        <CelebrationProvider>
                            <HabitProvider>
                                <View style={{ flex: 1 }}>
                                    <Stack screenOptions={{ headerShown: false }}>
                                        <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
                                        <Stack.Screen name="(auth)/onboarding" options={{ animation: 'slide_from_right' }} />
                                        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                                        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                                        <Stack.Screen name="add-habit" options={{ presentation: 'formSheet' }} />
                                        <Stack.Screen name="habit/[id]" options={{ presentation: 'card' }} />
                                    </Stack>

                                    {splashVisible && (
                                        <Animated.View 
                                            exiting={FadeOut.duration(800)}
                                            style={{ ...StyleSheet.absoluteFillObject, zIndex: 99999 }}
                                        >
                                            <DayyloSplashScreen onAnimationComplete={handleSplashComplete} />
                                        </Animated.View>
                                    )}
                                </View>
                            </HabitProvider>
                        </CelebrationProvider>
                    </PrivacyProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
