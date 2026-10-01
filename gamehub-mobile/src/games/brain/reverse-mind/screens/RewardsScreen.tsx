// ============================================================
// REVERSE MIND — Treasure Rewards Unlock Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { MascotCompanion } from '../components/MascotCompanion';
import { HangingSignboard } from '../components/HangingSignboard';
import { RMTheme } from '../theme';

interface RewardsScreenProps {
  coins: number;
  gems: number;
  xp: number;
  onClaim: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  coins,
  gems,
  xp,
  onClaim,
}) => {
  return (
    <EnvironmentalBackground theme="rewards">
      <View style={styles.container}>
        {/* Signboard */}
        <HangingSignboard
          title="TREASURE UNLOCKED!"
          subtitle="Cognitive achievement rewards claimed"
          tag="REWARD CHEST"
        />

        {/* Treasure Chest Icon */}
        <View style={styles.chestBox}>
          <Text style={styles.chestEmoji}>🎁</Text>
          <View style={styles.auraGlow} />
        </View>

        {/* Rewards Breakdown Cards */}
        <View style={styles.rewardsGrid}>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>🪙</Text>
            <Text style={styles.rewardVal}>+{coins}</Text>
            <Text style={styles.rewardLabel}>Coins</Text>
          </View>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>💎</Text>
            <Text style={styles.rewardVal}>+{gems}</Text>
            <Text style={styles.rewardLabel}>Gems</Text>
          </View>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>⚡</Text>
            <Text style={styles.rewardVal}>+{xp}</Text>
            <Text style={styles.rewardLabel}>XP Points</Text>
          </View>
        </View>

        {/* Mascot Mascot Reaction */}
        <MascotCompanion
          state="excited"
          size="lg"
          showSpeechBubble={true}
          speechText="Double bonus claimed! Keep building your streak!"
        />

        {/* CTA */}
        <View style={styles.actionWrapper}>
          <GlowButton
            title="CLAIM ALL REWARDS"
            variant="gold"
            size="lg"
            icon="🎉"
            onPress={onClaim}
          />
        </View>
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chestBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  chestEmoji: {
    fontSize: 72,
  },
  auraGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 216, 61, 0.25)',
    zIndex: -1,
  },
  rewardsGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  rewardCard: {
    flex: 1,
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderRadius: RMTheme.radii.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 216, 61, 0.4)',
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  rewardVal: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  rewardLabel: {
    fontSize: 9,
    color: RMTheme.colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  actionWrapper: {
    width: '100%',
  },
});
