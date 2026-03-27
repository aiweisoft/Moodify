import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider } from './src/context/AppContext';
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

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
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
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: '首页',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="🏠" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Diary"
            component={DiaryScreen}
            options={{
              tabBarLabel: '日记',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="📝" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="Community"
            component={CommunityScreen}
            options={{
              tabBarLabel: '社区',
              tabBarIcon: ({ focused }) => (
                <TabIcon emoji="💬" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
