// ============================================================
// DON'T TAP WRONG — In-game Heads Up Display (HUD)
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { DtwColors } from '../../theme/colors';
import { NeonBadge } from '../common/NeonBadge';
import type { GameMode } from '../../types';

interface GameHudProps {
  score: number;
  streak: number;
  timeLeftSeconds: number;
  totalTimeSeconds: number;
  targetScore: number;
  mode: GameMode;
  onPause: () => void;
  onExit: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  streak,
  timeLeftSeconds,
  totalTimeSeconds,
  targetScore,
  mode,
  onPause,
  onExit,
}) => {
  const timeProgress = Math.max(0, Math.min(1, timeLeftSeconds / totalTimeSeconds));
  const isTimeCritical = timeLeftSeconds <= 5;

  const timerColor = isTimeCritical
    ? DtwColors.dangerRed
    : timeLeftSeconds <= 10
    ? DtwColors.streakGold
    : DtwColors.safeGreen;

  return (
    <View style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <Pressable onPress={onExit} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>✕</Text>
        </Pressable>

        <View style={styles.badgeRow}>
          <NeonBadge
            label={mode}
            color={DtwColors.cyanAccent}
            style={styles.modeBadge}
          />
          <NeonBadge
            label={`TARGET ${targetScore}`}
            color={DtwColors.streakGold}
          />
        </View>

        <Pressable onPress={onPause} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>❚❚</Text>
        </Pressable>
      </View>

      {/* Timer Bar */}
      <View style={styles.timerTrack}>
        <View
          style={[
            styles.timerFill,
            {
              width: `${Math.round(timeProgress * 100)}%`,
              backgroundColor: timerColor,
              shadowColor: timerColor,
            },
          ]}
        />
      </View>

      {/* Main Stats Row */}
      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>STREAK</Text>
          <View style={styles.streakValueRow}>
            {streak >= 5 ? <Text style={styles.flameIcon}>🔥</Text> : null}
            <Text
              style={[
                styles.statValue,
                streak >= 5 && { color: DtwColors.streakGold },
              ]}
            >
              {streak}
            </Text>
          </View>
        </View>

        {/* Big Score */}
        <View style={styles.scoreCenterCol}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreSubLabel}>POINTS</Text>
        </View>

        {/* Time Left */}
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>TIME LEFT</Text>
          <Text style={[styles.statValue, { color: timerColor }]}>
            {timeLeftSeconds.toFixed(1)}s
          </Text>
        </View>
      </View>

      {/* Neon Directive Banner */}
      <View style={styles.directivePill}>
        <View style={styles.directiveGreenDot} />
        <Text style={styles.directiveText}>TAP GREEN ONLY</Text>
        <Text style={styles.directiveDivider}>•</Text>
        <View style={styles.directiveRedDot} />
        <Text style={[styles.directiveText, { color: DtwColors.dangerRed }]}>
          AVOID RED
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: DtwColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeBadge: {
    marginRight: 8,
  },
  timerTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(8, 11, 16, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCol: {
    alignItems: 'center',
    minWidth: 70,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  scoreCenterCol: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 1,
    lineHeight: 42,
    textShadowColor: DtwColors.safeGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textSecondary,
    letterSpacing: 2,
  },
  directivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  directiveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DtwColors.safeGreen,
    marginRight: 6,
  },
  directiveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DtwColors.dangerRed,
    marginRight: 6,
  },
  directiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.safeGreen,
    letterSpacing: 1,
  },
  directiveDivider: {
    color: DtwColors.textMuted,
    marginHorizontal: 8,
    fontSize: 12,
  },
});
