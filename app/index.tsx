import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
    // In a real app, check for authenticated user
    // For this implementation, we start with Login
    return <Redirect href="/(auth)/login" />;
}
