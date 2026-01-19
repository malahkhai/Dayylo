import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { useHabits } from '../../context/HabitContext';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows, AppleBorderRadius } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';

const { width } = Dimensions.get('window');

export default function HabitDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { habits, deleteHabit, toggleHabit } = useHabits();

    // Find the habit. useMemo isn't strictly necessary here unless performance hit is noticed
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

    const handleDelete = () => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteHabit(habit.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleToggle = async () => {
        await toggleHabit(habit.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.iconButton}>
                    <LucideIcons.ChevronLeft size={28} color={AppleColors.label.primary} />
                </Pressable>
                <Pressable style={styles.iconButton}>
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

                    <Pressable
                        onPress={handleToggle}
                        style={[
                            styles.toggleButton,
                            { backgroundColor: habit.completedToday ? habit.color : 'rgba(255,255,255,0.1)' }
                        ]}
                    >
                        <LucideIcons.Check size={24} color={habit.completedToday ? '#000000' : '#FFFFFF'} />
                        <Text style={[styles.toggleText, { color: habit.completedToday ? '#000000' : '#FFFFFF' }]}>
                            {habit.completedToday ? 'COMPLETED TODAY' : 'MARK COMPLETE'}
                        </Text>
                    </Pressable>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>CURRENT STREAK</Text>
                        <Text style={[styles.statValue, { color: habit.color }]}>
                            {habit.streak} <Text style={styles.statUnit}>DAYS</Text>
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>BEST STREAK</Text>
                        <Text style={styles.statValue}>
                            {habit.longestStreak} <Text style={styles.statUnit}>DAYS</Text>
                        </Text>
                    </View>
                </View>

                {/* Additional Info / Future Expansion */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <LucideIcons.Repeat size={20} color={AppleColors.label.secondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Frequency</Text>
                            <Text style={styles.infoValue}>Daily</Text>
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
                                {habit.type === 'build' ? 'Build Habit' : 'Break Habit'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Danger Zone */}
                <Pressable
                    onPress={handleDelete}
                    style={styles.deleteButton}
                >
                    <LucideIcons.Trash2 size={20} color={AppleColors.systemRed} />
                    <Text style={styles.deleteText}>Delete Habit</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    errorText: {
        ...AppleTypography.title3,
        color: AppleColors.label.secondary
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: AppleSpacing.base,
        paddingTop: AppleSpacing.sm,
        paddingBottom: AppleSpacing.md,
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 22,
        ...AppleShadows.small,
    },
    scrollContent: {
        paddingHorizontal: AppleSpacing.base,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    heroIconBg: {
        width: 100,
        height: 100,
        borderRadius: 24, // Slightly larger than standard 12 for large hero element, but cleaner than 36
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        ...AppleShadows.medium,
    },
    heroTitle: {
        ...AppleTypography.largeTitle,
        fontWeight: '900',
        color: AppleColors.label.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        maxWidth: '80%',
        marginBottom: 32,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12, // 12pt per Skill
        gap: 12,
        ...AppleShadows.medium,
    },
    toggleText: {
        ...AppleTypography.headline,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 12, // 12pt per Skill
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    statUnit: {
        fontSize: 12,
        fontWeight: '700',
        color: AppleColors.label.tertiary,
    },
    infoCard: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 12, // 12pt per Skill
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 40,
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        ...AppleTypography.caption2,
        color: AppleColors.label.tertiary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    infoValue: {
        ...AppleTypography.body,
        fontWeight: '700',
        color: AppleColors.label.primary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 68,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12, // 12pt per Skill
        backgroundColor: 'rgba(255, 69, 58, 0.1)',
        gap: 8,
    },
    deleteText: {
        ...AppleTypography.body,
        fontWeight: '700',
        color: AppleColors.systemRed,
    },
});
