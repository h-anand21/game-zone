// ============================================================
// GameHub — Sky Jump Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialSkyJumpState, updateSkyJumpStep } from './logic';
import type { SkyJumpState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface SkyJumpProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const SkyJumpGame: React.FC<SkyJumpProps> = ({ onFinish, isPaused }) => {
  const [jumpState, setJumpState] = useState<SkyJumpState>(() => getInitialSkyJumpState());
  const moveDirRef = useRef<-1 | 0 | 1>(0);

  useEffect(() => {
    if (isPaused || jumpState.gameOver) return;

    const timer = setInterval(() => {
      setJumpState((prev) => {
        const next = updateSkyJumpStep(prev, moveDirRef.current);
        if (next.gameOver && !prev.gameOver) {
          onFinish(next.score, next.score >= 500, { finalScore: next.score });
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, jumpState.gameOver, onFinish]);

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>Height Score: {jumpState.score}</Text>
      </View>

      {/* Jump Canvas */}
      <View style={styles.arena}>
        {/* Platforms */}
        {jumpState.platforms.map((plat) => (
          <View
            key={plat.id}
            style={[
              styles.platform,
              {
                left: `${plat.x}%`,
                bottom: `${plat.y}%`,
                width: `${plat.width}%`,
              },
            ]}
          />
        ))}

        {/* Player Character */}
        <View
          style={[
            styles.player,
            {
              left: `${jumpState.playerX}%`,
              bottom: `${jumpState.playerY}%`,
            },
          ]}
        >
          <Text style={styles.playerIcon}>🚀</Text>
        </View>
      </View>

      {/* Touch Controls */}
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}
          onPressIn={() => (moveDirRef.current = -1)}
          onPressOut={() => (moveDirRef.current = 0)}
        >
          <Text style={styles.ctrlText}>◀ LEFT</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}
          onPressIn={() => (moveDirRef.current = 1)}
          onPressOut={() => (moveDirRef.current = 0)}
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
  scoreCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h3,
    color: Colors.primary,
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
  platform: {
    position: 'absolute',
    height: 12,
    backgroundColor: Colors.success,
    borderRadius: 6,
    ...Shadows.glow(Colors.success),
  },
  player: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerIcon: {
    fontSize: 24,
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
