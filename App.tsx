import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { MoodProvider } from './src/context/MoodContext';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import { COLORS } from './src/constants';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { backgroundColor: COLORS.card, borderTopWidth: 0, elevation: 8, height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '首页', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ tabBarLabel: '日记', tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} /> }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: '社区', tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </MoodProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { auth } = useAuth();
  const isLoggedIn = useRef(auth.user !== null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (auth.isLoading) {
      setShowLogin(true);
    } else {
      isLoggedIn.current = auth.user !== null;
      setShowLogin(!isLoggedIn.current);
    }
  }, [auth.user, auth.isLoading]);

  if (auth.isLoading) {
    return <View style={styles.loading}><Text style={styles.logo}>Moodify</Text></View>;
  }

  if (showLogin || !auth.user) {
    return <AuthScreen />;
  }

  return <MainNavigator />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary },
});
