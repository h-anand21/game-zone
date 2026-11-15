// ============================================================
// Block Blast — 8x8 Game Board Component with Ghost Preview
// ============================================================

import React from 'react';
import { View, StyleSheet, LayoutChangeEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockCell } from './BlockCell';
import type { BlockGrid, GhostPreview } from '../types';
import { GRID_DIM } from '../logic';

interface GameBoardProps {
  grid: BlockGrid;
  boardWidth: number;
  ghostPreview: GhostPreview | null;
  onLayoutBoard: (e: LayoutChangeEvent) => void;
  onCellTap?: (row: number, col: number) => void;
  clearingRows?: number[];
  clearingCols?: number[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  boardWidth,
  ghostPreview,
  onLayoutBoard,
  onCellTap,
  clearingRows = [],
  clearingCols = [],
}) => {
  // Padding & gap layout calculations
  const PADDING = 8;
  const GAP = 3.5;
  const innerWidth = boardWidth - PADDING * 2;
  const cellSize = Math.floor((innerWidth - GAP * (GRID_DIM - 1)) / GRID_DIM);

  // Helper to check if (r, c) is covered by ghost preview
  const isGhostCell = (r: number, c: number): boolean => {
    if (!ghostPreview) return false;
    const { row: gr, col: gc, piece } = ghostPreview;
    const relR = r - gr;
    const relC = c - gc;
    if (
      relR >= 0 &&
      relR < piece.matrix.length &&
      relC >= 0 &&
      relC < piece.matrix[relR].length
    ) {
      return Boolean(piece.matrix[relR][relC]);
    }
    return false;
  };

  return (
    <View
      style={[
        styles.outerBoard,
        {
          width: boardWidth,
          height: boardWidth,
        },
      ]}
      onLayout={onLayoutBoard}
    >
      <LinearGradient
        colors={['#0C1626', '#060B14']}
        style={[
          styles.innerBoardGradient,
          {
            padding: PADDING,
          },
        ]}
      >
        {grid.map((row, r) => {
          const isRowClearing = clearingRows.includes(r);
          return (
            <View key={`row-${r}`} style={[styles.gridRow, { gap: GAP }]}>
              {row.map((cell, c) => {
                const isColClearing = clearingCols.includes(c);
                const isCellClearing = isRowClearing || isColClearing;
                const isGhost = !cell.filled && isGhostCell(r, c);

                return (
                  <Pressable
                    key={`cell-${r}-${c}`}
                    disabled={!onCellTap}
                    onPress={() => onCellTap?.(r, c)}
                  >
                    <BlockCell
                      size={cellSize}
                      filled={cell.filled}
                      colorKey={isGhost ? ghostPreview?.piece.colorKey : cell.colorKey}
                      isGhost={isGhost}
                      isClearing={isCellClearing}
                    />
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBoard: {
    borderRadius: 20,
    backgroundColor: '#0A1322',
    borderWidth: 2,
    borderColor: '#1C3150',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  innerBoardGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
