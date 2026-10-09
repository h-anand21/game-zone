// ============================================================
// DON'T TAP WRONG — Interactive 3x3 Reflex Tile Grid
// Responsive, square, high-response touch cells
// ============================================================

import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { TileItem } from '../../types';
import { GameTile } from './GameTile';
import { DtwColors } from '../../theme/colors';

interface TileGridProps {
  tiles: TileItem[];
  onTilePress: (tile: TileItem) => void;
  disabled?: boolean;
}

export const TileGrid: React.FC<TileGridProps> = ({
  tiles,
  onTilePress,
  disabled = false,
}) => {
  const { width } = useWindowDimensions();

  // Responsive grid calculation (max 360, min 280)
  const gridContainerSize = Math.min(width - 32, 360);
  const padding = 12;
  const gutter = 8;
  const tileSize = Math.floor((gridContainerSize - padding * 2 - gutter * 2) / 3);

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.gridFrame,
          {
            width: gridContainerSize,
            height: gridContainerSize,
            padding,
          },
        ]}
      >
        {tiles.map((tile) => (
          <GameTile
            key={tile.key}
            tile={tile}
            size={tileSize}
            onPress={onTilePress}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  gridFrame: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    borderRadius: 24,
    backgroundColor: 'rgba(8, 11, 16, 0.78)',
    borderWidth: 2,
    borderColor: 'rgba(66, 217, 255, 0.35)',
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
});

export default TileGrid;
