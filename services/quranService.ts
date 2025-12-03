
import { API_BASE_URL } from '../constants';
import { Surah, Ayah } from '../types';

export const fetchChapters = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters`);
    if (!response.ok) throw new Error('Failed to fetch chapters');
    const data = await response.json();
    return data.chapters || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchVerses = async (chapterId: number): Promise<Ayah[]> => {
  try {
    // Added page_number to fields to support pagination
    const response = await fetch(
      `${API_BASE_URL}/verses/by_chapter/${chapterId}?language=en&words=false&translations=131&fields=text_uthmani,page_number&per_page=300`
    );
    if (!response.ok) throw new Error('Failed to fetch verses');
    const data = await response.json();
    return data.verses || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
