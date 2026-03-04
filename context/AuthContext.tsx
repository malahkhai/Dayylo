import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextData {
    user: FirebaseAuthTypes.User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth state changes
        const subscriber = auth().onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
            if (isLoading) setIsLoading(false);
        });

        return subscriber; // unsubscribe on unmount
    }, []);

    const logout = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
