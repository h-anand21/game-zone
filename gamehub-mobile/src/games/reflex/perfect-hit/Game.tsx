// ============================================================
// GameHub — Perfect Hit Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { evaluateHitQuality } from './logic';
import type { GameEngine } from '../../engine/GameEngine';

interface PerfectHitProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const PerfectHitGame: React.FC<PerfectHitProps> = ({ onFinish, isPaused }) => {
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [score, setScore] = useState(0);
  const [roundsLeft, setRoundsLeft] = useState(5);
  const [lastFeedback, setLastFeedback] = useState('');

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setPos((prev) => {
        let next = prev + dir * 3;
        if (next >= 100) {
          next = 100;
          setDir(-1);
        } else if (next <= 0) {
          next = 0;
          setDir(1);
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, dir]);

  const handleHit = () => {
    if (isPaused || roundsLeft <= 0) return;

    const { type, points } = evaluateHitQuality(pos);
    const newScore = score + points;
    setScore(newScore);
    setLastFeedback(`${type}! +${points}`);

    const remaining = roundsLeft - 1;
    setRoundsLeft(remaining);

    if (remaining === 0) {
      onFinish(newScore, newScore >= 50, { finalScore: newScore });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.roundsText}>Hits Remaining: {roundsLeft}</Text>
        {lastFeedback !== '' && <Text style={styles.feedbackText}>{lastFeedback}</Text>}
      </View>

      {/* Target Meter Track */}
      <View style={styles.track}>
        {/* Good Zone (32% - 68%) */}
        <View style={[styles.zone, styles.goodZone]} />
        {/* Great Zone (40% - 60%) */}
        <View style={[styles.zone, styles.greatZone]} />
        {/* Golden Perfect Zone (46% - 54%) */}
        <View style={[styles.zone, styles.perfectZone]} />

        {/* Moving Needle */}
        <View style={[styles.needle, { left: `${pos}%` }]} />
      </View>

      {/* Hit Button */}
      <Pressable
        style={({ pressed }) => [styles.hitBtn, pressed && styles.pressed]}
        onPress={handleHit}
      >
        <Text style={styles.hitBtnText}>💥 HIT!</Text>
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
  roundsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  feedbackText: {
    fontSize: Typography.h4,
    color: Colors.warning,
    fontWeight: Typography.bold,
    marginTop: 8,
  },
  track: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  zone: {
    position: 'absolute',
    height: '100%',
  },
  goodZone: {
    left: '32%',
    width: '36%',
    backgroundColor: Colors.surfaceLight,
  },
  greatZone: {
    left: '40%',
    width: '20%',
    backgroundColor: Colors.primary + '40',
  },
  perfectZone: {
    left: '46%',
    width: '8%',
    backgroundColor: Colors.warning,
  },
  needle: {
    position: 'absolute',
    width: 6,
    height: '100%',
    backgroundColor: '#FFFFFF',
    ...Shadows.glow('#FFFFFF'),
  },
  hitBtn: {
    width: 200,
    height: 90,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  hitBtnText: {
    fontSize: Typography.h3,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
