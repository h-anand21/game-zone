// ============================================================
// GameHub — Bagh-Bakri Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialBaghBakriBoard } from './logic';
import type { BaghBakriBoard } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface BaghBakriProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const BaghBakriGame: React.FC<BaghBakriProps> = ({ onFinish, isPaused }) => {
  const [board, setBoard] = useState<BaghBakriBoard>(() => getInitialBaghBakriBoard());
  const [goatsPlaced, setGoatsPlaced] = useState(0);
  const [goatsCaptured, setGoatsCaptured] = useState(0);
  const [turn, setTurn] = useState<'goat' | 'tiger'>('goat');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleCellPress = (idx: number) => {
    if (isPaused) return;

    if (goatsPlaced < 20 && turn === 'goat') {
      // Place goat
      if (!board[idx]) {
        const newBoard = [...board];
        newBoard[idx] = 'goat';
        setBoard(newBoard);
        const nextPlaced = goatsPlaced + 1;
        setGoatsPlaced(nextPlaced);
        setTurn('tiger');
      }
    } else {
      // Move logic
      if (selectedIdx === null) {
        if (board[idx] === turn) setSelectedIdx(idx);
      } else {
        if (!board[idx]) {
          const newBoard = [...board];
          newBoard[idx] = turn;
          newBoard[selectedIdx] = null;
          setBoard(newBoard);
          setSelectedIdx(null);
          setTurn(turn === 'goat' ? 'tiger' : 'goat');
        } else {
          setSelectedIdx(null);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBox}>
        <Text style={styles.turnText}>Turn: {turn.toUpperCase()}</Text>
        <Text style={styles.statsText}>
          Goats Placed: {goatsPlaced}/20 • Captured: {goatsCaptured}/5
        </Text>
      </View>

      {/* 5x5 Grid */}
      <View style={styles.board}>
        {board.map((cell, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <Pressable
              key={idx}
              style={[
                styles.cell,
                isSelected && styles.selectedCell,
              ]}
              onPress={() => handleCellPress(idx)}
            >
              <Text style={styles.pieceEmoji}>
                {cell === 'tiger' ? '🐅' : cell === 'goat' ? '🐐' : ''}
              </Text>
            </Pressable>
          );
        })}
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
  turnText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  board: {
    width: 300,
    height: 300,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  cell: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  pieceEmoji: {
    fontSize: 24,
  },
});
