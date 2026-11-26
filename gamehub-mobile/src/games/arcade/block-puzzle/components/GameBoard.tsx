// ============================================================
// Block Puzzle — Carved Wooden 10x20 Recessed Board Tray
// Preserves real-time touch sliding, tap-to-rotate & flick-to-slam
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
import { WOOD_PALETTE } from './woodTheme';
import type { FallingGrid, ActivePiece, BlockColor } from '../types';
import { GRID_ROWS, GRID_COLS } from '../logic';

export const BOARD_GAP = 1.5;
export const BOARD_PADDING = 7;

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
  const FRAME_BORDER = 4;
  const boardWidth =
    cellSize * GRID_COLS + GAP * (GRID_COLS - 1) + PADDING * 2 + FRAME_BORDER * 2;
  const boardHeight =
    cellSize * GRID_ROWS + GAP * (GRID_ROWS - 1) + PADDING * 2 + FRAME_BORDER * 2;

  // Real-time Gesture Tracking Refs (unchanged core gameplay input)
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
      onPanResponderMove: (_e, gestureState) => {
        const step = cellSize + GAP;

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

        const totalDy = gestureState.dy;
        if (totalDy > step * 1.4) {
          const dropStep = Math.trunc(totalDy / (step * 1.4));
          if (dropStep > lastDropStepRef.current) {
            onSoftDrop();
            lastDropStepRef.current = dropStep;
          }
        }
      },
      onPanResponderRelease: (_e, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const dt = Date.now() - touchStartRef.current.time;
        const step = cellSize + GAP;

        if (Math.abs(dx) < 18 && Math.abs(dy) < 18 && dt < 280) {
          onRotate();
        } else if ((dy > 35 && gestureState.vy > 0.45) || dy > step * 2.5) {
          onHardDrop();
        }
      },
    })
  ).current;

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
        styles.outerBevelFrame,
        {
          width: boardWidth,
          height: boardHeight,
          padding: FRAME_BORDER,
        },
      ]}
      onLayout={onLayoutBoard}
    >
      <View style={styles.innerRecessShadow}>
        <LinearGradient
          colors={WOOD_PALETTE.trayInnerGradient}
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
                      checkerAlt={(r + c) % 2 === 1}
                    />
                  );
                })}

                {/* Golden light sweep beam on clearing row */}
                {isRowClearing && (
                  <LinearGradient
                    pointerEvents="none"
                    colors={WOOD_PALETTE.clearGlowGradient}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.clearRowBeam}
                  />
                )}
              </View>
            );
          })}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBevelFrame: {
    borderRadius: 16,
    backgroundColor: WOOD_PALETTE.trayOuterBg,
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 3,
    borderTopColor: WOOD_PALETTE.trayBevelTop,
    borderLeftColor: WOOD_PALETTE.trayBevelTop,
    borderRightColor: WOOD_PALETTE.trayBevelBottom,
    borderBottomColor: WOOD_PALETTE.trayBevelBottom,
    shadowColor: '#2A1204',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  innerRecessShadow: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.trayInnerBorder,
    overflow: 'hidden',
  },
  innerBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: BOARD_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  clearRowBeam: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
});
