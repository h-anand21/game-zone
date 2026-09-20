// ============================================================
// GameHub — Air Hockey Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialAirHockeyState, updateAirHockeyStep } from './logic';
import type { AirHockeyState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface AirHockeyProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const AirHockeyGame: React.FC<AirHockeyProps> = ({ onFinish, isPaused }) => {
  const [state, setState] = useState<AirHockeyState>(() => getInitialAirHockeyState());
  const touchRef = useRef<{ x?: number; y?: number }>({});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const tableWidth = 300;
        const tableHeight = 380;
        const normX = (gestureState.moveX / tableWidth) * 100;
        const normY = ((gestureState.moveY - 150) / tableHeight) * 100;
        touchRef.current = { x: normX, y: normY };
      },
    })
  ).current;

  useEffect(() => {
    if (isPaused || state.gameOver) return;

    const timer = setInterval(() => {
      setState((prev) => {
        const next = updateAirHockeyStep(prev, touchRef.current.x, touchRef.current.y);
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
  }, [isPaused, state.gameOver, onFinish]);

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.scoreRow}>
        <Text style={styles.playerScore}>PLAYER: {state.playerScore}</Text>
        <Text style={styles.vsText}>First to 7</Text>
        <Text style={styles.aiScore}>AI: {state.aiScore}</Text>
      </View>

      {/* Rink Table */}
      <View style={styles.rink} {...panResponder.panHandlers}>
        {/* Top Goal Net */}
        <View style={styles.goalTop} />

        {/* Center Line */}
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />

        {/* Bottom Goal Net */}
        <View style={styles.goalBottom} />

        {/* AI Mallet (Top) */}
        <View style={[styles.mallet, styles.aiMallet, { left: `${state.aiX}%`, top: `${state.aiY}%` }]} />

        {/* Player Mallet (Bottom) */}
        <View style={[styles.mallet, styles.playerMallet, { left: `${state.playerX}%`, top: `${state.playerY}%` }]} />

        {/* Puck */}
        <View style={[styles.puck, { left: `${state.puckX}%`, top: `${state.puckY}%` }]} />
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
  },
  aiScore: {
    fontSize: Typography.body,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
  rink: {
    width: '100%',
    height: 380,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    borderWidth: 3,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.borderLight,
  },
  centerCircle: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  goalTop: {
    position: 'absolute',
    top: 0,
    left: '30%',
    width: '40%',
    height: 8,
    backgroundColor: Colors.accent,
  },
  goalBottom: {
    position: 'absolute',
    bottom: 0,
    left: '30%',
    width: '40%',
    height: 8,
    backgroundColor: Colors.primary,
  },
  mallet: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: -18,
    marginTop: -18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerMallet: {
    backgroundColor: Colors.primary,
    ...Shadows.glow(Colors.primary),
  },
  aiMallet: {
    backgroundColor: Colors.accent,
    ...Shadows.glow(Colors.accent),
  },
  puck: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: -11,
    marginTop: -11,
    backgroundColor: Colors.warning,
    ...Shadows.glow(Colors.warning),
  },
});
