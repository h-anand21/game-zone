// ============================================================
// GameHub — Battle Arena FPS Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { UnityBridgeService } from '@/services/unity-bridge';
import { useAuthStore } from '@/store/auth-store';

const FPS_MODES = [
  { id: 'free-for-all', name: 'Free For All', icon: '⚔️', desc: '8 players deathmatch. First to 25 kills wins.' },
  { id: 'team-deathmatch', name: 'Team Deathmatch', icon: '🛡️', desc: '4v4 team combat. Alpha vs Bravo.' },
  { id: 'gun-game', name: 'Gun Game', icon: '🔫', desc: 'Every kill upgrades your weapon. First to knife wins.' },
  { id: 'capture-point', name: 'Capture Point', icon: '🚩', desc: 'Hold control points for team score.' },
  { id: '1v1-duel', name: '1v1 Duel', icon: '🎯', desc: 'High stakes 1-on-1 sniper & rifle duels.' },
];

export default function BattleScreen() {
  const [selectedMode, setSelectedMode] = useState<string>('free-for-all');
  const [launching, setLaunching] = useState<boolean>(false);
  const { guestId, cloudUserId } = useAuthStore();

  const handleLaunchMatch = async () => {
    setLaunching(true);
    try {
      const modeObj = FPS_MODES.find((m) => m.id === selectedMode);
      const res = await UnityBridgeService.launchFpsMatch({
        userId: cloudUserId || guestId || 'guest_player',
        username: cloudUserId ? 'CloudPlayer' : 'GuestPlayer',

        mode: modeObj?.name || 'Free For All',
        map: 'FPS_Factory',
      });
      Alert.alert('Battle Arena', `${res.message}\nConnecting to 60Hz FPS Server...`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Launch failed');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Battle Arena</Text>
        <Text style={styles.subtitle}>60Hz Authoritative Realtime FPS Multiplayer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerBadge}>LIVE MULTIPLAYER</Text>
          <Text style={styles.bannerTitle}>3D FPS Combat</Text>
          <Text style={styles.bannerText}>Low latency, client prediction, raycast hit detection, & 60Hz server tick.</Text>
          <TouchableOpacity style={styles.quickPlayBtn} onPress={handleLaunchMatch} disabled={launching}>
            <Text style={styles.quickPlayText}>{launching ? 'Connecting...' : '🚀 Quick Match'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select Game Mode</Text>
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
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  bannerCard: {
    backgroundColor: Colors.categoryBattle + '25',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.categoryBattle + '60',
  },
  bannerBadge: { color: Colors.categoryBattle, fontSize: Typography.caption, fontWeight: Typography.bold, letterSpacing: 1 },
  bannerTitle: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold, marginTop: 4 },
  bannerText: { color: Colors.textSecondary, fontSize: Typography.bodySmall, marginTop: 4, lineHeight: 20 },
  quickPlayBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.categoryBattle,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  quickPlayText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  sectionTitle: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold },
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
  },
  modeIcon: { fontSize: 32 },
  modeDetails: { flex: 1 },
  modeName: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold },
  selectedModeName: { color: Colors.categoryBattle },
  modeDesc: { color: Colors.textMuted, fontSize: Typography.caption, marginTop: 2, lineHeight: 18 },
});
