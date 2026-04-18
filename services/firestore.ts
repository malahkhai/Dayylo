import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { Habit } from '../types';

const USERS_COLLECTION = 'users';

/**
 * Modern (V22) Firebase Modular API wrapper for Firestore operations
 */
const db = getFirestore();

export const FirestoreService = {
    /**
     * Syncs habits to Firestore for the given user.
     */
    async saveHabits(userId: string, habits: Habit[]): Promise<void> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await setDoc(userRef, { habits }, { merge: true });
        } catch (error) {
            console.error('Error saving habits to Firestore:', error);
            throw error;
        }
    },

    /**
     * Fetches the user document from Firestore.
     */
    async getUserData(userId: string): Promise<any> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            const userDoc = await getDoc(userRef);
            return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },

    /**
     * Updates user progress.
     */
    async updateUserProgress(userId: string, xp: number, level: number): Promise<void> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, { xp, level });
        } catch (error) {
            console.error('Error updating user progress:', error);
            throw error;
        }
    },

    /**
     * Updates premium status.
     */
    async setPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, { isPremium });
        } catch (error) {
            console.error('Error updating premium status:', error);
            throw error;
        }
    },

    /**
     * Deletes all user data from Firestore.
     */
    async deleteUserData(userId: string): Promise<void> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await deleteDoc(userRef);
        } catch (error) {
            console.error('Error deleting user data:', error);
            throw error;
        }
    }
};
