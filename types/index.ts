export type HabitType = 'build' | 'break';

export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    icon: string;
    color: string;
    streak: number;
    longestStreak: number;
    completedToday: boolean;
    isPrivate: boolean;
    frequency: string[];
    reminderTime?: string;
    description?: string;
    currentValue?: number;
    targetValue?: number;
    unit?: string;
}

export interface User {
    name: string;
    email: string;
    isLoggedIn: boolean;
    isUnlocked: boolean;
    onboardingStep: number;
    joinDate?: string;
}
