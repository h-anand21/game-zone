// ============================================================
// GameHub — Connect 4 Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialConnect4Board, dropChip, checkConnect4Win, COLS } from './logic';
import type { Connect4Board, ChipColor } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface Connect4Props {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const Connect4Game: React.FC<Connect4Props> = ({ onFinish, isPaused }) => {
  const [board, setBoard] = useState<Connect4Board>(() => getInitialConnect4Board());
  const [turn, setTurn] = useState<'red' | 'yellow'>('red');
  const [statusMsg, setStatusMsg] = useState('Player Red Turn');

  // Handle AI turn when yellow
  useEffect(() => {
    if (isPaused) return;

    if (turn === 'yellow') {
      const timer = setTimeout(() => {
        const randomCol = Math.floor(Math.random() * COLS);
        makeMove(randomCol, 'yellow');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [turn, board, isPaused]);

  const makeMove = (col: number, color: ChipColor) => {
    const newBoard = dropChip(board, col, color);
    if (!newBoard) return;

    setBoard(newBoard);
    const winner = checkConnect4Win(newBoard);

    if (winner) {
      const won = winner === 'red';
      setStatusMsg(won ? 'Red Wins!' : 'Yellow Wins!');
      onFinish(won ? 200 : 0, won, { winner });
    } else {
      const nextTurn = color === 'red' ? 'yellow' : 'red';
      setTurn(nextTurn);
      setStatusMsg(nextTurn === 'yellow' ? 'AI is thinking...' : 'Player Red Turn');
    }
  };

  const handleColPress = (col: number) => {
    if (turn === 'yellow' || isPaused) return;
    makeMove(col, 'red');
  };

  return (
    <View style={styles.container}>
      {/* Turn Banner */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* Column Drop Buttons */}
      <View style={styles.colHeaderRow}>
        {Array.from({ length: COLS }).map((_, c) => (
          <Pressable
            key={c}
            disabled={turn === 'yellow'}
            style={({ pressed }) => [styles.dropBtn, pressed && styles.pressed]}
            onPress={() => handleColPress(c)}
          >
            <Text style={styles.dropArrow}>▼</Text>
          </Pressable>
        ))}
      </View>

      {/* Board Grid */}
      <View style={styles.boardContainer}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((chip, c) => (
              <View
                key={c}
                style={[
                  styles.hole,
                  chip === 'red' && styles.redChip,
                  chip === 'yellow' && styles.yellowChip,
                ]}
              />
            ))}
          </View>
        ))}
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
  statusBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  colHeaderRow: {
    flexDirection: 'row',
    width: 290,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dropBtn: {
    width: 36,
    height: 36,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropArrow: {
    fontSize: 16,
    color: Colors.primary,
  },
  boardContainer: {
    width: 300,
    height: 260,
    backgroundColor: '#1E3A8A', // Deep blue Connect 4 frame
    borderRadius: BorderRadius.xl,
    padding: 8,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 3,
  },
  hole: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.background,
  },
  redChip: {
    backgroundColor: Colors.accent,
    ...Shadows.glow(Colors.accent),
  },
  yellowChip: {
    backgroundColor: Colors.warning,
    ...Shadows.glow(Colors.warning),
  },
  pressed: {
    opacity: 0.8,
  },
});
