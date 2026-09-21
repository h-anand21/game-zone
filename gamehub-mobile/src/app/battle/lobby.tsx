// ============================================================
// GameHub — Battle: Lobby Screen
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface GameMode {
  id: string;
  name: string;
  icon: string;
  desc: string;
  players: string;
  color: string;
}

const GAME_MODES: GameMode[] = [
  { id: 'free-for-all', name: 'Free For All', icon: '💥', desc: 'Everyone for themselves! Top kills win.', players: '2-8', color: '#FF4757' },
  { id: 'team-deathmatch', name: 'Team Deathmatch', icon: '⚔️', desc: 'Two teams battle for kill supremacy.', players: '4-8', color: '#6C5CE7' },
  { id: 'gun-game', name: 'Gun Game', icon: '🔫', desc: 'Kill to upgrade weapons. Cycle all to win!', players: '2-8', color: '#00D2A0' },
  { id: 'capture-point', name: 'Capture Point', icon: '🏴', desc: 'Capture and hold zones to score points.', players: '4-8', color: '#FDCB6E' },
  { id: 'duel', name: '1v1 Duel', icon: '🎯', desc: 'Best of 5 rounds. Prove your skill.', players: '2', color: '#FF6B6B' },
];

export default function BattleLobbyScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handlePlay = (modeId: string) => {
    router.push(`/battle/matchmaking?mode=${modeId}` as any);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Battle Arena</Text>
        <Text style={styles.subtitle}>Choose your game mode</Text>
      </Animated.View>

      {/* Online Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>247</Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>38</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12ms</Text>
          <Text style={styles.statLabel}>Ping</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.modesContainer}>
        {GAME_MODES.map((mode, idx) => (
          <Animated.View
            key={mode.id}
            style={[{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20 * (idx + 1), 0] }) }] }]}
          >
            <Pressable
              style={[
                styles.modeCard,
                selectedMode === mode.id && { borderColor: mode.color },
              ]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <View style={[styles.modeIconBox, { backgroundColor: mode.color + '20' }]}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDesc}>{mode.desc}</Text>
                <Text style={[styles.modePlayers, { color: mode.color }]}>👥 {mode.players} Players</Text>
              </View>
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: mode.color }]}
                onPress={() => handlePlay(mode.id)}
              >
                <Text style={styles.playBtnText}>PLAY</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        ))}

        {/* Browse Rooms */}
        <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/battle/rooms' as any)}>
          <Text style={styles.browseIcon}>🏠</Text>
          <Text style={styles.browseText}>Browse Rooms</Text>
          <Text style={styles.browseArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  backBtn: { marginBottom: Spacing.sm },
  backText: { color: Colors.primaryLight, fontSize: Typography.bodySmall },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.surface, marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  statItem: { alignItems: 'center' },
  statValue: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold },
  statLabel: { color: Colors.textMuted, fontSize: Typography.tiny, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  modesContainer: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  modeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 2, borderColor: Colors.border,
  },
  modeIconBox: {
    width: 56, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  modeIcon: { fontSize: 28 },
  modeInfo: { flex: 1 },
  modeName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  modeDesc: { color: Colors.textSecondary, fontSize: Typography.caption, marginTop: 2, lineHeight: 16 },
  modePlayers: { fontSize: Typography.tiny, fontWeight: Typography.semibold, marginTop: 4 },
  playBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  playBtnText: { color: '#FFFFFF', fontWeight: Typography.extrabold, fontSize: Typography.caption },
  browseBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  browseIcon: { fontSize: 24 },
  browseText: { flex: 1, color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.semibold },
  browseArrow: { color: Colors.textMuted, fontSize: Typography.h3 },
});
