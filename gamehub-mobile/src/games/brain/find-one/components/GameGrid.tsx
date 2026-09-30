// ============================================================
// Find One — Dynamic Game Grid Component (4x4, 5x5, 6x6)
// ============================================================

import React, { forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FOColors, FORadius, FOShadows } from '../theme';
import { CharacterTile } from './CharacterTile';
import type { TileItem, GridSize } from '../types';

export interface GameGridRef {
  triggerShake: () => void;
}

interface GameGridProps {
  tiles: TileItem[];
  gridSize: GridSize;
  onTilePress: (index: number) => void;
  hintHighlightIndex?: number | null;
  style?: ViewStyle;
}

export const GameGrid = forwardRef<GameGridRef, GameGridProps>(({
  tiles,
  gridSize,
  onTilePress,
  hintHighlightIndex = null,
  style,
}, ref) => {
  const { width: windowWidth } = useWindowDimensions();
  const shakeOffset = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    triggerShake: () => {
      // Subtle screen shake on wrong tap
      shakeOffset.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    },
  }));

  const animatedGridStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // Calculate responsive tile size
  const containerPadding = 16;
  const gridGap = gridSize === 6 ? 6 : gridSize === 5 ? 8 : 10;
  const maxContainerWidth = Math.min(windowWidth - 36, 360);
  const availableWidth = maxContainerWidth - (containerPadding * 2);
  const totalGaps = (gridSize - 1) * gridGap;
  const tileSize = Math.floor((availableWidth - totalGaps) / gridSize);

  return (
    <Animated.View style={[styles.containerWrapper, animatedGridStyle, style]}>
      <LinearGradient
        colors={['#102842', '#0B1D30', '#071424']}
        style={[
          styles.gridCard,
          FOShadows.cardGlow,
          { width: maxContainerWidth, padding: containerPadding },
        ]}
      >
        <View style={[styles.tilesGrid, { gap: gridGap }]}>
          {tiles.map((tile, idx) => (
            <CharacterTile
              key={`${tile.id}-${tile.characterId}-${idx}`}
              id={tile.id}
              name={tile.name}
              emoji={tile.emoji}
              isOdd={tile.isOdd}
              size={tileSize}
              isHighlighted={hintHighlightIndex === idx}
              onPress={() => onTilePress(idx)}
            />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  containerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  gridCard: {
    borderRadius: FORadius.xl,
    borderWidth: 2,
    borderColor: '#1C426B',
    borderTopColor: '#2C629E',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
