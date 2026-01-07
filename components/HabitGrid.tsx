import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppleColors, AppleTypography } from '../constants/AppleTheme';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import * as LucideIcons from 'lucide-react-native';
import { Habit } from '../types';

interface HabitGridProps {
    habits: Habit[];
}

export function HabitGrid({ habits }: HabitGridProps) {
    // Last 7 days including today
    const days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Weekly Overview</Text>
                <View style={styles.dateRange}>
                    <Text style={styles.dateRangeText}>
                        {format(days[0], 'MMM d')} - {format(days[6], 'MMM d')}
                    </Text>
                </View>
            </View>

            <View style={styles.gridContainer}>
                {/* Header Row: Dates */}
                <View style={styles.row}>
                    <View style={styles.habitLabelColumn} />
                    {days.map(d => (
                        <View key={d.toString()} style={styles.dateHeaderCell}>
                            <Text style={styles.dayName}>{format(d, 'E')}</Text>
                        </View>
                    ))}
                </View>

                {/* Rows for each habit */}
                {habits.map(habit => {
                    const Icon = (LucideIcons as any)[habit.icon] || LucideIcons.Circle;

                    return (
                        <View key={habit.id} style={styles.row}>
                            {/* Habit Label */}
                            <View style={styles.habitLabelColumn}>
                                <View style={styles.iconContainer}>
                                    <Icon size={14} color={habit.color} />
                                </View>
                                <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
                            </View>

                            {/* Checks for each day */}
                            {days.map(d => {
                                const dateStr = format(d, 'yyyy-MM-dd');
                                // Check history safely
                                const isDone = habit.history && habit.history[dateStr];

                                return (
                                    <View key={dateStr} style={styles.cell}>
                                        <View style={[
                                            styles.checkCircle,
                                            isDone ? { backgroundColor: habit.color } : { backgroundColor: 'rgba(255,255,255,0.05)' }
                                        ]} />
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        ...AppleTypography.headline,
        color: AppleColors.label.primary,
    },
    dateRange: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateRangeText: {
        ...AppleTypography.caption1,
        color: AppleColors.label.secondary,
        fontWeight: '700',
    },
    gridContainer: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    habitLabelColumn: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    iconContainer: {
        marginRight: 8,
    },
    habitName: {
        ...AppleTypography.caption1,
        color: AppleColors.label.secondary,
        fontWeight: '600',
        flex: 1,
    },
    dateHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    dayName: {
        ...AppleTypography.caption2,
        color: AppleColors.label.tertiary,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 6,
    }
});
