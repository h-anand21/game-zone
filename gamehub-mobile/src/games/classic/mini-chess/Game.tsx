// ============================================================
// GameHub — Mini Chess Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialMiniChessBoard, getPieceEmoji } from './logic';
import type { ChessBoard } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface MiniChessProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const MiniChessGame: React.FC<MiniChessProps> = ({ onFinish, isPaused }) => {
  const [board, setBoard] = useState<ChessBoard>(() => getInitialMiniChessBoard());
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);

  const handleCellPress = (row: number, col: number) => {
    if (isPaused) return;

    const cell = board[row][col];

    if (selectedPos === null) {
      if (cell && cell.color === turn) {
        setSelectedPos([row, col]);
      }
    } else {
      const [fromR, fromC] = selectedPos;
      const piece = board[fromR][fromC];

      if (piece && (fromR !== row || fromC !== col)) {
        // Execute move
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = piece;
        newBoard[fromR][fromC] = null;
        setBoard(newBoard);
        setSelectedPos(null);

        // Check King capture
        if (cell?.kind === 'king') {
          const playerWon = turn === 'white';
          onFinish(playerWon ? 300 : 0, playerWon, { winner: turn });
        } else {
          setTurn(turn === 'white' ? 'black' : 'white');
        }
      } else {
        setSelectedPos(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.turnText}>Turn: {turn.toUpperCase()}</Text>
        <Text style={styles.subText}>Tap a piece to select, then tap target square</Text>
      </View>

      {/* 5x5 Board */}
      <View style={styles.boardContainer}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const isDarkSquare = (r + c) % 2 === 1;
              const isSelected = selectedPos?.[0] === r && selectedPos?.[1] === c;

              return (
                <Pressable
                  key={c}
                  style={[
                    styles.cell,
                    isDarkSquare ? styles.darkSquare : styles.lightSquare,
                    isSelected && styles.selectedSquare,
                  ]}
                  onPress={() => handleCellPress(r, c)}
                >
                  <Text style={styles.pieceEmoji}>{getPieceEmoji(cell)}</Text>
                </Pressable>
              );
            })}
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
  infoCard: {
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
  subText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  boardContainer: {
    width: 290,
    height: 290,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.sm,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightSquare: {
    backgroundColor: '#E2E8F0',
  },
  darkSquare: {
    backgroundColor: '#475569',
  },
  selectedSquare: {
    borderWidth: 3,
    borderColor: Colors.warning,
  },
  pieceEmoji: {
    fontSize: 34,
  },
});
