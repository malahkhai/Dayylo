import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Animated,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import ReAnimated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
    cancelAnimation
} from 'react-native-reanimated';
import { AppleHabitCard } from '../../components/AppleHabitCard';
import { AppleButton } from '../../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows } from '../../constants/AppleTheme';
import { useHabits } from '../../context/HabitContext';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDiscipline } from '../../utils/format';
import { WeekCalendar } from '../../components/WeekCalendar';
import { Habit } from '../../types';
import { MotiView } from 'moti';

const REVIEW_PROMPT_KEY = 'DAYYLO_REVIEW_PROMPT_SHOWN';

export default function HomeScreen() {
    const router = useRouter();
    const { habits, recordHabitResult, globalStreak, totalDiscipline } = useHabits();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [scrollY] = useState(new Animated.Value(0));

    // Handle Day 2 Review Prompt
    React.useEffect(() => {
        const checkReviewPrompt = async () => {
            if (!user?.metadata?.creationTime) return;

            try {
                const hasShown = await AsyncStorage.getItem(REVIEW_PROMPT_KEY);
                if (hasShown === 'true') return;

                const creationTime = new Date(user.metadata.creationTime).getTime();
                const now = Date.now();
                const diffHours = (now - creationTime) / (1000 * 60 * 60);

                // If user has been around for more than 24 hours (Day 2+)
                if (diffHours >= 24) {
                    try {
                        // Safe inline require to prevent crash if native module is absent
                        const StoreReview = require('expo-store-review');
                        const isAvailable = await StoreReview.isAvailableAsync();
                        if (isAvailable) {
                            await StoreReview.requestReview();
                            await AsyncStorage.setItem(REVIEW_PROMPT_KEY, 'true');
                            console.log('[Review] Prompt triggered successfully');
                        }
                    } catch (nativeError) {
                        console.log('[Review] Native StoreReview not available in this build');
                    }
                }
            } catch (e) {
                console.log('[Review] Error checking prompt status:', e);
            }
        };

        // Delay check slightly after app load for better UX
        const timer = setTimeout(checkReviewPrompt, 3000);
        return () => clearTimeout(timer);
    }, [user]);

    // Enable LayoutAnimation for Android
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [filterCategory, setFilterCategory] = useState<'All' | 'build' | 'break'>('All');

    // Memoized habit filtering based on category
    const visibleHabits = useMemo(() => {
        return habits.filter(h => {
            if (h.isArchived) return false;
            if (h.trackedToday) return false; // Hide if already tracked (Done/Missed)
            
            if (filterCategory === 'All') return true;
            
            const color = (h.color || '').toLowerCase();
            const type = (h.type || '').toLowerCase();
            const isGood = (h as any).isGood;

            // Robust detection for legacy habits
            const isBuild = 
                type === 'build' || 
                isGood === true ||
                ['#007aff', '#3b82f6', '#30e8ab', '#8b5cf6', '#34c759'].includes(color);

            const isBreak = 
                type === 'break' || 
                isGood === false ||
                ['#ff9500', '#f97316', '#ef4444', '#ff3b30', '#ff2d55'].includes(color);
            
            if (filterCategory === 'build') return isBuild;
            if (filterCategory === 'break') return isBreak;
            return false;
        });
    }, [habits, filterCategory]);

    // Memoized stats calculations
    const stats = useMemo(() => {
        const activeOnly = habits.filter(h => !h.isArchived);
        const total = activeOnly.length;
        const completed = activeOnly.filter(h => h.completedToday).length;
        const missed = activeOnly.filter(h => h.trackedToday && !h.completedToday).length;
        const pending = activeOnly.filter(h => !h.trackedToday).length;
        
        return {
            total,
            completed,
            missed,
            pending,
            isMissionComplete: total > 0 && pending === 0
        };
    }, [habits]);

    const { total: totalHabits, completed: completedHabits, isMissionComplete } = stats;

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Dynamic greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    const getGreetingIcon = () => {
        const hour = new Date().getHours();
        if (hour < 18) return "☀️";
        return "🌙";
    };

    // ─── Countdown Logic ──────────────────────────────────────────────────────────
    const [timeLeft, setTimeLeft] = useState('');
    
    React.useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            
            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            setTimeLeft(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    const MissionCompleteView = () => (
        <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.missionCard}
        >
            <LucideIcons.ShieldCheck size={48} color={AppleColors.systemGreen} style={{ marginBottom: 16 }} />
            <Text style={styles.missionTitle}>Mission Complete</Text>
            <Text style={styles.missionText}>Objectives secured. Resistance holding.</Text>
            
            <View style={styles.countdownContainer}>
                <Text style={styles.countdownLabel}>NEXT BATTLE IN</Text>
                <Text style={styles.countdownTime}>{timeLeft}</Text>
            </View>
            
            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryVal}>{completedHabits}</Text>
                    <Text style={styles.summaryLab}>WINS</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryVal, { color: AppleColors.systemRed }]}>{stats.missed}</Text>
                    <Text style={styles.summaryLab}>LOSSES</Text>
                </View>
            </View>
        </MotiView>
    );

    // Sun/Moon rotation animation
    const rotation = useSharedValue(0);
    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(1, { duration: 15000, easing: Easing.linear }),
            -1,
            false
        );
        return () => cancelAnimation(rotation);
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value * 360}deg` }],
        };
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.95],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.85],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -15],
        extrapolate: 'clamp',
    });

    const handleHabitPress = async (habit: Habit) => {
        router.push(`/habit/${habit.id}`);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Animated Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        transform: [
                            { translateY: headerTranslateY },
                            { scale: headerScale }
                        ],
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.headerTitle}>{format(new Date(), 'MMMM d')}</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <View style={styles.metricItem}>
                            <Text style={styles.streakNumber}>{globalStreak}</Text>
                            <Text style={styles.streakEmoji}>🔥</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricItem}>
                            <Text style={styles.streakNumber}>{formatDiscipline(totalDiscipline)}</Text>
                            <Text style={styles.streakEmoji}>🛡️</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricItem}>
                            <Text style={styles.streakNumber}>{completedHabits}/{totalHabits}</Text>
                            <Text style={styles.streakEmoji}>✅</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
            {/* Scrollable Habit List */}
            <Animated.FlatList
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={visibleHabits}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        <WeekCalendar />

                        {/* Category Filters */}
                        <View style={styles.filterContainer}>
                            {['All', 'build', 'break'].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.filterBadge,
                                        filterCategory === cat && styles.filterBadgeActive
                                    ]}
                                    onPress={() => setFilterCategory(cat as any)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.filterText,
                                        filterCategory === cat && styles.filterTextActive
                                    ]}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {visibleHabits.length > 0 && <Text style={styles.sectionTitle}>Your Habits</Text>}
                    </>
                }
                renderItem={({ item: habit, index }) => (
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 300 }}
                    >
                        <AppleHabitCard
                            id={habit.id}
                            title={habit.name}
                            description={habit.description}
                            streak={habit.streak}
                            isCompleted={habit.completedToday}
                            trackedToday={habit.trackedToday}
                            color={habit.color}
                            icon={habit.icon}
                            difficulty={(habit as any).difficulty}
                            onPress={() => handleHabitPress(habit)}
                            onComplete={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                recordHabitResult(habit.id, true);
                            }}
                            onFail={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                recordHabitResult(habit.id, false);
                            }}
                        />
                    </MotiView>
                )}
                ListEmptyComponent={
                    isMissionComplete ? (
                        <MissionCompleteView />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>🌱</Text>
                            <Text style={styles.emptyTitle}>Start your journey</Text>
                            <Text style={styles.emptyText}>Tap the + button to add your first habit</Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    <View style={{ paddingBottom: 100 }}>
                        {habits.length === 1 && (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: 800 }}
                                style={styles.nudgeCard}
                            >
                                <TouchableOpacity 
                                    onPress={() => router.push('/add-habit')}
                                    style={styles.nudgeContent}
                                >
                                    <View style={styles.nudgeIconBg}>
                                        <LucideIcons.Plus size={20} color={AppleColors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.nudgeTitle}>Ready to scale?</Text>
                                        <Text style={styles.nudgeSub}>Add a {habits[0].type === 'build' ? 'Stop' : 'Start'} habit 👉</Text>
                                    </View>
                                    <LucideIcons.ChevronRight size={20} color={AppleColors.label.tertiary} />
                                </TouchableOpacity>
                            </MotiView>
                        )}
                    </View>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    header: {
        paddingHorizontal: AppleSpacing.base,
        paddingTop: 60,
        paddingBottom: AppleSpacing.base,
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        ...AppleTypography.subheadline,
        color: AppleColors.label.secondary,
        marginBottom: 4,
    },
    headerTitle: {
        ...AppleTypography.largeTitle,
        fontWeight: '900',
        color: AppleColors.label.primary,
        letterSpacing: -0.5,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppleColors.surface.glassLow,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 12,
    },
    streakNumber: {
        fontSize: 18,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    streakEmoji: {
        fontSize: 16,
    },

    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.md,
        gap: 8,
    },
    filterBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: AppleColors.surface.glassLow,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    filterBadgeActive: {
        backgroundColor: AppleColors.primary,
        borderColor: AppleColors.primary,
    },
    filterText: {
        ...AppleTypography.subheadline,
        color: AppleColors.label.secondary,
        fontWeight: '600',
    },
    filterTextActive: {
        fontWeight: '800',
        color: '#FFFFFF',
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: AppleSpacing.sm,
        paddingBottom: 110,
    },
    sectionTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.primary,
        paddingHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.md,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 11,
        opacity: 0.4,
    },
    privacyBanner: {
        backgroundColor: AppleColors.primary + '10',
        paddingVertical: 12,
        paddingHorizontal: AppleSpacing.base,
        marginHorizontal: AppleSpacing.base,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: AppleColors.primary + '20',
    },
    privacyText: {
        ...AppleTypography.footnote,
        fontWeight: '800',
        color: AppleColors.primary,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 24,
    },
    emptyTitle: {
        ...AppleTypography.title2,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
    },
    nudgeCard: {
        marginHorizontal: AppleSpacing.base,
        marginTop: 20,
        backgroundColor: AppleColors.primary + '10',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AppleColors.primary + '20',
        overflow: 'hidden',
    },
    nudgeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
    },
    nudgeIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: AppleColors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nudgeTitle: {
        ...AppleTypography.callout,
        fontWeight: '700',
        color: AppleColors.label.primary,
    },
    nudgeSub: {
        ...AppleTypography.footnote,
        color: AppleColors.label.secondary,
        marginTop: 2,
    },
    missionCard: {
        marginHorizontal: AppleSpacing.base,
        marginTop: 40,
        backgroundColor: AppleColors.surface.glassLow,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    missionTitle: {
        ...AppleTypography.title2,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginBottom: 8,
    },
    missionText: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    countdownContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 24,
        marginBottom: 32,
    },
    countdownLabel: {
        ...AppleTypography.caption2,
        fontWeight: '800',
        color: AppleColors.label.tertiary,
        letterSpacing: 2,
        marginBottom: 4,
    },
    countdownTime: {
        fontSize: 32,
        fontWeight: '900',
        color: AppleColors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryVal: {
        fontSize: 24,
        fontWeight: '900',
        color: AppleColors.systemGreen,
    },
    summaryLab: {
        ...AppleTypography.caption2,
        fontWeight: '800',
        color: AppleColors.label.tertiary,
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
