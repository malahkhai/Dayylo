import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

export const authenticateUser = async (): Promise<boolean> => {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) return true; // Fallback for simulators or devices without auth

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) return true; // No auth set up, allow access

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock to view this habit',
            fallbackLabel: 'Enter Passcode',
        });

        return result.success;
    } catch (error) {
        console.error('Auth error:', error);
        return false;
    }
};
