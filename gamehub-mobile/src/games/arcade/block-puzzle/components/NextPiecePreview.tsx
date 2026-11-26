// ============================================================
// Block Puzzle — Dark Espresso Next Piece Pocket Box
// Matches side wooden trays showing Honey-Gold polyomino pieces
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlockCell } from './BlockCell';
import { WOOD_PALETTE } from './woodTheme';
import { TETROMINOES } from '../shapes';
import type { TetrominoType } from '../types';

interface NextPiecePreviewProps {
  nextType: TetrominoType | null;
  compact?: boolean;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({
  nextType,
  compact = false,
}) => {
  if (!nextType) return null;

  const shape = TETROMINOES[nextType];
  const matrix = shape.rotations[0];
  const MINI_CELL_SIZE = compact ? 8.5 : 10;
  const GAP = 1;

  return (
    <View style={styles.pocketOuter}>
      <View style={styles.pocketInner}>
        <Text style={styles.label}>NEXT</Text>
        <View style={styles.matrixContainer}>
          {matrix.map((row, r) => (
            <View key={`nr-${r}`} style={[styles.matrixRow, { gap: GAP }]}>
              {row.map((active, c) => (
                <View
                  key={`nc-${c}`}
                  style={{ width: MINI_CELL_SIZE, height: MINI_CELL_SIZE }}
                >
                  {active ? (
                    <BlockCell
                      size={MINI_CELL_SIZE}
                      filled={true}
                      colorKey={shape.colorKey}
                    />
                  ) : (
                    <View style={{ width: MINI_CELL_SIZE, height: MINI_CELL_SIZE }} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pocketOuter: {
    borderRadius: 12,
    padding: 2,
    backgroundColor: WOOD_PALETTE.trayOuterBg,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.trayBevelBottom,
  },
  pocketInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderWidth: 1,
    borderColor: WOOD_PALETTE.trayInnerBorder,
    minWidth: 56,
    height: 46,
  },
  label: {
    fontSize: 7.5,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  matrixContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
  },
});
