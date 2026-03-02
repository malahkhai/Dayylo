import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useHabits } from '../../context/HabitContext';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows, AppleBorderRadius } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';

const { width } = Dimensions.get('window');

// ─── Component Imports ─────────────────────────────────────
import { CalendarHeatmap } from '../../components/CalendarHeatmap';

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
    const config = {
        easy: { color: AppleColors.systemGreen, label: 'Easy' },
        medium: { color: AppleColors.systemOrange, label: 'Medium' },
        hard: { color: AppleColors.systemRed, label: 'Hard' },
    };
    const d = (difficulty || 'medium').toLowerCase() as keyof typeof config;
    const c = config[d] || config.medium;
    return (
        <View style={[styles.badge, { backgroundColor: c.color + '20' }]}>
            <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
        </View>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HabitDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { habits, deleteHabit, toggleHabit } = useHabits();
    const [moreVisible, setMoreVisible] = useState(false);

    const habit = habits.find(h => h.id === id);

    if (!habit) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Habit not found.</Text>
                    <AppleButton title="Go Back" onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const Icon = (LucideIcons as any)[habit.icon] || LucideIcons.Circle;

    // Real completions from history
    const histEntries = Object.entries(habit.history || {});
    const totalCompleted = histEntries.filter(([, v]) => v).length;
    const totalTracked = histEntries.length;
    const successRate = totalTracked > 0 ? Math.round((totalCompleted / totalTracked) * 100) : 0;

    // Frequency label
    const frequencyLabel = (() => {
        const freq = (habit as any).frequency;
        if (!freq) return 'Daily';
        if (freq === 'daily') return 'Every Day';
        if (freq === 'weekdays') return 'Weekdays (Mon–Fri)';
        if (freq === 'weekends') return 'Weekends (Sat–Sun)';
        if (Array.isArray(freq)) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return freq.map((d: number) => dayNames[d]).join(', ');
        }
        return 'Daily';
    })();

    const handleDelete = () => {
        Alert.alert(
            "Delete Habit",
            "Are you sure? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        await deleteHabit(habit.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleToggle = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await toggleHabit(habit.id);
        setMoreVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.iconButton}>
                    <LucideIcons.ChevronLeft size={28} color={AppleColors.label.primary} />
                </Pressable>
                <Pressable onPress={() => setMoreVisible(true)} style={styles.iconButton}>
                    <LucideIcons.MoreHorizontal size={24} color={AppleColors.label.primary} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={[styles.heroIconBg, { backgroundColor: habit.color + '20' }]}>
                        <Icon size={48} color={habit.color} />
                    </View>
                    <Text style={styles.heroTitle}>{habit.name}</Text>
                    <Text style={styles.heroSubtitle}>{habit.description || "Keep building this habit."}</Text>

                    <DifficultyBadge difficulty={(habit as any).difficulty} />

                    <Pressable
                        onPress={handleToggle}
                        style={[
                            styles.toggleButton,
                            { backgroundColor: habit.completedToday ? habit.color : 'rgba(255,255,255,0.1)' }
                        ]}
                    >
                        <LucideIcons.Check size={24} color={habit.completedToday ? '#000000' : '#FFFFFF'} />
                        <Text style={[styles.toggleText, { color: habit.completedToday ? '#000000' : '#FFFFFF' }]}>
                            {habit.completedToday ? 'COMPLETED TODAY ✓' : 'MARK COMPLETE'}
                        </Text>
                    </Pressable>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>STREAK</Text>
                        <Text style={[styles.statValue, { color: habit.color }]}>
                            {habit.streak} <Text style={styles.statUnit}>DAYS</Text>
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>BEST</Text>
                        <Text style={styles.statValue}>
                            {habit.longestStreak} <Text style={styles.statUnit}>DAYS</Text>
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>SUCCESS</Text>
                        <Text style={[styles.statValue, {
                            color: successRate >= 80 ? AppleColors.systemGreen
                                : successRate >= 50 ? AppleColors.systemOrange
                                    : AppleColors.systemRed
                        }]}>
                            {successRate}<Text style={styles.statUnit}>%</Text>
                        </Text>
                    </View>
                </View>

                {/* 30-Day Heatmap */}
                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <LucideIcons.CalendarDays size={18} color={AppleColors.label.secondary} />
                        <Text style={styles.sectionTitle}>Past 30 Days</Text>
                    </View>
                    <CalendarHeatmap history={habit.history || {}} color={habit.color} />
                    <View style={styles.heatmapLegend}>
                        <View style={[styles.legendDot, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
                        <Text style={styles.legendText}>Not tracked</Text>
                        <View style={[styles.legendDot, { backgroundColor: `${AppleColors.systemRed}50` }]} />
                        <Text style={styles.legendText}>Missed</Text>
                        <View style={[styles.legendDot, { backgroundColor: habit.color }]} />
                        <Text style={styles.legendText}>Done</Text>
                    </View>
                </View>

                {/* Info rows */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <LucideIcons.Repeat size={20} color={AppleColors.label.secondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Frequency</Text>
                            <Text style={styles.infoValue}>{frequencyLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <LucideIcons.Target size={20} color={AppleColors.label.secondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Type</Text>
                            <Text style={styles.infoValue}>
                                {habit.type === 'build' ? '🌱 Build Habit' : '🛡️ Break Habit'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <LucideIcons.CheckCircle2 size={20} color={AppleColors.label.secondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Total Completions</Text>
                            <Text style={styles.infoValue}>{totalCompleted}</Text>
                        </View>
                    </View>
                </View>

                {/* Delete button */}
                <Pressable onPress={handleDelete} style={styles.deleteButton}>
                    <LucideIcons.Trash2 size={20} color={AppleColors.systemRed} />
                    <Text style={styles.deleteText}>Delete Habit</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* More Modal */}
            <Modal
                visible={moreVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setMoreVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setMoreVisible(false)}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>{habit.name}</Text>

                        <Pressable
                            style={styles.modalAction}
                            onPress={handleToggle}
                        >
                            <LucideIcons.Check size={20} color={habit.completedToday ? AppleColors.systemGreen : AppleColors.label.primary} />
                            <Text style={styles.modalActionText}>
                                {habit.completedToday ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.modalAction}
                            onPress={() => {
                                setMoreVisible(false);
                                router.push({ pathname: '/add-habit', params: { editId: habit.id } });
                            }}
                        >
                            <LucideIcons.Edit2 size={20} color={AppleColors.label.primary} />
                            <Text style={styles.modalActionText}>Edit Habit</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalAction, styles.modalActionDestructive]}
                            onPress={() => { setMoreVisible(false); handleDelete(); }}
                        >
                            <LucideIcons.Trash2 size={20} color={AppleColors.systemRed} />
                            <Text style={[styles.modalActionText, { color: AppleColors.systemRed }]}>Delete Habit</Text>
                        </Pressable>

                        <Pressable style={styles.modalCancel} onPress={() => setMoreVisible(false)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppleColors.background.primary },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
    errorText: { ...AppleTypography.title3, color: AppleColors.label.secondary },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: AppleSpacing.base, paddingTop: AppleSpacing.sm, paddingBottom: AppleSpacing.md,
    },
    iconButton: {
        width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
        backgroundColor: AppleColors.background.tertiary, borderRadius: 22, ...AppleShadows.small,
    },
    scrollContent: { paddingHorizontal: AppleSpacing.base },
    hero: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
    heroIconBg: {
        width: 100, height: 100, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...AppleShadows.medium,
    },
    heroTitle: { ...AppleTypography.largeTitle, fontWeight: '900', color: AppleColors.label.primary, marginBottom: 8, textAlign: 'center' },
    heroSubtitle: { ...AppleTypography.body, color: AppleColors.label.secondary, textAlign: 'center', maxWidth: '80%', marginBottom: 16 },
    badge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginBottom: 24 },
    badgeText: { ...AppleTypography.footnote, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    toggleButton: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, gap: 12, ...AppleShadows.medium,
    },
    toggleText: { ...AppleTypography.headline, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: {
        flex: 1, backgroundColor: AppleColors.background.tertiary,
        borderRadius: 12, padding: 16, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: { ...AppleTypography.caption2, fontWeight: '900', color: AppleColors.label.tertiary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
    statValue: { fontSize: 28, fontWeight: '900', color: AppleColors.label.primary },
    statUnit: { fontSize: 11, fontWeight: '700', color: AppleColors.label.tertiary },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { ...AppleTypography.callout, fontWeight: '700', color: AppleColors.label.secondary },
    heatmapLegend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'center' },
    legendDot: { width: 10, height: 10, borderRadius: 3 },
    legendText: { ...AppleTypography.caption2, color: AppleColors.label.tertiary, marginRight: 8 },

    infoCard: {
        backgroundColor: AppleColors.background.tertiary, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20, padding: 16,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    infoIcon: {
        width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    infoContent: { flex: 1 },
    infoLabel: { ...AppleTypography.caption2, color: AppleColors.label.tertiary, textTransform: 'uppercase', marginBottom: 2 },
    infoValue: { ...AppleTypography.body, fontWeight: '700', color: AppleColors.label.primary },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 50 },

    deleteButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 16, borderRadius: 12, backgroundColor: 'rgba(255,69,58,0.1)', gap: 8,
    },
    deleteText: { ...AppleTypography.body, fontWeight: '700', color: AppleColors.systemRed },

    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalSheet: {
        backgroundColor: AppleColors.background.tertiary, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36,
    },
    modalHandle: { width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { ...AppleTypography.title3, fontWeight: '700', color: AppleColors.label.primary, marginBottom: 20, textAlign: 'center' },
    modalAction: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: AppleColors.background.secondary, borderRadius: 12, padding: 16, marginBottom: 10,
    },
    modalActionDestructive: { opacity: 0.9 },
    modalActionText: { ...AppleTypography.body, fontWeight: '600', color: AppleColors.label.primary },
    modalCancel: { backgroundColor: AppleColors.fill.secondary, borderRadius: 12, padding: 16, marginTop: 8 },
    modalCancelText: { ...AppleTypography.body, fontWeight: '700', color: AppleColors.label.primary, textAlign: 'center' },
});
