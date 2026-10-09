// ============================================================
// REACTION FIRE — Mission Card Component
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { RfColors } from '../theme';
import type { MissionItem } from '../types';

interface MissionCardProps {
  mission: MissionItem;
  onClaim: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaim }) => {
  const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const isReady = mission.completed && !mission.claimed;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.infoCol}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>

        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{mission.rewardXp} XP</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.progressNumbers}>
          {mission.progress} / {mission.target}
        </Text>
      </View>

      {/* Claim Action */}
      {isReady && (
        <Pressable style={styles.claimButton} onPress={() => onClaim(mission.id)}>
          <Text style={styles.claimText}>CLAIM REWARD</Text>
        </Pressable>
      )}

      {mission.claimed && (
        <View style={styles.claimedBadge}>
          <Text style={styles.claimedText}>✓ CLAIMED</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 23, 41, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 1,
  },
  description: {
    fontSize: 11,
    color: RfColors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 200, 87, 0.15)',
    borderWidth: 1,
    borderColor: RfColors.rewardGold,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '900',
    color: RfColors.rewardGold,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: RfColors.goLime,
    borderRadius: 3,
  },
  progressNumbers: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.textMuted,
  },
  claimButton: {
    marginTop: 10,
    backgroundColor: 'rgba(183, 255, 60, 0.2)',
    borderWidth: 1.5,
    borderColor: RfColors.goLime,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimText: {
    fontSize: 11,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 1.5,
  },
  claimedBadge: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  claimedText: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
  },
});

export default MissionCard;
