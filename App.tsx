import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Alert } from 'expo-status-bar';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
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

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <NavigationContainer ref={navigationRef}>
        <AppContent navigationRef={navigationRef} />
      </NavigationContainer>
    </AppProvider>
  );
}

function AppContent({ navigationRef }: { navigationRef: React.RefObject<NavigationContainerRef<any>> }) {
  const { state, logout } = useApp();
  const [ready, setReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

  useEffect(() => {
    if (ready) {
      if (!state.currentUser && !showAuth) {
        setShowAuth(true);
      } else if (state.currentUser && showAuth) {
        setShowAuth(false);
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    }
  }, [state.currentUser, ready]);

  useEffect(() => {
    if (ready && !state.currentUser) {
      setShowAuth(true);
    }
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text style={styles.logo}>Moodify</Text>
      </View>
    );
  }

  if (!state.currentUser) {
    return (
      <View style={styles.container} key="auth-view">
        <AuthScreen onAuthSuccess={() => {}} />
      </View>
    );
  }

  return (
    <View style={styles.container} key="main-view">
      <MainNavigator />
    </View>
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
