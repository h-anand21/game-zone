// ============================================================
// Block Blast — Next Piece Preview Box Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlockCell } from './BlockCell';
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
    <View style={styles.capsule}>
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
  );
};

const styles = StyleSheet.create({
  capsule: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 16, 28, 0.7)',
    borderWidth: 1,
    borderColor: '#1D3B62',
    minWidth: 54,
    height: 48,
  },
  label: {
    fontSize: 8,
    fontWeight: '900',
    color: '#00E5FF',
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
