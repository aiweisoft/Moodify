import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    const result = isLogin ? login(username, password) : register(username, password);

    if (!result.success) {
      setError(result.message);
    }
  };

  const clearError = () => setError('');

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
            <TextInput 
              style={[styles.input, error && (error.includes('用户名') || error.includes('请')) ? styles.inputError : null]} 
              placeholder="请输入用户名" 
              placeholderTextColor={COLORS.textSecondary} 
              value={username} 
              onChangeText={(text) => { setUsername(text); clearError(); }} 
              autoCapitalize="none" 
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>密码</Text>
            <TextInput 
              style={[styles.input, error && error.includes('密码') ? styles.inputError : null]} 
              placeholder="请输入密码" 
              placeholderTextColor={COLORS.textSecondary} 
              value={password} 
              onChangeText={(text) => { setPassword(text); clearError(); }} 
              secureTextEntry 
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>确认密码</Text>
              <TextInput 
                style={[styles.input, error && error.includes('不一致') ? styles.inputError : null]} 
                placeholder="请再次输入密码" 
                placeholderTextColor={COLORS.textSecondary} 
                value={confirmPassword} 
                onChangeText={(text) => { setConfirmPassword(text); clearError(); }} 
                secureTextEntry 
              />
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{isLogin ? '登录' : '注册'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={() => { setIsLogin(!isLogin); setUsername(''); setPassword(''); setConfirmPassword(''); setError(''); }}>
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
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: '#EF4444' },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center' },
  submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchButton: { marginTop: 16, alignItems: 'center' },
  switchText: { color: COLORS.primary, fontSize: 14 },
});
