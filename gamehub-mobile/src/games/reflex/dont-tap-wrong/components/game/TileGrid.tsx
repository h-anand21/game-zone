// ============================================================
// DON'T TAP WRONG — Interactive 3x3 Reflex Tile Grid
// Uses authentic green safe and red danger neon tile assets
// ============================================================

import React, { useRef } from 'react';
import { StyleSheet, View, ImageBackground, Pressable, Animated, Dimensions } from 'react-native';
import type { TileItem } from '../../types';
import { dtwAssets } from '../../theme/uiAssets';
import { DtwColors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const GRID_CONTAINER_SIZE = Math.min(width - 48, 360);
const TILE_SIZE = (GRID_CONTAINER_SIZE - 24) / 3;

interface TileGridProps {
  tiles: TileItem[];
  onTilePress: (tile: TileItem) => void;
  disabled?: boolean;
}

interface TileItemViewProps {
  tile: TileItem;
  onPress: () => void;
  disabled?: boolean;
}

const TileItemView: React.FC<TileItemViewProps> = React.memo(({ tile, onPress, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || tile.type === 'empty') return;
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.tileSlot,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.pressable}
      >
        {tile.type === 'safe' && (
          <ImageBackground
            source={dtwAssets.tiles.safe}
            style={styles.tileImage}
            imageStyle={styles.tileImageBorder}
            resizeMode="cover"
          >
            <View style={styles.safeGlowOverlay} />
          </ImageBackground>
        )}

        {tile.type === 'danger' && (
          <ImageBackground
            source={dtwAssets.tiles.danger}
            style={styles.tileImage}
            imageStyle={styles.tileImageBorder}
            resizeMode="cover"
          >
            <View style={styles.dangerGlowOverlay} />
          </ImageBackground>
        )}

        {tile.type === 'empty' && (
          <View style={styles.emptyTile}>
            <View style={styles.emptyTileCenterDot} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

TileItemView.displayName = 'TileItemView';

export const TileGrid: React.FC<TileGridProps> = ({ tiles, onTilePress, disabled }) => {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridFrame}>
        {tiles.map((tile) => (
          <TileItemView
            key={tile.key}
            tile={tile}
            onPress={() => onTilePress(tile)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  gridFrame: {
    width: GRID_CONTAINER_SIZE,
    height: GRID_CONTAINER_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 11, 16, 0.72)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tileSlot: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImageBorder: {
    borderRadius: 14,
  },
  safeGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DtwColors.safeGreen,
    shadowColor: DtwColors.safeGreen,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  dangerGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DtwColors.dangerRed,
    shadowColor: DtwColors.dangerRed,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  emptyTile: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(20, 26, 38, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTileCenterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
