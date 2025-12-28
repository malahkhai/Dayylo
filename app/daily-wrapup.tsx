import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../constants/AppleTheme';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

export default function DailyWrapupScreen() {
    const router = useRouter();
    const { habits } = useHabits();

    // In a real app, this would fetch historical data for 'yesterday'
    // For this demonstration, we'll use current habit states to simulate a wrap-up
    const builds = habits.filter(h => h.type === 'build');
    const breaks = habits.filter(h => h.type === 'break');

    const completedBuilds = builds.filter(h => h.completedToday);
    const avoidedBreaks = breaks.filter(h => h.completedToday);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <LucideIcons.ChevronLeft size={28} color={AppleColors.label.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Daily Wrap-up</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.summaryCard}>
                    <View style={styles.dateLabel}>
                        <Text style={styles.dateText}>PERFORMANCE SUMMARY</Text>
                        <Text style={styles.actualDate}>Yesterday</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{completedBuilds.length}/{builds.length}</Text>
                            <Text style={styles.statLabel}>Builds</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{avoidedBreaks.length}/{breaks.length}</Text>
                            <Text style={styles.statLabel}>Breaks Avoided</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Build Habits</Text>
                </View>

                {builds.map(h => (
                    <View key={h.id} style={styles.habitRow}>
                        <View style={[styles.iconBg, { backgroundColor: h.color + '15' }]}>
                            {React.createElement((LucideIcons as any)[h.icon], { size: 20, color: h.color })}
                        </View>
                        <Text style={styles.habitName}>{h.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: h.completedToday ? AppleColors.systemGreen + '15' : 'rgba(255,255,255,0.05)' }]}>
                            <Text style={[styles.statusText, { color: h.completedToday ? AppleColors.systemGreen : AppleColors.label.tertiary }]}>
                                {h.completedToday ? 'COMPLETED' : 'MISSED'}
                            </Text>
                        </View>
                    </View>
                ))}

                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Break Habits</Text>
                </View>

                {breaks.map(h => (
                    <View key={h.id} style={styles.habitRow}>
                        <View style={[styles.iconBg, { backgroundColor: h.color + '15' }]}>
                            {React.createElement((LucideIcons as any)[h.icon], { size: 20, color: h.color })}
                        </View>
                        <Text style={styles.habitName}>{h.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: h.completedToday ? AppleColors.systemGreen + '15' : AppleColors.systemRed + '15' }]}>
                            <Text style={[styles.statusText, { color: h.completedToday ? AppleColors.systemGreen : AppleColors.systemRed }]}>
                                {h.completedToday ? 'AVOIDED' : 'FAILED'}
                            </Text>
                        </View>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerQuote}>"Every day is a new scroll of history."</Text>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.closeButtonText}>Done</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: AppleSpacing.base,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppleSpacing.base,
    },
    summaryCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 32,
        padding: 24,
        marginTop: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dateLabel: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dateText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.systemBlue,
        letterSpacing: 1,
        marginBottom: 4,
    },
    actualDate: {
        ...AppleTypography.title2,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        ...AppleTypography.largeTitle,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    statLabel: {
        ...AppleTypography.caption2,
        fontWeight: '800',
        color: AppleColors.label.secondary,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 11,
    },
    habitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    habitName: {
        ...AppleTypography.body,
        fontWeight: '900',
        color: AppleColors.label.primary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        fontSize: 10,
    },
    footer: {
        marginTop: 48,
        marginBottom: 60,
        alignItems: 'center',
    },
    footerQuote: {
        ...AppleTypography.body,
        color: AppleColors.label.tertiary,
        fontStyle: 'italic',
        marginBottom: 32,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: AppleColors.systemBlue,
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 20,
        ...AppleShadows.medium,
    },
    closeButtonText: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: '#FFFFFF',
    }
});
