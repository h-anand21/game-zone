// ============================================================
// GameHub — Don't Tap Wrong Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateTileGrid } from './logic';
import type { GridTileItem } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface DontTapWrongProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const DontTapWrongGame: React.FC<DontTapWrongProps> = ({ onFinish, isPaused }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [tiles, setTiles] = useState<GridTileItem[]>(() => generateTileGrid(9));

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score, score >= 15, { finalScore: score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, score, onFinish]);

  const handleTilePress = (tile: GridTileItem) => {
    if (isPaused || timeLeft <= 0) return;

    if (tile.type === 'correct') {
      const nextScore = score + 1;
      setScore(nextScore);
      setTiles(generateTileGrid(9));
    } else if (tile.type === 'wrong') {
      // Tapped wrong! Game over!
      onFinish(score, false, { reason: 'tapped_wrong', finalScore: score });
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

      {/* Instructions */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>Tap GREEN 🟢 • Avoid RED 🔴</Text>
      </View>

      {/* 3x3 Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {tiles.map((tile, idx) => {
            const isCorrect = tile.type === 'correct';
            const isWrong = tile.type === 'wrong';

            return (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.tile,
                  isCorrect && styles.correctTile,
                  isWrong && styles.wrongTile,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleTilePress(tile)}
              >
                <Text style={styles.tileEmoji}>
                  {isCorrect ? '🟢' : isWrong ? '🔴' : ''}
                </Text>
              </Pressable>
            );
          })}
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
  infoBanner: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  gridContainer: {
    width: 300,
    height: 300,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: 84,
    height: 84,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctTile: {
    backgroundColor: Colors.success + '30',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  wrongTile: {
    backgroundColor: Colors.error + '30',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  tileEmoji: {
    fontSize: 32,
  },
  pressed: {
    opacity: 0.8,
  },
});
