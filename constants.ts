import { Habit } from './types';

// helper: build last N days of simulated history
const buildHistory = (daysBack: number, pctSuccess: number): Record<string, boolean> => {
    const history: Record<string, boolean> = {};
    for (let i = daysBack; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        history[key] = Math.random() < pctSuccess;
    }
    return history;
};

export const INITIAL_HABITS: Habit[] = [
    {
        id: '1',
        name: 'Drink Water',
        type: 'build',
        icon: 'Droplet',
        color: '#3b82f6',
        streak: 5,
        longestStreak: 10,
        completedToday: false,
        trackedToday: false,
        isPrivate: false,
        frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        difficulty: 'easy',
        reminderTime: '08:00',
        currentValue: 2,
        targetValue: 8,
        unit: 'glasses',
        history: buildHistory(30, 0.8),
    },
    {
        id: '2',
        name: 'No Sugar',
        type: 'break',
        icon: 'Ban',
        color: '#f97316',
        streak: 12,
        longestStreak: 15,
        completedToday: false,
        trackedToday: false,
        isPrivate: true,
        difficulty: 'hard',
        frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        history: buildHistory(30, 0.6),
    },
    {
        id: '3',
        name: 'Meditate',
        type: 'build',
        icon: 'Leaf',
        color: '#30e8ab',
        streak: 24,
        longestStreak: 30,
        completedToday: false,
        trackedToday: false,
        isPrivate: false,
        difficulty: 'medium',
        frequency: ['M', 'W', 'F'],
        unit: 'min',
        targetValue: 15,
        currentValue: 0,
        history: buildHistory(30, 0.9),
    },
    {
        id: '4',
        name: 'Read a Book',
        type: 'build',
        icon: 'BookOpen',
        color: '#a855f7',
        streak: 8,
        longestStreak: 25,
        completedToday: false,
        trackedToday: false,
        isPrivate: false,
        difficulty: 'easy',
        frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        currentValue: 0,
        targetValue: 20,
        unit: 'pages',
        history: buildHistory(30, 0.7),
    },
    {
        id: '5',
        name: 'Exercise',
        type: 'build',
        icon: 'Dumbbell',
        color: '#22c55e',
        streak: 14,
        longestStreak: 28,
        completedToday: false,
        trackedToday: false,
        isPrivate: false,
        difficulty: 'hard',
        frequency: ['M', 'W', 'F'],
        unit: 'min',
        targetValue: 30,
        currentValue: 0,
        history: buildHistory(30, 0.75),
    }
];
