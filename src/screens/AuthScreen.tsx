import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('错误', '两次密码输入不一致');
      return;
    }

    const result = isLogin ? login(username, password) : register(username, password);

    if (!result.success) {
      Alert.alert('错误', result.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>Moodify</Text>
          <Text style={styles.tagline}>记录心情，倾诉心声</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>{isLogin ? '登录' : '注册'}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>用户名</Text>
            <TextInput style={styles.input} placeholder="请输入用户名" placeholderTextColor={COLORS.textSecondary} value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>密码</Text>
            <TextInput style={styles.input} placeholder="请输入密码" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>确认密码</Text>
              <TextInput style={styles.input} placeholder="请再次输入密码" placeholderTextColor={COLORS.textSecondary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{isLogin ? '登录' : '注册'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={() => { setIsLogin(!isLogin); setUsername(''); setPassword(''); setConfirmPassword(''); }}>
            <Text style={styles.switchText}>{isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  tagline: { fontSize: 16, color: COLORS.textSecondary },
  form: { backgroundColor: COLORS.card, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 24, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.textPrimary },
  submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchButton: { marginTop: 16, alignItems: 'center' },
  switchText: { color: COLORS.primary, fontSize: 14 },
});
