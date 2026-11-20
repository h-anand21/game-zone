// ============================================================
// Block Blast — Immersive Full-Screen 10x20 Game Board
// Real-time touch sliding, tap-to-rotate & flick-to-slam
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockCell } from './BlockCell';
import type { FallingGrid, ActivePiece, BlockColor } from '../types';
import { GRID_ROWS, GRID_COLS } from '../logic';

export const BOARD_GAP = 2;
export const BOARD_PADDING = 6;

interface GameBoardProps {
  grid: FallingGrid;
  activePiece: ActivePiece | null;
  ghostRow: number;
  cellSize: number;
  clearingRows?: number[];
  onLayoutBoard?: (e: LayoutChangeEvent) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  activePiece,
  ghostRow,
  cellSize,
  clearingRows = [],
  onLayoutBoard,
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
}) => {
  const GAP = BOARD_GAP;
  const PADDING = BOARD_PADDING;
  const boardWidth = cellSize * GRID_COLS + GAP * (GRID_COLS - 1) + PADDING * 2;
  const boardHeight = cellSize * GRID_ROWS + GAP * (GRID_ROWS - 1) + PADDING * 2;

  // Real-time Gesture Tracking Refs
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastColDeltaRef = useRef<number>(0);
  const lastDropStepRef = useRef<number>(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: (e) => {
        touchStartRef.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
          time: Date.now(),
        };
        lastColDeltaRef.current = 0;
        lastDropStepRef.current = 0;
      },
      onPanResponderMove: (e, gestureState) => {
        const step = cellSize + GAP;

        // 1. Real-time Column Slide Tracking
        const totalDx = gestureState.dx;
        const targetColDelta = Math.trunc(totalDx / step);
        const colDiff = targetColDelta - lastColDeltaRef.current;

        if (colDiff > 0) {
          for (let i = 0; i < colDiff; i++) {
            onMoveRight();
          }
          lastColDeltaRef.current = targetColDelta;
        } else if (colDiff < 0) {
          for (let i = 0; i < Math.abs(colDiff); i++) {
            onMoveLeft();
          }
          lastColDeltaRef.current = targetColDelta;
        }

        // 2. Drag Downward Soft Drop
        const totalDy = gestureState.dy;
        if (totalDy > step * 1.4) {
          const dropStep = Math.trunc(totalDy / (step * 1.4));
          if (dropStep > lastDropStepRef.current) {
            onSoftDrop();
            lastDropStepRef.current = dropStep;
          }
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const dt = Date.now() - touchStartRef.current.time;
        const step = cellSize + GAP;

        // Quick Tap: Rotate piece!
        if (Math.abs(dx) < 18 && Math.abs(dy) < 18 && dt < 280) {
          onRotate();
        }
        // Fast downward flick: Hard Drop (Instant Slam)!
        else if ((dy > 35 && gestureState.vy > 0.45) || dy > step * 2.5) {
          onHardDrop();
        }
      },
    })
  ).current;

  // Helper to check if (r, c) is occupied by active piece
  const getActivePieceCell = (r: number, c: number): BlockColor | null => {
    if (!activePiece) return null;
    const relR = r - activePiece.row;
    const relC = c - activePiece.col;
    if (
      relR >= 0 &&
      relR < activePiece.matrix.length &&
      relC >= 0 &&
      relC < activePiece.matrix[relR].length &&
      activePiece.matrix[relR][relC]
    ) {
      return activePiece.colorKey;
    }
    return null;
  };

  // Helper to check if (r, c) is occupied by ghost piece
  const isGhostCell = (r: number, c: number): boolean => {
    if (!activePiece || ghostRow === activePiece.row) return false;
    const relR = r - ghostRow;
    const relC = c - activePiece.col;
    if (
      relR >= 0 &&
      relR < activePiece.matrix.length &&
      relC >= 0 &&
      relC < activePiece.matrix[relR].length &&
      activePiece.matrix[relR][relC]
    ) {
      return true;
    }
    return false;
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.outerBoard,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
      onLayout={onLayoutBoard}
    >
      <LinearGradient
        colors={['#0D1A30', '#060D18']}
        style={[styles.innerBoard, { padding: PADDING }]}
      >
        {grid.map((row, r) => {
          const isRowClearing = clearingRows.includes(r);

          return (
            <View key={`row-${r}`} style={[styles.gridRow, { gap: GAP }]}>
              {row.map((cell, c) => {
                const activeColor = getActivePieceCell(r, c);
                const ghost = !cell.filled && !activeColor && isGhostCell(r, c);

                const isFilled = cell.filled || activeColor !== null;
                const colorKey = activeColor || cell.colorKey;

                return (
                  <BlockCell
                    key={`cell-${r}-${c}`}
                    size={cellSize}
                    filled={isFilled}
                    colorKey={ghost ? activePiece?.colorKey : colorKey}
                    isGhost={ghost}
                    isClearing={isRowClearing}
                  />
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
    backgroundColor: '#091220',
    borderWidth: 2,
    borderColor: '#1E3558',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
    overflow: 'hidden',
  },
  innerBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GAP,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
