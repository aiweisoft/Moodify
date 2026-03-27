import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppAction, MoodEntry, Post, User } from '../constants';

const initialState: AppState = {
  currentUser: null,
  users: [],
  moods: [],
  posts: [
    {
      id: '1',
      content: '今天感觉有点低落，想找人说说话...',
      likes: 12,
      comments: 3,
      createdAt: Date.now() - 86400000,
      liked: false,
      userId: 'guest',
    },
    {
      id: '2',
      content: '刚刚完成了一个小目标，给自己点个赞！',
      likes: 25,
      comments: 8,
      createdAt: Date.now() - 172800000,
      liked: false,
      userId: 'guest',
    },
    {
      id: '3',
      content: '有人和我一样失眠吗？最近总是睡不好',
      likes: 18,
      comments: 12,
      createdAt: Date.now() - 259200000,
      liked: false,
      userId: 'guest',
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'REGISTER':
      return { ...state, users: [...state.users, action.payload] };
    case 'LOAD_USERS':
      return { ...state, users: action.payload };
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
  login: (username: string, password: string) => { success: boolean; message: string };
  register: (username: string, password: string) => { success: boolean; message: string };
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@moodify_data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (state.currentUser) {
      saveData();
    }
  }, [state.currentUser, state.moods, state.users]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.users) {
          dispatch({ type: 'LOAD_USERS', payload: parsed.users });
        }
        if (parsed.currentUser) {
          dispatch({ type: 'SET_CURRENT_USER', payload: parsed.currentUser });
        }
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
        JSON.stringify({
          users: state.users,
          currentUser: state.currentUser,
          moods: state.currentUser ? state.moods : [],
        })
      );
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const user = state.users.find(
      u => u.username === username && u.password === password
    );
    if (user) {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      return { success: true, message: '登录成功' };
    }
    return { success: false, message: '用户名或密码错误' };
  };

  const register = (username: string, password: string): { success: boolean; message: string } => {
    if (!username.trim() || !password.trim()) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    if (username.length < 2 || username.length > 20) {
      return { success: false, message: '用户名需要2-20个字符' };
    }
    if (password.length < 4) {
      return { success: false, message: '密码至少需要4个字符' };
    }
    if (state.users.some(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      password,
      createdAt: Date.now(),
    };
    dispatch({ type: 'REGISTER', payload: newUser });
    dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
    return { success: true, message: '注册成功' };
  };

  const logout = async () => {
    console.log('logout called, current user:', state.currentUser?.username);
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_MOODS', payload: [] });
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users: state.users,
          currentUser: null,
          moods: state.moods,
        })
      );
    } catch (error) {
      console.log('Error saving on logout:', error);
    }
    console.log('logout done, current user now:', state.currentUser);
  };

  const getTodayMood = (): MoodEntry | undefined => {
    if (!state.currentUser) return undefined;
    const today = new Date().toISOString().split('T')[0];
    return state.moods.find(
      mood => mood.date === today && mood.userId === state.currentUser?.id
    );
  };

  const getWeekMoods = (): MoodEntry[] => {
    if (!state.currentUser) return [];
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return state.moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      return mood.userId === state.currentUser?.id &&
             moodDate >= weekAgo && moodDate <= today;
    });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      getTodayMood, 
      getWeekMoods,
      login,
      register,
      logout,
    }}>
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
