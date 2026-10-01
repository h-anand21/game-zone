// ============================================================
// REVERSE MIND — Dedicated Level Complete Celebration Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { MascotCompanion } from '../components/MascotCompanion';
import { HangingSignboard } from '../components/HangingSignboard';
import { RMTheme } from '../theme';

interface LevelCompleteScreenProps {
  score: number;
  maxCombo: number;
  accuracy: number;
  coinsEarned: number;
  gemsEarned: number;
  onNextLevel: () => void;
  onHome: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  score,
  maxCombo,
  accuracy,
  coinsEarned,
  gemsEarned,
  onNextLevel,
  onHome,
}) => {
  return (
    <EnvironmentalBackground theme="level-complete">
      <View style={styles.container}>
        {/* Hanging Celebration Signboard */}
        <HangingSignboard
          title="VICTORY!"
          subtitle="Level Complete - Memory Mastered!"
          tag="STRICTLY REVERSED"
        />

        {/* Star Rating Display */}
        <View style={styles.starsRow}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starIconCenter}>⭐</Text>
          <Text style={styles.starIcon}>⭐</Text>
        </View>

        {/* Score & Rewards Breakdown */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Final Level Score</Text>
            <Text style={styles.statValGold}>{score} pts</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Inversion Accuracy</Text>
            <Text style={styles.statValCyan}>{accuracy}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Max Combo Streak</Text>
            <Text style={styles.statValCyan}>{maxCombo}x</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Coins Rewarded</Text>
            <Text style={styles.statValGold}>+{coinsEarned} 🪙</Text>
          </View>
          {gemsEarned > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Gems Rewarded</Text>
              <Text style={styles.statValCyan}>+{gemsEarned} 💎</Text>
            </View>
          )}
        </View>

        {/* Mascot Celebration */}
        <MascotCompanion
          state="celebrating"
          size="lg"
          showSpeechBubble={true}
          speechText="Insane memory inversion! You cleared it!"
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <GlowButton
            title="NEXT LEVEL"
            variant="gold"
            size="lg"
            icon="▶"
            onPress={onNextLevel}
          />
          <View style={{ height: 10 }} />
          <GlowButton
            title="RETURN TO HUB"
            variant="glass"
            size="md"
            onPress={onHome}
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
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  starIcon: {
    fontSize: 36,
  },
  starIconCenter: {
    fontSize: 48,
    marginTop: -8,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderRadius: RMTheme.radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: RMTheme.colors.textSecondary,
    fontWeight: '600',
  },
  statValGold: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  statValCyan: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  actions: {
    width: '100%',
  },
});
