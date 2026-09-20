// ============================================================
// GameHub — Block Puzzle Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { createEmptyGrid, generateRandomPiece, canPlacePiece, placePieceAndClearLines, GRID_DIM } from './logic';
import type { BlockGrid, ShapePiece } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface BlockPuzzleProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const BlockPuzzleGame: React.FC<BlockPuzzleProps> = ({ onFinish, isPaused }) => {
  const [grid, setGrid] = useState<BlockGrid>(() => createEmptyGrid());
  const [score, setScore] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<ShapePiece | null>(null);
  const [availablePieces, setAvailablePieces] = useState<ShapePiece[]>(() => [
    generateRandomPiece(1),
    generateRandomPiece(2),
    generateRandomPiece(3),
  ]);

  const handleCellPress = (row: number, col: number) => {
    if (!selectedPiece || isPaused) return;

    if (canPlacePiece(grid, selectedPiece.matrix, row, col)) {
      const { newGrid, linesCleared } = placePieceAndClearLines(grid, selectedPiece.matrix, row, col);
      setGrid(newGrid);

      const pointsEarned = 10 + linesCleared * 50;
      const nextScore = score + pointsEarned;
      setScore(nextScore);

      // Remove piece
      const remainingPieces = availablePieces.filter((p) => p.id !== selectedPiece.id);
      setSelectedPiece(null);

      if (remainingPieces.length === 0) {
        // Refill 3 new pieces
        setAvailablePieces([
          generateRandomPiece(Date.now() + 1),
          generateRandomPiece(Date.now() + 2),
          generateRandomPiece(Date.now() + 3),
        ]);
      } else {
        setAvailablePieces(remainingPieces);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.instructionText}>
          {selectedPiece ? 'Tap grid to place piece' : 'Select a shape piece below'}
        </Text>
      </View>

      {/* 8x8 Grid */}
      <View style={styles.gridContainer}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((filled, c) => (
              <Pressable
                key={c}
                style={[styles.cell, filled && styles.cellFilled]}
                onPress={() => handleCellPress(r, c)}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Shapes Rack */}
      <View style={styles.rack}>
        {availablePieces.map((piece) => {
          const isSelected = selectedPiece?.id === piece.id;
          return (
            <Pressable
              key={piece.id}
              style={[
                styles.pieceCard,
                { backgroundColor: piece.color + '30', borderColor: piece.color },
                isSelected && styles.pieceCardSelected,
              ]}
              onPress={() => setSelectedPiece(piece)}
            >
              {piece.matrix.map((r, ri) => (
                <View key={ri} style={{ flexDirection: 'row' }}>
                  {r.map((active, ci) => (
                    <View
                      key={ci}
                      style={[
                        styles.miniCell,
                        active && { backgroundColor: piece.color },
                      ]}
                    />
                  ))}
                </View>
              ))}
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
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  instructionText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  gridContainer: {
    width: 296,
    height: 296,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 6,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 2,
  },
  cell: {
    width: 31,
    height: 31,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
  },
  cellFilled: {
    backgroundColor: Colors.primary,
    ...Shadows.glow(Colors.primary),
  },
  rack: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
    width: '100%',
  },
  pieceCard: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pieceCardSelected: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  miniCell: {
    width: 14,
    height: 14,
    borderRadius: 2,
    margin: 1,
  },
});
