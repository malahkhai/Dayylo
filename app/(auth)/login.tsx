import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, TextInput, ScrollView, Image, Linking, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';
import { useAuth } from '../../context/AuthContext';



const { width } = Dimensions.get('window');

type AuthMode = 'welcome' | 'features' | 'storyboard' | 'focus' | 'signup' | 'signin';

export default function AuthScreen() {
    const router = useRouter();
    const { user, loginWithGoogle, loginWithApple } = useAuth();
    const [mode, setMode] = useState<AuthMode>('welcome');
    const [selectedFocus, setSelectedFocus] = useState<{ build: boolean, break: boolean }>({ build: false, break: false });

    // Handle initial redirect if user is already logged in
    React.useEffect(() => {
        if (user && mode !== 'signup') {
            router.replace('/(tabs)');
        }
    }, [user, mode]);

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
    const handleNextStoryboard = () => setMode('features');
    const handleNextFeatures = () => setMode('focus');
    const handleNext = () => setMode('signup');
    const handleLoginLink = () => setMode('signin');
    const handleBack = () => {
        if (mode === 'storyboard') setMode('welcome');
        else if (mode === 'features') setMode('storyboard');
        else if (mode === 'focus') setMode('features');
        else if (mode === 'signup' || mode === 'signin') setMode('focus');
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            const isNewUser = provider === 'google' ? await loginWithGoogle() : await loginWithApple();
            if (isNewUser) {
                router.replace('/(auth)/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            if (error?.message !== 'Sign in cancelled') {
                Alert.alert("Authentication Failed", error.message || "Please try again.");
            }
        }
    };

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Please enter email and password.");
        try {
            await auth().signInWithEmailAndPassword(email.trim(), password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        }
    };

    const handleSignup = async () => {
        if (!email || !password) return Alert.alert("Error", "Please enter valid credentials.");
        if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");
        try {
            await auth().createUserWithEmailAndPassword(email.trim(), password);
            router.replace('/(auth)/onboarding');
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message);
        }
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
                        title="Get Started"
                        onPress={handleContinue}
                        size="large"
                        fullWidth
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'features') {
        return (
            <SafeAreaView style={styles.container}>
                {/* Fixed header */}
                <View style={[styles.sbHeader, { paddingHorizontal: AppleSpacing.screenPadding }]}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        {['welcome', 'storyboard', 'features', 'focus'].map((s, i) => (
                            <View key={i} style={[{
                                width: s === 'features' ? 20 : 6, height: 6, borderRadius: 3,
                                backgroundColor: s === 'features' ? AppleColors.primary : 'rgba(255,255,255,0.2)'
                            }]} />
                        ))}
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                {/* Content */}
                <View style={{ flex: 1, paddingHorizontal: AppleSpacing.screenPadding, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <LucideIcons.LayoutGrid size={80} color={AppleColors.systemIndigo} style={{ marginBottom: 20 }} />
                        <Text style={[styles.sbHeadline, { textAlign: 'center', fontSize: 26 }]}>Track Your Habits</Text>
                        <Text style={[styles.sbSubheadline, { textAlign: 'center', marginTop: 10, paddingHorizontal: 20, lineHeight: 22 }]}>
                            See your progress evolve with our beautiful heatmap and stay consistent every day.
                        </Text>

                        <View style={[{
                            width: 240, height: 100, backgroundColor: '#1E1E20', borderRadius: AppleBorderRadius.lg, padding: 12, marginTop: 40,
                            ...AppleShadows.medium
                        }]}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                                {[...Array(35)].map((_, i) => (
                                    <View key={i} style={{
                                        width: 14, height: 14, borderRadius: 3,
                                        backgroundColor: Math.random() > 0.4
                                            ? AppleColors.primary + (Math.random() * 80 + 20).toString(16).split('.')[0].padStart(2, '0')
                                            : 'rgba(255,255,255,0.05)'
                                    }} />
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* CTA */}
                <View style={{ paddingHorizontal: AppleSpacing.screenPadding, paddingBottom: 20 }}>
                    <AppleButton
                        title="Next"
                        onPress={handleNextFeatures}
                        size="large"
                        fullWidth
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'storyboard') {
        const STATS = [
            { icon: 'Flame', color: '#FF6B35', value: '21', unit: 'day streak', label: 'Average user streak built' },
            { icon: 'TrendingUp', color: '#30D158', value: '78%', unit: 'success rate', label: 'Habit completion rate' },
            { icon: 'ShieldOff', color: '#FF453A', value: '66', unit: 'days to break', label: 'Days to drop a bad habit' },
        ];

        return (
            <SafeAreaView style={styles.container}>
                {/* Fixed header */}
                <View style={[styles.sbHeader, { paddingHorizontal: AppleSpacing.screenPadding }]}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        {['welcome', 'storyboard', 'features', 'focus'].map((s, i) => (
                            <View key={i} style={[{
                                width: s === 'storyboard' ? 20 : 6, height: 6, borderRadius: 3,
                                backgroundColor: s === 'storyboard' ? AppleColors.primary : 'rgba(255,255,255,0.2)'
                            }]} />
                        ))}
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                {/* Content — no scroll, everything fits */}
                <View style={{ flex: 1, paddingHorizontal: AppleSpacing.screenPadding, justifyContent: 'space-between', paddingVertical: 12 }}>

                    {/* Headline */}
                    <View>
                        <View style={styles.sbBadge}>
                            <LucideIcons.Sparkles size={10} color={AppleColors.primary} />
                            <Text style={styles.sbBadgeText}>WHY IT WORKS</Text>
                        </View>
                        <Text style={[styles.sbHeadline, { fontSize: 26, lineHeight: 34 }]}>
                            Building a{' '}
                            <Text style={{ color: AppleColors.primary }}>better you</Text>
                            {"\n"}starts today.
                        </Text>
                        <Text style={[styles.sbSubheadline, { fontSize: 13, lineHeight: 19 }]}>
                            Dayylo turns intention into identity — one tracked day at a time.
                        </Text>
                    </View>

                    {/* Stat cards */}
                    <View style={{ gap: 8 }}>
                        {STATS.map((stat, i) => {
                            const Icon = (LucideIcons as any)[stat.icon];
                            return (
                                <View key={i} style={[styles.sbStatCard, { borderLeftColor: stat.color, borderLeftWidth: 3, padding: 12 }]}>
                                    <View style={[styles.sbStatIcon, { backgroundColor: stat.color + '20', width: 40, height: 40, borderRadius: 12 }]}>
                                        <Icon size={18} color={stat.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.sbStatLabel, { fontSize: 12 }]}>{stat.label}</Text>
                                        <Text style={[styles.sbStatSub, { fontSize: 11 }]}>{stat.value} {stat.unit}</Text>
                                    </View>
                                    <View style={[styles.sbStatPill, { backgroundColor: stat.color + '20', paddingHorizontal: 10, paddingVertical: 4 }]}>
                                        <Text style={[styles.sbStatPillText, { color: stat.color, fontSize: 14 }]}>{stat.value}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Quote */}
                    <View style={[styles.sbQuote, { padding: 12, gap: 4 }]}>
                        <LucideIcons.Quote size={12} color={AppleColors.primary} />
                        <Text style={[styles.sbQuoteText, { fontSize: 12, lineHeight: 18 }]}>
                            "We are what we repeatedly do. Excellence, then, is not an act but a habit."
                        </Text>
                        <Text style={[styles.sbQuoteAuthor, { fontSize: 11 }]}>— Aristotle</Text>
                    </View>

                    {/* CTA */}
                    <View>
                        <AppleButton
                            title="That's me — Let's go"
                            onPress={handleNextStoryboard}
                            size="large"
                            fullWidth
                        />
                    </View>
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
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            {['welcome', 'storyboard', 'features', 'focus'].map((s, i) => (
                                <View key={i} style={[{
                                    width: s === 'focus' ? 20 : 6, height: 6, borderRadius: 3,
                                    backgroundColor: s === 'focus' ? AppleColors.primary : 'rgba(255,255,255,0.2)'
                                }]} />
                            ))}
                        </View>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', marginVertical: 20 }}>
                        <Text style={styles.focusHeadline}>This is where the magic happens.</Text>
                        <Text style={styles.focusSubtext}>Here's what Dayylo helps you do.</Text>

                        <View style={[styles.focusGrid, { marginTop: 20 }]}>
                            {/* Build Habits card — static, not tappable */}
                            <View style={[styles.focusCard, styles.focusCardSelectedBuild]}>
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemGreen + '15' }]}>
                                    <LucideIcons.TrendingUp size={28} color={AppleColors.systemGreen} />
                                </View>
                                <View style={styles.focusCardContent}>
                                    <Text style={styles.focusCardTitle}>Build Habits</Text>
                                    <Text style={styles.focusCardDesc}>Start positive routines like Gym, Meditation, and Reading.</Text>
                                </View>
                            </View>

                            {/* Break Habits card — static, not tappable */}
                            <View style={[styles.focusCard, styles.focusCardSelectedBreak]}>
                                <View style={[styles.focusIconBg, { backgroundColor: AppleColors.systemOrange + '15' }]}>
                                    <LucideIcons.ShieldOff size={28} color={AppleColors.systemOrange} />
                                </View>
                                <View style={styles.focusCardContent}>
                                    <Text style={styles.focusCardTitle}>Break Habits</Text>
                                    <Text style={styles.focusCardDesc}>Reduce behaviors you want to stop like Smoking or Sugar.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <AppleButton
                        title="Let's get started"
                        onPress={handleNext}
                        size="large"
                        fullWidth
                    />
                </View>
            </SafeAreaView>
        );
    }


    if (mode === 'signup') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>

                    <View style={styles.authHeader}>
                        <Text style={styles.authTitle}>Create Account</Text>
                        <Text style={styles.authSub}>Start building better habits today.</Text>
                    </View>

                    <View style={styles.authForm}>
                        {/* Email fields first */}
                        <TextInput
                            placeholder="Email address"
                            style={styles.input}
                            placeholderTextColor={AppleColors.label.tertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            secureTextEntry
                            placeholderTextColor={AppleColors.label.tertiary}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            style={styles.input}
                            secureTextEntry
                            placeholderTextColor={AppleColors.label.tertiary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <AppleButton title="Sign Up" onPress={handleSignup} size="large" fullWidth style={{ marginTop: 8 }} />

                        <Text style={styles.legalText}>
                            By signing up, you agree to our{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://www.notion.so/Privacy-Policy-Dayylo-31792d45fcc58005beeaf9c6208d9cd5?source=copy_link')}>Terms</Text>
                            {' '}and{' '}
                            <Text style={styles.link} onPress={() => Linking.openURL('https://malahkhai.notion.site/Privacy-Policy-Dayylo-31792d45fcc58005beeaf9c6208d9cd5')}>Privacy Policy</Text>.
                        </Text>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
                            <View style={styles.line} />
                        </View>

                        {/* Apple Sign In — logo + text centred together as a unit, per Apple spec */}
                        <Pressable onPress={() => handleSocialLogin('apple')} style={styles.ssoButtonApple}>
                            <FontAwesome name="apple" size={22} color={AppleColors.label.primary} />
                            <Text style={styles.ssoAppleText}>Sign up with Apple</Text>
                        </Pressable>

                        {/* Google Sign In — authentic four-color Google G SVG */}
                        <Pressable onPress={() => handleSocialLogin('google')} style={styles.ssoButtonGoogle}>
                            <View style={styles.ssoGoogleIconBg}>
                                <Svg width={18} height={18} viewBox="0 0 48 48">
                                    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </Svg>
                            </View>
                            <Text style={styles.ssoGoogleText}>Sign up with Google</Text>
                        </Pressable>

                        <View style={styles.switchAuth}>
                            <Text style={styles.switchText}>Already have an account? </Text>
                            <Pressable onPress={() => setMode('signin')}>
                                <Text style={styles.linkText}>Sign in</Text>
                            </Pressable>
                        </View>
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
                    <Pressable onPress={() => handleSocialLogin('apple')} style={styles.ssoButtonApple}>
                        <FontAwesome name="apple" size={22} color={AppleColors.label.primary} />
                        <Text style={styles.ssoAppleText}>Continue with Apple</Text>
                    </Pressable>

                    <Pressable onPress={() => handleSocialLogin('google')} style={styles.ssoButtonGoogle}>
                        <View style={styles.ssoGoogleIconBg}>
                            <Svg width={18} height={18} viewBox="0 0 48 48">
                                <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </Svg>
                        </View>
                        <Text style={styles.ssoGoogleText}>Continue with Google</Text>
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR LOG IN WITH EMAIL</Text>
                        <View style={styles.line} />
                    </View>

                    <TextInput
                        placeholder="Email address"
                        style={styles.input}
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable style={styles.forgotPass}>
                        <Text style={styles.linkText}>Forgot password?</Text>
                    </Pressable>

                    <AppleButton title="Sign In" onPress={handleLogin} size="large" fullWidth style={{ marginTop: 12 }} />

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
    ssoButtonApple: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: AppleColors.background.secondary,
        borderRadius: AppleBorderRadius.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
        paddingVertical: 15, paddingHorizontal: 20,
        gap: 10, marginBottom: 12,
    },
    ssoAppleText: {
        fontSize: 16,
        fontWeight: '600',
        color: AppleColors.label.primary,
        letterSpacing: -0.2,
    },
    ssoButtonGoogle: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: AppleColors.background.secondary,
        borderRadius: AppleBorderRadius.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
        paddingVertical: 15, paddingHorizontal: 20,
        gap: 10, marginBottom: 12,
    },
    ssoGoogleIconBg: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
    },
    ssoGoogleText: {
        fontSize: 16, fontWeight: '600',
        color: AppleColors.label.primary,
        letterSpacing: -0.2,
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

    // ─── Storyboard redesign ──────────────────────────────────────────────────
    sbBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: AppleColors.primary + '18',
        paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
        alignSelf: 'flex-start', marginBottom: 16,
        borderWidth: 1, borderColor: AppleColors.primary + '30',
    },
    sbBadgeText: {
        fontSize: 10, fontWeight: '800', color: AppleColors.primary,
        letterSpacing: 1.5, textTransform: 'uppercase',
    },
    sbHeadline: {
        fontSize: 36, fontWeight: '900', color: AppleColors.label.primary,
        lineHeight: 44, letterSpacing: -0.5, marginBottom: 12,
    },
    sbSubheadline: {
        ...AppleTypography.body, color: AppleColors.label.secondary, lineHeight: 22,
    },
    sbStatCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18, padding: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    sbStatIcon: {
        width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    },
    sbStatLabel: {
        fontSize: 13, fontWeight: '700', color: AppleColors.label.primary, marginBottom: 2,
    },
    sbStatSub: {
        fontSize: 12, color: AppleColors.label.tertiary, fontWeight: '500',
    },
    sbStatPill: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    sbStatPillText: {
        fontSize: 16, fontWeight: '900',
    },
    sbQuote: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16, padding: 16, gap: 8,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    sbQuoteText: {
        ...AppleTypography.callout, color: AppleColors.label.secondary,
        fontStyle: 'italic', lineHeight: 22,
    },
    sbQuoteAuthor: {
        ...AppleTypography.caption2, color: AppleColors.primary,
        fontWeight: '700', letterSpacing: 0.5,
    },
    sbHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 8,
    },
    sbFooter: {
        paddingTop: 12, paddingBottom: 20,
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
    },
});
