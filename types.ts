
export interface Surah {
  id: number;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  revelation_order: number;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface Ayah {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: {
    resource_id: number;
    text: string;
  }[];
}

export type ChallengeType = 'quran' | 'duco' | 'habit';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  createdAt: string; // ISO Date
  startDate: string; // ISO Date
  
  // For Quran/Habit: Defined duration. For Duco: 0 or null (Infinite)
  durationDays: number; 
  
  // Tracks which "Day" the user is on (0 = Day 1, 1 = Day 2).
  // Not used for Duco (which is date-based).
  currentDayIndex: number; 
  
  completed: boolean;
  
  // Quran Specific
  quranConfig?: {
    mode: 'whole' | 'surah';
    surahId?: number;
    surahName?: string;
    totalUnits: number; // Pages or Ayahs
    unitType?: 'pages' | 'ayahs';
    unitsCompleted: number;
  };

  // Duco Specific
  duaConfig?: {
    targetCountPerDay: number; // Optional goal
    text: string;
    totalLifetimeCount: number; // Persistent counter
  };

  // Habit Specific
  habitConfig?: {
    habits: string[]; // List of habit names e.g. ["Pray Fajr", "Read Book"]
  };

  // Progress Logs
  // Key = "YYYY-MM-DD" (Standardized for History) OR "DayIndex" (Legacy/Sequence)
  // Value: Number (Quran/Duco) or Array of completed habit indices (Habit)
  logs: Record<string, number | number[]>; 
}

export interface Bookmark {
  verse_key: string;
  surah_id: number;
  surah_name: string;
  ayah_number: number;
  text_uthmani: string;
  timestamp: number;
}

export interface UserProgress {
  lastReadSurahId: number | null;
  lastReadAyahNumber: number | null;
  bookmarks: Bookmark[]; // Changed from string[] to Bookmark object
  theme: 'light' | 'dark';
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  completedDates: string[];
  targetDays: number[];
  streak: number;
  color: string;
}