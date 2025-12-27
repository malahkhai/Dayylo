
import { Habit } from './types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    type: 'build',
    icon: 'water_drop',
    color: '#93c5fd',
    streak: 5,
    completedToday: false,
    private: false,
    frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    reminderTime: '08:00',
    currentValue: 2,
    targetValue: 8,
    unit: 'Times'
  },
  {
    id: '2',
    name: 'No Sugar',
    type: 'break',
    icon: 'block',
    color: '#fdba74',
    streak: 12,
    completedToday: true,
    private: true,
    frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },
  {
    id: '3',
    name: 'Meditate',
    type: 'build',
    icon: 'self_improvement',
    color: '#30e8ab',
    streak: 24,
    completedToday: true,
    private: false,
    frequency: ['M', 'W', 'F'],
    unit: 'min',
    targetValue: 15,
    currentValue: 15
  },
  {
    id: '4',
    name: 'Read a book',
    type: 'build',
    icon: 'menu_book',
    color: '#c084fc',
    streak: 24,
    completedToday: false,
    private: false,
    frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    currentValue: 5,
    targetValue: 20,
    unit: 'Pages'
  },
  {
    id: '5',
    name: 'Exercise',
    type: 'build',
    icon: 'fitness_center',
    color: '#4ade80',
    streak: 24,
    completedToday: true,
    private: false,
    frequency: ['M', 'W', 'F'],
    unit: 'min',
    targetValue: 30,
    currentValue: 30
  }
];

export const CATEGORIES = {
  health: ['water_drop', 'fitness_center', 'directions_run', 'spa', 'fastfood', 'coffee'],
  mindfulness: ['self_improvement', 'psychology', 'bedtime', 'history_edu'],
  productivity: ['menu_book', 'edit_note', 'check_circle', 'schedule'],
};
