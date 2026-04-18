import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getAuth, signInAnonymously, signInWithCredential, linkWithCredential, signOut, createUserWithEmailAndPassword, updateProfile, EmailAuthProvider, GoogleAuthProvider, AppleAuthProvider } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';

interface AuthContextData {
    user: FirebaseAuthTypes.User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<boolean>;
    loginWithApple: () => Promise<boolean>;
    updateUserName: (name: string) => Promise<void>;
    linkEmailPassword: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const db = getFirestore();
const LOGOUT_FLAG = 'dayylo_manual_logout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isLoggingOut = useRef(false);
    const firebaseAuth = getAuth();

    useEffect(() => {
        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: '344264941790-v8lqvup5v8lqvup5v8lqvup5v8lqvup5.apps.googleusercontent.com',
        });

        // Subscribe to auth state changes
        const subscriber = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);
            
            if (firebaseUser) {
                // If we have a user, reset the logout flags
                isLoggingOut.current = false;
                await AsyncStorage.removeItem(LOGOUT_FLAG);
            }

            if (isLoading) setIsLoading(false);
        });

        return subscriber;
    }, []);

    const loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();
            const idToken = data?.idToken;
            if (!idToken) throw new Error("No ID Token found");
            const googleCredential = GoogleAuthProvider.credential(idToken);
            
            const userCredential = await signInWithCredential(firebaseAuth, googleCredential);
            
            if (userCredential.user.displayName) {
                try {
                    const userRef = doc(db, 'users', userCredential.user.uid);
                    await setDoc(userRef, { userName: userCredential.user.displayName }, { merge: true });
                } catch (e) {
                    console.error("Failed to save Google displayName", e);
                }
            }
            
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

            const { identityToken, fullName } = appleAuthRequestResponse;

            if (identityToken) {
                const appleCredential = AppleAuthProvider.credential(identityToken);
                
                const userCredential = await signInWithCredential(firebaseAuth, appleCredential);
                
                if (fullName && (fullName.givenName || fullName.familyName)) {
                    const name = [fullName.givenName, fullName.familyName].filter(Boolean).join(' ');
                    if (name) {
                        try {
                            await updateProfile(userCredential.user, { displayName: name });
                            const userRef = doc(db, 'users', userCredential.user.uid);
                            await setDoc(userRef, { userName: name }, { merge: true });
                            setUser(firebaseAuth.currentUser);
                        } catch (e) {
                            console.error("Failed to save Apple fullName", e);
                        }
                    }
                }
                
                return userCredential.additionalUserInfo?.isNewUser ?? false;
            }
            return false;
        } catch (error) {
            console.error("Apple Sign-In Error:", error);
            throw error;
        }
    };

    const updateUserName = async (name: string) => {
        try {
            const currentUser = firebaseAuth.currentUser;
            if (currentUser) {
                // 1. Update Firebase Auth Profile
                await updateProfile(currentUser, { displayName: name });
                
                // 2. Update Firestore document
                const userRef = doc(db, 'users', currentUser.uid);
                await setDoc(userRef, { userName: name }, { merge: true });
                
                // 3. Update local state
                setUser(firebaseAuth.currentUser);
            }
        } catch (error) {
            console.error("Update Username Error:", error);
            throw error;
        }
    };

    /**
     * Standard Email/Password Sign Up
     */
    const linkEmailPassword = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            return true;
        } catch (error) {
            console.error("Email Signup Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const currentUser = firebaseAuth.currentUser;
            if (currentUser) {
                isLoggingOut.current = true; // Signal that this is intentional
                await AsyncStorage.setItem(LOGOUT_FLAG, 'true');
                const isSignedIn = await GoogleSignin.hasPreviousSignIn();
                if (isSignedIn) {
                    await GoogleSignin.signOut();
                }
                await signOut(firebaseAuth);
            }
        } catch (error: any) {
            // Suppress error if already logged out, otherwise log it
            if (error?.code !== 'auth/no-current-user') {
                console.error("Error signing out:", error);
            }
        }
    };

    const deleteAccount = async () => {
        try {
            const currentUser = firebaseAuth.currentUser;
            if (currentUser) {
                console.log('[Auth) Initiating account deletion for:', currentUser.uid);
                isLoggingOut.current = true;
                await AsyncStorage.setItem(LOGOUT_FLAG, 'true');
                
                // 1. Delete Firestore Data First
                const { FirestoreService } = require('../services/firestore');
                await FirestoreService.deleteUserData(currentUser.uid);
                
                // 2. Delete Auth User
                await currentUser.delete();
                console.log('[Auth] Account successfully deleted');
            }
        } catch (error: any) {
            console.error("Error deleting account:", error);
            // Re-throw specific errors to be handled by the UI
            if (error.code === 'auth/requires-recent-login') {
                throw error;
            }
            throw new Error("Failed to delete account. Please try again later.");
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            loginWithGoogle, 
            loginWithApple, 
            updateUserName,
            linkEmailPassword,
            logout, 
            deleteAccount 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
