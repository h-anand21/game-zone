// ============================================================
// GameHub — Quiz Battle Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getQuizQuestions } from './logic';
import type { QuizQuestion } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface QuizBattleProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const QuizBattleGame: React.FC<QuizBattleProps> = ({ onFinish, isPaused }) => {
  const [questions] = useState<QuizQuestion[]>(() => getQuizQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentQ = questions[currentIdx];

  useEffect(() => {
    if (isPaused || selectedIndex !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          nextQuestion(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, currentIdx, selectedIndex]);

  const handleOptionPress = (idx: number) => {
    if (selectedIndex !== null || isPaused) return;

    setSelectedIndex(idx);
    const isCorrect = idx === currentQ.correctIndex;
    const points = isCorrect ? 100 + timeLeft * 10 : 0;
    const nextScore = score + points;

    if (isCorrect) setScore(nextScore);

    setTimeout(() => {
      nextQuestion(isCorrect, nextScore);
    }, 1000);
  };

  const nextQuestion = (lastCorrect: boolean, latestScore = score) => {
    setSelectedIndex(null);
    setTimeLeft(15);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Quiz complete!
      onFinish(latestScore, latestScore >= 300, { finalScore: latestScore });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerRow}>
        <Text style={styles.categoryBadge}>{currentQ.category}</Text>
        <Text style={styles.questionCounter}>
          Question {currentIdx + 1} / {questions.length}
        </Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === currentQ.correctIndex;

          return (
            <Pressable
              key={idx}
              disabled={selectedIndex !== null}
              style={({ pressed }) => [
                styles.optionBtn,
                selectedIndex !== null && isCorrect && styles.correctBtn,
                selectedIndex !== null && isSelected && !isCorrect && styles.wrongBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => handleOptionPress(idx)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryBadge: {
    fontSize: Typography.caption,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  questionCounter: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  timerText: {
    fontSize: Typography.body,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
  questionCard: {
    width: '100%',
    minHeight: 140,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  questionText: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  optionsList: {
    width: '100%',
    gap: Spacing.md,
  },
  optionBtn: {
    width: '100%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  correctBtn: {
    backgroundColor: Colors.success + '30',
    borderColor: Colors.success,
  },
  wrongBtn: {
    backgroundColor: Colors.error + '30',
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  pressed: {
    opacity: 0.8,
  },
});
