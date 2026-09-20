// ============================================================
// GameHub — One Tap Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getRandomTargetZone } from './logic';
import type { GameEngine } from '../../engine/GameEngine';

interface OneTapProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const OneTapGame: React.FC<OneTapProps> = ({ onFinish, isPaused }) => {
  const [pos, setPos] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [score, setScore] = useState(0);
  const [targetZone, setTargetZone] = useState(() => getRandomTargetZone(0));
  const [statusMsg, setStatusMsg] = useState('Tap when in the green zone!');

  useEffect(() => {
    if (isPaused) return;

    const speed = 2 + Math.min(6, Math.floor(score / 3));
    const timer = setInterval(() => {
      setPos((prev) => {
        let next = prev + direction * speed;
        if (next >= 100) {
          next = 100;
          setDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, direction, score]);

  const handleTap = () => {
    if (isPaused) return;

    if (pos >= targetZone.start && pos <= targetZone.end) {
      // Perfect hit!
      const nextScore = score + 1;
      setScore(nextScore);
      setStatusMsg('PERFECT TAP! +1');
      setTargetZone(getRandomTargetZone(nextScore));
    } else {
      // Missed! Game Over
      setStatusMsg('MISSED THE ZONE!');
      onFinish(score, score >= 5, { totalTaps: score });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.scoreText}>Streak: {score}</Text>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* Target Meter Track */}
      <View style={styles.track}>
        {/* Target Zone */}
        <View
          style={[
            styles.targetZone,
            {
              left: `${targetZone.start}%`,
              width: `${targetZone.end - targetZone.start}%`,
            },
          ]}
        />

        {/* Moving Indicator Pin */}
        <View style={[styles.indicator, { left: `${pos}%` }]} />
      </View>

      {/* Giant Tap Button */}
      <Pressable
        style={({ pressed }) => [styles.tapBtn, pressed && styles.pressed]}
        onPress={handleTap}
      >
        <Text style={styles.tapBtnText}>TAP NOW!</Text>
      </Pressable>
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
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  track: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  targetZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: Colors.success + '50',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.success,
  },
  indicator: {
    position: 'absolute',
    width: 8,
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
    ...Shadows.glow(Colors.accent),
  },
  tapBtn: {
    width: 220,
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  tapBtnText: {
    fontSize: Typography.h3,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
