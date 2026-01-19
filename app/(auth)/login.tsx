import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, TextInput, ScrollView, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';

const { width } = Dimensions.get('window');

type AuthMode = 'welcome' | 'storyboard' | 'focus' | 'signup' | 'signin';

export default function AuthScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('welcome');
    const [selectedFocus, setSelectedFocus] = useState<{ build: boolean, break: boolean }>({ build: false, break: false });

    // Bouncing Animation
    const bounceValue = useSharedValue(0);

    React.useEffect(() => {
        bounceValue.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bounceValue.value }],
    }));

    const handleContinue = () => setMode('storyboard');
    const handleNextStoryboard = () => setMode('focus');
    const handleNext = () => setMode('signup');
    const handleLoginLink = () => setMode('signin');
    const handleBack = () => {
        if (mode === 'storyboard') setMode('welcome');
        else if (mode === 'focus') setMode('storyboard');
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
                        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
                            <Image
                                source={require('../../assets/welcome-logo.png')}
                                style={styles.appIcon}
                                resizeMode="contain"
                            />
                        </Animated.View>
                        <Text style={styles.headline}>Welcome to Dayylo</Text>
                        <Text style={styles.subtext}>Build what matters. Break what holds you back.</Text>
                    </View>
                    <AppleButton
                        title="Continue"
                        onPress={handleContinue}
                        size="large"
                        fullWidth
                    />
                    <Pressable onPress={() => router.replace('/(tabs)')} style={styles.loginShortcut}>
                        <Text style={styles.loginShortcutText}>Already have an account? <Text style={styles.loginShortcutBold}>Log in</Text></Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'storyboard') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.focusHeadline, { marginTop: 12, fontSize: 32 }]}>Building a better you{"\n"}starts today.</Text>

                        <View style={[styles.storyboardGrid, { gap: 12 }]}>
                            <View style={[styles.storyboardCard, { padding: 16 }]}>
                                <View style={[styles.storyIconBg, { backgroundColor: AppleColors.primary + '15', marginBottom: 8, width: 48, height: 48 }]}>
                                    <LucideIcons.Sparkles size={24} color={AppleColors.primary} />
                                </View>
                                <View style={styles.storyContent}>
                                    <Text style={styles.storyText}>
                                        <Text style={{ fontWeight: '700', color: AppleColors.primary }}>Build Momentum.</Text>
                                        {"\n"}Every positive action compounds into a lifetime of success.
                                    </Text>
                                    <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 6 }} />
                                    <Text style={[styles.storyInsight, { marginTop: 0 }]}>Consistency is the bridge to accomplishment.</Text>
                                </View>
                            </View>

                            <View style={[styles.storyboardCard, { padding: 16 }]}>
                                <View style={[styles.storyIconBg, { backgroundColor: AppleColors.warning + '15', marginBottom: 8, width: 48, height: 48 }]}>
                                    <LucideIcons.Unplug size={24} color={AppleColors.warning} />
                                </View>
                                <View style={styles.storyContent}>
                                    <Text style={styles.storyText}>
                                        <Text style={{ fontWeight: '700', color: AppleColors.warning }}>Break Chains.</Text>
                                        {"\n"}Breaking old habits is about gaining your freedom back.
                                    </Text>
                                    <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 6 }} />
                                    <Text style={[styles.storyInsight, { color: AppleColors.warning, marginTop: 0 }]}>Progress is what you leave behind.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <AppleButton
                        title="Continue"
                        onPress={handleNextStoryboard}
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

                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Text style={styles.focusHeadline}>This is where the magic happens.</Text>
                        <Text style={styles.focusSubtext}>Choose your focus areas. You can select both.</Text>

                        <View style={styles.focusGrid}>
                            <Pressable
                                onPress={() => toggleFocus('build')}
                                style={[
                                    styles.focusCard,
                                    selectedFocus.build && styles.focusCardSelectedBuild
                                ]}
                            >
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemGreen + '15' }]}>
                                    <LucideIcons.TrendingUp size={28} color={AppleColors.systemGreen} />
                                </View>
                                <View style={styles.focusCardContent}>
                                    <Text style={styles.focusCardTitle}>Build Habits</Text>
                                    <Text style={styles.focusCardDesc}>Start positive routines like Gym, Meditation, and Reading.</Text>
                                </View>
                                <View style={[styles.focusCheckbox, selectedFocus.build && { backgroundColor: AppleColors.systemGreen, borderColor: AppleColors.systemGreen }]}>
                                    {selectedFocus.build && <LucideIcons.Check size={14} color="white" />}
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={() => toggleFocus('break')}
                                style={[
                                    styles.focusCard,
                                    selectedFocus.break && styles.focusCardSelectedBreak
                                ]}
                            >
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemOrange + '15' }]}>
                                    <LucideIcons.ShieldOff size={28} color={AppleColors.systemOrange} />
                                </View>
                                <View style={styles.focusCardContent}>
                                    <Text style={styles.focusCardTitle}>Break Habits</Text>
                                    <Text style={styles.focusCardDesc}>Reduce behaviors you want to stop like Smoking or Sugar.</Text>
                                </View>
                                <View style={[styles.focusCheckbox, selectedFocus.break && { backgroundColor: AppleColors.systemOrange, borderColor: AppleColors.systemOrange }]}>
                                    {selectedFocus.break && <LucideIcons.Check size={14} color="white" />}
                                </View>
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
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>

                    <View style={styles.authHeader}>
                        <Text style={styles.authTitle}>Create Account</Text>
                        <Text style={styles.authSub}>Start building better habits today.</Text>
                    </View>

                    <View style={styles.authForm}>
                        <AppleButton title="Continue with Apple" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Apple size={20} color={AppleColors.label.primary} />} fullWidth style={{ marginBottom: 12 }} />
                        <AppleButton title="Continue with Google" onPress={handleAuthAction} variant="secondary" icon={<LucideIcons.Chrome size={20} color={AppleColors.label.primary} />} fullWidth />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>OR SIGN UP WITH EMAIL</Text>
                            <View style={styles.line} />
                        </View>

                        <TextInput placeholder="Email address" style={styles.input} placeholderTextColor={AppleColors.label.tertiary} />
                        <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor={AppleColors.label.tertiary} />
                        <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry placeholderTextColor={AppleColors.label.tertiary} />

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
        backgroundColor: AppleColors.background.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppleSpacing.screenPadding,
        paddingTop: 20,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    scrollContent: {
        paddingHorizontal: AppleSpacing.screenPadding,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        width: 44, // Smallest recommended touch target per guide
        height: 44,
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 140,
        height: 140,
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appIcon: {
        width: '100%',
        height: '100%',
    },
    headline: {
        ...AppleTypography.display,
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtext: {
        ...AppleTypography.bodyLarge,
        fontWeight: '400',
        color: AppleColors.label.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    focusHeadline: {
        ...AppleTypography.h1,
        color: AppleColors.label.primary,
        marginBottom: 12,
    },
    focusSubtext: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        marginBottom: 40,
    },
    focusGrid: {
        gap: 16,
    },
    focusCard: {
        backgroundColor: AppleColors.background.secondary,
        borderRadius: 12, // 12pt per Skill
        padding: 16, // 16pt per Skill (Standard container padding)
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    focusCardSelectedBuild: {
        borderColor: AppleColors.primary,
        backgroundColor: AppleColors.primary + '05',
    },
    focusCardSelectedBreak: {
        borderColor: AppleColors.warning,
        backgroundColor: AppleColors.warning + '05',
    },
    focusIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12, // 12pt per Skill
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    storyboardGrid: {
        gap: 16,
        marginTop: 20,
    },
    storyboardCard: {
        backgroundColor: AppleColors.background.secondary,
        borderRadius: 12, // 12pt per Skill
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    storyIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12, // 12pt per Skill
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    storyContent: {
        gap: 12,
    },
    storyText: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
    },
    storyInsight: {
        ...AppleTypography.labelSmall,
        color: AppleColors.primary,
        marginTop: 8,
    },
    focusCardContent: {
        flex: 1,
    },
    focusCardTitle: {
        ...AppleTypography.labelLarge,
        color: AppleColors.label.primary,
        marginBottom: 4,
    },
    focusCardDesc: {
        ...AppleTypography.caption,
        color: AppleColors.label.secondary,
        paddingRight: 10,
    },
    focusCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: AppleColors.separator.opaque,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authHeader: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    authTitle: {
        ...AppleTypography.h1,
        color: AppleColors.label.primary,
        marginBottom: 8,
    },
    authSub: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
    },
    authForm: {
        gap: 12,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: AppleColors.separator.nonOpaque,
    },
    dividerText: {
        marginHorizontal: 16,
        ...AppleTypography.labelSmall,
        color: AppleColors.label.tertiary,
    },
    input: {
        backgroundColor: AppleColors.background.secondary,
        paddingHorizontal: 12, // 12pt horizontal
        paddingVertical: 12, // 8-12pt vertical (Skill says 8, but 12 feels better for touch)
        borderRadius: 12, // 12pt per Skill
        ...AppleTypography.body,
        color: AppleColors.label.primary,
        marginBottom: 4,
    },
    legalText: {
        ...AppleTypography.caption,
        color: AppleColors.label.tertiary,
        textAlign: 'center',
        marginTop: 16,
    },
    link: {
        color: AppleColors.primary,
        fontWeight: '600',
    },
    forgotPass: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    linkText: {
        color: AppleColors.primary,
        ...AppleTypography.label,
    },
    switchAuth: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    switchText: {
        ...AppleTypography.bodySmall,
        color: AppleColors.label.secondary,
    },
    loginShortcut: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginShortcutText: {
        ...AppleTypography.bodySmall,
        color: AppleColors.label.secondary,
    },
    loginShortcutBold: {
        color: AppleColors.primary,
        fontWeight: '700',
    },
});
