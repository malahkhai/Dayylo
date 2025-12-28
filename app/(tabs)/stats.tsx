// app/(tabs)/stats.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useHabits } from '../../context/HabitContext';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';

const { width } = Dimensions.get('window');

const getAICoachMessage = (streak: number) => {
    if (streak === 0) {
        return {
            title: "Defaulting to average?",
            message: "The streak is at absolute zero. How can you build a resistance army if you can't honor your pledge?",
            type: 'roast'
        };
    }
    if (streak < 3) {
        return {
            title: "Barely breathing",
            message: "A tiny flame is better than none, but honestly, this streak is crying for help. Don't let it die.",
            type: 'roast'
        };
    }
    if (streak < 7) {
        return {
            title: "Warming up",
            message: "You're starting to get the rhythm. But remember: consistency is the only way to the top.",
            type: 'compliment'
        };
    }
    if (streak < 14) {
        return {
            title: "The standards are rising",
            message: "You're making this look easy. The resistance is proud, but the real test is just beginning.",
            type: 'compliment'
        };
    }
    return {
        title: "Salute Maximus",
        message: "A force of nature. You aren't just tracking habits; you're rewriting your destiny. Keep the fire burning.",
        type: 'compliment'
    };
};

export default function StatsScreen() {
    const { habits } = useHabits();
    // For demo purposes, we'll calculate a 'global' streak or just use the highest one
    const highestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    const aiInsight = getAICoachMessage(highestStreak);

    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const weekData = [
        { day: 'Mon', completion: 0.8, label: 'M' },
        { day: 'Tue', completion: 1.0, label: 'T' },
        { day: 'Wed', completion: 0.6, label: 'W' },
        { day: 'Thu', completion: 0.9, label: 'T' },
        { day: 'Fri', completion: 1.0, label: 'F' },
        { day: 'Sat', completion: 0.7, label: 'S' },
        { day: 'Sun', completion: 0.5, label: 'S' },
    ];

    const monthlyStats = [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 78 },
        { month: 'Mar', value: 85 },
        { month: 'Apr', value: 90 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Progress</Text>
                <Text style={styles.headerSubtitle}>Keep up the great work! 🎉</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Streak Card */}
                <Animated.View
                    style={[
                        styles.streakCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.streakContent}>
                        <View style={styles.streakLeft}>
                            <Text style={styles.streakEmoji}>🔥</Text>
                            <View>
                                <Text style={styles.streakNumber}>15</Text>
                                <Text style={styles.streakLabel}>Day Streak</Text>
                            </View>
                        </View>
                        <View style={styles.streakRight}>
                            <Text style={styles.streakBest}>Best: 23 days</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* AI Coach Insight */}
                <Animated.View
                    style={[
                        styles.aiCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.aiIconContainer}>
                        <LucideIcons.Sparkles size={20} color={aiInsight.type === 'compliment' ? AppleColors.primary : AppleColors.systemRed} />
                    </View>
                    <View style={styles.aiTextContainer}>
                        <Text style={[styles.aiTitle, { color: aiInsight.type === 'compliment' ? AppleColors.primary : AppleColors.systemRed }]}>{aiInsight.title}</Text>
                        <Text style={styles.aiMessage}>{aiInsight.message}</Text>
                    </View>
                </Animated.View>

                {/* Quick Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>✅</Text>
                        <Text style={styles.statValue}>247</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={[styles.statValue, { color: AppleColors.systemGreen }]}>89%</Text>
                        <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⏱️</Text>
                        <Text style={styles.statValue}>4.2</Text>
                        <Text style={styles.statLabel}>Avg per Day</Text>
                    </View>
                </View>

                {/* This Week */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>This Week</Text>
                    <View style={styles.chartCard}>
                        <View style={styles.weekChart}>
                            {weekData.map((item, index) => (
                                <View key={index} style={styles.barContainer}>
                                    <View style={styles.barColumn}>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: `${item.completion * 100}%`,
                                                    backgroundColor:
                                                        item.completion >= 0.9
                                                            ? AppleColors.systemGreen
                                                            : item.completion >= 0.7
                                                                ? AppleColors.systemOrange
                                                                : AppleColors.systemRed,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.barLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.chartNote}>5 out of 7 days completed ⭐️</Text>
                    </View>
                </View>

                {/* Monthly Trends */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly Trends</Text>
                    <View style={styles.chartCard}>
                        {monthlyStats.map((item, index) => (
                            <View key={index} style={styles.trendRow}>
                                <Text style={styles.trendMonth}>{item.month}</Text>
                                <View style={styles.trendBarContainer}>
                                    <View
                                        style={[
                                            styles.trendBar,
                                            {
                                                width: `${item.value}%`,
                                                backgroundColor: AppleColors.systemBlue,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.trendValue}>{item.value}%</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsContainer}>
                        <View style={styles.achievementCard}>
                            <Text style={styles.achievementIcon}>🏆</Text>
                            <Text style={styles.achievementTitle}>First Week</Text>
                            <Text style={styles.achievementSubtitle}>Complete 7 days</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <Text style={styles.achievementIcon}>⭐️</Text>
                            <Text style={styles.achievementTitle}>Perfect Week</Text>
                            <Text style={styles.achievementSubtitle}>100% completion</Text>
                        </View>
                        <View style={[styles.achievementCard, styles.achievementCardLocked]}>
                            <Text style={styles.achievementIcon}>🔒</Text>
                            <Text style={styles.achievementTitle}>30 Day Streak</Text>
                            <Text style={styles.achievementSubtitle}>Keep going!</Text>
                        </View>
                    </View>
                </View>

                {/* Motivational Quote */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteIcon}>"</Text>
                    <Text style={styles.quoteText}>
                        Success is the sum of small efforts repeated day in and day out.
                    </Text>
                    <Text style={styles.quoteAuthor}>— Robert Collier</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    },
    headerTitle: {
        ...AppleTypography.largeTitle,
        color: AppleColors.label.primary,
    },
    headerSubtitle: {
        ...AppleTypography.subheadline,
        color: AppleColors.label.secondary,
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: AppleSpacing.base,
    },
    streakCard: {
        backgroundColor: AppleColors.systemOrange,
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.lg,
        marginBottom: AppleSpacing.base,
        ...AppleShadows.medium,
    },
    streakContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakEmoji: {
        fontSize: 48,
        marginRight: AppleSpacing.base,
    },
    streakNumber: {
        ...AppleTypography.largeTitle,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    streakLabel: {
        ...AppleTypography.callout,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    streakRight: {
        alignItems: 'flex-end',
    },
    streakBest: {
        ...AppleTypography.footnote,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: AppleSpacing.md,
        marginBottom: AppleSpacing.base,
    },
    statCard: {
        flex: 1,
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.base,
        alignItems: 'center',
        ...AppleShadows.small,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: AppleSpacing.sm,
    },
    statValue: {
        ...AppleTypography.title2,
        fontWeight: '700',
        color: AppleColors.systemBlue,
        marginBottom: 4,
    },
    statLabel: {
        ...AppleTypography.caption2,
        color: AppleColors.label.secondary,
        textAlign: 'center',
    },
    section: {
        marginBottom: AppleSpacing.xl,
    },
    sectionTitle: {
        ...AppleTypography.title3,
        color: AppleColors.label.primary,
        marginBottom: AppleSpacing.md,
    },
    chartCard: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.base,
        ...AppleShadows.small,
    },
    weekChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        marginBottom: AppleSpacing.md,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
    },
    barColumn: {
        width: '100%',
        height: 100,
        justifyContent: 'flex-end',
        paddingHorizontal: 4,
    },
    bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 8,
    },
    barLabel: {
        ...AppleTypography.caption2,
        color: AppleColors.label.secondary,
        marginTop: AppleSpacing.sm,
    },
    chartNote: {
        ...AppleTypography.footnote,
        color: AppleColors.label.secondary,
        textAlign: 'center',
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: AppleSpacing.md,
    },
    trendMonth: {
        ...AppleTypography.callout,
        color: AppleColors.label.primary,
        width: 40,
        fontWeight: '500',
    },
    trendBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: AppleColors.fill.tertiary,
        borderRadius: 4,
        overflow: 'hidden',
        marginHorizontal: AppleSpacing.md,
    },
    trendBar: {
        height: '100%',
        borderRadius: 4,
    },
    trendValue: {
        ...AppleTypography.callout,
        color: AppleColors.label.secondary,
        width: 50,
        textAlign: 'right',
        fontWeight: '600',
    },
    achievementsContainer: {
        flexDirection: 'row',
        gap: AppleSpacing.md,
    },
    achievementCard: {
        flex: 1,
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.base,
        alignItems: 'center',
        ...AppleShadows.small,
    },
    achievementCardLocked: {
        opacity: 0.5,
    },
    achievementIcon: {
        fontSize: 32,
        marginBottom: AppleSpacing.sm,
    },
    achievementTitle: {
        ...AppleTypography.footnote,
        fontWeight: '600',
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 2,
    },
    achievementSubtitle: {
        ...AppleTypography.caption2,
        color: AppleColors.label.secondary,
        textAlign: 'center',
    },
    quoteCard: {
        backgroundColor: AppleColors.systemIndigo + '15',
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.lg,
        marginTop: AppleSpacing.base,
    },
    quoteIcon: {
        ...AppleTypography.largeTitle,
        color: AppleColors.systemIndigo,
        opacity: 0.3,
        marginBottom: AppleSpacing.sm,
    },
    quoteText: {
        ...AppleTypography.body,
        color: AppleColors.systemIndigo,
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: AppleSpacing.sm,
    },
    quoteAuthor: {
        ...AppleTypography.footnote,
        color: AppleColors.systemIndigo,
        textAlign: 'right',
    },
    aiCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    aiIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    aiTextContainer: {
        flex: 1,
    },
    aiTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 12,
    },
    aiMessage: {
        ...AppleTypography.subheadline,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        lineHeight: 20,
    },
});
