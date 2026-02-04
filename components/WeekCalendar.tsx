import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { AppleColors, AppleTypography, AppleSpacing } from '../constants/AppleTheme';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

export const WeekCalendar = () => {
    const today = new Date();
    const scrollRef = useRef<ScrollView>(null);

    // Generate 2 weeks window (1 week back, 1 week fwd)
    const generateDates = () => {
        const dates = [];
        const start = new Date(today);
        start.setDate(today.getDate() - 7);

        for (let i = 0; i < 14; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dates = generateDates();

    const isToday = (date: Date) => {
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Auto-scroll to today
    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({ x: 7 * 56, animated: true });
        }, 500);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={50}
            >
                {dates.map((date, index) => {
                    const active = isToday(date);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dayItem, active && styles.dayItemActive]}
                            onPress={() => {
                                Haptics.selectionAsync();
                                // Handle date select
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.dayName, active && styles.activeText]}>
                                {format(date, 'EEE')}
                            </Text>
                            <View style={[styles.dateCircle, active && styles.activeCircle]}>
                                <Text style={[styles.dateText, active && styles.activeDateText]}>
                                    {date.getDate()}
                                </Text>
                            </View>
                            {active && <View style={styles.dot} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: AppleSpacing.lg,
    },
    scrollContent: {
        paddingHorizontal: AppleSpacing.base,
        gap: 8,
    },
    dayItem: {
        width: 50,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: AppleColors.surface.glassLow,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dayItemActive: {
        backgroundColor: AppleColors.surface.glassHigh,
        borderColor: AppleColors.primary + '50',
    },
    dayName: {
        ...AppleTypography.caption2,
        fontWeight: '700',
        color: AppleColors.label.tertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontSize: 10,
    },
    dateCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        backgroundColor: AppleColors.primary,
        shadowColor: AppleColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    dateText: {
        ...AppleTypography.body,
        fontWeight: '700',
        color: AppleColors.label.primary,
        fontSize: 15,
    },
    activeDateText: {
        color: '#FFFFFF',
    },
    activeText: {
        color: AppleColors.primary,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: AppleColors.primary,
        marginTop: 6,
    }
});
