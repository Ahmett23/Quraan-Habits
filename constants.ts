import { Habit } from './types';

export const API_BASE_URL = 'https://api.quran.com/api/v4';

export const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Daily Salah',
    description: 'Pray 5 times a day',
    icon: '🕌',
    completedDates: [],
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    color: 'bg-digri-100 text-digri-600',
  },
  {
    id: '2',
    title: 'Read Quran',
    description: 'At least 1 page',
    icon: '📖',
    completedDates: [],
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    color: 'bg-digri-100 text-digri-600',
  },
  {
    id: '3',
    title: 'Morning Adhkar',
    description: 'Start day with remembrance',
    icon: '☀️',
    completedDates: [],
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    color: 'bg-digri-100 text-digri-600',
  }
];

export const TOTAL_QURAN_PAGES = 604;