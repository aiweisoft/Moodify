export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  emoji: string;
  label: string;
  note: string;
  timestamp: number;
  userId: string;
}

export interface Post {
  id: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: number;
  liked: boolean;
  userId: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  moods: MoodEntry[];
  posts: Post[];
}

export type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'REGISTER'; payload: User }
  | { type: 'ADD_MOOD'; payload: MoodEntry }
  | { type: 'SET_MOODS'; payload: MoodEntry[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'TOGGLE_LIKE'; payload: string }
  | { type: 'LOAD_USERS'; payload: User[] };

export const MOOD_OPTIONS = [
  { emoji: '😢', label: '难过', color: '#EF4444', value: 1 },
  { emoji: '😔', label: '低落', color: '#F97316', value: 2 },
  { emoji: '😐', label: '一般', color: '#EAB308', value: 3 },
  { emoji: '🙂', label: '愉快', color: '#22C55E', value: 4 },
  { emoji: '😄', label: '开心', color: '#10B981', value: 5 },
] as const;

export const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
};
