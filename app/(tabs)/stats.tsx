import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { useHabits, getDailyQuote } from '../../context/HabitContext';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { formatDiscipline } from '../../utils/format';

console.log('[Heartbeat] stats.tsx module loaded');

const { width } = Dimensions.get('window');

// ─── AI Coach message based on streak ────────────────────────────────────────
const getAICoachMessage = (streak: number) => {
    if (streak === 0) return {
        title: "Defaulting to average?",
        message: "The streak is at absolute zero. How can you build a resistance army if you can't honor your pledge?",
        type: 'roast',
    };
    if (streak < 3) return {
        title: "Barely breathing",
        message: "A tiny flame is better than none, but honestly, this streak is crying for help. Don't let it die.",
        type: 'roast',
    };
    if (streak < 7) return {
        title: "Warming up",
        message: "You're starting to get the rhythm. But remember: consistency is the only way to the top.",
        type: 'compliment',
    };
    if (streak < 14) return {
        title: "The standards are rising",
        message: "You're making this look easy. The resistance is proud, but the real test is just beginning.",
        type: 'compliment',
    };
    return {
        title: "Salute Maximus",
        message: "A force of nature. You aren't just tracking habits; you're rewriting your destiny. Keep the fire burning.",
        type: 'compliment',
    };
};

// ─── Achievement definitions ──────────────────────────────────────────────────
const getAchievements = (
    highestStreak: number,
    totalCompletions: number,
    successRate: number
) => [
    {
        icon: '🏆',
        title: 'First Week',
        subtitle: 'Complete 7 days',
        earned: highestStreak >= 7,
    },
    {
        icon: '⭐️',
        title: 'Perfect Week',
        subtitle: '100% completion',
        earned: successRate === 100,
    },
    {
        icon: '🔥',
        title: '30 Day Streak',
        subtitle: 'Keep going!',
        earned: highestStreak >= 30,
    },
    {
        icon: '💯',
        title: '100 Completions',
        subtitle: 'Century mark',
        earned: totalCompletions >= 100,
    },
];

// ─── Progress Bar Component ───────────────────────────────────────────────────
const ProgressBarRow = ({
    icon,
    label,
    currentVal,
    totalVal,
    currentDisplay,
    totalDisplay,
    color = AppleColors.systemBlue
}: {
    icon: string;
    label: string;
    currentVal: number;
    totalVal: number;
    currentDisplay: string | number;
    totalDisplay: string | number;
    color?: string;
}) => {
    const percentage = Math.max(0, Math.min(100, (currentVal / Math.max(1, totalVal)) * 100));
    return (
        <View style={styles.progressRow}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{icon} {label}</Text>
                <Text style={[styles.progressValues, { color }]}>
                    <Text style={{ fontWeight: '700' }}>{currentDisplay}</Text>
                    <Text style={{ color: AppleColors.label.tertiary }}> / {totalDisplay}</Text>
                </Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
};

export default function StatsScreen() {
    const { 
        habits, loading, totalDiscipline, globalStreak, level,
        totalCompletions, successRate, avgPerDay,
        weeklyData, monthlyData, dailyBalanceScore, balanceVsLastWeek
    } = useHabits();
    const router = useRouter();
    const [dailyQuote] = useState(() => getDailyQuote());

    const slideAnim = useState(new Animated.Value(30))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const daysCompleted = weeklyData.filter(d => d.completion > 0).length;
    const maxCompletion = Math.max(...weeklyData.map(d => d.completion), 0.01);

    const highestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak), 0) : 0;
    const achievements = getAchievements(highestStreak, totalCompletions, successRate);
    const aiCoach = getAICoachMessage(globalStreak);

    if (habits.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Your Progress</Text>
                    <Text style={styles.headerSubtitle}>Start your streak today! 💪</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 60 }}>
                    <Text style={{ fontSize: 64, marginBottom: 24 }}>📈</Text>
                    <Text style={{ ...AppleTypography.title2, fontWeight: '900', color: AppleColors.label.primary, marginBottom: 8, textAlign: 'center' }}>No Data Yet</Text>
                    <Text style={{ ...AppleTypography.body, color: AppleColors.label.secondary, textAlign: 'center', marginBottom: 32 }}>Complete your first habit to start tracking your progress.</Text>
                    <Pressable
                        style={{ backgroundColor: AppleColors.systemBlue, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20 }}
                        onPress={() => router.push('/add')}
                    >
                        <Text style={{ ...AppleTypography.headline, color: '#FFF', fontWeight: '900' }}>Add a Habit</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Progress</Text>
                <Text style={styles.headerSubtitle}>Fueling your resistance.</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* AI Coach Card */}
                <View style={styles.aiCard}>
                    <View style={styles.aiIconContainer}>
                        <LucideIcons.Bot size={20} color={aiCoach.type === 'roast' ? AppleColors.systemRed : AppleColors.systemGreen} />
                    </View>
                    <View style={styles.aiTextContainer}>
                        <Text style={[styles.aiTitle, { color: aiCoach.type === 'roast' ? AppleColors.systemRed : AppleColors.systemGreen }]}>
                            {aiCoach.title}
                        </Text>
                        <Text style={styles.aiMessage}>{aiCoach.message}</Text>
                    </View>
                </View>

                {/* Global Streak Hero */}
                <Animated.View style={[styles.streakCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.streakContent}>
                        <View style={styles.streakLeft}>
                            <Text style={styles.streakEmoji}>🔥</Text>
                            <View>
                                <Text style={styles.streakNumber}>{globalStreak}</Text>
                                <Text style={styles.streakLabel}>{globalStreak === 1 ? 'DAY STREAK' : 'DAYS STREAK'}</Text>
                            </View>
                        </View>
                        <View style={styles.streakRight}>
                            <Text style={styles.streakBest}>BEST: {highestStreak} DAYS</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Core Stats Overview */}
                <View style={styles.progressList}>
                    <ProgressBarRow 
                        icon="🛡️" label="Discipline" 
                        currentVal={totalDiscipline % 100} totalVal={100} 
                        currentDisplay={totalDiscipline} totalDisplay={level * 100} 
                        color={AppleColors.primary} 
                    />
                    <ProgressBarRow 
                        icon="🎯" label="Success Rate" 
                        currentVal={successRate} totalVal={100} 
                        currentDisplay={`${successRate}%`} totalDisplay="100%" 
                        color={AppleColors.systemGreen} 
                    />
                    <ProgressBarRow 
                        icon="📅" label="Weekly consistency" 
                        currentVal={daysCompleted} totalVal={7} 
                        currentDisplay={daysCompleted} totalDisplay="7 days" 
                        color={AppleColors.systemIndigo} 
                    />
                </View>

                {/* Performance Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly intensity</Text>
                    <View style={styles.chartCard}>
                        <View style={styles.weekChart}>
                            {weeklyData.map((day, i) => (
                                <View key={i} style={styles.barContainer}>
                                    <View style={styles.barColumn}>
                                        <View style={[
                                            styles.bar,
                                            { 
                                                height: `${(day.completion / maxCompletion) * 100}%`,
                                                backgroundColor: day.completion > 0 ? AppleColors.primary : AppleColors.fill.tertiary
                                            }
                                        ]} />
                                    </View>
                                    <Text style={styles.barLabel}>{day.label}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.chartNote}>Activity based on habit completion volume</Text>
                    </View>
                </View>

                {/* Trends */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly momentum</Text>
                    <View style={styles.chartCard}>
                        {monthlyData.map((m, i) => (
                            <View key={i} style={styles.trendRow}>
                                <Text style={styles.trendMonth}>{m.month}</Text>
                                <View style={styles.trendBarContainer}>
                                    <View style={[styles.trendBar, { width: `${m.value}%`, backgroundColor: AppleColors.systemBlue }]} />
                                </View>
                                <Text style={styles.trendValue}>{m.value}%</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsContainer}>
                        {achievements.map((a, i) => (
                            <View key={i} style={[styles.achievementCard, !a.earned && styles.achievementCardLocked]}>
                                <Text style={styles.achievementIcon}>{a.earned ? a.icon : '🔒'}</Text>
                                <Text style={styles.achievementTitle}>{a.title}</Text>
                                <Text style={styles.achievementSubtitle}>{a.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Daily Quote */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteIcon}>"</Text>
                    <Text style={styles.quoteText}>{dailyQuote.split(' — ')[0]}</Text>
                    <Text style={styles.quoteAuthor}>— {dailyQuote.split(' — ')[1]}</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppleColors.background.secondary },
    header: { paddingHorizontal: AppleSpacing.base, paddingTop: AppleSpacing.md, paddingBottom: AppleSpacing.base },
    headerTitle: { ...AppleTypography.largeTitle, color: AppleColors.label.primary },
    headerSubtitle: { ...AppleTypography.subheadline, color: AppleColors.label.secondary, marginTop: 4 },
    scrollView: { flex: 1 },
    scrollContent: { padding: AppleSpacing.base },
    streakCard: { backgroundColor: AppleColors.systemOrange, borderRadius: AppleBorderRadius.card, padding: AppleSpacing.lg, marginBottom: AppleSpacing.base, ...AppleShadows.medium },
    streakContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    streakLeft: { flexDirection: 'row', alignItems: 'center' },
    streakEmoji: { fontSize: 48, marginRight: AppleSpacing.base },
    streakNumber: { ...AppleTypography.largeTitle, fontWeight: '700', color: '#FFFFFF' },
    streakLabel: { ...AppleTypography.callout, color: '#FFFFFF', opacity: 0.9 },
    streakRight: { alignItems: 'flex-end' },
    streakBest: { ...AppleTypography.footnote, color: '#FFFFFF', opacity: 0.9 },
    progressList: { backgroundColor: AppleColors.background.tertiary, borderRadius: AppleBorderRadius.card, padding: AppleSpacing.base, marginBottom: AppleSpacing.xl, gap: AppleSpacing.md, ...AppleShadows.small },
    progressRow: { marginBottom: 4 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    progressLabel: { ...AppleTypography.callout, color: AppleColors.label.secondary, fontWeight: '500' },
    progressValues: { ...AppleTypography.footnote },
    progressBarContainer: { height: 12, backgroundColor: AppleColors.fill.tertiary, borderRadius: 6, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 6 },
    section: { marginBottom: AppleSpacing.xl },
    sectionTitle: { ...AppleTypography.title3, color: AppleColors.label.primary, marginBottom: AppleSpacing.md },
    chartCard: { backgroundColor: AppleColors.background.tertiary, borderRadius: AppleBorderRadius.card, padding: AppleSpacing.base, ...AppleShadows.small },
    weekChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginBottom: AppleSpacing.md },
    barContainer: { flex: 1, alignItems: 'center' },
    barColumn: { width: '100%', height: 100, justifyContent: 'flex-end', paddingHorizontal: 4 },
    bar: { width: '100%', borderRadius: 4, minHeight: 6 },
    barLabel: { ...AppleTypography.caption2, color: AppleColors.label.secondary, marginTop: AppleSpacing.sm },
    chartNote: { ...AppleTypography.footnote, color: AppleColors.label.secondary, textAlign: 'center' },
    trendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: AppleSpacing.md },
    trendMonth: { ...AppleTypography.callout, color: AppleColors.label.primary, width: 40, fontWeight: '500' },
    trendBarContainer: { flex: 1, height: 8, backgroundColor: AppleColors.fill.tertiary, borderRadius: 4, overflow: 'hidden', marginHorizontal: AppleSpacing.md },
    trendBar: { height: '100%', borderRadius: 4 },
    trendValue: { ...AppleTypography.callout, color: AppleColors.label.secondary, width: 50, textAlign: 'right', fontWeight: '600' },
    achievementsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: AppleSpacing.md },
    achievementCard: { flex: 1, minWidth: (width - AppleSpacing.base * 2 - AppleSpacing.md * 2) / 3, backgroundColor: AppleColors.background.tertiary, borderRadius: AppleBorderRadius.card, padding: AppleSpacing.base, alignItems: 'center', ...AppleShadows.small },
    achievementCardLocked: { opacity: 0.4 },
    achievementIcon: { fontSize: 32, marginBottom: AppleSpacing.sm },
    achievementTitle: { ...AppleTypography.footnote, fontWeight: '600', color: AppleColors.label.primary, textAlign: 'center', marginBottom: 2 },
    achievementSubtitle: { ...AppleTypography.caption2, color: AppleColors.label.secondary, textAlign: 'center' },
    quoteCard: { backgroundColor: AppleColors.systemIndigo + '15', borderRadius: AppleBorderRadius.card, padding: AppleSpacing.lg, marginTop: AppleSpacing.base },
    quoteIcon: { ...AppleTypography.largeTitle, color: AppleColors.systemIndigo, opacity: 0.3, marginBottom: AppleSpacing.sm },
    quoteText: { ...AppleTypography.body, color: AppleColors.systemIndigo, fontStyle: 'italic', lineHeight: 24, marginBottom: AppleSpacing.sm },
    quoteAuthor: { ...AppleTypography.footnote, color: AppleColors.systemIndigo, textAlign: 'right' },
    aiCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', flexDirection: 'row', alignItems: 'flex-start' },
    aiIconContainer: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    aiTextContainer: { flex: 1 },
    aiTitle: { ...AppleTypography.headline, fontWeight: '900', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
    aiMessage: { ...AppleTypography.subheadline, color: 'rgba(255, 255, 255, 0.7)', fontWeight: '600', lineHeight: 20 },
});
