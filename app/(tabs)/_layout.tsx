import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors } from '../../constants/AppleTheme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: AppleColors.background.tertiary,
                    borderTopWidth: 0.5,
                    borderTopColor: AppleColors.separator.nonOpaque,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: AppleColors.systemBlue,
                tabBarInactiveTintColor: AppleColors.systemGray,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Today',
                    tabBarIcon: ({ color, size }) => <LucideIcons.Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color, size }) => <LucideIcons.BarChart3 size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color }) => (
                        <View style={styles.addButton}>
                            <LucideIcons.Plus size={28} color="#FFFFFF" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, size }) => <LucideIcons.TrendingUp size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <LucideIcons.Settings size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    href: null, // Hide from tab bar but keep for navigation
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: AppleColors.systemBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
        shadowColor: AppleColors.systemBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
