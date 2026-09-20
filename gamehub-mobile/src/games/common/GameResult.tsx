// ============================================================
// GameHub — Common Game Result Screen Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameResult as GameResultData } from '@/constants/types';

interface GameResultProps {
  gameName: string;
  result: GameResultData;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameResultView: React.FC<GameResultProps> = ({
  gameName,
  result,
  onPlayAgain,
  onHome,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerIcon}>{result.won ? '🏆' : '🎯'}</Text>
        <Text style={styles.title}>{result.won ? 'VICTORY!' : 'GAME OVER'}</Text>
        <Text style={styles.gameName}>{gameName}</Text>

        {/* Score Summary */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{result.score}</Text>
          <Text style={styles.durationText}>Time: {result.duration}s</Text>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsRow}>
          <View style={styles.rewardPill}>
            <Text style={styles.rewardIcon}>✨</Text>
            <Text style={styles.rewardText}>+{result.xpEarned} XP</Text>
          </View>

          <View style={[styles.rewardPill, { backgroundColor: Colors.warning + '20' }]}>
            <Text style={styles.rewardIcon}>🪙</Text>
            <Text style={[styles.rewardText, { color: Colors.warning }]}>+{result.coinsEarned} Coins</Text>
          </View>
        </View>

        {/* Achievements Unlocked */}
        {result.achievementsUnlocked && result.achievementsUnlocked.length > 0 && (
          <View style={styles.achievementsBox}>
            <Text style={styles.achievementsTitle}>🎖️ Achievements Unlocked!</Text>
            {result.achievementsUnlocked.map((name, index) => (
              <View key={index} style={styles.achievementBadge}>
                <Text style={styles.achievementText}>• {name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
            onPress={onHome}
          >
            <Text style={styles.btnTextSecondary}>🏠 Home</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
            onPress={onPlayAgain}
          >
            <Text style={styles.btnTextPrimary}>🔄 Play Again</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  headerIcon: {
    fontSize: 56,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    marginBottom: 2,
  },
  gameName: {
    fontSize: Typography.body,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  scoreBox: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scoreLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 42,
    color: Colors.primary,
    fontWeight: Typography.bold,
    marginVertical: Spacing.xs,
  },
  durationText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  rewardIcon: {
    fontSize: 16,
  },
  rewardText: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  achievementsBox: {
    width: '100%',
    backgroundColor: Colors.success + '15',
    borderWidth: 1,
    borderColor: Colors.success + '30',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  achievementsTitle: {
    fontSize: Typography.bodySmall,
    color: Colors.success,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  achievementBadge: {
    marginTop: 2,
  },
  achievementText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceLight,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },
  btnTextSecondary: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
