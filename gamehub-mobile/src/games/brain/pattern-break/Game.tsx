// ============================================================
// GameHub — Pattern Break Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generatePatternQuestion } from './logic';
import type { PatternQuestion } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface PatternBreakProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const PatternBreakGame: React.FC<PatternBreakProps> = ({ onFinish, isPaused }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [question, setQuestion] = useState<PatternQuestion>(() => generatePatternQuestion(1));
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score, score >= 8, { finalScore: score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, score, onFinish]);

  const handleItemPress = (index: number) => {
    if (isPaused || timeLeft <= 0) return;

    if (index === question.breakerIndex) {
      // Correct breaker found!
      const nextScore = score + 1;
      setScore(nextScore);
      setFeedback('Correct! +1 Point');
      setTimeLeft((prev) => Math.min(30, prev + 2));

      setTimeout(() => {
        setFeedback('');
        setQuestion(generatePatternQuestion(nextScore + 1));
      }, 500);
    } else {
      // Wrong choice — -3s penalty
      setFeedback('Wrong element! -3s');
      setTimeLeft((prev) => Math.max(0, prev - 3));
      setTimeout(() => setFeedback(''), 800);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>

        <View style={[styles.statBox, timeLeft <= 5 && styles.timeLow]}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, timeLeft <= 5 && styles.timeLowText]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Prompt Card */}
      <View style={styles.promptCard}>
        <Text style={styles.promptTitle}>Spot the Pattern Breaker!</Text>
        <Text style={styles.promptSub}>Tap the single item that breaks the rule</Text>
        {feedback !== '' && <Text style={styles.feedbackText}>{feedback}</Text>}
      </View>

      {/* Item Sequence */}
      <View style={styles.itemsRow}>
        {question.items.map((item, idx) => (
          <Pressable
            key={idx}
            style={({ pressed }) => [styles.itemCard, pressed && styles.pressed]}
            onPress={() => handleItemPress(idx)}
          >
            <Text style={styles.itemText}>{item}</Text>
          </Pressable>
        ))}
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
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 110,
  },
  timeLow: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  timeLowText: {
    color: Colors.error,
  },
  statLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  statValue: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  promptCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptTitle: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  promptSub: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  feedbackText: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.bold,
    marginTop: 8,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
    width: '100%',
  },
  itemCard: {
    width: 60,
    height: 72,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  itemText: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
