import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { AppleColors, AppleTypography } from '../constants/AppleTheme';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, addMonths, subMonths } from 'date-fns';
import * as LucideIcons from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CalendarHeatmapProps {
    history: Record<string, boolean>;
    color: string;
}

export function CalendarHeatmap({ history, color }: CalendarHeatmapProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const startDay = getDay(startOfMonth(currentMonth)); // 0 = Sunday, 1 = Monday
    // Adjust for Monday start if desired. Let's assume Sunday start for standard US/Expo locale default, 
    // but the design showed Mon-Sun. Let's do Mon start to match design.
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const fillerDays = Array.from({ length: adjustedStartDay }, (_, i) => i);

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
                    <LucideIcons.ChevronLeft size={20} color={AppleColors.label.secondary} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
                    <LucideIcons.ChevronRight size={20} color={AppleColors.label.secondary} />
                </TouchableOpacity>
            </View>

            {/* Week Headers */}
            <View style={styles.grid}>
                {weekDays.map((day, i) => (
                    <View key={`header-${i}`} style={styles.headerCell}>
                        <Text style={styles.headerText}>{day}</Text>
                    </View>
                ))}

                {/* Filler Days from Prev Month */}
                {fillerDays.map(i => (
                    <View key={`filler-${i}`} style={styles.cell} />
                ))}

                {/* Days */}
                {daysInMonth.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isCompleted = history && history[dateStr];

                    return (
                        <View key={dateStr} style={styles.cell}>
                            <View style={[
                                styles.dayCircle,
                                isCompleted && { backgroundColor: color || AppleColors.systemBlue },
                                !isCompleted && { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
                            ]}>
                                <Text style={[
                                    styles.dayText,
                                    isCompleted ? { color: '#000' } : { color: AppleColors.label.secondary }
                                ]}>
                                    {format(date, 'd')}
                                </Text>
                            </View>
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
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    monthTitle: {
        ...AppleTypography.headline,
        color: AppleColors.label.primary,
        fontSize: 15,
    },
    arrowButton: {
        padding: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    headerCell: {
        width: '14.28%',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerText: {
        ...AppleTypography.caption2,
        color: AppleColors.label.tertiary,
        fontWeight: '700',
    },
    cell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: AppleColors.label.primary,
    }
});
