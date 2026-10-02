import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { GlassCard } from '../components/cards/GlassCard';
import { PBColors, PBTypography, PBRadius, PBShadows, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const ResultScreen: React.FC = () => {
  const {
    score,
    correctCount,
    wrongCount,
    bestStreak,
    startNewRun,
    setScreen,
  } = usePatternBreakStore();

  const totalTaps = correctCount + wrongCount;
  const accuracy = totalTaps > 0 ? Math.round((correctCount / totalTaps) * 100) : 100;

  return (
    <GameBackground variant="splash">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          {/* 3D Sculpted Result Plaque */}
          <ScreenPlaque type="result" height={190} />

          {/* Big Score Card */}
          <GlassCard variant="cyan" style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>PATTERN POINTS</Text>

            {/* Performance Stats Matrix */}
            <View style={styles.statsGrid}>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>CORRECT</Text>
                <Text style={[styles.statValue, { color: PBColors.positive }]}>
                  {correctCount}
                </Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>WRONG</Text>
                <Text style={[styles.statValue, { color: PBColors.danger }]}>
                  {wrongCount}
                </Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>STREAK</Text>
                <View style={styles.streakRow}>
                  <Ionicons name="flame" size={15} color={PBColors.accent} style={{ marginRight: 2 }} />
                  <Text style={[styles.statValue, { color: PBColors.accent }]}>
                    {bestStreak}
                  </Text>
                </View>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLabel}>ACCURACY</Text>
                <Text style={[styles.statValue, { color: PBColors.primary }]}>
                  {accuracy}%
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBar}>
          <GameButton
            asset={uiAssets.actions.playAgain}
            height={64}
            onPress={startNewRun}
            accessibilityLabel="Play Again"
          />
          <GameButton
            asset={uiAssets.actions.exit}
            height={56}
            onPress={() => setScreen('home')}
            accessibilityLabel="Return to Home"
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  scoreCard: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  scoreNumber: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 1,
    color: PBColors.primary,
    lineHeight: 56,
    textShadowColor: 'rgba(25, 211, 255, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCell: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  actionsBar: {
    gap: 10,
    paddingBottom: 20,
  },
});
