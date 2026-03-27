import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, Alert } from 'expo-status-bar';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider, useApp } from './src/context/AppContext';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import { COLORS } from './src/constants';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { state } = useApp();
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      setVersion(v => v + 1);
    }
  }, [state.currentUser, ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text style={styles.logo}>Moodify</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {version > 0 && !state.currentUser ? (
        <AuthScreen key="auth-screen" onAuthSuccess={() => {}} />
      ) : version > 0 && state.currentUser ? (
        <MainNavigator key={`nav-${state.currentUser.id}`} />
      ) : null}
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
