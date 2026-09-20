// ============================================================
// GameHub — Pong Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialPongState, updatePongStep } from './logic';
import type { PongState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface PongProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const PongGame: React.FC<PongProps> = ({ onFinish, isPaused }) => {
  const [pongState, setPongState] = useState<PongState>(() => getInitialPongState());
  const touchYRef = useRef<number | undefined>(undefined);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Normalize touch Y position inside court
        const courtHeight = 350;
        const relativeY = Math.max(0, Math.min(courtHeight, gestureState.moveY - 180));
        touchYRef.current = (relativeY / courtHeight) * 100;
      },
    })
  ).current;

  useEffect(() => {
    if (isPaused || pongState.gameOver) return;

    const timer = setInterval(() => {
      setPongState((prev) => {
        const next = updatePongStep(prev, touchYRef.current);
        if (next.gameOver && !prev.gameOver) {
          const won = next.playerScore > next.aiScore;
          onFinish(next.playerScore * 10, won, {
            playerScore: next.playerScore,
            aiScore: next.aiScore,
          });
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused, pongState.gameOver, onFinish]);

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.scoreRow}>
        <Text style={styles.playerScore}>PLAYER: {pongState.playerScore}</Text>
        <Text style={styles.vsText}>VS</Text>
        <Text style={styles.aiScore}>AI: {pongState.aiScore}</Text>
      </View>

      {/* Pong Court */}
      <View style={styles.court} {...panResponder.panHandlers}>
        {/* Center Line */}
        <View style={styles.centerLine} />

        {/* Player Paddle (Left) */}
        <View style={[styles.paddle, styles.playerPaddle, { top: `${pongState.playerY}%` }]} />

        {/* AI Paddle (Right) */}
        <View style={[styles.paddle, styles.aiPaddle, { top: `${pongState.aiY}%` }]} />

        {/* Ball */}
        <View
          style={[
            styles.ball,
            {
              left: `${pongState.ballX}%`,
              top: `${pongState.ballY}%`,
            },
          ]}
        />
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerScore: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  vsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  aiScore: {
    fontSize: Typography.body,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
  court: {
    width: '100%',
    height: 350,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.borderLight,
  },
  paddle: {
    position: 'absolute',
    width: 10,
    height: 70,
    borderRadius: 5,
  },
  playerPaddle: {
    left: 8,
    backgroundColor: Colors.primary,
    ...Shadows.glow(Colors.primary),
  },
  aiPaddle: {
    right: 8,
    backgroundColor: Colors.accent,
    ...Shadows.glow(Colors.accent),
  },
  ball: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    ...Shadows.glow('#FFFFFF'),
  },
});
