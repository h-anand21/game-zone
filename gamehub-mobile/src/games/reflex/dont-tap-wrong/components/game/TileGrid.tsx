// ============================================================
// DON'T TAP WRONG — Interactive 3x3 Reflex Tile Grid
// Responsive, square, high-response touch cells
// Guaranteed 3x3 row layout that never wraps or leaks outside boundary
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
  const { width, height } = useWindowDimensions();

  // Responsive grid calculation (max 350, min 260)
  // Ensures grid fits with ample headroom between HUD and bottom stats
  const maxByHeight = Math.floor(height * 0.44);
  const maxAllowedSize = Math.min(350, maxByHeight > 240 ? maxByHeight : 320);
  const maxGridWidth = Math.min(width - 32, maxAllowedSize);

  const padding = 10;
  const gap = 8;
  const innerSize = maxGridWidth - padding * 2;
  const tileSize = Math.floor((innerSize - gap * 2) / 3);
  const exactFrameSize = tileSize * 3 + gap * 2 + padding * 2;

  // Split tiles into 3 deterministic rows of 3 to guarantee zero overflow
  const rows = [
    tiles.slice(0, 3),
    tiles.slice(3, 6),
    tiles.slice(6, 9),
  ];

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.gridFrame,
          {
            width: exactFrameSize,
            height: exactFrameSize,
            padding,
          },
        ]}
      >
        {/* Subtle Neon Cyber Corner Accents */}
        <View style={[styles.cornerBracket, styles.topLeftBracket]} pointerEvents="none" />
        <View style={[styles.cornerBracket, styles.topRightBracket]} pointerEvents="none" />
        <View style={[styles.cornerBracket, styles.bottomLeftBracket]} pointerEvents="none" />
        <View style={[styles.cornerBracket, styles.bottomRightBracket]} pointerEvents="none" />

        {rows.map((rowTiles, rowIndex) => (
          <View
            key={`grid-row-${rowIndex}`}
            style={[
              styles.gridRow,
              {
                height: tileSize,
                gap,
              },
            ]}
          >
            {rowTiles.map((tile) => (
              <GameTile
                key={tile.key}
                tile={tile}
                size={tileSize}
                onPress={onTilePress}
                disabled={disabled}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  gridFrame: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderRadius: 22,
    backgroundColor: 'rgba(8, 11, 16, 0.92)',
    borderWidth: 2,
    borderColor: 'rgba(66, 217, 255, 0.45)',
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cornerBracket: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: DtwColors.cyanAccent,
    zIndex: 10,
  },
  topLeftBracket: {
    top: 4,
    left: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6,
  },
  topRightBracket: {
    top: 4,
    right: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6,
  },
  bottomLeftBracket: {
    bottom: 4,
    left: 4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 6,
  },
  bottomRightBracket: {
    bottom: 4,
    right: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6,
  },
});

export default TileGrid;
