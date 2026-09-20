// ============================================================
// GameHub — Rock Paper Scissors Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getAIChoice, playRPSRound } from './logic';
import type { Choice, RPSResult } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface RockPaperScissorsProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const RockPaperScissorsGame: React.FC<RockPaperScissorsProps> = ({ onFinish, isPaused }) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [lastRound, setLastRound] = useState<RPSResult | null>(null);

  const handleChoice = (choice: Choice) => {
    if (isPaused) return;

    const ai = getAIChoice();
    const res = playRPSRound(choice, ai);
    setLastRound(res);

    let nextPlayerScore = playerScore;
    let nextAiScore = aiScore;

    if (res.outcome === 'WIN') nextPlayerScore += 1;
    if (res.outcome === 'LOSS') nextAiScore += 1;

    setPlayerScore(nextPlayerScore);
    setAiScore(nextAiScore);

    if (nextPlayerScore >= 3 || nextAiScore >= 3) {
      const playerWon = nextPlayerScore > nextAiScore;
      onFinish(nextPlayerScore * 20, playerWon, { playerScore: nextPlayerScore, aiScore: nextAiScore });
    }
  };

  const getEmoji = (c?: Choice) => {
    if (c === 'rock') return '✊';
    if (c === 'paper') return '✋';
    if (c === 'scissors') return '✌️';
    return '❓';
  };

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>Player: {playerScore}</Text>
        <Text style={styles.vsText}>Best of 5</Text>
        <Text style={styles.scoreText}>AI: {aiScore}</Text>
      </View>

      {/* Duel Arena Display */}
      <View style={styles.arena}>
        <View style={styles.fighter}>
          <Text style={styles.fighterLabel}>Player</Text>
          <Text style={styles.fighterEmoji}>{getEmoji(lastRound?.playerChoice)}</Text>
        </View>

        <Text style={styles.versusLabel}>VS</Text>

        <View style={styles.fighter}>
          <Text style={styles.fighterLabel}>AI</Text>
          <Text style={styles.fighterEmoji}>{getEmoji(lastRound?.aiChoice)}</Text>
        </View>
      </View>

      {/* Outcome Banner */}
      {lastRound && (
        <View style={styles.outcomeBox}>
          <Text style={styles.outcomeText}>
            {lastRound.outcome === 'WIN'
              ? '🎉 Round Won!'
              : lastRound.outcome === 'LOSS'
              ? '❌ Round Lost!'
              : '🤝 Draw!'}
          </Text>
        </View>
      )}

      {/* Choices Keypad */}
      <View style={styles.choicesRow}>
        <Pressable style={styles.choiceBtn} onPress={() => handleChoice('rock')}>
          <Text style={styles.choiceEmoji}>✊</Text>
          <Text style={styles.choiceText}>Rock</Text>
        </Pressable>

        <Pressable style={styles.choiceBtn} onPress={() => handleChoice('paper')}>
          <Text style={styles.choiceEmoji}>✋</Text>
          <Text style={styles.choiceText}>Paper</Text>
        </Pressable>

        <Pressable style={styles.choiceBtn} onPress={() => handleChoice('scissors')}>
          <Text style={styles.choiceEmoji}>✌️</Text>
          <Text style={styles.choiceText}>Scissors</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h4,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  vsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
  },
  arena: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 180,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  fighter: {
    alignItems: 'center',
  },
  fighterLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  fighterEmoji: {
    fontSize: 56,
    marginTop: 8,
  },
  versusLabel: {
    fontSize: Typography.h2,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
  outcomeBox: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
  },
  outcomeText: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  choicesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    justifyContent: 'center',
  },
  choiceBtn: {
    flex: 1,
    height: 90,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  choiceEmoji: {
    fontSize: 32,
  },
  choiceText: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
    marginTop: 4,
  },
});
