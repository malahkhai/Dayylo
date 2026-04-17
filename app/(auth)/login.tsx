import React, { useState, useEffect } from 'react';
import { 
    View, Text, Pressable, StyleSheet, Dimensions, TextInput, 
    ScrollView, Image, Linking, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import Animated, { 
    useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
    FadeInRight, FadeIn
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { AppleColors, AppleTypography, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitContext';
import { SwipeButton } from '../../components/SwipeButton';
import { ConfettiExplosion } from '../../components/ConfettiExplosion';

console.log('[Heartbeat] login.tsx module loaded');

const { width } = Dimensions.get('window');

type AuthMode = 'welcome' | 'storyboard' | 'signup' | 'signin';

export default function AuthScreen() {
    const router = useRouter();
    const { user, loginWithGoogle, loginWithApple, loginAnonymously } = useAuth();
    const [mode, setMode] = useState<AuthMode>('welcome');
    const [storyStep, setStoryStep] = useState(1);
    const [selectedFocus, setSelectedFocus] = useState<{ build: boolean, break: boolean }>({ build: false, break: false });
    const [animatedStreak, setAnimatedStreak] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);
    const [habitInput, setHabitInput] = useState('');
    
    // Safely attempt hook resolution
    let habitsContext: any = null;
    try {
        habitsContext = useHabits();
    } catch (e) {
        console.log('[Heartbeat] login.tsx: useHabits failed (normal if not in provider)', e);
    }
    const addHabit = habitsContext?.addHabit;

    // Handle initial redirect if user is already logged in
    useEffect(() => {
        if (user && mode !== 'signup') {
            console.log('[Heartbeat] User detected, redirecting to tabs');
            router.replace('/(tabs)');
        }
    }, [user, mode]);

    // Bouncing Animation for Logo
    const bounceValue = useSharedValue(0);
    useEffect(() => {
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

    // Rotation Animation for Loop
    const rotation = useSharedValue(0);
    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 4000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedRotateStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    // Streak Cycle Logic for Screen 5
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (mode === 'storyboard' && storyStep === 5) {
            const sequence = [1, 5, 12];
            let index = 0;
            interval = setInterval(() => {
                if (index < sequence.length - 1) {
                    index++;
                    setAnimatedStreak(sequence[index]);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    
                    if (sequence[index] === 12) {
                        clearInterval(interval);
                        setShowConfetti(true);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                }
            }, 1000);
        } else {
            setAnimatedStreak(1);
            setShowConfetti(false);
        }
        return () => clearInterval(interval);
    }, [mode, storyStep]);

    const handleContinue = () => {
        setStoryStep(1);
        setMode('storyboard');
    };
    
    const handleNextStoryboard = async () => {
        if (storyStep === 6) return; 

        if (storyStep === 7) {
            if (!habitInput.trim()) return;
            setStoryStep(8);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
        }

        if (storyStep === 8) {
            try {
                console.log('[Heartbeat] Finalizing Day 1 commitment...');
                await loginAnonymously();
                
                const formattedName = formatHabitName(habitInput, selectedFocus.build ? 'build' : 'break');
                if (addHabit) {
                    await addHabit({
                        name: formattedName,
                        type: selectedFocus.build ? 'build' : 'break',
                        icon: selectedFocus.build ? 'Zap' : 'Ban',
                        color: selectedFocus.build ? AppleColors.systemGreen : AppleColors.systemOrange,
                        frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        difficulty: 'medium',
                    });
                }
                
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.replace('/(tabs)');
            } catch (e) {
                console.error("[Heartbeat] Onboarding finalization failed", e);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
            return;
        }

        if (storyStep < 6) {
            setStoryStep(prev => prev + 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const formatHabitName = (input: string, type: 'build' | 'break') => {
        let text = input.trim();
        if (!text) return text;
        if (type === 'build') {
            const lower = text.toLowerCase();
            if (lower === 'go gym') return 'Go to the gym';
            if (lower === 'play piano') return 'Play the piano';
            if (lower.startsWith('go ') && !lower.includes(' to ')) {
                text = text.replace(/go /i, 'Go to the ');
            }
        } else {
            const lower = text.toLowerCase();
            if (lower === 'texting ex') return 'No texting ex';
            if (lower === 'junk food') return 'No junk food';
            if (!lower.startsWith('no ') && !lower.startsWith('stop ') && !lower.startsWith('avoid ')) {
                text = 'No ' + text;
            }
        }
        text = text.replace(/\s+/g, ' ');
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleBack = () => {
        if (mode === 'storyboard') {
            if (storyStep > 1) setStoryStep(prev => prev - 1);
            else setMode('welcome');
        } else setMode('welcome');
    };

    const toggleFocus = (type: 'build' | 'break') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedFocus({ build: type === 'build', break: type === 'break' });
        setTimeout(() => setStoryStep(7), 400);
    };

    const getStoryStepConfig = (step: number) => {
        switch(step) {
            case 1: return { title: 'Be honest. What’s controlling you?', highlight: 'controlling', sub: 'Not just habits — the things you can’t seem to stop' };
            case 2: return { title: 'It’s not lack of discipline', highlight: 'discipline', sub: 'It’s patterns you repeat every day without noticing' };
            case 3: return { title: 'Track what you want to STOP or START', highlight: 'STOP', sub: 'Most apps track what you do.\nDayylo tracks what you avoid.' };
            case 4: return { title: 'Every day counts — no hiding', highlight: 'counts', sub: 'You either did it… or you didn’t' };
            case 5: return { title: 'Build a streak you won’t want to break', highlight: 'streak', sub: 'One day becomes two. Then twelve. Then a new identity.' };
            case 6: return { title: 'What do you want to change?', highlight: 'change', sub: 'Start something better or stop something holding you back' };
            case 7: 
                if (selectedFocus.build) {
                    return { title: 'What do you want to start?', highlight: 'start', sub: 'Keep it simple — make it doable' };
                }
                return { title: 'What do you want to stop?', highlight: 'stop', sub: 'Be honest — this is for you' };
            case 8: return { title: 'This is Day 1.', highlight: 'Day 1', sub: 'The journey of a thousand miles begins with a single step.' };
            default: return { title: '', highlight: '', sub: '' };
        }
    };

    const renderHeadline = (title: string, highlight: string) => {
        if (!highlight) return <Text style={[styles.sbHeadline, storyStep === 6 && { textAlign: 'center' }]}>{title}</Text>;
        
        const parts = title.split(highlight);
        return (
            <Text style={[styles.sbHeadline, storyStep === 6 && { textAlign: 'center' }]}>
                {parts[0]}
                <Text style={{ color: AppleColors.primary }}>{highlight}</Text>
                {parts[1]}
            </Text>
        );
    };

    const renderStoryStep = () => {
        const config = getStoryStepConfig(storyStep);

        return (
            <View style={styles.stepContent}>
                <View style={[styles.fixedHeader, { minHeight: 140 }, storyStep === 6 && { alignItems: 'center' }]}>
                    {renderHeadline(config.title, config.highlight)}
                    <Text style={[styles.sbSubheadline, storyStep === 6 && { textAlign: 'center' }]}>{config.sub}</Text>
                </View>

                <View style={styles.visualSection}>
                    {renderStepVisual()}
                </View>
            </View>
        );
    };

    const renderStepVisual = () => {
        switch(storyStep) {
            case 1:
                return (
                    <View style={styles.bubbleGrid}>
                        {['Late night scrolling', 'Texting your ex', 'Skipping workouts', 'Porn', 'Junk food'].map((item, i) => (
                            <View key={i} style={[styles.blurredBubble, { opacity: 1 - (i * 0.15), transform: [{ scale: 1 - (i * 0.05) }] }]}>
                                <Text style={styles.bubbleText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 2:
                return (
                    <View style={styles.loopContainer}>
                        <Animated.View style={animatedRotateStyle}>
                            <LucideIcons.RefreshCw size={80} color={AppleColors.systemBlue} />
                        </Animated.View>
                        <Text style={[styles.sbQuoteAuthor, { marginTop: 20, color: AppleColors.label.tertiary }]}>again… and again…</Text>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.sbStatGrid}>
                        {[
                            { label: 'Yes to Gym', icon: 'Dumbbell', color: AppleColors.systemGreen },
                            { label: 'No to Porn', icon: 'ShieldOff', color: AppleColors.systemOrange },
                            { label: 'Yes to 20K daily walk', icon: 'Footprints', color: AppleColors.systemGreen },
                            { label: 'No to texting your ex', icon: 'MessageCircle', color: AppleColors.systemOrange },
                            { label: 'Yes to Saving daily 20 euros', icon: 'Euro', color: AppleColors.systemGreen }
                        ].map((item, i) => {
                            const ItemIcon = (LucideIcons as any)[item.icon];
                            return (
                                <Animated.View 
                                    key={i} 
                                    entering={FadeInRight.delay(i * 100).duration(400).springify()}
                                    style={[styles.sbStatCard, { paddingVertical: 10, borderColor: item.color + '30' }]}
                                >
                                    <View style={[styles.sbStatIcon, { width: 32, height: 32, backgroundColor: item.color + '15' }]}>
                                        {ItemIcon && <ItemIcon size={16} color={item.color} />}
                                    </View>
                                    <Text style={[styles.sbStatLabel, { fontSize: 13, color: '#FFF' }]}>{item.label}</Text>
                                    <View style={{ flex: 1 }} />
                                    <LucideIcons.CheckCircle size={18} color={item.color} />
                                </Animated.View>
                            );
                        })}
                    </View>
                );
            case 4:
                return (
                    <View style={styles.contrastGrid}>
                        <View style={[styles.contrastCard, { borderColor: AppleColors.systemRed + '40' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <LucideIcons.X size={24} color={AppleColors.systemRed} />
                                <Text style={styles.contrastText}>Did it</Text>
                            </View>
                        </View>
                        <View style={[styles.contrastCard, { borderColor: AppleColors.systemGreen + '40' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <LucideIcons.Check size={24} color={AppleColors.systemGreen} />
                                <Text style={styles.contrastText}>Avoided it</Text>
                            </View>
                        </View>
                    </View>
                );
            case 5:
                return (
                    <View style={styles.streakContainer}>
                        {showConfetti && <ConfettiExplosion />}
                        <LucideIcons.Flame size={64} color={AppleColors.systemOrange} style={{ marginBottom: 10 }} />
                        <Text style={styles.streakValue}>{animatedStreak}</Text>
                        <Text style={styles.accLabel}>DAY STREAK</Text>
                    </View>
                );
            case 6:
                return (
                    <View style={[styles.choiceGrid, { gap: 24, marginTop: 10 }]}>
                        {/* START CARD */}
                        <View style={[styles.contrastCard, { backgroundColor: '#070707', borderColor: '#111', padding: 24 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                                <View style={[styles.choiceIconBg, { backgroundColor: '#34C759', width: 56, height: 56, borderRadius: 16 }]}>
                                    <LucideIcons.PlusCircle size={32} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.choiceTitle, { fontSize: 20 }]}>START (Build)</Text>
                                    <Text style={[styles.choiceDesc, { fontSize: 13, color: '#888' }]}>Start routines that improve your life</Text>
                                </View>
                            </View>
                            
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                                {['Exercise', 'Read', 'Sleep early'].map(ex => (
                                    <View key={ex} style={{ backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                                        <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>{ex}</Text>
                                    </View>
                                ))}
                            </View>

                            <Pressable 
                                onPress={() => {
                                    setSelectedFocus({ build: true, break: false });
                                    setStoryStep(7);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }}
                                style={({ pressed }) => [
                                    { backgroundColor: '#34C759', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
                                    pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
                                ]}
                            >
                                <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '800' }}>👉 Start a habit</Text>
                            </Pressable>
                        </View>

                        {/* STOP CARD */}
                        <View style={[styles.contrastCard, { backgroundColor: '#070707', borderColor: '#111', padding: 24 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                                <View style={[styles.choiceIconBg, { backgroundColor: '#FF9500', width: 56, height: 56, borderRadius: 16 }]}>
                                    <LucideIcons.MinusCircle size={32} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.choiceTitle, { fontSize: 20 }]}>STOP (Break)</Text>
                                    <Text style={[styles.choiceDesc, { fontSize: 13, color: '#888' }]}>Stop patterns that control you</Text>
                                </View>
                            </View>
                            
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                                {['Late night scrolling', 'Texting ex', 'Porn'].map(ex => (
                                    <View key={ex} style={{ backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                                        <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>{ex}</Text>
                                    </View>
                                ))}
                            </View>

                            <Pressable 
                                onPress={() => {
                                    setSelectedFocus({ build: false, break: true });
                                    setStoryStep(7);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }}
                                style={({ pressed }) => [
                                    { backgroundColor: '#FF9500', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
                                    pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
                                ]}
                            >
                                <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '800' }}>👉 Break a habit</Text>
                            </Pressable>
                        </View>
                    </View>
                );
            case 7:
                const suggestions = selectedFocus.build 
                    ? ['Exercise', 'Drink water', 'Read', 'Sleep early']
                    : ['No porn', 'No texting ex', 'No sugar', 'No late night scrolling'];

                return (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, width: '100%' }}>
                        <View style={styles.creationContainer}>
                            <TextInput 
                                style={styles.largeInput}
                                placeholder={selectedFocus.build ? "e.g. go to the gym" : "e.g. texting my ex"}
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                value={habitInput}
                                onChangeText={setHabitInput}
                                autoFocus
                                selectionColor={AppleColors.primary}
                            />
                            <View style={styles.suggestionGrid}>
                                {suggestions.map(s => (
                                    <Pressable 
                                        key={s} 
                                        style={styles.suggestionPill} 
                                        onPress={() => {
                                            setHabitInput(s);
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                    >
                                        <Text style={styles.suggestionText}>{s}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                );
            case 8:
                return (
                    <View style={[styles.visualSection, { alignItems: 'center', justifyContent: 'center' }]}>
                        <View style={styles.dayOneCircle}>
                            <Text style={styles.dayOneNum}>1</Text>
                        </View>
                    </View>
                );
            default: return null;
        }
    };

    if (mode === 'welcome') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.centerContent}>
                        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
                            <Image source={require('../../assets/welcome-logo.png')} style={styles.appIcon} resizeMode="contain" />
                        </Animated.View>
                        <Text style={styles.headline}>Welcome to Dayylo</Text>
                        <Text style={styles.subtext}>Habit tracker for real-life struggles, not perfect routines</Text>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 4 }}>
                        <SwipeButton title="Slide to start" onSwipeComplete={handleContinue} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (mode === 'storyboard') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.sbHeader, { paddingHorizontal: 20 }]}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <LucideIcons.ChevronLeft size={24} color={AppleColors.label.primary} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <View key={s} style={[{
                                width: s === storyStep ? 16 : 6, height: 6, borderRadius: 3,
                                backgroundColor: s === storyStep ? AppleColors.primary : 'rgba(255,255,255,0.1)'
                            }]} />
                        ))}
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    {renderStoryStep()}
                </View>

                {storyStep !== 6 && (
                    <View style={[styles.sbFooter, { paddingHorizontal: 20 }]}>
                        <AppleButton 
                            title={
                                storyStep === 1 ? "👉 I’m ready to change" :
                                storyStep === 2 ? "👉 Break the cycle" :
                                storyStep === 3 ? "👉 Take control" :
                                storyStep === 4 ? "👉 Be accountable" :
                                storyStep === 5 ? "👉 Start my streak" :
                                storyStep === 7 ? "Start Day 1" : 
                                storyStep === 8 ? "Continue" : "Next"
                            } 
                            onPress={handleNextStoryboard}
                            type="primary"
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppleColors.background.primary },
    content: { flex: 1, padding: 24, justifyContent: 'space-between', alignItems: 'center' },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoContainer: { width: 140, height: 140, marginBottom: 40, alignItems: 'center', justifyContent: 'center' },
    appIcon: { width: 120, height: 120 },
    headline: { ...AppleTypography.largeTitle, color: AppleColors.label.primary, textAlign: 'center', marginBottom: 12, fontWeight: '900' },
    subtext: { ...AppleTypography.body, color: AppleColors.label.secondary, textAlign: 'center', paddingHorizontal: 20 },
    backButton: { width: 44, height: 44, justifyContent: 'center' },
    sbHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
    sbFooter: { paddingBottom: Platform.OS === 'ios' ? 20 : 30 },
    
    sbBadge: { 
        flexDirection: 'row', alignItems: 'center', gap: 6, 
        backgroundColor: AppleColors.primary + '18', 
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, 
        alignSelf: 'flex-start', marginBottom: 20,
        borderWidth: 1, borderColor: AppleColors.primary + '30',
    },
    sbBadgeText: { fontSize: 10, fontWeight: '900', color: AppleColors.primary, letterSpacing: 1.5, textTransform: 'uppercase' },
    sbHeadline: { fontSize: 36, fontWeight: '900', color: '#FFF', textAlign: 'left', lineHeight: 44, marginBottom: 12, letterSpacing: -0.5 },
    sbSubheadline: { ...AppleTypography.body, color: AppleColors.label.secondary, textAlign: 'left', lineHeight: 22 },
    sbQuoteAuthor: { ...AppleTypography.caption1, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    
    stepContent: { flex: 1, paddingTop: 50 },
    fixedHeader: { paddingHorizontal: 20, marginBottom: 20, minHeight: 180 },
    visualSection: { flex: 1, paddingHorizontal: 20 },
    
    // Reality Hook Bubbles
    bubbleGrid: { marginVertical: 40, alignItems: 'center', gap: 12 },
    blurredBubble: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    bubbleText: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '600' },
    
    loopContainer: { marginVertical: 40, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
    
    sbStatGrid: { marginVertical: 10, gap: 8 },
    sbStatCard: { 
        flexDirection: 'row', alignItems: 'center', gap: 14, 
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, 
        padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' 
    },
    sbStatIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    sbStatLabel: { fontSize: 13, fontWeight: '700', color: AppleColors.label.primary, marginBottom: 2 },
    sbStatSub: { fontSize: 12, color: AppleColors.label.tertiary, fontWeight: '500' },
    
    contrastGrid: { marginVertical: 30, gap: 16 },
    contrastCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, borderWidth: 1 },
    contrastLabel: { fontSize: 11, fontWeight: '900', color: AppleColors.label.tertiary, textTransform: 'uppercase', marginBottom: 8 },
    contrastText: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    
    streakContainer: { marginVertical: 60, alignItems: 'center', gap: 10 },
    streakValue: { fontSize: 80, fontWeight: '900', color: AppleColors.primary },
    accLabel: { color: '#FFF', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    
    choiceGrid: { width: '100%', gap: 12, marginTop: 10 },
    choiceCard: { 
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, 
        padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16,
        borderWidth: 2, borderColor: 'transparent' 
    },
    choiceCardSelectedBuild: { borderColor: AppleColors.systemGreen, backgroundColor: AppleColors.systemGreen + '05' },
    choiceCardSelectedBreak: { borderColor: AppleColors.systemOrange, backgroundColor: AppleColors.systemOrange + '05' },
    choiceIconBg: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    choiceTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
    choiceDesc: { fontSize: 13, color: AppleColors.label.secondary, marginTop: 2 },
    
    creationContainer: { marginTop: 40, width: '100%', gap: 32 },
    largeInput: { fontSize: 32, fontWeight: '900', color: '#FFF', textAlign: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    suggestionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    suggestionPill: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    suggestionText: { color: AppleColors.label.secondary, fontSize: 14, fontWeight: '600' },
    
    dayOneCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: AppleColors.primary + '20', borderWidth: 3, borderColor: AppleColors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 40, ...AppleShadows.medium },
    dayOneNum: { fontSize: 72, fontWeight: '900', color: AppleColors.primary },
});
