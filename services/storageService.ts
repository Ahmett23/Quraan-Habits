
import { Challenge, UserProgress } from '../types';

const KEYS = {
  CHALLENGES: 'qh_challenges_v6', // Incremented to v6 for new Day Index logic
  PROGRESS: 'qh_progress_v6',
};

export const getChallenges = (): Challenge[] => {
  const stored = localStorage.getItem(KEYS.CHALLENGES);
  try {
    const parsed = stored ? JSON.parse(stored) : [];
    // Safety check: Ensure it is actually an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse challenges", e);
    return [];
  }
};

export const saveChallenges = (challenges: Challenge[]) => {
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
};

export const getUserProgress = (): UserProgress => {
  const stored = localStorage.getItem(KEYS.PROGRESS);
  const defaultProgress: UserProgress = {
    lastReadSurahId: null,
    lastReadAyahNumber: null,
    bookmarks: [],
    theme: 'light'
  };

  try {
    const parsed = stored ? JSON.parse(stored) : defaultProgress;
    
    // Safety check for bookmarks array (migration from string[] to Bookmark[])
    if (parsed.bookmarks && parsed.bookmarks.length > 0) {
      if (typeof parsed.bookmarks[0] === 'string') {
        parsed.bookmarks = []; // Clear old format bookmarks or you could attempt to migrate
      }
    }
    
    return parsed;
  } catch (e) {
     return defaultProgress;
  }
};

export const saveUserProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};