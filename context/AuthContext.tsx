import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface AuthContextData {
    user: FirebaseAuthTypes.User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<boolean>;
    loginWithApple: () => Promise<boolean>;
    linkEmailPassword: (email: string, password: string) => Promise<boolean>;
    loginAnonymously: () => Promise<void>;
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
            webClientId: '344264941790-v8lqvup5v8lqvup5v8lqvup5v8lqvup5.apps.googleusercontent.com',
        });

        // Subscribe to auth state changes
        const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);
            
            // AUTO-ANONYMOUS: If no user exists on launch, create one silently
            // This ensures every guest has a UID to save habits to immediately.
            if (!firebaseUser) {
                console.log('[Auth] No user detected, triggering silent anonymous login...');
                try {
                    await auth().signInAnonymously();
                } catch (e) {
                    console.error('[Auth] Initial anonymous login failed', e);
                }
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
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            
            let userCredential;
            if (user?.isAnonymous) {
                console.log('[Auth] Linking Google account to Anonymous user:', user.uid);
                userCredential = await user.linkWithCredential(googleCredential);
            } else {
                userCredential = await auth().signInWithCredential(googleCredential);
            }
            
            if (userCredential.user.displayName) {
                try {
                    await firestore().collection('users').doc(userCredential.user.uid).set({ userName: userCredential.user.displayName }, { merge: true });
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
                const appleCredential = auth.AppleAuthProvider.credential(identityToken);
                
                let userCredential;
                if (user?.isAnonymous) {
                    console.log('[Auth] Linking Apple account to Anonymous user:', user.uid);
                    userCredential = await user.linkWithCredential(appleCredential);
                } else {
                    userCredential = await auth().signInWithCredential(appleCredential);
                }
                
                if (fullName && (fullName.givenName || fullName.familyName)) {
                    const name = [fullName.givenName, fullName.familyName].filter(Boolean).join(' ');
                    if (name) {
                        try {
                            await userCredential.user.updateProfile({ displayName: name });
                            await firestore().collection('users').doc(userCredential.user.uid).set({ userName: name }, { merge: true });
                            setUser(auth().currentUser);
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

    /**
     * Link Email/Password to existing Anonymous account
     * This prevents splitting the User ID when someone creates an account
     */
    const linkEmailPassword = async (email: string, password: string) => {
        try {
            const credential = auth.EmailAuthProvider.credential(email, password);
            if (auth().currentUser?.isAnonymous) {
                console.log('[Auth] Linking Email to Anonymous account:', auth().currentUser?.uid);
                await auth().currentUser?.linkWithCredential(credential);
                return true; 
            } else {
                // If for some reason they aren't anonymous, just create a new user
                await auth().createUserWithEmailAndPassword(email, password);
                return true;
            }
        } catch (error) {
            console.error("Email Linking Error:", error);
            throw error;
        }
    };

    const loginAnonymously = async () => {
        try {
            await auth().signInAnonymously();
        } catch (error) {
            console.error("Anonymous Sign-In Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const isSignedIn = await GoogleSignin.hasPreviousSignIn();
                if (isSignedIn) {
                    await GoogleSignin.signOut();
                }
                await auth().signOut();
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
            const currentUser = auth().currentUser;
            if (currentUser) {
                const { FirestoreService } = require('../services/firestore');
                await FirestoreService.deleteUserData(currentUser.uid);
                await currentUser.delete();
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            loginWithGoogle, 
            loginWithApple, 
            linkEmailPassword,
            loginAnonymously, 
            logout, 
            deleteAccount 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
