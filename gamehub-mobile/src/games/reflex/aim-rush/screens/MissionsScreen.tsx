// ============================================================
// AIM RUSH — Screen 10: MissionsScreen
// Tactical directives, real run progress, and coin claims
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushMission } from '../types';
import { AimRushStorage } from '../storage/aimRushStorage';

interface MissionsScreenProps {
  onBack: () => void;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ onBack }) => {
  const [missions, setMissions] = useState<AimRushMission[]>([]);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    const list = await AimRushStorage.getMissions();
    setMissions(list);
  };

  const handleClaim = async (id: string) => {
    const updated = await AimRushStorage.claimMission(id);
    setMissions(updated);
  };

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={ARColors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>DIRECTIVES</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {missions.map((m) => {
            const progressRatio = Math.min(1, m.current / m.target);
            const progressPercent = Math.round(progressRatio * 100);

            return (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{m.title}</Text>
                  <View style={styles.rewardTag}>
                    <Ionicons name="sparkles" size={12} color={ARColors.gold} />
                    <Text style={styles.rewardText}>+{m.rewardCoins}</Text>
                  </View>
                </View>

                <Text style={styles.cardDesc}>{m.description}</Text>

                {/* Progress bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {m.current} / {m.target}
                  </Text>
                </View>

                {/* Claim / Status */}
                {m.claimed ? (
                  <View style={styles.claimedPill}>
                    <Text style={styles.claimedText}>CLAIMED ✓</Text>
                  </View>
                ) : m.completed ? (
                  <Pressable style={styles.claimBtn} onPress={() => handleClaim(m.id)}>
                    <Text style={styles.claimBtnText}>CLAIM REWARD</Text>
                  </Pressable>
                ) : (
                  <View style={styles.inProgressPill}>
                    <Text style={styles.inProgressText}>IN PROGRESS</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  scrollList: {
    gap: 14,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.2,
  },
  rewardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: ARColors.gold,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.gold,
  },
  cardDesc: {
    fontSize: 12,
    color: ARColors.textSecondary,
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ARColors.lime,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  claimBtn: {
    width: '100%',
    height: 38,
    backgroundColor: ARColors.gold,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1,
  },
  claimedPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  claimedText: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  inProgressPill: {
    alignSelf: 'flex-start',
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  inProgressText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.cyan,
  },
});
