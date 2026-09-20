// ============================================================
// GameHub — Number Rush Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateQuestion } from './logic';
import type { MathQuestion } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface NumberRushProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const NumberRushGame: React.FC<NumberRushProps> = ({ onFinish, isPaused }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion(0));
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score, score >= 15, { finalScore: score, bestStreak: streak });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, score, streak, onFinish]);

  const handleOptionPress = (selected: number) => {
    if (isPaused || timeLeft <= 0) return;

    if (selected === question.answer) {
      const nextScore = score + 1;
      const nextStreak = streak + 1;
      setScore(nextScore);
      setStreak(nextStreak);
      setTimeLeft((prev) => Math.min(30, prev + 2)); // +2s for correct answer
      setQuestion(generateQuestion(nextScore));
    } else {
      // Wrong answer — reset streak & -4s penalty
      setStreak(0);
      setTimeLeft((prev) => Math.max(0, prev - 4));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STREAK</Text>
          <Text style={[styles.statValue, { color: Colors.warning }]}>🔥 {streak}</Text>
        </View>

        <View style={[styles.statBox, timeLeft <= 5 && styles.timeLow]}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, timeLeft <= 5 && styles.timeLowText]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Question Display Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          {question.num1} {question.operator} {question.num2} = ?
        </Text>
      </View>

      {/* 2x2 Answer Grid */}
      <View style={styles.optionsGrid}>
        {question.options.map((opt, idx) => (
          <Pressable
            key={idx}
            style={({ pressed }) => [styles.optionBtn, pressed && styles.pressed]}
            onPress={() => handleOptionPress(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
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
    gap: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  questionCard: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  questionText: {
    fontSize: 42,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  optionBtn: {
    width: '45%',
    height: 70,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  optionText: {
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
