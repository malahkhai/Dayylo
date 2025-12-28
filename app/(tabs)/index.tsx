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
import { AppleHabitCard } from '../../components/AppleHabitCard';
import { AppleButton, AppleFAB } from '../../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing } from '../../constants/AppleTheme';
import { useHabits } from '../../context/HabitContext';
import { usePrivacy } from '../../context/PrivacyContext';

export default function HomeScreen() {
    const router = useRouter();
    const { habits, toggleHabit } = useHabits();
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
                                title={habit.name}
                                description={habit.description}
                                streak={habit.streak}
                                isCompleted={habit.completedToday}
                                color={habit.color}
                                onPress={() => console.log('Habit pressed:', habit.id)}
                                onComplete={() => toggleHabit(habit.id)}
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

            {/* Floating Action Button */}
            <AppleFAB
                onPress={() => router.push('/add-habit')}
                icon="+"
                color={AppleColors.systemBlue}
            />
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
        color: AppleColors.label.primary,
    },
    streakContainer: {
        alignItems: 'flex-end',
    },
    streakNumber: {
        ...AppleTypography.title1,
        fontWeight: '700',
        color: AppleColors.systemOrange,
    },
    streakLabel: {
        ...AppleTypography.caption1,
        color: AppleColors.label.secondary,
        marginTop: 2,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: AppleColors.background.tertiary,
        marginHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.base,
        padding: AppleSpacing.base,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        ...AppleTypography.title1,
        fontWeight: '700',
        color: AppleColors.systemBlue,
        marginBottom: 4,
    },
    statLabel: {
        ...AppleTypography.caption1,
        color: AppleColors.label.secondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: AppleColors.separator.nonOpaque,
        marginVertical: AppleSpacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: AppleSpacing.sm,
    },
    sectionTitle: {
        ...AppleTypography.title3,
        color: AppleColors.label.primary,
        paddingHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.md,
    },
    privacyBanner: {
        backgroundColor: AppleColors.systemBlue + '10',
        paddingVertical: 8,
        paddingHorizontal: AppleSpacing.base,
        marginHorizontal: AppleSpacing.base,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: AppleColors.systemBlue + '20',
    },
    privacyText: {
        ...AppleTypography.footnote,
        color: AppleColors.systemBlue,
        textAlign: 'center',
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
