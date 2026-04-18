import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Modal, Animated, TextInput, KeyboardAvoidingView, Platform as RNPlatform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';
import { useHabits } from '../../context/HabitContext';
import { useAuth } from '../../context/AuthContext';
import { SwipeButton } from '../../components/SwipeButton';

const { width } = Dimensions.get('window');

type OnboardingStep = 'WELCOME' | 'NAME' | 'HABITS';
import { Analytics } from '../../services/analytics';
interface StarterHabit {
    id: string;
    name: string;
    type: 'build' | 'break';
    icon: keyof typeof LucideIcons;
    color: string;
    difficulty: number;
}

const STARTER_HABITS: StarterHabit[] = [
    { id: 'h1', name: 'Gym', type: 'build', icon: 'Dumbbell', color: '#007AFF', difficulty: 7 },
    { id: 'h2', name: 'Water', type: 'build', icon: 'Droplets', color: '#007AFF', difficulty: 2 },
    { id: 'h3', name: 'Meditate', type: 'build', icon: 'Zap', color: '#007AFF', difficulty: 4 },
    { id: 'h4', name: 'Read', type: 'build', icon: 'BookOpen', color: '#007AFF', difficulty: 3 },
    { id: 'h9', name: 'Plank', type: 'build', icon: 'Timer', color: '#007AFF', difficulty: 6 },
    { id: 'h5', name: 'Smoking', type: 'break', icon: 'Wind', color: '#FF9500', difficulty: 9 },
    { id: 'h6', name: 'Social', type: 'break', icon: 'Smartphone', color: '#FF9500', difficulty: 6 },
    { id: 'h7', name: 'Porn', type: 'break', icon: 'EyeOff', color: '#FF9500', difficulty: 8 },
    { id: 'h8', name: 'Sugar', type: 'break', icon: 'Cookie', color: '#FF9500', difficulty: 5 },
    { id: 'h10', name: 'Don\'t call Ex', type: 'break', icon: 'PhoneOff', color: '#FF9500', difficulty: 10 },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ 
        initialHabitName?: string; 
        initialHabitType?: string;
        initialHabitDifficulty?: 'easy' | 'medium' | 'hard';
    }>();
    const { user } = useAuth();
    const { addHabit, addHabits, updateUserName, userName, loading } = useHabits();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('WELCOME');
    const [tempName, setTempName] = useState(user?.displayName || '');
    const [isFinalizing, setIsFinalizing] = useState(false);

    React.useEffect(() => {
        if (user?.displayName) {
            setTempName(user.displayName);
        }
    }, [user?.displayName]);

    React.useEffect(() => {
        const handleAutoSave = async () => {
            // Wait for HabitContext sync AND ensure we have a valid UID (either Anonymous or Real)
            if (!loading && user && params.initialHabitName && params.initialHabitType) {
                console.log('[Heartbeat] Onboarding auto-save triggered for user:', user.uid, `(Anonymous: ${user.isAnonymous})`);
                
                const type = params.initialHabitType as 'build' | 'break';
                const success = await addHabit({
                    name: params.initialHabitName,
                    type: type,
                    icon: type === 'build' ? 'PlusCircle' : 'MinusCircle' as any,
                    color: type === 'build' ? '#007AFF' : '#FF9500',
                    frequency: [0, 1, 2, 3, 4, 5, 6], // All days
                    difficulty: params.initialHabitDifficulty || 'medium',
                    targetValue: 1, // Default for non-value habits
                    currentValue: 0,
                    isGood: type === 'build',
                });

                if (success) {
                    console.log('[Heartbeat] Auto-save success, syncing state and redirecting...');
                    // Add a tiny buffer to allow Firestore write and Context state to settle
                    setTimeout(() => {
                        router.replace('/(tabs)');
                    }, 500);
                }
            }
        };

        handleAutoSave();
    }, [user, params.initialHabitName, loading]);
    const [selectedHabits, setSelectedHabits] = useState<{ [id: string]: number }>({});
    const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showAllowNotificationsModal, setShowAllowNotificationsModal] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    const transitionTo = (step: OnboardingStep) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
        setTimeout(() => setCurrentStep(step), 200);
    };

    const toggleHabit = (id: string) => {
        const habit = STARTER_HABITS.find(h => h.id === id);
        if (!habit) return;

        setSelectedHabits(prev => {
            const isRemoving = !!prev[id];
            const newState = { ...prev };

            if (isRemoving) {
                delete newState[id];
                if (activeHabitId === id) {
                    const remaining = Object.keys(newState);
                    setActiveHabitId(remaining.length > 0 ? remaining[0] : null);
                }
            } else {
                newState[id] = habit.difficulty || 5;
                setActiveHabitId(id);
            }
            return newState;
        });
    };

    const updateDifficulty = (id: string, diff: number) => {
        setSelectedHabits(prev => ({
            ...prev,
            [id]: diff
        }));
    };

    const handleStartTracking = () => {
        if (Object.keys(selectedHabits).length === 0) {
            router.replace('/(tabs)');
            return;
        }
        setShowNotificationModal(true);
    };

    const finalizeOnboarding = async () => {
        setIsFinalizing(true);
        try {
            if (tempName.trim()) {
                await updateUserName(tempName.trim());
            }
            await Analytics.logEvent('onboarding_completed', { 
                habit_count: Object.keys(selectedHabits).length 
            });

            const habitsToPush: any[] = [];
            for (const hid of Object.keys(selectedHabits)) {
                const h = STARTER_HABITS.find(sh => sh.id === hid);
                if (h) {
                    const difVal = selectedHabits[hid] || 5;
                    const difStr = difVal < 4 ? 'easy' : difVal > 7 ? 'hard' : 'medium';
                    habitsToPush.push({
                        name: h.name,
                        type: h.type,
                        icon: h.icon,
                        color: h.color,
                        isPrivate: false,
                        frequency: ['daily'],
                        difficulty: difStr,
                        history: {},
                    });
                }
            }

            if (habitsToPush.length > 0) {
                await addHabits(habitsToPush);
            }

            // Sync buffer
            setTimeout(() => {
                setShowNotificationModal(false);
                router.replace('/(tabs)');
            }, 1000);
        } catch (error) {
            console.error('Finalization failed:', error);
            setIsFinalizing(false);
        }
    };



    const renderHabitItem = (h: StarterHabit) => {
        const isSelected = !!selectedHabits[h.id];
        const isActive = activeHabitId === h.id;
        const difficulty = selectedHabits[h.id] || h.difficulty;
        const isCustom = h.id.includes('custom');
        const Icon = LucideIcons[h.icon] as any;

        const getDifficultyColor = (d: number) => {
            if (d < 4) return AppleColors.systemGreen;
            if (d > 7) return AppleColors.systemRed;
            return AppleColors.systemBlue;
        };

        return (
            <View key={h.id} style={styles.habitContainer}>
                <Pressable
                    onPress={() => {
                        if (isSelected && !isActive) {
                            setActiveHabitId(h.id);
                        } else {
                            toggleHabit(h.id);
                        }
                    }}
                    style={[
                        styles.habitItem,
                        {
                            backgroundColor: isSelected ? h.color + '15' : 'rgba(255,255,255,0.03)',
                            borderColor: isActive ? h.color : (isSelected ? h.color + '40' : 'rgba(255,255,255,0.05)')
                        },
                        isSelected && { borderWidth: 2 }
                    ]}
                >
                    <View style={[styles.habitIconBg, { backgroundColor: isSelected ? h.color + '20' : 'rgba(21, 21, 23, 1)' }]}>
                        <Icon size={24} color={isSelected ? h.color : 'rgba(255,255,255,0.4)'} />
                    </View>
                    <Text style={[styles.habitName, isSelected && { color: h.color, opacity: 1 }, !isSelected && { color: '#FFFFFF', opacity: 0.9 }]} numberOfLines={1}>{h.name}</Text>

                    {isSelected && !isCustom && (
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '15', borderColor: getDifficultyColor(difficulty) }]}>
                            <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>LV.{difficulty}</Text>
                        </View>
                    )}

                    <View style={[styles.checkbox, isSelected && { backgroundColor: h.color, borderColor: h.color }, !isSelected && { borderColor: 'rgba(255,255,255,0.15)' }]}>
                        {isSelected && <LucideIcons.Check size={14} color="white" />}
                    </View>
                </Pressable>
            </View>
        );
    };

    const renderDifficultySelector = () => {
        if (!activeHabitId) return null;

        const activeHabit = STARTER_HABITS.find(h => h.id === activeHabitId);
        const difficulty = selectedHabits[activeHabitId];

        const getDifficultyColor = (d: number) => {
            if (d < 4) return AppleColors.systemGreen;
            if (d > 7) return AppleColors.systemRed;
            return AppleColors.systemBlue;
        };

        return (
            <View style={styles.difficultySelector}>
                <Text style={styles.selectorLabel}>SET DIFFICULTY</Text>
                <View style={styles.difficultyRange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                        <Pressable
                            key={d}
                            onPress={() => updateDifficulty(activeHabitId, d)}
                            style={[
                                styles.difficultyNode,
                                difficulty === d && { backgroundColor: getDifficultyColor(d), borderColor: getDifficultyColor(d) }
                            ]}
                        >
                            <Text style={[styles.difficultyNodeText, difficulty === d && { color: '#000000' }]}>{d}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        );
    };

    const renderWelcome = () => (
        <View style={styles.stepContainer}>
            <View style={styles.heroContent}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <LucideIcons.Zap size={60} color={AppleColors.systemGreen} />
                    </View>
                </View>
                <Text style={styles.heroTitle}>Welcome to Dayylo</Text>
                <Text style={styles.heroSubtitle}>
                    Habit tracker for real-life struggles, not perfect routines
                </Text>

                <View style={styles.miniHeatmap}>
                    <View style={styles.heatmapGrid}>
                        {[...Array(21)].map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.heatmapCell,
                                    { backgroundColor: i % 3 === 0 ? AppleColors.systemGreen : 'rgba(255,255,255,0.05)' }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.footerContainer}>
                <SwipeButton
                    title="Slide to start"
                    onSwipeComplete={() => {
                        const nameToUse = user?.displayName || tempName.trim();
                        if (nameToUse) {
                            transitionTo('HABITS');
                        } else {
                            transitionTo('NAME');
                        }
                    }}
                />
            </View>
        </View>
    );

    const renderNameStep = () => (
        <KeyboardAvoidingView
            behavior={RNPlatform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={styles.stepContainer}>
                <View style={{ marginTop: 60 }}>
                    <Text style={styles.title}>What's your name?</Text>
                    <Text style={styles.subtitle}>We'll use this to personalize your journey.</Text>

                    <TextInput
                        value={tempName}
                        onChangeText={setTempName}
                        placeholder="Your Name"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        autoFocus
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: 16,
                            padding: 20,
                            color: '#FFFFFF',
                            fontSize: 18,
                            fontWeight: '700',
                            marginTop: 32,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                        }}
                    />
                </View>

                <View style={styles.footerContainer}>
                    <AppleButton
                        title="Continue"
                        onPress={() => {
                            if (tempName.trim()) transitionTo('HABITS');
                        }}
                        disabled={!tempName.trim()}
                        fullWidth
                    />
                    <Pressable
                        onPress={() => {
                            setTempName('Dynamic User'); // OR just keep it empty
                            transitionTo('HABITS');
                        }}
                        style={[styles.skipButton, { marginTop: 12 }]}
                    >
                        <Text style={styles.skipText}>Skip for now</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );

    const renderHabitSelection = () => (
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Define your path</Text>
                <Text style={styles.subtitle}>Hi {tempName}, select the habits you want to track.</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={{ paddingBottom: 160 }}>
                <View style={styles.accordionGroup}>
                    <Text style={styles.sectionTitle}>Build Habits</Text>
                    <View style={styles.grid}>
                        {STARTER_HABITS.filter(h => h.type === 'build').map(renderHabitItem)}
                    </View>
                </View>

                <View style={[styles.accordionGroup, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Break Habits</Text>
                    <View style={styles.grid}>
                        {STARTER_HABITS.filter(h => h.type === 'break').map(renderHabitItem)}
                    </View>
                </View>
            </ScrollView>

            {activeHabitId && (
                <View style={styles.floatingSelectorContainer}>
                    {renderDifficultySelector()}
                </View>
            )}

            <View style={styles.footer}>
                <AppleButton
                    title="Start My Journey"
                    onPress={handleStartTracking}
                    size="large"
                    fullWidth
                />
                <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {currentStep === 'WELCOME' && renderWelcome()}
                {currentStep === 'NAME' && renderNameStep()}
                {currentStep === 'HABITS' && renderHabitSelection()}
            </Animated.View>

            <Modal visible={showNotificationModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: 40 }]}>
                        <View style={[styles.modalIconBg, { backgroundColor: AppleColors.systemBlue + '20' }]}>
                            <LucideIcons.BellRing size={32} color={AppleColors.systemBlue} />
                        </View>
                        <Text style={styles.modalTitle}>Stay Accountable</Text>
                        <Text style={styles.modalText}>
                            You'll get a daily notification to track your habits.
                            {"\n\n"}
                            Success requires manual input: <Text style={{ fontWeight: '900', color: AppleColors.systemGreen }}>Swipe Right</Text> if you completed the habit, and <Text style={{ fontWeight: '900', color: AppleColors.systemRed }}>Swipe Left</Text> if you missed it.
                        </Text>
                        <View style={styles.modalActions}>
                            <AppleButton
                                title="Start My Journey"
                                onPress={() => {
                                    setShowNotificationModal(false);
                                    setTimeout(() => setShowAllowNotificationsModal(true), 300);
                                }}
                                fullWidth
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={showAllowNotificationsModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: 40 }]}>
                        <View style={[styles.modalIconBg, { backgroundColor: AppleColors.systemIndigo + '20' }]}>
                            <LucideIcons.Bell size={32} color={AppleColors.systemIndigo} />
                        </View>
                        <Text style={styles.modalTitle}>Enable Notifications</Text>
                        <Text style={styles.modalText}>
                            We'd like to send you notifications for daily reminders — one in the morning to keep you inspired, and one at night to log your daily progress.
                        </Text>
                        <View style={styles.modalActions}>
                            <AppleButton
                                title="Allow Notifications"
                                onPress={() => { setShowAllowNotificationsModal(false); finalizeOnboarding(); }}
                                fullWidth
                                style={{ marginBottom: 12 }}
                            />
                            <Pressable onPress={() => { setShowAllowNotificationsModal(false); finalizeOnboarding(); }} style={styles.modalCancel}>
                                <Text style={styles.modalCancelText}>Not right now</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={isFinalizing} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.loadingCard}>
                        <LucideIcons.ShieldCheck size={50} color={AppleColors.systemGreen} />
                        <Text style={styles.loadingTitle}>Preparing Your Path</Text>
                        <Text style={styles.loadingSubtitle}>Hardening your daily discipline...</Text>
                        <View style={styles.progressTrack}>
                            <Animated.View style={styles.progressBar} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: AppleSpacing.screenPadding,
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    heroContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoBackground: {
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    heroTitle: {
        ...AppleTypography.display,
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    heroSubtitle: {
        ...AppleTypography.bodyLarge,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 28,
    },
    featureIconContainer: {
        marginBottom: 32,
    },
    miniHeatmap: {
        marginTop: 48,
        padding: 16,
        backgroundColor: AppleColors.background.secondary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        width: 240,
        justifyContent: 'center',
    },
    heatmapCell: {
        width: 26,
        height: 26,
        borderRadius: 6,
    },
    footerContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppleSpacing.base,
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
    },
    title: {
        ...AppleTypography.largeTitle,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        ...AppleTypography.body,
        fontWeight: '600',
        color: AppleColors.label.secondary,
        lineHeight: 24,
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 11,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    habitContainer: {
        width: (width - AppleSpacing.base * 2 - 12) / 2,
        marginBottom: 12,
    },
    habitItem: {
        width: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppleColors.background.tertiary,
        padding: 16,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        ...AppleShadows.small,
    },
    habitIconBg: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    habitName: {
        ...AppleTypography.body,
        fontWeight: '900',
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    accordionGroup: {
        // Expanded accordion style
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1.5,
        marginTop: 4,
        backgroundColor: 'rgba(255,255,255,0.02)', // Subtle fill
    },
    difficultyText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontSize: 10,
    },
    difficultySelector: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        ...AppleShadows.medium,
    },
    floatingSelectorContainer: {
        position: 'absolute',
        bottom: 120, // Above the footer
        left: AppleSpacing.base,
        right: AppleSpacing.base,
        zIndex: 50,
    },
    selectorLabel: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 1,
    },
    difficultyRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    difficultyNode: {
        width: (width - (AppleSpacing.base * 2) - 32 - (9 * 4)) / 10,
        aspectRatio: 1,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    difficultyNodeText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: '#FFFFFF',
        fontSize: 10,
    },
    checkbox: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: AppleColors.separator.opaque,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    footer: {
        paddingVertical: 24,
    },
    skipButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    skipText: {
        ...AppleTypography.callout,
        fontWeight: '800',
        color: AppleColors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    modalContent: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        ...AppleShadows.card,
    },
    modalIconBg: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: AppleColors.systemBlue + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        ...AppleTypography.title2,
        color: AppleColors.label.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    modalActions: {
        width: '100%',
    },
    modalCancel: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalCancelText: {
        ...AppleTypography.callout,
        color: AppleColors.label.secondary,
        fontWeight: '600',
    },
    loadingCard: {
        backgroundColor: AppleColors.background.tertiary,
        padding: 40,
        borderRadius: 32,
        alignItems: 'center',
        width: '85%',
        ...AppleShadows.card,
    },
    loadingTitle: {
        ...AppleTypography.title2,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginTop: 24,
    },
    loadingSubtitle: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        marginTop: 8,
        textAlign: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        marginTop: 32,
        overflow: 'hidden',
    },
    progressBar: {
        width: '60%', // Static for now, feels "working"
        height: '100%',
        backgroundColor: AppleColors.systemGreen,
    }
});
