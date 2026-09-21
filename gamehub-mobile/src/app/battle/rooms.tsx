// ============================================================
// GameHub — Battle: Rooms Browser
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface Room {
  id: string;
  name: string;
  host: string;
  mode: string;
  modeIcon: string;
  players: number;
  maxPlayers: number;
  map: string;
  ping: number;
  status: 'waiting' | 'in-progress' | 'full';
}

const DEMO_ROOMS: Room[] = [
  { id: 'r1', name: 'Pro Lobby 🔥', host: 'AimBot_Pro', mode: 'Free For All', modeIcon: '💥', players: 5, maxPlayers: 8, map: 'Factory', ping: 15, status: 'waiting' },
  { id: 'r2', name: 'Noob Friendly', host: 'RajGamer99', mode: 'Team Deathmatch', modeIcon: '⚔️', players: 4, maxPlayers: 8, map: 'Factory', ping: 22, status: 'waiting' },
  { id: 'r3', name: 'Gun Game Grind', host: 'ProSniper_X', mode: 'Gun Game', modeIcon: '🔫', players: 6, maxPlayers: 8, map: 'Desert', ping: 18, status: 'in-progress' },
  { id: 'r4', name: 'Duel Arena', host: 'ChessQueen', mode: '1v1 Duel', modeIcon: '🎯', players: 1, maxPlayers: 2, map: 'Factory', ping: 10, status: 'waiting' },
  { id: 'r5', name: 'Cap Point Masters', host: 'LudoKing_420', mode: 'Capture Point', modeIcon: '🏴', players: 8, maxPlayers: 8, map: 'Desert', ping: 30, status: 'full' },
  { id: 'r6', name: 'Late Night FFA', host: 'NightHawk', mode: 'Free For All', modeIcon: '💥', players: 3, maxPlayers: 8, map: 'Factory', ping: 12, status: 'waiting' },
];

type Filter = 'all' | 'waiting' | 'in-progress';

export default function BattleRoomsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const filteredRooms = DEMO_ROOMS.filter((r) => filter === 'all' || r.status === filter);

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return Colors.success;
      case 'in-progress': return Colors.warning;
      case 'full': return Colors.error;
    }
  };

  const getStatusLabel = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'in-progress': return 'In Progress';
      case 'full': return 'Full';
    }
  };

  const handleJoin = (room: Room) => {
    if (room.status === 'full') return;
    router.push(`/battle/matchmaking?room=${room.id}&mode=${room.mode}` as any);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Browse Rooms</Text>
        <Text style={styles.subtitle}>{DEMO_ROOMS.length} rooms available</Text>
      </Animated.View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['all', 'waiting', 'in-progress'] as Filter[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'waiting' ? '🟢 Open' : '🟡 In Progress'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Create Room */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createIcon}>➕</Text>
        <Text style={styles.createText}>Create Room</Text>
      </TouchableOpacity>

      {/* Rooms List */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.roomCard}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomModeIcon}>{item.modeIcon}</Text>
              <View style={styles.roomHeaderInfo}>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomHost}>Host: @{item.host} • {item.map}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusLabel(item.status)}</Text>
              </View>
            </View>

            <View style={styles.roomFooter}>
              <Text style={styles.roomMode}>{item.mode}</Text>
              <Text style={styles.roomPlayers}>👥 {item.players}/{item.maxPlayers}</Text>
              <Text style={[styles.roomPing, item.ping < 20 ? styles.pingGood : item.ping < 40 ? styles.pingOk : styles.pingBad]}>
                {item.ping}ms
              </Text>
              <TouchableOpacity
                style={[styles.joinBtn, item.status === 'full' && styles.joinBtnDisabled]}
                onPress={() => handleJoin(item)}
                disabled={item.status === 'full'}
              >
                <Text style={styles.joinBtnText}>{item.status === 'full' ? 'Full' : 'Join'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyTitle}>No rooms found</Text>
            <Text style={styles.emptyText}>Create a room or change your filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  backText: { color: Colors.primaryLight, fontSize: Typography.bodySmall, marginBottom: Spacing.sm },
  title: { fontSize: Typography.h2, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.caption, color: Colors.textMuted, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.xs, marginVertical: Spacing.sm },
  filterBtn: {
    flex: 1, backgroundColor: Colors.surface, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.textMuted, fontSize: Typography.caption, fontWeight: Typography.semibold },
  filterTextActive: { color: '#FFFFFF' },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceLight, marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  createIcon: { fontSize: 18 },
  createText: { color: Colors.primary, fontWeight: Typography.bold, fontSize: Typography.body },
  listContainer: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 100 },
  roomCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  roomHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  roomModeIcon: { fontSize: 28, marginRight: Spacing.sm },
  roomHeaderInfo: { flex: 1 },
  roomName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  roomHost: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 1 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  statusText: { fontSize: Typography.tiny, fontWeight: Typography.bold },
  roomFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  roomMode: { color: Colors.textSecondary, fontSize: Typography.caption, flex: 1 },
  roomPlayers: { color: Colors.textSecondary, fontSize: Typography.caption },
  roomPing: { fontSize: Typography.caption, fontWeight: Typography.bold },
  pingGood: { color: Colors.success },
  pingOk: { color: Colors.warning },
  pingBad: { color: Colors.error },
  joinBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.md,
  },
  joinBtnDisabled: { backgroundColor: Colors.surfaceLight },
  joinBtnText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.caption },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.sm },
  emptyTitle: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold },
  emptyText: { color: Colors.textMuted, marginTop: 4 },
});
