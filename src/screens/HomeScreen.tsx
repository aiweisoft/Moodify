import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, MOOD_OPTIONS } from '../constants';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { getTodayMood, getWeekMoods, state } = useApp();
  const todayMood = getTodayMood();
  const weekMoods = getWeekMoods();

  const getMoodEmoji = (label: string) => {
    const mood = MOOD_OPTIONS.find(m => m.label === label);
    return mood?.emoji || '😐';
  };

  const getMoodColor = (label: string) => {
    const mood = MOOD_OPTIONS.find(m => m.label === label);
    return mood?.color || COLORS.textSecondary;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.subtitle}>今天心情怎么样？</Text>
      </View>

      <View style={styles.todayCard}>
        <Text style={styles.cardTitle}>今日心情</Text>
        {todayMood ? (
          <View style={styles.todayMoodRow}>
            <Text style={styles.todayEmoji}>{getMoodEmoji(todayMood.label)}</Text>
            <View style={styles.todayInfo}>
              <Text style={[styles.todayLabel, { color: getMoodColor(todayMood.label) }]}>
                {todayMood.label}
              </Text>
              {todayMood.note ? (
                <Text style={styles.todayNote} numberOfLines={2}>
                  {todayMood.note}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤔</Text>
            <Text style={styles.emptyText}>还没有记录今天的心情</Text>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => navigation.navigate('Diary')}
            >
              <Text style={styles.recordButtonText}>立即记录</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.weekCard}>
        <Text style={styles.cardTitle}>最近7天</Text>
        {weekMoods.length > 0 ? (
          <View style={styles.weekChart}>
            {[...Array(7)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dateStr = date.toISOString().split('T')[0];
              const mood = state.moods.find(m => m.date === dateStr);
              const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
              
              return (
                <View key={index} style={styles.dayColumn}>
                  <View style={styles.dayBar}>
                    {mood ? (
                      <Text style={styles.dayEmoji}>{getMoodEmoji(mood.label)}</Text>
                    ) : (
                      <Text style={styles.dayEmpty}>-</Text>
                    )}
                  </View>
                  <Text style={styles.dayLabel}>{dayNames[date.getDay()]}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>记录你的心情来看看趋势吧</Text>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Diary')}
        >
          <Text style={styles.actionEmoji}>📝</Text>
          <Text style={styles.actionText}>写日记</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Community')}
        >
          <Text style={styles.actionEmoji}>💬</Text>
          <Text style={styles.actionText}>倾诉</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  todayCard: {
    margin: 16,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  todayMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  todayInfo: {
    flex: 1,
  },
  todayLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  todayNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  weekCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayBar: {
    width: 36,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayEmoji: {
    fontSize: 24,
  },
  dayEmpty: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  dayLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
