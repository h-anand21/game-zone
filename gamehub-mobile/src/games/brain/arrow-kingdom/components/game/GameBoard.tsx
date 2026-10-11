// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Interactive Puzzle GameBoard
// Deep fantasy navy board with subtle grid lines, inner depth,
// tutorial hand animation, and responsive SVG arrow pieces
// ============================================================

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Animated } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import type { ArrowPieceData, ThemeConfig } from '../../game/types';
import { ArrowPiece } from './ArrowPiece';

interface GameBoardProps {
  rows: number;
  cols: number;
  pieces: ArrowPieceData[];
  onPiecePress: (piece: ArrowPieceData) => void;
  blockedPieceId: string | null;
  escapingPieceId: string | null;
  hintedPieceId: string | null;
  theme: ThemeConfig;
  showTutorialHand?: boolean;
  disabled?: boolean;
  hiddenSymbol?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  rows,
  cols,
  pieces,
  onPiecePress,
  blockedPieceId,
  escapingPieceId,
  hintedPieceId,
  theme,
  showTutorialHand = false,
  disabled = false,
  hiddenSymbol,
}) => {
  const { width, height } = useWindowDimensions();

  // Responsive Board Size Calculation (square board centered in available viewport)
  const maxAllowedWidth = Math.min(width - 32, 380);
  const maxAllowedHeight = Math.floor(height * 0.50);
  const boardSize = Math.min(maxAllowedWidth, maxAllowedHeight > 240 ? maxAllowedHeight : 340);
  const cellSize = boardSize / Math.max(rows, cols);

  // Compute grid lines
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    // Horizontal
    for (let r = 1; r < rows; r++) {
      lines.push({
        x1: 0,
        y1: r * cellSize,
        x2: cols * cellSize,
        y2: r * cellSize,
      });
    }
    // Vertical
    for (let c = 1; c < cols; c++) {
      lines.push({
        x1: c * cellSize,
        y1: 0,
        x2: c * cellSize,
        y2: rows * cellSize,
      });
    }
    return lines;
  }, [rows, cols, cellSize]);

  return (
    <View style={styles.outerContainer}>
      {/* Board Bezel & Frame */}
      <View
        style={[
          styles.boardFrame,
          {
            width: boardSize,
            height: boardSize,
            backgroundColor: theme.boardBg,
            borderColor: theme.boardBorder,
            shadowColor: theme.glowColor,
          },
        ]}
      >
        {/* Subtle Neon Grid Texture */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {gridLines.map((l, idx) => (
            <Line
              key={`grid-${idx}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={theme.gridLineColor}
              strokeWidth={1}
            />
          ))}
          {/* Subtle outer inset rim */}
          <Rect
            x={1}
            y={1}
            width={boardSize - 2}
            height={boardSize - 2}
            rx={18}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1.5}
          />
        </Svg>

        {/* Hidden Kingdom Rune / Symbol underneath arrows */}
        {hiddenSymbol && (
          <View style={styles.hiddenSymbolBox} pointerEvents="none">
            <Text style={[styles.hiddenSymbolEmoji, { fontSize: boardSize * 0.44 }]}>
              {hiddenSymbol}
            </Text>
          </View>
        )}

        {/* All Arrow Pieces */}
        {pieces.map((piece) => (
          <ArrowPiece
            key={piece.id}
            piece={piece}
            cellSize={cellSize}
            onPress={onPiecePress}
            isBlocked={blockedPieceId === piece.id}
            isEscaping={escapingPieceId === piece.id}
            isHinted={hintedPieceId === piece.id}
            disabled={disabled}
          />
        ))}

        {/* Tutorial Animated Hand Helper */}
        {showTutorialHand && (
          <View style={styles.tutorialContainer} pointerEvents="none">
            <Text style={styles.handEmoji}>👆</Text>
            <View style={styles.tutorialPill}>
              <Text style={styles.tutorialPillText}>TAP TO SLIDE</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  boardFrame: {
    borderRadius: 22,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'visible', // allows escaping arrows to visually slide off board before removal
  },
  tutorialContainer: {
    position: 'absolute',
    top: '35%',
    left: '25%',
    alignItems: 'center',
    zIndex: 99,
  },
  handEmoji: {
    fontSize: 34,
    transform: [{ translateY: -10 }],
  },
  tutorialPill: {
    backgroundColor: 'rgba(8, 27, 47, 0.9)',
    borderWidth: 1.5,
    borderColor: '#78F329',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  tutorialPillText: {
    color: '#78F329',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hiddenSymbolBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.28,
  },
  hiddenSymbolEmoji: {
    textAlign: 'center',
  },
});

export default GameBoard;
