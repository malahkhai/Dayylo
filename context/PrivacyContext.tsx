import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrivacyContextType {
    isUnlocked: boolean;
    authenticate: () => Promise<boolean>;
    lock: () => void;
    failedAttempts: number;
    isPermanentlyLocked: boolean; // For the 24h lock
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockUntil, setLockUntil] = useState<number | null>(null);

    useEffect(() => {
        // Load lock state on mount
        AsyncStorage.getItem('privacy_lock_until').then(val => {
            if (val) setLockUntil(parseInt(val));
        });
        AsyncStorage.getItem('privacy_failed_attempts').then(val => {
            if (val) setFailedAttempts(parseInt(val));
        });
    }, []);

    const isPermanentlyLocked = lockUntil ? Date.now() < lockUntil : false;

    const authenticate = async () => {
        if (isPermanentlyLocked) return false;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock Private Habits',
            fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
            setIsUnlocked(true);
            setFailedAttempts(0);
            await AsyncStorage.removeItem('privacy_failed_attempts');
            return true;
        } else {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            await AsyncStorage.setItem('privacy_failed_attempts', newAttempts.toString());

            if (newAttempts >= 4) {
                const until = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
                setLockUntil(until);
                await AsyncStorage.setItem('privacy_lock_until', until.toString());
            }
            return false;
        }
    };

    const lock = () => setIsUnlocked(false);

    return (
        <PrivacyContext.Provider value={{ isUnlocked, authenticate, lock, failedAttempts, isPermanentlyLocked }}>
            {children}
        </PrivacyContext.Provider>
    );
};

export const usePrivacy = () => {
    const context = useContext(PrivacyContext);
    if (!context) throw new Error('usePrivacy must be used within a PrivacyProvider');
    return context;
};
