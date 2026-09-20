// ============================================================
// GameHub — Aim Rush Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { createRandomTarget } from './logic';
import type { Target } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface AimRushProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const AimRushGame: React.FC<AimRushProps> = ({ onFinish, isPaused }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [target, setTarget] = useState<Target>(() => createRandomTarget(1));

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score, score >= 15, { totalHits: score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, score, onFinish]);

  const handleTargetPress = () => {
    if (isPaused || timeLeft <= 0) return;
    const nextScore = score + 1;
    setScore(nextScore);
    setTarget(createRandomTarget(nextScore + 1));
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TARGETS HIT</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>

        <View style={[styles.statBox, timeLeft <= 5 && styles.timeLow]}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, timeLeft <= 5 && styles.timeLowText]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Target Canvas Area */}
      <View style={styles.arena}>
        <Pressable
          style={({ pressed }) => [
            styles.target,
            {
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: target.size,
              height: target.size,
              borderRadius: target.size / 2,
            },
            pressed && styles.pressed,
          ]}
          onPress={handleTargetPress}
        >
          <Text style={styles.targetIcon}>🎯</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-between',
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
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
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
  arena: {
    width: '100%',
    flex: 1,
    maxHeight: 400,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.md,
  },
  target: {
    position: 'absolute',
    backgroundColor: Colors.accent + '30',
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetIcon: {
    fontSize: 24,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
});
