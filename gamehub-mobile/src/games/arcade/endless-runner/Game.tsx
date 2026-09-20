// ============================================================
// GameHub — Endless Runner Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, type DimensionValue } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialRunnerState, updateRunnerStep } from './logic';
import type { Lane, RunnerState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface EndlessRunnerProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const EndlessRunnerGame: React.FC<EndlessRunnerProps> = ({ onFinish, isPaused }) => {
  const [runnerState, setRunnerState] = useState<RunnerState>(() => getInitialRunnerState());

  useEffect(() => {
    if (isPaused || runnerState.gameOver) return;

    const timer = setInterval(() => {
      setRunnerState((prev) => {
        const next = updateRunnerStep(prev);
        if (next.gameOver && !prev.gameOver) {
          onFinish(next.score, next.score >= 500, {
            distance: next.score,
            coins: next.coinsCollected,
          });
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, runnerState.gameOver, onFinish]);

  const switchLane = (targetLane: Lane) => {
    if (isPaused) return;
    setRunnerState((prev) => ({ ...prev, playerLane: targetLane }));
  };

  const laneXOffsets: DimensionValue[] = ['15%', '50%', '85%'];

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <Text style={styles.scoreText}>Distance: {runnerState.score}m</Text>
        <Text style={styles.coinsText}>🪙 {runnerState.coinsCollected}</Text>
      </View>

      {/* 3-Lane Track */}
      <View style={styles.track}>
        {/* Lane dividers */}
        <View style={[styles.divider, { left: '33.3%' }]} />
        <View style={[styles.divider, { left: '66.6%' }]} />

        {/* Obstacles & Coins */}
        {runnerState.obstacles.map((obs) => (
          <View
            key={obs.id}
            style={[
              styles.item,
              {
                left: laneXOffsets[obs.lane],
                top: `${obs.y}%`,
              },
            ]}
          >
            <Text style={styles.itemEmoji}>{obs.type === 'obstacle' ? '🚧' : '🪙'}</Text>
          </View>
        ))}

        {/* Player Runner */}
        <View style={[styles.player, { left: laneXOffsets[runnerState.playerLane] }]}>
          <Text style={styles.playerEmoji}>🏃</Text>
        </View>
      </View>

      {/* Lane Change Buttons */}
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}
          onPress={() => switchLane(Math.max(0, runnerState.playerLane - 1) as Lane)}
        >
          <Text style={styles.ctrlText}>◀ LEFT</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}
          onPress={() => switchLane(Math.min(2, runnerState.playerLane + 1) as Lane)}
        >
          <Text style={styles.ctrlText}>RIGHT ▶</Text>
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
    justifyContent: 'space-around',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  coinsText: {
    fontSize: Typography.body,
    color: Colors.warning,
    fontWeight: Typography.bold,
  },
  track: {
    width: '100%',
    height: 380,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.borderLight,
  },
  item: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 28,
  },
  player: {
    position: 'absolute',
    bottom: 30,
    width: 44,
    height: 44,
    marginLeft: -22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '30',
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  playerEmoji: {
    fontSize: 28,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.xl,
    width: '100%',
    justifyContent: 'center',
  },
  ctrlBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  ctrlText: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
