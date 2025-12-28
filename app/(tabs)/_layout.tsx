import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import * as LucideIcons from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#30e8ab',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.2)',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <LucideIcons.Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Status',
                    tabBarIcon: ({ color, size }) => <LucideIcons.LayoutGrid size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color }) => (
                        <View className="bg-primary w-12 h-12 rounded-2xl items-center justify-center -mt-8 shadow-lg shadow-primary/40">
                            <LucideIcons.Plus size={28} color="black" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, size }) => <LucideIcons.BarChart3 size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <LucideIcons.Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
