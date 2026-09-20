// ============================================================
// GameHub — Friends Screen
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { fetchFriendsApi, sendFriendRequestApi, FriendUser } from '@/services/api/friends-service';

export default function FriendsScreen() {
  const [friendsList, setFriendsList] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFriendsApi();
      if (res.success && res.data) {
        setFriendsList(res.data.friends || []);
      }
    } catch (err) {
      // Offline fallback or silent ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleAddFriend = async () => {
    if (!searchUsername.trim()) return;
    setAdding(true);
    try {
      const res = await sendFriendRequestApi(searchUsername.trim());
      if (res.success) {
        Alert.alert('Success', `Friend request sent to ${searchUsername.trim()}`);
        setSearchUsername('');
      } else {
        Alert.alert('Failed', res.message || 'Could not send friend request');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Play together & compete on leaderboards</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter username to add..."
          placeholderTextColor={Colors.textMuted}
          value={searchUsername}
          onChangeText={setSearchUsername}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.addButton, (!searchUsername.trim() || adding) && styles.disabledButton]}
          onPress={handleAddFriend}
          disabled={!searchUsername.trim() || adding}
        >
          {adding ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      ) : (
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.displayName || item.username}</Text>
                <Text style={styles.friendMeta}>Level {item.level || 1} • @{item.username}</Text>
              </View>
              <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeText}>Play</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No Friends Yet</Text>
              <Text style={styles.emptyText}>Add friends by username above to start competing!</Text>
            </View>
          }
          onRefresh={loadFriends}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: Typography.body,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.5 },
  addButtonText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.body },
  listContainer: { padding: Spacing.md, gap: Spacing.sm },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: { color: '#FFFFFF', fontSize: Typography.h3, fontWeight: Typography.bold },
  friendInfo: { flex: 1 },
  friendName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  friendMeta: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 2 },
  challengeButton: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  challengeText: { color: Colors.primaryLight, fontWeight: Typography.bold, fontSize: Typography.bodySmall },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textMuted, marginTop: Spacing.sm },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.sm },
  emptyTitle: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 20 },
});
