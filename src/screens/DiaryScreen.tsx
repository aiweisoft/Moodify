import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useMoods } from '../context/MoodContext';
import { COLORS, MOOD_OPTIONS, MoodEntry } from '../constants';

export default function DiaryScreen() {
  const { auth } = useAuth();
  const { moods, addMood, updateMood, deleteMood } = useMoods();
  const [selectedMood, setSelectedMood] = useState<typeof MOOD_OPTIONS[number] | null>(null);
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [viewingMood, setViewingMood] = useState<MoodEntry | null>(null);

  const userId = auth.user?.id || 'guest';
  const today = new Date().toISOString().split('T')[0];
  const todayMood = moods.find(m => m.date === today && m.userId === userId);
  const userMoods = moods.filter(m => m.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [error, setError] = useState('');

  useEffect(() => {
    if (todayMood) {
      const moodOption = MOOD_OPTIONS.find(m => m.label === todayMood.label);
      setSelectedMood(moodOption || null);
      setNote(todayMood.note || '');
    } else {
      setSelectedMood(null);
      setNote('');
    }
  }, [moods, todayMood]);

  const handleSave = async () => {
    setError('');
    if (!selectedMood) {
      setError('请选择今天的心情');
      return;
    }

    const newMood: MoodEntry = {
      id: todayMood ? todayMood.id : Date.now().toString(),
      date: today,
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      note: note.trim(),
      timestamp: Date.now(),
      userId,
    };

    if (todayMood) {
      await updateMood(newMood);
    } else {
      await addMood(newMood);
    }
    setError(todayMood ? '更新成功' : '保存成功');
  };

  const handleDelete = async () => {
    if (todayMood) {
      await deleteMood(todayMood.id);
      setSelectedMood(null);
      setNote('');
    }
  };

  const handleViewHistory = (mood: MoodEntry) => setViewingMood(mood);

  const handleCloseView = async () => {
    if (viewingMood) {
      await deleteMood(viewingMood.id);
    }
    setViewingMood(null);
    setShowHistory(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === today.toISOString().split('T')[0]) return '今天';
    if (dateStr === yesterday.toISOString().split('T')[0]) return '昨天';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>心情日记</Text>
          <Text style={styles.subtitle}>记录今天的心情</Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>今天感觉怎么样？</Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity key={mood.label} style={[styles.moodOption, selectedMood?.label === mood.label && { backgroundColor: mood.color + '20', borderColor: mood.color }]} onPress={() => { setSelectedMood(mood); setError(''); }}>
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood?.label === mood.label && { color: mood.color }]}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>写下今天的故事</Text>
          <TextInput style={styles.noteInput} placeholder="记录今天让你感受深刻的事情..." placeholderTextColor={COLORS.textSecondary} multiline value={note} onChangeText={(text) => { setNote(text); setError(''); }} textAlignVertical="top" />

          {error ? <View style={[styles.errorContainer, error.includes('成功') ? styles.successContainer : null]}><Text style={[styles.errorText, error.includes('成功') ? styles.successText : null]}>{error}</Text></View> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{todayMood ? '更新记录' : '保存'}</Text>
          </TouchableOpacity>

          {todayMood && <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}><Text style={styles.deleteButtonText}>删除今天记录</Text></TouchableOpacity>}
        </View>

        <TouchableOpacity style={styles.historyHeader} onPress={() => setShowHistory(!showHistory)}>
          <Text style={styles.historyTitle}>历史记录</Text>
          <Text style={styles.historyToggle}>{showHistory ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {showHistory && (
          <View style={styles.historyList}>
            {userMoods.filter(m => m.date !== today).length > 0 ? (
              userMoods.filter(m => m.date !== today).map((mood) => (
                <TouchableOpacity key={mood.id} style={styles.historyItem} onPress={() => handleViewHistory(mood)}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyEmoji}>{mood.emoji}</Text>
                    <View><Text style={styles.historyDate}>{formatDate(mood.date)}</Text><Text style={styles.historyMood}>{mood.label}</Text></View>
                  </View>
                  {mood.note ? <Text style={styles.historyNote} numberOfLines={2}>{mood.note}</Text> : null}
                  <Text style={styles.viewHint}>点击查看</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyHistory}><Text style={styles.emptyHistoryText}>还没有历史记录</Text></View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  header: { padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
  inputCard: { margin: 16, marginTop: 0, padding: 20, backgroundColor: COLORS.card, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12, marginTop: 8 },
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  moodOption: { alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', backgroundColor: COLORS.background, flex: 1, marginHorizontal: 4 },
  moodEmoji: { fontSize: 32, marginBottom: 4 },
  moodLabel: { fontSize: 12, color: COLORS.textSecondary },
  noteInput: { backgroundColor: COLORS.background, borderRadius: 12, padding: 16, fontSize: 16, minHeight: 100, color: COLORS.textPrimary, marginBottom: 16 },
  saveButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButton: { backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, alignItems: 'center' },
  deleteButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  historyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  historyToggle: { fontSize: 14, color: COLORS.textSecondary },
  historyList: { padding: 16, paddingTop: 0 },
  historyItem: { backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyLeft: { flexDirection: 'row', alignItems: 'center' },
  historyEmoji: { fontSize: 32, marginRight: 12 },
  historyDate: { fontSize: 14, color: COLORS.textSecondary },
  historyMood: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  historyNote: { flex: 1, fontSize: 14, color: COLORS.textSecondary, marginLeft: 12, textAlign: 'right' },
  viewHint: { fontSize: 12, color: COLORS.primary, marginLeft: 8 },
  emptyHistory: { padding: 40, alignItems: 'center' },
  emptyHistoryText: { fontSize: 16, color: COLORS.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.card, borderRadius: 24, padding: 32, width: '100%', alignItems: 'center' },
  modalEmoji: { fontSize: 64, marginBottom: 16 },
  modalMood: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  modalDate: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 16 },
  modalNote: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 24, textAlign: 'center', marginBottom: 24 },
  noNoteText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  closeButton: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 12 },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center' },
  successContainer: { backgroundColor: '#DCFCE7' },
  successText: { color: '#22C55E' },
});
