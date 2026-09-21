// ============================================================
// GameHub — Battle Arena FPS Screen (Mobile Simulator + Unity Bridge)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { UnityBridgeService } from '@/services/unity-bridge';
import { useAuthStore } from '@/store/auth-store';

const FPS_MODES = [
  { id: 'fps-ffa', name: 'Free For All', icon: '⚔️', desc: '8 players deathmatch. First to 25 kills wins.' },
  { id: 'fps-tdm', name: 'Team Deathmatch', icon: '🛡️', desc: '4v4 team combat. Alpha vs Bravo.' },
  { id: 'fps-gun-game', name: 'Gun Game', icon: '🔫', desc: 'Every kill upgrades your weapon. First to knife wins.' },
  { id: 'fps-capture-point', name: 'Capture Point', icon: '🚩', desc: 'Hold control points for team score.' },
  { id: 'fps-duel', name: '1v1 Duel', icon: '🎯', desc: 'High stakes 1-on-1 sniper & rifle duels.' },
];

const MAPS = ['FPS_Factory', 'Cyber_Hangar', 'Dust_Ruins'];

export default function BattleScreen() {
  const [selectedMode, setSelectedMode] = useState<string>('fps-ffa');
  const [selectedMap, setSelectedMap] = useState<string>('FPS_Factory');
  const [launching, setLaunching] = useState<boolean>(false);
  const { guestId, cloudUserId } = useAuthStore();

  const handlePlayMobileArena = () => {
    router.push(`/games/${selectedMode}`);
  };

  const handleLaunchUnityMatch = async () => {
    setLaunching(true);
    try {
      const modeObj = FPS_MODES.find((m) => m.id === selectedMode);
      const res = await UnityBridgeService.launchFpsMatch({
        userId: cloudUserId || guestId || 'guest_player',
        username: cloudUserId ? 'CloudPlayer' : 'GuestPlayer',
        mode: modeObj?.name || 'Free For All',
        map: selectedMap,
      });
      Alert.alert('Battle Arena 3D', `${res.message}\nConnecting to 60Hz Realtime FPS Server...`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Launch failed');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Battle Arena</Text>
        <Text style={styles.subtitle}>60Hz Realtime FPS • Mobile Simulator & Unity 3D</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.serverBadge}>
            <Text style={styles.serverBadgeText}>🟢 SERVER ACTIVE • ws://localhost:5001/ws/fps</Text>
          </View>

          <Text style={styles.bannerTitle}>3D Battle Combat</Text>
          <Text style={styles.bannerText}>
            60Hz tick rate, client prediction, raycast hit detection & leaderboard sync.
          </Text>

          {/* Action Launchers */}
          <View style={styles.bannerActions}>
            <TouchableOpacity style={styles.mobilePlayBtn} onPress={handlePlayMobileArena}>
              <Text style={styles.mobilePlayText}>🎮 Play Mobile FPS Arena</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.unityPlayBtn} onPress={handleLaunchUnityMatch} disabled={launching}>
              <Text style={styles.unityPlayText}>
                {launching ? 'Connecting...' : '🚀 Launch Unity 3D Engine'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.unityPlayBtn} onPress={() => router.push('/battle/lobby' as any)}>
              <Text style={styles.unityPlayText}>🌐 Browse Online Rooms</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Selection */}
        <Text style={styles.sectionTitle}>Select Arena Map</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mapScroll}>
          {MAPS.map((map) => {
            const isSelected = map === selectedMap;
            return (
              <TouchableOpacity
                key={map}
                style={[styles.mapCard, isSelected && styles.selectedMapCard]}
                onPress={() => setSelectedMap(map)}
              >
                <Text style={styles.mapIcon}>🗺️</Text>
                <Text style={[styles.mapText, isSelected && styles.selectedMapText]}>{map.replace('_', ' ')}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Game Mode Selection */}
        <Text style={styles.sectionTitle}>Select FPS Mode</Text>
        <View style={styles.modesContainer}>
          {FPS_MODES.map((mode) => {
            const isSelected = mode.id === selectedMode;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeCard, isSelected && styles.selectedModeCard]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.modeDetails}>
                  <Text style={[styles.modeName, isSelected && styles.selectedModeName]}>{mode.name}</Text>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.playModeBadge, isSelected && styles.activePlayModeBadge]}
                  onPress={() => router.push(`/games/${mode.id}`)}
                >
                  <Text style={styles.playModeBadgeText}>PLAY ▶</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  bannerCard: {
    backgroundColor: Colors.categoryBattle + '20',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.categoryBattle,
    ...Shadows.md,
  },
  serverBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  serverBadgeText: {
    color: Colors.success,
    fontSize: Typography.tiny,
    fontWeight: Typography.bold,
  },
  bannerTitle: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold, marginTop: 4 },
  bannerText: { color: Colors.textSecondary, fontSize: Typography.bodySmall, marginTop: 4, lineHeight: 20 },
  bannerActions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  mobilePlayBtn: {
    backgroundColor: Colors.categoryBattle,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  mobilePlayText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  unityPlayBtn: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unityPlayText: { color: Colors.textPrimary, fontSize: Typography.bodySmall, fontWeight: Typography.semibold },
  sectionTitle: { color: Colors.textPrimary, fontSize: Typography.h4, fontWeight: Typography.bold },
  mapScroll: { flexDirection: 'row', gap: Spacing.sm },
  mapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  selectedMapCard: {
    borderColor: Colors.categoryBattle,
    backgroundColor: Colors.categoryBattle + '25',
    borderWidth: 2,
  },
  mapIcon: { fontSize: 18 },
  mapText: { color: Colors.textSecondary, fontSize: Typography.caption, fontWeight: Typography.semibold },
  selectedMapText: { color: Colors.categoryBattle, fontWeight: Typography.bold },
  modesContainer: { gap: Spacing.sm },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  selectedModeCard: {
    borderColor: Colors.categoryBattle,
    backgroundColor: Colors.categoryBattle + '15',
    borderWidth: 2,
  },
  modeIcon: { fontSize: 32 },
  modeDetails: { flex: 1 },
  modeName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  selectedModeName: { color: Colors.categoryBattle },
  modeDesc: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 2, lineHeight: 18 },
  playModeBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePlayModeBadge: {
    backgroundColor: Colors.categoryBattle,
    borderColor: Colors.categoryBattle,
  },
  playModeBadgeText: {
    color: '#FFFFFF',
    fontSize: Typography.tiny,
    fontWeight: Typography.bold,
  },
});
