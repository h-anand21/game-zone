// ============================================================
// Block Blast — Next Piece Preview Box Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockCell } from './BlockCell';
import { TETROMINOES } from '../shapes';
import type { TetrominoType } from '../types';

interface NextPiecePreviewProps {
  nextType: TetrominoType | null;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ nextType }) => {
  if (!nextType) return null;

  const shape = TETROMINOES[nextType];
  const matrix = shape.rotations[0];
  const MINI_CELL_SIZE = 13;
  const GAP = 1.5;

  return (
    <LinearGradient
      colors={['#162844', '#0E1A2C']}
      style={styles.container}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#243C60',
    minWidth: 72,
    minHeight: 52,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8CA0B8',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  matrixContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
    marginVertical: 1,
  },
});
