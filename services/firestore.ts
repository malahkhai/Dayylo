import firestore from '@react-native-firebase/firestore';
import { Habit } from '../types';

const USERS_COLLECTION = 'users';

export const FirestoreService = {
    /**
     * Syncs habits to Firestore for the given user.
     */
    async saveHabits(userId: string, habits: Habit[]): Promise<void> {
        try {
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .set({ habits }, { merge: true });
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
            const doc = await firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },

    /**
     * Updates user XP and Level.
     */
    async updateUserProgress(userId: string, xp: number, level: number): Promise<void> {
        try {
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .update({ xp, level });
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
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .update({ isPremium });
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
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(userId)
                .delete();
        } catch (error) {
            console.error('Error deleting user data:', error);
            throw error;
        }
    }
};
