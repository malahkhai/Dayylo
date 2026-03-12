import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

interface AuthContextData {
    user: FirebaseAuthTypes.User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<boolean>;
    loginWithApple: () => Promise<boolean>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: '344264941790-v8lqvup5v8lqvup5v8lqvup5v8lqvup5.apps.googleusercontent.com', // Replace with your actual web client ID
        });

        // Subscribe to auth state changes
        const subscriber = auth().onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
            if (isLoading) setIsLoading(false);
        });

        return subscriber; // unsubscribe on unmount
    }, []);

    const loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();
            const idToken = data?.idToken;
            if (!idToken) throw new Error("No ID Token found");
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            return userCredential.additionalUserInfo?.isNewUser ?? false;
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    };

    const loginWithApple = async () => {
        try {
            const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const { identityToken } = appleAuthRequestResponse;

            if (identityToken) {
                const appleCredential = auth.AppleAuthProvider.credential(identityToken);
                const userCredential = await auth().signInWithCredential(appleCredential);
                return userCredential.additionalUserInfo?.isNewUser ?? false;
            }
            return false;
        } catch (error) {
            console.error("Apple Sign-In Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const isSignedIn = await GoogleSignin.hasPreviousSignIn();
            if (isSignedIn) {
                await GoogleSignin.signOut();
            }
            await auth().signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const deleteAccount = async () => {
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                // 1. Delete Firestore Data
                const { FirestoreService } = require('../services/firestore');
                await FirestoreService.deleteUserData(currentUser.uid);

                // 2. Delete Auth User
                await currentUser.delete();
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, loginWithApple, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
