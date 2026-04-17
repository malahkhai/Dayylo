import React, { useState, useEffect } from 'react';
import { 
    View, Text, Pressable, StyleSheet, Dimensions, TextInput, 
    ScrollView, Image, Linking, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import Animated, { 
    useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence 
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

    const renderStoryStep = () => {
        switch(storyStep) {
            case 1:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.sbBadge}>
                            <LucideIcons.ShieldAlert size={12} color={AppleColors.primary} />
                            <Text style={styles.sbBadgeText}>Reality Hook</Text>
                        </View>
                        <Text style={styles.sbHeadline}>Be honest. What’s controlling you?</Text>
                        <Text style={styles.sbSubheadline}>Not just habits — the things you can’t seem to stop</Text>
                        
                        <View style={styles.bubbleGrid}>
                            {['Late night scrolling', 'Texting your ex', 'Skipping workouts', 'Porn', 'Junk food'].map((item, i) => (
                                <View key={i} style={[styles.blurredBubble, { opacity: 1 - (i * 0.15), transform: [{ scale: 1 - (i * 0.05) }] }]}>
                                    <Text style={styles.bubbleText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.sbBadge}>
                            <LucideIcons.Repeat size={12} color={AppleColors.systemRed} />
                            <Text style={[styles.sbBadgeText, { color: AppleColors.systemRed }]}>Call It Out</Text>
                        </View>
                        <Text style={styles.sbHeadline}>It’s not lack of discipline</Text>
                        <Text style={styles.sbSubheadline}>It’s patterns you repeat every day without noticing</Text>
                        <View style={styles.loopContainer}>
                            <Animated.View style={animatedRotateStyle}>
                                <LucideIcons.RefreshCw size={80} color={AppleColors.systemRed} />
                            </Animated.View>
                            <Text style={[styles.sbQuoteAuthor, { marginTop: 20, color: AppleColors.label.tertiary }]}>again… and again…</Text>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.sbBadge}>
                            <LucideIcons.ArrowLeftRight size={12} color={AppleColors.systemBlue} />
                            <Text style={[styles.sbBadgeText, { color: AppleColors.systemBlue }]}>Your Differentiator</Text>
                        </View>
                        <Text style={styles.sbHeadline}>Track what you want to STOP or START</Text>
                        <Text style={styles.sbSubheadline}>Most apps track what you do.{"\n"}Dayylo tracks what you avoid.</Text>
                        
                        <View style={styles.sbStatGrid}>
                            {[
                                { label: 'Yes Gym', icon: 'CheckCircle', color: AppleColors.systemGreen },
                                { label: 'No porn', icon: 'EyeOff', color: AppleColors.systemOrange },
                                { label: 'Yes Walk 20k', icon: 'Footprints', color: AppleColors.systemGreen },
                                { label: 'No texting ex', icon: 'MessageCircle', color: AppleColors.systemOrange },
                                { label: 'Saving €20 Daily', icon: 'Wallet', color: AppleColors.systemGreen },
                                { label: 'No sugar', icon: 'Cookie', color: AppleColors.systemOrange }
                            ].map((item, i) => (
                                <View key={i} style={[styles.sbStatCard, { paddingVertical: 10, borderColor: item.color + '30' }]}>
                                    <View style={[styles.sbStatIcon, { width: 32, height: 32, backgroundColor: item.color + '15' }]}>
                                        <LucideIcons.Check size={16} color={item.color} />
                                    </View>
                                    <Text style={[styles.sbStatLabel, { fontSize: 13, color: '#FFF' }]}>{item.label}</Text>
                                    <View style={{ flex: 1 }} />
                                    <LucideIcons.CheckCircle size={18} color={item.color} />
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.sbBadge}>
                            <LucideIcons.Scale size={12} color={AppleColors.systemOrange} />
                            <Text style={[styles.sbBadgeText, { color: AppleColors.systemOrange }]}>Accountability Angle</Text>
                        </View>
                        <Text style={styles.sbHeadline}>Every day counts — no hiding</Text>
                        <Text style={styles.sbSubheadline}>You either did it… or you didn’t</Text>
                        
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
                    </View>
                );
            case 5:
                return (
                    <View style={styles.stepContent}>
                        {showConfetti && <ConfettiExplosion />}
                        <View style={styles.sbBadge}>
                            <LucideIcons.Flame size={12} color={AppleColors.primary} />
                            <Text style={styles.sbBadgeText}>Dopamine Hook</Text>
                        </View>
                        <Text style={styles.sbHeadline}>Build a streak you won’t want to break</Text>
                        <Text style={styles.sbSubheadline}>One day becomes two. Then ten. Then a new identity.</Text>
                        <View style={styles.streakContainer}>
                            <Text style={styles.streakValue}>{animatedStreak}</Text>
                            <Text style={styles.accLabel}>DAY STREAK</Text>
                        </View>
                    </View>
                );
            case 6:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.sbBadge}>
                            <LucideIcons.Target size={12} color={AppleColors.primary} />
                            <Text style={styles.sbBadgeText}>Focus Choice</Text>
                        </View>
                        <Text style={styles.sbHeadline}>Choose your battle.</Text>
                        <Text style={[styles.sbSubheadline, { marginBottom: 30 }]}>Focus on just one thing for now. Make it small, make it doable.</Text>
                        
                        <View style={styles.choiceGrid}>
                            <Pressable 
                                style={[styles.choiceCard, selectedFocus.build && styles.choiceCardSelectedBuild]} 
                                onPress={() => toggleFocus('build')}
                            >
                                <View style={[styles.choiceIconBg, { backgroundColor: AppleColors.systemGreen + '15' }]}>
                                    <LucideIcons.TrendingUp size={28} color={AppleColors.systemGreen} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.choiceTitle}>Start a habit</Text>
                                    <Text style={styles.choiceDesc}>Build a positive momentum</Text>
                                </View>
                                {selectedFocus.build && <LucideIcons.CheckCircle size={20} color={AppleColors.systemGreen} />}
                            </Pressable>

                            <Pressable 
                                style={[styles.choiceCard, selectedFocus.break && styles.choiceCardSelectedBreak]} 
                                onPress={() => toggleFocus('break')}
                            >
                                <View style={[styles.choiceIconBg, { backgroundColor: AppleColors.systemOrange + '15' }]}>
                                    <LucideIcons.ShieldOff size={28} color={AppleColors.systemOrange} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.choiceTitle}>Stop a habit</Text>
                                    <Text style={styles.choiceDesc}>Break a toxic cycle</Text>
                                </View>
                                {selectedFocus.break && <LucideIcons.CheckCircle size={20} color={AppleColors.systemOrange} />}
                            </Pressable>
                        </View>
                    </View>
                );
            case 7:
                return (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <View style={styles.stepContent}>
                            <Text style={styles.sbHeadline}>{selectedFocus.build ? 'What do you want to start?' : 'What do you want to break?'}</Text>
                            <Text style={styles.sbSubheadline}>Keep it simple — make it doable.</Text>
                            
                            <View style={styles.creationContainer}>
                                <TextInput 
                                    style={styles.largeInput}
                                    placeholder={selectedFocus.build ? "e.g. go to the gym" : "e.g. junk food"}
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    value={habitInput}
                                    onChangeText={setHabitInput}
                                    autoFocus
                                    selectionColor={AppleColors.primary}
                                />
                                <View style={styles.suggestionGrid}>
                                    {(selectedFocus.build ? ['Exercise', 'Drink water', 'Read', 'Sleep early'] : ['Social Media', 'Sugar', 'Caffeine', 'Late Nights']).map(s => (
                                        <Pressable key={s} style={styles.suggestionPill} onPress={() => setHabitInput(s)}>
                                            <Text style={styles.suggestionText}>{s}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                );
            case 8:
                return (
                    <View style={[styles.stepContent, { alignItems: 'center', justifyContent: 'center' }]}>
                        <View style={styles.dayOneCircle}>
                            <Text style={styles.dayOneNum}>1</Text>
                        </View>
                        <Text style={styles.sbHeadline}>This is Day 1</Text>
                        <Text style={styles.sbSubheadline}>Just focus on today. You've got this.</Text>
                    </View>
                );
            default:
                return null;
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
    
    stepContent: { flex: 1, justifyContent: 'center' },
    
    // Reality Hook Bubbles
    bubbleGrid: { marginVertical: 40, alignItems: 'center', gap: 12 },
    blurredBubble: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    bubbleText: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '600' },
    
    loopContainer: { marginVertical: 40, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
    
    sbStatGrid: { marginVertical: 30, gap: 12 },
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
