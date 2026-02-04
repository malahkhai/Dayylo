import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Animated,
    RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import ReAnimated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { AppleHabitCard } from '../../components/AppleHabitCard';
import { AppleButton } from '../../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows } from '../../constants/AppleTheme';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';
import { WeekCalendar } from '../../components/WeekCalendar';
import { Habit } from '../../types';

export default function HomeScreen() {
    const router = useRouter();
    const { habits, recordHabitResult } = useHabits();
    const { isUnlocked, authenticate } = usePrivacy();
    const [refreshing, setRefreshing] = useState(false);
    const [scrollY] = useState(new Animated.Value(0));

    // Show all habits, but lock interaction for break habits if not authenticated
    // User requested "Break habits... should still appear... but require auth for details"
    const visibleHabits = habits;

    // Stats calculations
    const activeHabits = visibleHabits.length;
    const completedHabits = visibleHabits.filter(h => h.completedToday).length;
    const remainingHabits = activeHabits - completedHabits;

    // Bad habits (break) specialized stat
    const breakHabits = visibleHabits.filter(h => h.type === 'break');
    const breakTotal = breakHabits.length;
    const breakCompleted = breakHabits.filter(h => h.completedToday).length;

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

    // Sun/Moon rotation animation
    const rotation = useSharedValue(0);
    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(1, { duration: 15000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value * 360}deg` }],
        };
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0.97],
        extrapolate: 'clamp',
    });

    const handleHabitPress = async (habit: Habit) => {
        // Intercept "Break" habits or Private habits
        if (habit.type === 'break' && !isUnlocked) {
            const success = await authenticate();
            if (success) {
                router.push(`/habit/${habit.id}`);
            }
        } else {
            router.push(`/habit/${habit.id}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Animated Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        transform: [{ scale: headerScale }],
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.headerTitle}>{format(new Date(), 'MMMM d')}</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <Text style={styles.streakNumber}>{habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}</Text>
                        <Text style={styles.streakEmoji}>🔥</Text>
                    </View>
                </View>
            </Animated.View>

            <WeekCalendar />



            {/* Privacy Banner - Only show if locked and break habits exist */}
            {!isUnlocked && breakHabits.length > 0 && (
                <View style={styles.privacyBanner}>
                    <Text style={styles.privacyText}>Break habits require unlock to view details.</Text>
                </View>
            )}

            {/* Scrollable Habit List */}
            <Animated.ScrollView
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
            >
                {visibleHabits.length > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>Your Habits</Text>
                        {visibleHabits.map((habit) => (
                            <AppleHabitCard
                                key={habit.id}
                                id={habit.id}
                                title={habit.name}
                                description={habit.description}
                                streak={habit.streak}
                                isCompleted={habit.completedToday}
                                trackedToday={habit.trackedToday}
                                color={habit.color}
                                icon={habit.icon}
                                onPress={() => handleHabitPress(habit)}
                                onComplete={() => recordHabitResult(habit.id, true)}
                                onFail={() => recordHabitResult(habit.id, false)}
                            />
                        ))}
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🌱</Text>
                        <Text style={styles.emptyTitle}>Start your journey</Text>
                        <Text style={styles.emptyText}>Tap the + button to add your first habit</Text>
                    </View>
                )}

                {/* Bottom Spacing */}
                <View style={{ height: 100 }} />
            </Animated.ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.secondary,
    },
    header: {
        paddingHorizontal: AppleSpacing.base,
        paddingTop: AppleSpacing.md,
        paddingBottom: AppleSpacing.base,
        backgroundColor: AppleColors.background.secondary,
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
        gap: 6,
    },
    streakNumber: {
        fontSize: 20,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    streakEmoji: {
        fontSize: 18,
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: AppleSpacing.sm,
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
});
