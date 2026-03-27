import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../constants';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  users: User[];
}

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => { success: boolean; message: string };
  register: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@moodify_auth';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  users: [],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setAuth({
          user: parsed.user || null,
          users: parsed.users || [],
          isLoading: false,
        });
      } else {
        setAuth({ ...initialState, isLoading: false });
      }
    } catch (error) {
      console.log('Error loading auth:', error);
      setAuth({ ...initialState, isLoading: false });
    }
  };

  const handleLogout = () => {
    const newAuth = { ...auth, user: null };
    setAuth(newAuth);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: null,
      users: auth.users,
    })).catch(e => console.log('Error saving auth:', e));
  };

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const user = auth.users.find(u => u.username === username && u.password === password);
    if (user) {
      const newAuth = { ...auth, user };
      setAuth(newAuth);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        user,
        users: auth.users,
      })).catch(e => console.log('Error saving auth:', e));
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
    if (auth.users.some(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      password,
      createdAt: Date.now(),
    };
    const newAuth = {
      user: newUser,
      users: [...auth.users, newUser],
    };
    setAuth(newAuth);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: newUser,
      users: newAuth.users,
    })).catch(e => console.log('Error saving auth:', e));
    return { success: true, message: '注册成功' };
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
