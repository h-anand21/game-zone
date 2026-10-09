// ============================================================
// DON'T TAP WRONG — Screen 10 & 11: Result Summary & Record Celebration
// Performance breakdown, grade badge, telemetry stats, and instant replay
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { NeonBadge } from '../components/common/NeonBadge';
import { PersonalBestCelebration } from '../components/game/PersonalBestCelebration';
import { getGradeForScore } from '../engine/gameEngine';
import { DtwAudio } from '../audio/audioManager';
import { DtwHaptics } from '../haptics/hapticManager';
import { DtwColors } from '../theme/colors';
import { DTW_MODES } from '../config';
import type { RunTelemetry } from '../types';

interface ResultScreenProps {
  telemetry: RunTelemetry;
  previousHighScore: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  telemetry,
  previousHighScore,
  onPlayAgain,
  onBackToHome,
}) => {
  const modeConfig = DTW_MODES[telemetry.mode];
  const gradeInfo = getGradeForScore(telemetry.score, telemetry.mode);

  const isWon = telemetry.targetReached;
  const isDangerTap = telemetry.reason === 'danger_tap';

  useEffect(() => {
    if (telemetry.isNewBest) {
      DtwAudio.playNewBest();
      DtwHaptics.newBest();
    }
  }, [telemetry.isNewBest]);

  const outcomeTitle = isDangerTap
    ? 'Lethal Hazard Triggered'
    : isWon
    ? 'Target Secured!'
    : 'Time Expired';

  return (
    <BackgroundLayer variant="game">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Mode & Status */}
          <View style={styles.header}>
            <NeonBadge
              label={modeConfig.name}
              color={modeConfig.badgeColor}
              size="compact"
            />
            <Text
              style={[
                styles.outcomeTitle,
                isDangerTap && styles.dangerOutcome,
                isWon && styles.wonOutcome,
              ]}
            >
              {outcomeTitle}
            </Text>
          </View>

          {/* Conditional Personal Best Celebration */}
          {telemetry.isNewBest && (
            <PersonalBestCelebration
              score={telemetry.score}
              previousBest={previousHighScore}
            />
          )}

          {/* Score & Grade Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.gradeBadgeContainer}>
              <View style={[styles.gradeCircle, { borderColor: gradeInfo.color }]}>
                <Text style={[styles.gradeLetter, { color: gradeInfo.color }]}>
                  {gradeInfo.grade}
                </Text>
              </View>
              <Text style={[styles.gradeLabel, { color: gradeInfo.color }]}>
                {gradeInfo.label}
              </Text>
            </View>

            <Text style={styles.scoreNumber}>{telemetry.score}</Text>
            <Text style={styles.scoreSubLabel}>FINAL SCORE (CORRECT TAPS)</Text>

            {/* Target Reached Status */}
            <View style={styles.targetStatusBox}>
              <Text style={styles.targetStatusText}>
                {isWon
                  ? `✓ TARGET ACHIEVED (${modeConfig.targetScore}+ TAPS)`
                  : `TARGET WAS ${modeConfig.targetScore} TAPS (${telemetry.score}/${modeConfig.targetScore})`}
              </Text>
            </View>
          </View>

          {/* Detailed Telemetry Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={[styles.statValue, { color: DtwColors.cyanAccent }]}>
                {telemetry.accuracy}%
              </Text>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>MAX STREAK</Text>
              <Text style={[styles.statValue, { color: DtwColors.streakGold }]}>
                {telemetry.bestStreak}
              </Text>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>SAFE TAPS</Text>
              <Text style={[styles.statValue, { color: DtwColors.safeGreen }]}>
                {telemetry.safeTaps}
              </Text>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>MISTAKES</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: telemetry.dangerTaps > 0 ? DtwColors.dangerRed : DtwColors.textPrimary },
                ]}
              >
                {telemetry.dangerTaps}
              </Text>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>TIME SURVIVED</Text>
              <Text style={styles.statValue}>{telemetry.durationElapsedSeconds}s</Text>
            </View>

            <View style={styles.statCell}>
              <Text style={styles.statLabel}>PERSONAL BEST</Text>
              <Text style={[styles.statValue, { color: DtwColors.streakGold }]}>
                {Math.max(previousHighScore, telemetry.score)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionBlock}>
            <ArcadeButton
              title="PLAY AGAIN"
              variant="green"
              size="large"
              icon="🔄"
              onPress={onPlayAgain}
              style={styles.actionBtn}
            />

            <ArcadeButton
              title="BACK TO ARENA HUB"
              variant="glass"
              onPress={onBackToHome}
              style={styles.actionBtn}
            />
          </View>
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 12,
  },
  outcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  wonOutcome: {
    color: DtwColors.safeGreen,
  },
  dangerOutcome: {
    color: DtwColors.dangerRed,
  },
  heroCard: {
    width: '100%',
    backgroundColor: 'rgba(21, 28, 37, 0.92)',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(66, 217, 255, 0.3)',
    marginVertical: 10,
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  gradeBadgeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 11, 16, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  gradeLetter: {
    fontSize: 26,
    fontWeight: '900',
  },
  gradeLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 6,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 2,
    lineHeight: 70,
    textShadowColor: DtwColors.safeGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  scoreSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
  },
  targetStatusBox: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  targetStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.textSecondary,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginVertical: 12,
  },
  statCell: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(21, 28, 37, 0.75)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  actionBlock: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  actionBtn: {
    width: '100%',
  },
});

export default ResultScreen;
