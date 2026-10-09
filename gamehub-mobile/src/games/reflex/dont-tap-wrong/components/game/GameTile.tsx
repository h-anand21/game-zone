// ============================================================
// DON'T TAP WRONG — Interactive Game Tile
// High-response tactile cell with native vector graphics,
// high-contrast neon borders, and press animations
// ============================================================

import React, { useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import type { TileItem } from '../../types';
import { DtwColors } from '../../theme/colors';

interface GameTileProps {
  tile: TileItem;
  size: number;
  onPress: (tile: TileItem) => void;
  disabled?: boolean;
}

export const GameTile: React.FC<GameTileProps> = React.memo(({
  tile,
  size,
  onPress,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isSafe = tile.type === 'safe';
  const isDanger = tile.type === 'danger';
  const isEmpty = tile.type === 'empty';

  const handlePressIn = () => {
    if (disabled || isEmpty) return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const handlePress = () => {
    if (disabled || isEmpty) return;
    onPress(tile);
  };

  return (
    <Animated.View
      style={[
        styles.tileContainer,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isEmpty}
        style={[
          styles.pressableSurface,
          isSafe && styles.safeTileSurface,
          isDanger && styles.dangerTileSurface,
          isEmpty && styles.emptyTileSurface,
        ]}
      >
        {/* Safe Green Tile Content */}
        {isSafe && (
          <View style={styles.contentWrapper}>
            <View style={styles.safeGlowRim} />
            <View style={styles.safeBadge}>
              <Text style={styles.safeSymbol}>✓</Text>
            </View>
            <Text style={styles.safeLabel}>TAP</Text>
          </View>
        )}

        {/* Danger Red Tile Content */}
        {isDanger && (
          <View style={styles.contentWrapper}>
            <View style={styles.dangerGlowRim} />
            <View style={styles.dangerBadge}>
              <Text style={styles.dangerSymbol}>✕</Text>
            </View>
            <Text style={styles.dangerLabel}>AVOID</Text>
          </View>
        )}

        {/* Empty Tile Content */}
        {isEmpty && (
          <View style={styles.contentWrapper}>
            <View style={styles.emptyCenterDot} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

GameTile.displayName = 'GameTile';

const styles = StyleSheet.create({
  tileContainer: {
    margin: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressableSurface: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DtwColors.tileBorder,
  },
  contentWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Safe Green State
  safeTileSurface: {
    backgroundColor: '#162D0B',
    borderColor: DtwColors.safeGreen,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  safeGlowRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DtwColors.safeGreenHighlight,
    opacity: 0.7,
  },
  safeBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DtwColors.safeGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  safeSymbol: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A1702',
    lineHeight: 24,
  },
  safeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 1.5,
    marginTop: 4,
  },

  // Danger Red State
  dangerTileSurface: {
    backgroundColor: '#300F13',
    borderColor: DtwColors.dangerRed,
    shadowColor: DtwColors.dangerRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  dangerGlowRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DtwColors.dangerRedHighlight,
    opacity: 0.7,
  },
  dangerBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DtwColors.dangerRed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DtwColors.dangerRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  dangerSymbol: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  dangerLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: DtwColors.dangerRedHighlight,
    letterSpacing: 1.5,
    marginTop: 4,
  },

  // Empty Idle State
  emptyTileSurface: {
    backgroundColor: 'rgba(21, 28, 37, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export default GameTile;
