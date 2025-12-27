import { Tabs } from 'expo-router';
import React from 'react';
import * as LucideIcons from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#30e8ab',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 100,
                    paddingBottom: 35,
                    paddingTop: 10,
                    position: 'absolute',
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <LucideIcons.Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color }) => <LucideIcons.BarChart2 size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <LucideIcons.User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
