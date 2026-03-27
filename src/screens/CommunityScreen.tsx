import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, Post } from '../constants';

export default function CommunityScreen() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) {
      Alert.alert('内容不能为空', '请写下你想说的话');
      return;
    }

    const userId = state.currentUser?.id || 'guest';
    const post: Post = {
      id: Date.now().toString(),
      content: newPost.trim(),
      likes: 0,
      comments: 0,
      createdAt: Date.now(),
      liked: false,
      userId,
    };

    dispatch({ type: 'ADD_POST', payload: post });
    setNewPost('');
    setShowModal(false);
    Alert.alert('发布成功', '你的心情已被分享');
  };

  const handleLike = (postId: string) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: postId });
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  const avatars = ['😔', '😊', '🤔', '😌', '🥰', '😎', '🌟', '💪'];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>倾诉社区</Text>
          <Text style={styles.subtitle}>匿名分享你的心情</Text>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsText}>💡 匿名分享，无需担忧</Text>
        </View>

        <View style={styles.postList}>
          {state.posts
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((post, index) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatars[index % avatars.length]}</Text>
                  </View>
                  <View>
                    <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
                    <Text style={styles.postAuthor}>匿名用户</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLike(post.id)}
                  >
                    <Text style={[styles.actionEmoji, post.liked && styles.liked]}>
                      {post.liked ? '❤️' : '🤍'}
                    </Text>
                    <Text style={[styles.actionCount, post.liked && styles.liked]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      Alert.alert('评论功能', '评论功能开发中...');
                    }}
                  >
                    <Text style={styles.actionEmoji}>💬</Text>
                    <Text style={styles.actionCount}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>分享心情</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.anonymousNotice}>
              🎭 你的发言将是匿名的
            </Text>
            <TextInput
              style={styles.postInput}
              placeholder="写下你的心情、烦恼或想说的话..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              value={newPost}
              onChangeText={setNewPost}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handlePost}>
              <Text style={styles.submitBtnText}>发布</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tips: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 8,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  postList: {
    padding: 16,
    paddingTop: 0,
  },
  postCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  postContent: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  actionCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  liked: {
    color: '#EF4444',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  anonymousNotice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  postInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
