// ============================================================
// REVERSE MIND — Analytical Game Result Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { MascotCompanion } from '../components/MascotCompanion';
import { HangingSignboard } from '../components/HangingSignboard';
import { RMTheme } from '../theme';

interface GameResultScreenProps {
  score: number;
  accuracy: number;
  bestCombo: number;
  correctTaps: number;
  wrongTaps: number;
  roundsCleared: number;
  onReplay: () => void;
  onHome: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  score,
  accuracy,
  bestCombo,
  correctTaps,
  wrongTaps,
  roundsCleared,
  onReplay,
  onHome,
}) => {
  return (
    <EnvironmentalBackground theme="result">
      <View style={styles.container}>
        {/* Header Signboard */}
        <HangingSignboard
          title="COGNITIVE PERFORMANCE"
          subtitle="Analytical breakdown of memory inversion"
          tag="MISSION SUMMARY"
        />

        {/* Analytics Dashboard Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.cardValGold}>{score}</Text>
            <Text style={styles.cardKey}>Total Score</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.cardValCyan}>{accuracy}%</Text>
            <Text style={styles.cardKey}>Accuracy Rate</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.cardValGreen}>{correctTaps}</Text>
            <Text style={styles.cardKey}>Correct Taps</Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.cardValRed}>{wrongTaps}</Text>
            <Text style={styles.cardKey}>Wrong Taps</Text>
          </View>
        </View>

        {/* Metric Rows */}
        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Rounds Cleared</Text>
            <Text style={styles.rowVal}>{roundsCleared}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Best Combo Streak</Text>
            <Text style={styles.rowVal}>{bestCombo}x</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Avg Response Speed</Text>
            <Text style={styles.rowVal}>1.4s / item</Text>
          </View>
        </View>

        {/* Mascot Feedback */}
        <MascotCompanion
          state={accuracy >= 80 ? 'happy' : 'confused'}
          size="md"
          showSpeechBubble={true}
          speechText={accuracy >= 80 ? 'Great focus! Memory agility is strong!' : 'Keep practicing, your brain will adapt!'}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <GlowButton
            title="PLAY AGAIN"
            variant="gold"
            size="lg"
            icon="🔄"
            onPress={onReplay}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  cardValGold: {
    fontSize: 22,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  cardValCyan: {
    fontSize: 22,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  cardValGreen: {
    fontSize: 22,
    fontWeight: '900',
    color: RMTheme.colors.emeraldGreen,
  },
  cardValRed: {
    fontSize: 22,
    fontWeight: '900',
    color: RMTheme.colors.coralRed,
  },
  cardKey: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowKey: {
    fontSize: 12,
    color: RMTheme.colors.textMuted,
    fontWeight: '700',
  },
  rowVal: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  actions: {
    width: '100%',
  },
});
