import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../constants';

const MOODS_KEY = '@moodify_moods';

interface MoodContextType {
  moods: MoodEntry[];
  refreshMoods: () => Promise<void>;
  addMood: (mood: MoodEntry) => Promise<void>;
  updateMood: (mood: MoodEntry) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const data = await AsyncStorage.getItem(MOODS_KEY);
      if (data) {
        setMoods(JSON.parse(data));
      }
    } catch (error) {
      console.log('Error loading moods:', error);
    }
  };

  const saveMoods = async (newMoods: MoodEntry[]) => {
    setMoods(newMoods);
    await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(newMoods));
  };

  const refreshMoods = async () => {
    await loadMoods();
  };

  const addMood = async (mood: MoodEntry) => {
    const newMoods = [mood, ...moods];
    await saveMoods(newMoods);
  };

  const updateMood = async (mood: MoodEntry) => {
    const newMoods = moods.map(m => m.id === mood.id ? mood : m);
    await saveMoods(newMoods);
  };

  const deleteMood = async (id: string) => {
    const newMoods = moods.filter(m => m.id !== id);
    await saveMoods(newMoods);
  };

  return (
    <MoodContext.Provider value={{ moods, refreshMoods, addMood, updateMood, deleteMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMoods() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMoods must be used within MoodProvider');
  }
  return context;
}
