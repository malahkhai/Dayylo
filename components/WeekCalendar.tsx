import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppleColors, AppleTypography, AppleSpacing } from '../constants/AppleTheme';

export const WeekCalendar = () => {
    const today = new Date();

    // Get the start of the week (Sunday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(today);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isToday = (date: Date) => {
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <View style={styles.container}>
            <View style={styles.weekContainer}>
                {weekDays.map((date, index) => {
                    const active = isToday(date);
                    return (
                        <View key={index} style={styles.dayItem}>
                            <Text style={[styles.dayName, active && styles.activeText]}>
                                {dayNames[date.getDay()]}
                            </Text>
                            <View style={[styles.dateCircle, active && styles.activeCircle]}>
                                <Text style={[styles.dateText, active && styles.activeDateText]}>
                                    {date.getDate()}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: AppleSpacing.base,
        marginBottom: AppleSpacing.lg,
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayItem: {
        alignItems: 'center',
    },
    dayName: {
        ...AppleTypography.caption2,
        fontWeight: '700',
        color: AppleColors.label.tertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    dateCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        backgroundColor: AppleColors.primary,
    },
    dateText: {
        ...AppleTypography.body,
        fontWeight: '700',
        color: AppleColors.label.primary,
        fontSize: 16,
    },
    activeDateText: {
        color: '#000',
    },
    activeText: {
        color: AppleColors.primary,
    }
});
