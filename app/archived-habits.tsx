import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AppleColors, AppleTypography, AppleSpacing, AppleShadows } from '../constants/AppleTheme';
import { useHabits } from '../context/HabitContext';

export default function ArchivedHabitsScreen() {
    const router = useRouter();
    const { habits, archiveHabit, deleteHabit } = useHabits();
    
    const archivedHabits = habits.filter(h => h.isArchived);

    const handlePermanentDelete = (habit: any) => {
        Alert.alert(
            "Delete Permanently",
            `Are you sure you want to delete "${habit.name}"? This will wipe all its history and XP permanently. This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        await deleteHabit(habit.id);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <LucideIcons.ChevronLeft size={28} color={AppleColors.label.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Archived Habits</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {archivedHabits.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconBg}>
                            <LucideIcons.Archive size={48} color={AppleColors.label.tertiary} />
                        </View>
                        <Text style={styles.emptyTitle}>No Archived Habits</Text>
                        <Text style={styles.emptySubtitle}>
                            When you archive a habit, it will appear here. Your data and history will be kept safe.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {archivedHabits.map((habit) => (
                            <View key={habit.id} style={styles.habitCard}>
                                <View style={[styles.iconBg, { backgroundColor: habit.color + '15' }]}>
                                    <View>
                                        {React.createElement((LucideIcons as any)[habit.icon || 'Circle'] || LucideIcons.Circle, {
                                            size: 24,
                                            color: habit.color
                                        })}
                                    </View>
                                </View>
                                <View style={styles.habitInfo}>
                                    <Text style={styles.habitName}>{habit.name}</Text>
                                    <Text style={styles.habitStats}>{habit.streak} day streak • {Object.keys(habit.history || {}).length} days tracked</Text>
                                </View>
                                
                                <View style={styles.actionContainer}>
                                    <Pressable 
                                        onPress={() => archiveHabit(habit.id, false)}
                                        style={styles.unarchiveButton}
                                    >
                                        <LucideIcons.RefreshCw size={16} color={AppleColors.systemBlue} />
                                        <Text style={styles.unarchiveText}>Restore</Text>
                                    </Pressable>

                                    <Pressable 
                                        onPress={() => handlePermanentDelete(habit)}
                                        style={styles.deleteButton}
                                    >
                                        <LucideIcons.Trash2 size={16} color={AppleColors.systemRed} />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppleColors.background.primary },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: AppleSpacing.base, paddingVertical: AppleSpacing.md,
    },
    backButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: AppleColors.background.tertiary,
        alignItems: 'center', justifyContent: 'center', ...AppleShadows.small,
    },
    headerTitle: { ...AppleTypography.headline, color: AppleColors.label.primary },
    scrollContent: { flexGrow: 1, paddingHorizontal: AppleSpacing.base, paddingBottom: 40 },
    
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyIconBg: {
        width: 100, height: 100, borderRadius: 30, backgroundColor: AppleColors.background.tertiary,
        alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...AppleShadows.small,
    },
    emptyTitle: { ...AppleTypography.title2, fontWeight: '700', color: AppleColors.label.primary, marginBottom: 12 },
    emptySubtitle: { ...AppleTypography.body, color: AppleColors.label.secondary, textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },

    listContainer: { gap: 12, marginTop: 10 },
    habitCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: AppleColors.background.tertiary,
        padding: 16, borderRadius: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
        ...AppleShadows.small,
    },
    iconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    habitInfo: { flex: 1, marginLeft: 16 },
    habitName: { ...AppleTypography.body, fontWeight: '700', color: AppleColors.label.primary },
    habitStats: { ...AppleTypography.caption2, color: AppleColors.label.tertiary, marginTop: 2 },
    
    actionContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    unarchiveButton: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
        backgroundColor: AppleColors.systemBlue + '15',
    },
    unarchiveText: { ...AppleTypography.caption1, fontWeight: '700', color: AppleColors.systemBlue },
    deleteButton: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: AppleColors.systemRed + '15',
        alignItems: 'center', justifyContent: 'center',
    },
});
