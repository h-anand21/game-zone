// ============================================================
// MEMORY RUSH — 09 Round Result Screen (Fast Transition)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface RoundResultScreenProps {
  onNextRound: () => void;
}

export const RoundResultScreen: React.FC<RoundResultScreenProps> = ({ onNextRound }) => {
  const { score, combo, round, totalRounds, correctAnswers, totalAttempts, reactionTimeMs } = useMemoryRushStore();

  const accuracy = Math.round((correctAnswers / Math.max(1, totalAttempts)) * 100);

  return (
    <GameBackground theme="gameplay">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ROUND COMPLETE</Text>
          <Text style={styles.roundTag}>ROUND {round} OF {totalRounds}</Text>
        </View>

        <GlassCard glowing style={styles.card}>
          <Text style={styles.pointsLabel}>ROUND POINTS</Text>
          <Text style={styles.pointsVal}>+{score}</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <MRIcon name="target" size={14} color={MRColors.yellowStatus} />
              <Text style={styles.metricLabel}>ACCURACY</Text>
              <Text style={styles.metricValYellow}>{accuracy}%</Text>
            </View>
            <View style={styles.metricCell}>
              <MRIcon name="clock" size={14} color={MRColors.cyanBright} />
              <Text style={styles.metricLabel}>REACTION</Text>
              <Text style={styles.metricValCyan}>{(reactionTimeMs / 1000).toFixed(2)}s</Text>
            </View>
            <View style={styles.metricCell}>
              <MRIcon name="zap" size={14} color={MRColors.textPrimary} />
              <Text style={styles.metricLabel}>COMBO</Text>
              <Text style={styles.metricValWhite}>×{combo}</Text>
            </View>
            <View style={styles.metricCell}>
              <MRIcon name="star" size={14} color={MRColors.cyanBright} />
              <Text style={styles.metricLabel}>TIME BONUS</Text>
              <Text style={styles.metricValCyan}>+4s</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.ctaWrapper}>
          <PrimaryButton
            title="NEXT ROUND →"
            size="lg"
            variant="cyan"
            onPress={onNextRound}
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  roundTag: {
    fontSize: 11,
    fontWeight: '800',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  card: {
    padding: 20,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  pointsVal: {
    fontSize: 48,
    fontWeight: '900',
    color: MRColors.cyanBright,
    marginVertical: 4,
    textShadowColor: MRColors.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
  metricCell: {
    width: '47%',
    backgroundColor: 'rgba(8, 10, 13, 0.85)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
    gap: 2,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  metricValCyan: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.cyanBright,
    marginTop: 2,
  },
  metricValYellow: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    marginTop: 2,
  },
  metricValWhite: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    marginTop: 2,
  },
  ctaWrapper: {
    width: '100%',
  },
});
