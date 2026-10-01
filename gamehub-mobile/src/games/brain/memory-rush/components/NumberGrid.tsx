// ============================================================
// MEMORY RUSH — Responsive Number Grid Calculator
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { NumberTile } from './NumberTile';
import type { NumberTileData } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NumberGridProps {
  tiles: NumberTileData[];
  rows: number;
  cols: number;
  onTilePress?: (tile: NumberTileData) => void;
  disabled?: boolean;
}

export const NumberGrid: React.FC<NumberGridProps> = ({
  tiles,
  rows,
  cols,
  onTilePress,
  disabled = false,
}) => {
  // Dynamically calculate responsive tile size based on screen width
  const gridPadding = 32;
  const gap = cols === 4 ? 10 : 14;
  const availableWidth = SCREEN_WIDTH - gridPadding * 2 - gap * (cols - 1);
  const tileSize = Math.floor(availableWidth / cols);

  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={`row_${r}`} style={[styles.row, { gap }]}>
          {tiles
            .filter((t) => t.row === r)
            .map((tile) => (
              <NumberTile
                key={tile.id}
                value={tile.value}
                state={tile.state}
                size={tileSize}
                disabled={disabled}
                onPress={() => onTilePress?.(tile)}
              />
            ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
