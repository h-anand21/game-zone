// ============================================================
// GameHub — Find One Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateRound } from './logic';
import type { RoundData } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface FindOneProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const FindOneGame: React.FC<FindOneProps> = ({ onFinish, isPaused }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [round, setRound] = useState<RoundData>(() => generateRound(0));

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score, score >= 10, { finalScore: score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, score, onFinish]);

  const handleTilePress = (isOdd: boolean) => {
    if (isPaused || timeLeft <= 0) return;

    if (isOdd) {
      const nextScore = score + 1;
      setScore(nextScore);
      setTimeLeft((prev) => Math.min(20, prev + 2)); // +2s bonus time!
      setRound(generateRound(nextScore));
    } else {
      // Wrong tile — -3s penalty
      setTimeLeft((prev) => Math.max(0, prev - 3));
    }
  };

  const tileSize = Math.floor(280 / round.gridSize) - 8;

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

      {/* Grid */}
      <View style={styles.gridContainer}>
        <View style={[styles.grid, { width: 280, height: 280 }]}>
          {round.tiles.map((tile) => (
            <Pressable
              key={tile.id}
              style={({ pressed }) => [
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: tile.color,
                },
                pressed && styles.pressed,
              ]}
              onPress={() => handleTilePress(tile.isOdd)}
            />
          ))}
        </View>
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
  gridContainer: {
    width: 300,
    height: 300,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    borderRadius: BorderRadius.md,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
