import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';

const { width } = Dimensions.get('window');

type AuthMode = 'welcome' | 'focus' | 'signup' | 'signin';

export default function AuthScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('welcome');
    const [selectedFocus, setSelectedFocus] = useState<{ build: boolean, break: boolean }>({ build: false, break: false });

    const handleContinue = () => setMode('focus');
    const handleNext = () => setMode('signup');
    const handleLoginLink = () => setMode('signin');
    const handleBack = () => {
        if (mode === 'focus') setMode('welcome');
        else if (mode === 'signup' || mode === 'signin') setMode('focus');
    };

    const handleAuthAction = () => {
        // Mock auth
        router.replace('/(auth)/onboarding');
    };

    const toggleFocus = (type: 'build' | 'break') => {
        setSelectedFocus(prev => ({ ...prev, [type]: !prev[type] }));
    };

    if (mode === 'welcome') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.centerContent}>
                        <View style={styles.logoContainer}>
                            <LucideIcons.Flame size={48} color={AppleColors.systemOrange} fill={AppleColors.systemOrange} />
                        </View>
                        <Text style={styles.headline}>Welcome to Dayylo</Text>
                        <Text style={styles.subtext}>Build what matters. Break what holds you back.</Text>
                    </View>
                    <AppleButton
                        title="Continue"
                        onPress={handleContinue}
                        size="large"
                        fullWidth
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'focus') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.content, { paddingBottom: 20 }]}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>

                    <View style={{ flex: 1, paddingTop: 40 }}>
                        <Text style={styles.focusHeadline}>This is where the magic happens.</Text>
                        <Text style={styles.focusSubtext}>Choose your focus areas. You can select both.</Text>

                        <View style={styles.focusGrid}>
                            <Pressable
                                onPress={() => toggleFocus('build')}
                                style={[
                                    styles.focusCard,
                                    selectedFocus.build && { borderColor: AppleColors.systemGreen, borderWidth: 2, backgroundColor: AppleColors.systemGreen + '10' }
                                ]}
                            >
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemGreen + '20' }]}>
                                    <LucideIcons.TrendingUp size={28} color={AppleColors.systemGreen} />
                                </View>
                                <Text style={styles.focusCardTitle}>Build Habits</Text>
                                <Text style={styles.focusCardDesc}>Start positive routines like Gym, Meditation, Reading.</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => toggleFocus('break')}
                                style={[
                                    styles.focusCard,
                                    selectedFocus.break && { borderColor: AppleColors.systemOrange, borderWidth: 2, backgroundColor: AppleColors.systemOrange + '10' }
                                ]}
                            >
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemOrange + '20' }]}>
                                    <LucideIcons.ShieldOff size={28} color={AppleColors.systemOrange} />
                                </View>
                                <Text style={styles.focusCardTitle}>Break Habits</Text>
                                <Text style={styles.focusCardDesc}>Reduce behaviors you want to stop like Smoking, Junk Food.</Text>
                            </Pressable>
                        </View>
                    </View>

                    <AppleButton
                        title="Next"
                        onPress={handleNext}
                        size="large"
                        fullWidth
                        disabled={!selectedFocus.build && !selectedFocus.break}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'signup') {
        return (
            <SafeAreaView style={styles.containerWhite}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color="black" />
                    </Pressable>

                    <View style={styles.authHeader}>
                        <Text style={styles.authTitle}>Create Account</Text>
                        <Text style={styles.authSub}>Start building better habits today.</Text>
                    </View>

                    <View style={styles.authForm}>
                        <AppleButton title="Continue with Apple" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Apple size={20} color="black" />} fullWidth style={{ marginBottom: 12 }} />
                        <AppleButton title="Continue with Google" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Chrome size={20} color="black" />} fullWidth />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>OR SIGN UP WITH EMAIL</Text>
                            <View style={styles.line} />
                        </View>

                        <TextInput placeholder="Email address" style={styles.input} placeholderTextColor="#999" />
                        <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor="#999" />
                        <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry placeholderTextColor="#999" />

                        <AppleButton title="Sign Up" onPress={handleAuthAction} size="large" fullWidth style={{ marginTop: 12 }} />

                        <Text style={styles.legalText}>
                            By signing up, you agree to our <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Sign In Mode
    return (
        <SafeAreaView style={styles.containerWhite}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <LucideIcons.ChevronLeft size={24} color="black" />
                </Pressable>

                <View style={styles.authHeader}>
                    <Text style={styles.authTitle}>Welcome Back</Text>
                    <Text style={styles.authSub}>Let's get you focused.</Text>
                </View>

                <View style={styles.authForm}>
                    <AppleButton title="Continue with Apple" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Apple size={20} color="black" />} fullWidth style={{ marginBottom: 12 }} />
                    <AppleButton title="Continue with Google" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Chrome size={20} color="black" />} fullWidth />

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR LOG IN WITH EMAIL</Text>
                        <View style={styles.line} />
                    </View>

                    <TextInput placeholder="Email address" style={styles.input} placeholderTextColor="#999" />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor="#999" />

                    <Pressable style={styles.forgotPass}>
                        <Text style={styles.linkText}>Forgot password?</Text>
                    </Pressable>

                    <AppleButton title="Sign In" onPress={handleAuthAction} size="large" fullWidth style={{ marginTop: 12 }} />

                    <View style={styles.switchAuth}>
                        <Text style={styles.switchText}>New here? </Text>
                        <Pressable onPress={() => setMode('signup')}>
                            <Text style={styles.linkText}>Create an account</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    containerWhite: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: AppleColors.systemGray6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        ...AppleShadows.medium,
    },
    headline: {
        ...AppleTypography.largeTitle,
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtext: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    focusHeadline: {
        ...AppleTypography.title1,
        color: AppleColors.label.primary,
        marginBottom: 8,
    },
    focusSubtext: {
        ...AppleTypography.subheadline,
        color: AppleColors.label.secondary,
        marginBottom: 32,
    },
    focusGrid: {
        gap: 20,
    },
    focusCard: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        ...AppleShadows.small,
    },
    focusIconBg: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    focusCardTitle: {
        ...AppleTypography.title3,
        color: AppleColors.label.primary,
        marginBottom: 4,
    },
    focusCardDesc: {
        ...AppleTypography.footnote,
        color: AppleColors.label.secondary,
    },
    authHeader: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    authTitle: {
        ...AppleTypography.largeTitle,
        color: '#000',
        marginBottom: 4,
    },
    authSub: {
        ...AppleTypography.body,
        color: '#666',
    },
    authForm: {
        gap: 12,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEE',
    },
    dividerText: {
        marginHorizontal: 16,
        ...AppleTypography.caption2,
        color: '#BBB',
        fontWeight: '700',
    },
    input: {
        backgroundColor: '#F7F7F7',
        padding: 18,
        borderRadius: 16,
        ...AppleTypography.body,
        color: '#000',
        marginBottom: 4,
    },
    legalText: {
        ...AppleTypography.caption2,
        color: '#999',
        textAlign: 'center',
        marginTop: 16,
    },
    link: {
        color: AppleColors.systemBlue,
        fontWeight: '600',
    },
    forgotPass: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    linkText: {
        color: AppleColors.systemBlue,
        ...AppleTypography.callout,
        fontWeight: '600',
    },
    switchAuth: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    switchText: {
        ...AppleTypography.callout,
        color: '#666',
    }
});
