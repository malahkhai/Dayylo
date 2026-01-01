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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleHabitCard } from '../../components/AppleHabitCard';
import { AppleButton } from '../../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows } from '../../constants/AppleTheme';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';

export default function HomeScreen() {
    const router = useRouter();
    const { habits, recordHabitResult } = useHabits();
    const { isUnlocked } = usePrivacy();
    const [refreshing, setRefreshing] = useState(false);
    const [scrollY] = useState(new Animated.Value(0));

    // Filter habits based on privacy
    const visibleHabits = habits.filter(h => !h.isPrivate || isUnlocked);

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

    // Animated header opacity
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
                        <Text style={styles.greeting}>Good Morning ☀️</Text>
                        <Text style={styles.headerTitle}>Today's Habits</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <Text style={styles.streakNumber}>{habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}</Text>
                        <Text style={styles.streakLabel}>Max Streak 🔥</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{activeHabits}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: AppleColors.systemGreen }]}>{completedHabits}</Text>
                    <Text style={styles.statLabel}>Done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: AppleColors.systemOrange }]}>
                        {breakTotal > 0 ? `${breakCompleted}/${breakTotal}` : remainingHabits}
                    </Text>
                    <Text style={styles.statLabel}>{breakTotal > 0 ? 'Bad Habits' : 'Remaining'}</Text>
                </View>
            </View>

            {!isUnlocked && habits.some(h => h.isPrivate) && (
                <View style={styles.privacyBanner}>
                    <Text style={styles.privacyText}>Some habits are hidden. Unlock to view.</Text>
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
                                onPress={() => console.log('Habit pressed:', habit.id)}
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
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    streakNumber: {
        fontSize: 32,
        fontWeight: '900',
        color: AppleColors.primary,
    },
    streakLabel: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: -2,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: AppleColors.background.tertiary,
        marginHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.xl,
        paddingVertical: 24,
        paddingHorizontal: AppleSpacing.base,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...AppleShadows.card,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginBottom: 4,
    },
    statLabel: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 4,
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
