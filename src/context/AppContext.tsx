import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppAction, MoodEntry, Post } from '../constants';

const initialState: AppState = {
  moods: [],
  posts: [
    {
      id: '1',
      content: '今天感觉有点低落，想找人说说话...',
      likes: 12,
      comments: 3,
      createdAt: Date.now() - 86400000,
      liked: false,
    },
    {
      id: '2',
      content: '刚刚完成了一个小目标，给自己点个赞！',
      likes: 25,
      comments: 8,
      createdAt: Date.now() - 172800000,
      liked: false,
    },
    {
      id: '3',
      content: '有人和我一样失眠吗？最近总是睡不好',
      likes: 18,
      comments: 12,
      createdAt: Date.now() - 259200000,
      liked: false,
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_MOOD':
      return { ...state, moods: [action.payload, ...state.moods] };
    case 'SET_MOODS':
      return { ...state, moods: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post
        ),
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getTodayMood: () => MoodEntry | undefined;
  getWeekMoods: () => MoodEntry[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@moodify_data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [state.moods]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.moods) {
          dispatch({ type: 'SET_MOODS', payload: parsed.moods });
        }
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ moods: state.moods })
      );
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const getTodayMood = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return state.moods.find((mood) => mood.date === today);
  };

  const getWeekMoods = (): MoodEntry[] => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return state.moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      return moodDate >= weekAgo && moodDate <= today;
    });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getTodayMood, getWeekMoods }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
