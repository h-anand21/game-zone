// ============================================================
// GameHub — Friends Screen (Offline-First + Online Sync)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  Alert, ScrollView, Pressable,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

// ── Types ────────────────────────────────────────────────────
interface FriendUser {
  id: string;
  username: string;
  displayName: string;
  avatarLetter: string;
  level: number;
  xp: number;
  status: 'online' | 'offline' | 'in-game';
  lastGame?: string;
  mutualGames: number;
}

interface FriendRequest {
  id: string;
  from: FriendUser;
  timestamp: string;
}

// ── Demo Data (Offline-First) ────────────────────────────────
const DEMO_FRIENDS: FriendUser[] = [
  { id: '1', username: 'RajGamer99', displayName: 'Raj Singh', avatarLetter: 'R', level: 12, xp: 5400, status: 'online', lastGame: 'Snake', mutualGames: 8 },
  { id: '2', username: 'ProSniper_X', displayName: 'Arjun K.', avatarLetter: 'A', level: 18, xp: 12000, status: 'in-game', lastGame: 'Free For All', mutualGames: 5 },
  { id: '3', username: 'ChessQueen', displayName: 'Priya M.', avatarLetter: 'P', level: 25, xp: 22000, status: 'offline', lastGame: 'Mini Chess', mutualGames: 12 },
  { id: '4', username: 'LudoKing_420', displayName: 'Vikram R.', avatarLetter: 'V', level: 8, xp: 3200, status: 'online', lastGame: 'Ludo', mutualGames: 6 },
  { id: '5', username: 'AimBot_Pro', displayName: 'Sahil D.', avatarLetter: 'S', level: 30, xp: 38000, status: 'in-game', lastGame: '1v1 Duel', mutualGames: 3 },
];

const DEMO_REQUESTS: FriendRequest[] = [
  { id: 'r1', from: { id: '10', username: 'NovicePlayer', displayName: 'Aman G.', avatarLetter: 'A', level: 3, xp: 600, status: 'online', mutualGames: 1 }, timestamp: '2 min ago' },
  { id: 'r2', from: { id: '11', username: 'QuizMaster_007', displayName: 'Neha S.', avatarLetter: 'N', level: 14, xp: 7800, status: 'offline', mutualGames: 4 }, timestamp: '1 hr ago' },
];

type Tab = 'friends' | 'requests' | 'find';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [friends, setFriends] = useState<FriendUser[]>(DEMO_FRIENDS);
  const [requests, setRequests] = useState<FriendRequest[]>(DEMO_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [findQuery, setFindQuery] = useState('');

  // Filtered friends based on search
  const filteredFriends = friends.filter((f) =>
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Accept friend request
  const handleAccept = useCallback((requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      setFriends((prev) => [...prev, req.from]);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      Alert.alert('✅ Friend Added!', `${req.from.displayName} is now your friend!`);
    }
  }, [requests]);

  // Reject friend request
  const handleReject = useCallback((requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  // Send friend request
  const handleSendRequest = useCallback(() => {
    if (!findQuery.trim()) return;
    Alert.alert('📤 Request Sent!', `Friend request sent to "${findQuery.trim()}".\nThey'll see it in their Requests tab.`);
    setFindQuery('');
  }, [findQuery]);

  // Challenge friend
  const handleChallenge = useCallback((friend: FriendUser) => {
    Alert.alert('🎮 Challenge Sent!', `You challenged ${friend.displayName} to a game!\nWaiting for them to accept...`);
  }, []);

  const getStatusColor = (status: FriendUser['status']) => {
    switch (status) {
      case 'online': return Colors.success;
      case 'in-game': return Colors.warning;
      case 'offline': return Colors.textMuted;
    }
  };

  const getStatusLabel = (status: FriendUser['status']) => {
    switch (status) {
      case 'online': return '🟢 Online';
      case 'in-game': return '🎮 In-Game';
      case 'offline': return '⚫ Offline';
    }
  };

  // ── Tab Navigation ─────────────────────────────────────────
  const renderTabs = () => (
    <View style={styles.tabRow}>
      {(['friends', 'requests', 'find'] as Tab[]).map((tab) => (
        <Pressable
          key={tab}
          style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab === 'friends' ? `👥 Friends (${friends.length})`
              : tab === 'requests' ? `📩 Requests (${requests.length})`
              : '🔍 Find Players'}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  // ── FRIENDS TAB ────────────────────────────────────────────
  const renderFriendsTab = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Online Stats */}
      <View style={styles.onlineStats}>
        <Text style={styles.onlineStatsText}>
          🟢 {friends.filter((f) => f.status === 'online').length} Online  •  
          🎮 {friends.filter((f) => f.status === 'in-game').length} In-Game  •  
          ⚫ {friends.filter((f) => f.status === 'offline').length} Offline
        </Text>
      </View>

      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.friendCard}>
            {/* Avatar */}
            <View style={[styles.avatarCircle, { borderColor: getStatusColor(item.status) }]}>
              <Text style={styles.avatarText}>{item.avatarLetter}</Text>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            </View>

            {/* Info */}
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{item.displayName}</Text>
              <Text style={styles.friendMeta}>
                @{item.username} • Lv.{item.level} • {item.xp.toLocaleString()} XP
              </Text>
              <Text style={styles.friendStatus}>
                {getStatusLabel(item.status)}
                {item.lastGame ? ` — ${item.lastGame}` : ''}
              </Text>
            </View>

            {/* Challenge Button */}
            <TouchableOpacity
              style={[
                styles.challengeBtn,
                item.status !== 'offline' && styles.challengeBtnActive,
              ]}
              onPress={() => handleChallenge(item)}
              disabled={item.status === 'offline'}
            >
              <Text style={[
                styles.challengeBtnText,
                item.status !== 'offline' && styles.challengeBtnTextActive,
              ]}>
                {item.status === 'offline' ? '💤' : '⚔️ Challenge'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No friends found</Text>
            <Text style={styles.emptyText}>Try a different search</Text>
          </View>
        }
      />
    </>
  );

  // ── REQUESTS TAB ───────────────────────────────────────────
  const renderRequestsTab = () => (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {requests.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptyText}>When someone sends you a friend request, it will appear here.</Text>
        </View>
      ) : (
        requests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            <View style={styles.requestAvatar}>
              <Text style={styles.avatarText}>{req.from.avatarLetter}</Text>
            </View>

            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>{req.from.displayName}</Text>
              <Text style={styles.requestMeta}>
                @{req.from.username} • Lv.{req.from.level} • {req.from.mutualGames} mutual games
              </Text>
              <Text style={styles.requestTime}>{req.timestamp}</Text>
            </View>

            <View style={styles.requestActions}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(req.id)}>
                <Text style={styles.acceptBtnText}>✅ Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(req.id)}>
                <Text style={styles.rejectBtnText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  // ── FIND PLAYERS TAB ───────────────────────────────────────
  const renderFindTab = () => (
    <ScrollView contentContainerStyle={styles.findContainer}>
      <View style={styles.findCard}>
        <Text style={styles.findCardTitle}>🔍 Find Players by Username</Text>
        <Text style={styles.findCardDesc}>
          Enter a GameHub username to send a friend request. They will see your request in their Requests tab.
        </Text>

        <View style={styles.findInputRow}>
          <TextInput
            style={styles.findInput}
            placeholder="Enter username (e.g. ProGamer_99)..."
            placeholderTextColor={Colors.textMuted}
            value={findQuery}
            onChangeText={setFindQuery}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.sendRequestBtn, !findQuery.trim() && styles.disabledBtn]}
            onPress={handleSendRequest}
            disabled={!findQuery.trim()}
          >
            <Text style={styles.sendRequestText}>📤 Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Suggested Players */}
      <Text style={styles.sectionTitle}>Suggested Players</Text>
      {[
        { name: 'SnakeKing_Pro', level: 22, games: 15, icon: '🐍' },
        { name: 'BrainMaster', level: 35, games: 28, icon: '🧠' },
        { name: 'CarromChamp', level: 19, games: 10, icon: '⚪' },
        { name: 'AimGod_360', level: 40, games: 32, icon: '🎯' },
      ].map((player) => (
        <View key={player.name} style={styles.suggestedCard}>
          <Text style={styles.suggestedIcon}>{player.icon}</Text>
          <View style={styles.suggestedInfo}>
            <Text style={styles.suggestedName}>@{player.name}</Text>
            <Text style={styles.suggestedMeta}>Lv.{player.level} • {player.games} games played</Text>
          </View>
          <TouchableOpacity
            style={styles.addFriendBtn}
            onPress={() => {
              Alert.alert('📤 Request Sent!', `Friend request sent to @${player.name}!`);
            }}
          >
            <Text style={styles.addFriendText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Play together & compete on leaderboards</Text>
      </View>

      {/* Tab Navigation */}
      {renderTabs()}

      {/* Tab Content */}
      {activeTab === 'friends' && renderFriendsTab()}
      {activeTab === 'requests' && renderRequestsTab()}
      {activeTab === 'find' && renderFindTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },

  // Tabs
  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.xs, marginBottom: Spacing.sm },
  tabBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { color: Colors.textMuted, fontSize: Typography.caption, fontWeight: Typography.semibold },
  tabTextActive: { color: '#FFFFFF' },

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 14, marginRight: Spacing.sm },
  searchInput: { flex: 1, height: 42, color: Colors.textPrimary, fontSize: Typography.body },
  clearBtn: { color: Colors.textMuted, fontSize: 16, padding: 4 },

  // Online Stats
  onlineStats: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  onlineStatsText: { color: Colors.textSecondary, fontSize: Typography.caption },

  // Friends List
  listContainer: { paddingHorizontal: Spacing.md, paddingBottom: 100, gap: Spacing.sm },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    position: 'relative',
  },
  avatarText: { color: Colors.textPrimary, fontSize: Typography.h4, fontWeight: Typography.bold },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  friendInfo: { flex: 1 },
  friendName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  friendMeta: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 1 },
  friendStatus: { color: Colors.textSecondary, fontSize: Typography.tiny, marginTop: 2 },

  challengeBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  challengeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  challengeBtnText: { color: Colors.textMuted, fontWeight: Typography.bold, fontSize: Typography.caption },
  challengeBtnTextActive: { color: '#FFFFFF' },

  // Requests
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  requestInfo: { flex: 1 },
  requestName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  requestMeta: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 1 },
  requestTime: { color: Colors.textMuted, fontSize: Typography.tiny, marginTop: 2 },
  requestActions: { flexDirection: 'row', gap: Spacing.xs },
  acceptBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.caption },
  rejectBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  rejectBtnText: { fontSize: 14 },

  // Find
  findContainer: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  findCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  findCardTitle: { color: Colors.textPrimary, fontSize: Typography.h4, fontWeight: Typography.bold },
  findCardDesc: { color: Colors.textSecondary, fontSize: Typography.caption, marginTop: 4, lineHeight: 18 },
  findInputRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  findInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: Typography.body,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendRequestBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: { opacity: 0.4 },
  sendRequestText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.bodySmall },

  // Suggested
  sectionTitle: { color: Colors.textPrimary, fontSize: Typography.h4, fontWeight: Typography.bold },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  suggestedIcon: { fontSize: 28 },
  suggestedInfo: { flex: 1 },
  suggestedName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  suggestedMeta: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 1 },
  addFriendBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addFriendText: { color: Colors.primary, fontWeight: Typography.bold, fontSize: Typography.caption },

  // Empty States
  emptyBox: { alignItems: 'center', marginTop: 40, paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.sm },
  emptyTitle: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 20 },
});
