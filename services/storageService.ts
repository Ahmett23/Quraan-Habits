import { supabase } from '../lib/supabase';
import { Challenge, UserProgress } from '../types';

const KEYS = {
  CHALLENGES: 'qh_challenges_v6',
  PROGRESS: 'qh_progress_v6',
};

// --- DEFAULT STATE ---
const defaultProgress: UserProgress = {
  lastReadSurahId: null,
  lastReadAyahNumber: null,
  bookmarks: [],
  theme: 'light'
};

// --- HELPER: CHECK AUTH ---
const getUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// --- API ---

export const fetchChallenges = async (): Promise<Challenge[]> => {
  const user = await getUser();
  
  if (user) {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('user_challenges')
      .select('data')
      .eq('user_id', user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching challenges:', error);
    }
    
    if (data?.data) {
        // Update local storage to keep sync
        localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(data.data));
        return data.data as Challenge[];
    }
  }

  // Fallback to LocalStorage (Guest or Offline first load)
  const stored = localStorage.getItem(KEYS.CHALLENGES);
  try {
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const persistChallenges = async (challenges: Challenge[]) => {
  // Update Local
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));

  // Update Remote
  const user = await getUser();
  if (user) {
    const { error } = await supabase
      .from('user_challenges')
      .upsert({ user_id: user.id, data: challenges, updated_at: new Date().toISOString() });
      
    if (error) console.error('Error saving challenges:', error);
  }
};

export const fetchUserProgress = async (): Promise<UserProgress> => {
  const user = await getUser();

  if (user) {
     const { data, error } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', user.id)
      .single();

     if (data?.data) {
         localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data.data));
         return data.data as UserProgress;
     }
  }

  const stored = localStorage.getItem(KEYS.PROGRESS);
  try {
    const parsed = stored ? JSON.parse(stored) : defaultProgress;
    // Migration check for bookmarks
    if (parsed.bookmarks && parsed.bookmarks.length > 0) {
      if (typeof parsed.bookmarks[0] === 'string') {
        parsed.bookmarks = []; 
      }
    }
    return parsed;
  } catch (e) {
     return defaultProgress;
  }
};

export const persistUserProgress = async (progress: UserProgress) => {
  // Update Local
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));

  // Update Remote
  const user = await getUser();
  if (user) {
     const { error } = await supabase
      .from('user_progress')
      .upsert({ user_id: user.id, data: progress, updated_at: new Date().toISOString() });

     if (error) console.error('Error saving progress:', error);
  }
};