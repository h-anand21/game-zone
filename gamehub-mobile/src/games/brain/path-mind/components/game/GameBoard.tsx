// ============================================================
// PATH MIND — Component 08: GameBoard
// Master responsive board with tactile tiles, continuous drag/swipe tracing,
// and radiant SVG energy path lines
// ============================================================

import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { GridTile, TileState } from './GridTile';
import { pmColors } from '../../design-system/colors';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import type { GridPos } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameBoardProps {
  gridSize?: number; // 4, 5, 6
  path?: GridPos[];
  playerPath?: GridPos[];
  phase?: 'memorize' | 'hide' | 'recall' | 'build' | 'preview';
  numbersMap?: Record<string, number>;
  disabled?: boolean;
  onTilePress?: (row: number, col: number) => void;
  maxWidth?: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize = 4,
  path = [],
  playerPath = [],
  phase = 'recall',
  numbersMap = {},
  disabled = false,
  onTilePress,
  maxWidth = Math.min(SCREEN_WIDTH - 36, 350),
}) => {
  const gap = 8;
  const padding = 12;
  const boardInnerWidth = maxWidth - padding * 2;
  const tileSize = Math.floor((boardInnerWidth - (gridSize - 1) * gap) / gridSize);
  const boardSize = tileSize * gridSize + (gridSize - 1) * gap + padding * 2;

  // Track last touched cell during drag gesture to avoid duplicate fires
  const lastCellRef = useRef<{ row: number; col: number } | null>(null);

  const handleTouchAt = (x: number, y: number) => {
    if (disabled) return;
    if (phase !== 'recall' && phase !== 'build') return;

    const relX = x - padding;
    const relY = y - padding;
    const step = tileSize + gap;

    const c = Math.floor(relX / step);
    const r = Math.floor(relY / step);

    // Check boundaries
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;

    // Check inside cell with a generous hit area for smooth dragging
    const inCellX = relX - c * step;
    const inCellY = relY - r * step;
    if (inCellX < -4 || inCellX > tileSize + 4 || inCellY < -4 || inCellY > tileSize + 4) return;

    // Avoid duplicate calls for the same cell
    if (lastCellRef.current && lastCellRef.current.row === r && lastCellRef.current.col === c) {
      return;
    }

    lastCellRef.current = { row: r, col: c };
    onTilePress?.(r, c);
  };

  // Continuous Drag / Swipe gesture responder
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled && (phase === 'recall' || phase === 'build'),
        onMoveShouldSetPanResponder: () => !disabled && (phase === 'recall' || phase === 'build'),
        onPanResponderGrant: (evt) => {
          handleTouchAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderMove: (evt) => {
          handleTouchAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderRelease: () => {
          lastCellRef.current = null;
        },
        onPanResponderTerminate: () => {
          lastCellRef.current = null;
        },
      }),
    [disabled, phase, tileSize, gap, padding, gridSize, onTilePress]
  );

  // Determine state of each cell
  const getCellState = (r: number, c: number): TileState => {
    const isStart = path.length > 0 && path[0].row === r && path[0].col === c;
    const isGoal = path.length > 0 && path[path.length - 1].row === r && path[path.length - 1].col === c;
    const inTarget = path.some((p) => p.row === r && p.col === c);
    const inPlayer = playerPath.some((p) => p.row === r && p.col === c);

    if (phase === 'memorize' || phase === 'preview') {
      if (isStart) return 'start';
      if (isGoal) return 'goal';
      if (inTarget) return 'highlighted';
      return 'idle';
    }

    if (phase === 'recall' || phase === 'build') {
      if (isStart && inPlayer) return 'start';
      if (inPlayer) return 'selected';
      if (isStart) return 'start';
      return 'idle';
    }

    return 'idle';
  };

  // Calculate SVG line points connecting player steps
  const pathPoints = useMemo(() => {
    const activePath = phase === 'memorize' || phase === 'preview' ? path : playerPath;
    if (activePath.length <= 1) return '';

    return activePath
      .map((pos) => {
        const x = padding + pos.col * (tileSize + gap) + tileSize / 2;
        const y = padding + pos.row * (tileSize + gap) + tileSize / 2;
        return `${x},${y}`;
      })
      .join(' ');
  }, [path, playerPath, phase, tileSize, gap, padding]);

  return (
    <View style={[styles.boardContainer, { width: boardSize, height: boardSize }]}>
      {/* Layer 1: SVG Path Trail Overlay */}
      {pathPoints.length > 0 && (
        <Svg
          width={boardSize}
          height={boardSize}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {/* Outer Cyan Glow Trail */}
          <Polyline
            points={pathPoints}
            fill="none"
            stroke="rgba(0, 240, 255, 0.45)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Sharp Energy Beam */}
          <Polyline
            points={pathPoints}
            fill="none"
            stroke={pmColors.cyanGlow}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}

      {/* Layer 2: Grid of Stone Tiles */}
      <View style={[styles.grid, { padding }]} pointerEvents="none">
        {Array.from({ length: gridSize }).map((_, r) => (
          <View key={`row-${r}`} style={[styles.row, { gap, marginBottom: r < gridSize - 1 ? gap : 0 }]}>
            {Array.from({ length: gridSize }).map((_, c) => {
              const state = getCellState(r, c);
              const key = `${r}-${c}`;
              const number = numbersMap[key];

              return (
                <GridTile
                  key={key}
                  row={r}
                  col={c}
                  size={tileSize}
                  state={state}
                  number={number}
                  disabled={disabled}
                  onPress={(row, col) => onTilePress?.(row, col)}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Layer 3: Gesture Detection Overlay for Continuous Drag & Tap */}
      <View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: 'rgba(8, 16, 24, 0.94)',
    borderRadius: pmRadii.xxl,
    borderWidth: 3,
    borderBottomWidth: 6,
    borderColor: '#384B59',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...pmShadows.heavy,
  },
  grid: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
