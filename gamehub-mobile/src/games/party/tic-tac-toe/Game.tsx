// ============================================================
// GameHub — Tic Tac Toe Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { checkWinner, getAIMove } from './logic';
import type { Board, PlayerSymbol, GameMode, AIDifficulty } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface TicTacToeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ onFinish, isPaused }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<PlayerSymbol>('X');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('hard');
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [statusText, setStatusText] = useState('Player X Turn');

  // Handle AI turn
  useEffect(() => {
    if (isPaused) return;

    if (gameMode === 'ai' && turn === 'O') {
      const timer = setTimeout(() => {
        const aiIndex = getAIMove([...board], difficulty);
        if (aiIndex !== -1) {
          makeMove(aiIndex, 'O');
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [turn, board, gameMode, difficulty, isPaused]);

  const makeMove = (index: number, player: PlayerSymbol) => {
    if (board[index] || winningCombo || isPaused) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      if (result.winner === 'DRAW') {
        setStatusText('Game Draw!');
        onFinish(0, false, { mode: gameMode, draw: true });
      } else {
        setWinningCombo(result.combo || null);
        const playerWon = result.winner === 'X';
        setStatusText(`Player ${result.winner} Wins!`);
        onFinish(playerWon ? 1 : 0, playerWon, { mode: gameMode, winner: result.winner });
      }
    } else {
      const nextTurn = player === 'X' ? 'O' : 'X';
      setTurn(nextTurn);
      setStatusText(gameMode === 'ai' && nextTurn === 'O' ? 'AI is thinking...' : `Player ${nextTurn} Turn`);
    }
  };

  const handleCellPress = (index: number) => {
    if (gameMode === 'ai' && turn === 'O') return;
    makeMove(index, 'X');
  };

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeBtn, gameMode === 'ai' && styles.modeBtnActive]}
          onPress={() => {
            setGameMode('ai');
            setBoard(Array(9).fill(null));
            setTurn('X');
            setWinningCombo(null);
            setStatusText('Player X Turn');
          }}
        >
          <Text style={[styles.modeText, gameMode === 'ai' && styles.modeTextActive]}>🤖 vs AI</Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, gameMode === 'pvp' && styles.modeBtnActive]}
          onPress={() => {
            setGameMode('pvp');
            setBoard(Array(9).fill(null));
            setTurn('X');
            setWinningCombo(null);
            setStatusText('Player X Turn');
          }}
        >
          <Text style={[styles.modeText, gameMode === 'pvp' && styles.modeTextActive]}>👥 2 Players</Text>
        </Pressable>
      </View>

      {/* Turn Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{statusText}</Text>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {board.map((cell, idx) => {
            const isWinningCell = winningCombo?.includes(idx);
            return (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.cell,
                  isWinningCell && styles.winningCell,
                  pressed && styles.cellPressed,
                ]}
                onPress={() => handleCellPress(idx)}
              >
                <Text
                  style={[
                    styles.cellText,
                    cell === 'X' ? styles.cellX : styles.cellO,
                  ]}
                >
                  {cell}
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
  modeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  modeBtnActive: {
    backgroundColor: Colors.primary,
  },
  modeText: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  banner: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bannerText: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  gridContainer: {
    width: 320,
    height: 320,
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
  cell: {
    width: 92,
    height: 92,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPressed: {
    opacity: 0.7,
  },
  winningCell: {
    backgroundColor: Colors.success + '40',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  cellText: {
    fontSize: 48,
    fontWeight: Typography.bold,
  },
  cellX: {
    color: Colors.primary,
  },
  cellO: {
    color: Colors.accent,
  },
});
