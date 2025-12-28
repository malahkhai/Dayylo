import { View } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import * as LucideIcons from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
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
                name="dashboard"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <LucideIcons.LayoutDashboard size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color }) => (
                        <View className="bg-primary w-12 h-12 rounded-full items-center justify-center -mt-8 shadow-lg border-4 border-white">
                            <LucideIcons.Plus size={28} color="black" />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Charts',
                    tabBarIcon: ({ color }) => <LucideIcons.LineChart size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Self',
                    tabBarIcon: ({ color }) => <LucideIcons.User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
