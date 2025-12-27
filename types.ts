
export type HabitType = 'build' | 'break';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  icon: string;
  color: string;
  streak: number;
  completedToday: boolean;
  private: boolean;
  frequency: string[]; // ['M', 'T', ...]
  reminderTime?: string;
  description?: string;
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  isUnlocked: boolean;
  onboardingStep: number;
}
