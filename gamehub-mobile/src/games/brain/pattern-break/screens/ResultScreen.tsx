import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { Mascot } from '../components/mascot/Mascot';
import { RobotCompanion } from '../components/mascot/RobotCompanion';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { GlassCard } from '../components/cards/GlassCard';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../theme';
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
          {/* Mascot & Companion Celebration */}
          <View style={styles.mascotArea}>
            <View style={styles.robotPos}>
              <RobotCompanion size={50} mood="happy" />
            </View>
            <Mascot pose="victory" size={135} />
          </View>

          {/* Result Title */}
          <View style={styles.titleWrapper}>
            <Text style={styles.completeTitle}>ROUND COMPLETE!</Text>
            <View style={styles.badgePill}>
              <Ionicons name="trophy" size={12} color={PBColors.accent} style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>PATTERN SCOUT RANK</Text>
            </View>
          </View>

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
          <PrimaryButton
            title="PLAY AGAIN"
            variant="cyan"
            size="lg"
            icon="🔄"
            onPress={startNewRun}
          />
          <SecondaryButton
            title="RETURN TO HOME"
            onPress={() => setScreen('home')}
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
    gap: 12,
  },
  mascotArea: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 4,
  },
  robotPos: {
    position: 'absolute',
    top: -12,
    right: -28,
  },
  titleWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  completeTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 213, 74, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: PBColors.accent,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1,
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
