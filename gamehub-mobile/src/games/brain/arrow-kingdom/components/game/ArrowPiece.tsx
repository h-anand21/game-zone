// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Neon Arrow Component
// Quadruple-pass SVG stroke rendering with glowing arrowhead,
// interactive touch scaling, blocked shake, and slide-out escape
// ============================================================

import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Pressable } from 'react-native';
import Svg, { Path, Polygon, Circle } from 'react-native-svg';
import type { ArrowPieceData, Cell, Direction } from '../../game/types';
import { ArrowHaptics } from '../../utils/haptics';

interface Props {
  piece: ArrowPieceData;
  cellSize: number;
  onPress: (piece: ArrowPieceData) => void;
  isBlocked?: boolean;
  isEscaping?: boolean;
  isHinted?: boolean;
  disabled?: boolean;
}

function buildSvgPath(cells: Cell[], cellSize: number): string {
  if (cells.length === 0) return '';
  return cells
    .map((cell, index) => {
      const x = cell.col * cellSize + cellSize / 2;
      const y = cell.row * cellSize + cellSize / 2;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function getArrowHeadPoints(
  lastCell: Cell,
  direction: Direction,
  cellSize: number
): string {
  const hx = lastCell.col * cellSize + cellSize / 2;
  const hy = lastCell.row * cellSize + cellSize / 2;
  const tipOffset = cellSize * 0.36;
  const baseOffset = cellSize * 0.16;
  const wingOffset = cellSize * 0.30;

  switch (direction) {
    case 'right':
      return `${hx + tipOffset},${hy} ${hx - baseOffset},${hy - wingOffset} ${hx - baseOffset},${hy + wingOffset}`;
    case 'left':
      return `${hx - tipOffset},${hy} ${hx + baseOffset},${hy - wingOffset} ${hx + baseOffset},${hy + wingOffset}`;
    case 'up':
      return `${hx},${hy - tipOffset} ${hx - wingOffset},${hy + baseOffset} ${hx + wingOffset},${hy + baseOffset}`;
    case 'down':
      return `${hx},${hy + tipOffset} ${hx - wingOffset},${hy - baseOffset} ${hx + wingOffset},${hy - baseOffset}`;
  }
}

export const ArrowPiece: React.FC<Props> = ({
  piece,
  cellSize,
  onPress,
  isBlocked = false,
  isEscaping = false,
  isHinted = false,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Trigger blocked shake animation
  useEffect(() => {
    if (isBlocked) {
      ArrowHaptics.blocked();
      const shakeAxis = piece.direction === 'left' || piece.direction === 'right' ? translateX : translateY;
      const nudge = piece.direction === 'right' || piece.direction === 'down' ? 6 : -6;

      Animated.sequence([
        Animated.timing(shakeAxis, { toValue: nudge, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAxis, { toValue: -nudge * 1.2, duration: 70, useNativeDriver: true }),
        Animated.timing(shakeAxis, { toValue: nudge * 0.8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAxis, { toValue: -nudge * 0.4, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAxis, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isBlocked, piece.direction, translateX, translateY]);

  // Trigger escape slide-out animation
  useEffect(() => {
    if (isEscaping) {
      ArrowHaptics.slide();
      const distance = cellSize * 8; // slide far off-screen
      let dx = 0;
      let dy = 0;
      if (piece.direction === 'right') dx = distance;
      if (piece.direction === 'left') dx = -distance;
      if (piece.direction === 'down') dy = distance;
      if (piece.direction === 'up') dy = -distance;

      Animated.parallel([
        Animated.timing(translateX, { toValue: dx, duration: 320, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: dy, duration: 320, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 320, useNativeDriver: true }),
      ]).start();
    }
  }, [isEscaping, piece.direction, cellSize, translateX, translateY, opacityAnim]);

  // Hint pulse animation
  useEffect(() => {
    if (isHinted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.08, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isHinted, scaleAnim]);

  if (piece.removed && !isEscaping) {
    return null;
  }

  const path = buildSvgPath(piece.cells, cellSize);
  const headCell = piece.cells[piece.cells.length - 1];
  const headPoints = getArrowHeadPoints(headCell, piece.direction, cellSize);

  const displayColor = isBlocked ? '#FF4655' : piece.color;

  const handlePressIn = () => {
    if (disabled) return;
    ArrowHaptics.touch();
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View
      pointerEvents={disabled ? 'none' : 'box-none'}
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [
            { translateX },
            { translateY },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(piece)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || piece.removed}
        style={StyleSheet.absoluteFill}
      >
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Layer 1: Dark Outer Drop Shadow */}
          <Path
            d={path}
            stroke="rgba(0, 0, 0, 0.75)"
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Polygon points={headPoints} fill="rgba(0, 0, 0, 0.75)" stroke="rgba(0, 0, 0, 0.75)" strokeWidth={6} />

          {/* Layer 2: Wide Soft Neon Glow */}
          <Path
            d={path}
            stroke={displayColor}
            strokeOpacity={0.35}
            strokeWidth={22}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Polygon points={headPoints} fill={displayColor} opacity={0.35} stroke={displayColor} strokeWidth={8} />

          {/* Layer 3: Solid Saturated Neon Body */}
          <Path
            d={path}
            stroke={displayColor}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Polygon points={headPoints} fill={displayColor} stroke={displayColor} strokeWidth={2} strokeLinejoin="round" />

          {/* Layer 4: Thin Bright White Core Highlight */}
          <Path
            d={path}
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
};

export default ArrowPiece;
