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

  const badgeSize = Math.max(26, Math.min(38, Math.floor(size * 0.4)));
  const symbolSize = Math.max(16, Math.min(24, Math.floor(badgeSize * 0.58)));
  const labelSize = Math.max(9, Math.min(11, Math.floor(size * 0.11)));
  const tileRadius = Math.max(12, Math.min(18, Math.floor(size * 0.18)));

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
          borderRadius: tileRadius,
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
          { borderRadius: tileRadius },
          isSafe && styles.safeTileSurface,
          isDanger && styles.dangerTileSurface,
          isEmpty && styles.emptyTileSurface,
        ]}
      >
        {/* Safe Green Tile Content */}
        {isSafe && (
          <View style={styles.contentWrapper}>
            <View style={[styles.safeGlowRim, { borderRadius: tileRadius - 2 }]} />
            <View
              style={[
                styles.safeBadge,
                {
                  width: badgeSize,
                  height: badgeSize,
                  borderRadius: badgeSize / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.safeSymbol,
                  {
                    fontSize: symbolSize,
                    lineHeight: symbolSize + 3,
                  },
                ]}
              >
                ✓
              </Text>
            </View>
            <Text style={[styles.safeLabel, { fontSize: labelSize }]}>TAP</Text>
          </View>
        )}

        {/* Danger Red Tile Content */}
        {isDanger && (
          <View style={styles.contentWrapper}>
            <View style={[styles.dangerGlowRim, { borderRadius: tileRadius - 2 }]} />
            <View
              style={[
                styles.dangerBadge,
                {
                  width: badgeSize,
                  height: badgeSize,
                  borderRadius: badgeSize / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.dangerSymbol,
                  {
                    fontSize: symbolSize,
                    lineHeight: symbolSize + 3,
                  },
                ]}
              >
                ✕
              </Text>
            </View>
            <Text style={[styles.dangerLabel, { fontSize: labelSize }]}>AVOID</Text>
          </View>
        )}

        {/* Empty Tile Content */}
        {isEmpty && (
          <View style={styles.contentWrapper}>
            <View
              style={[
                styles.emptyReticle,
                {
                  width: Math.floor(size * 0.28),
                  height: Math.floor(size * 0.28),
                  borderRadius: Math.floor(size * 0.14),
                },
              ]}
            >
              <View style={styles.emptyCenterDot} />
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

GameTile.displayName = 'GameTile';

const styles = StyleSheet.create({
  tileContainer: {
    margin: 0,
    overflow: 'hidden',
  },
  pressableSurface: {
    width: '100%',
    height: '100%',
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
    borderWidth: 1.5,
    borderColor: DtwColors.safeGreenHighlight,
    opacity: 0.7,
  },
  safeBadge: {
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
    fontWeight: '900',
    color: '#0A1702',
  },
  safeLabel: {
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 1.5,
    marginTop: 3,
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
    borderWidth: 1.5,
    borderColor: DtwColors.dangerRedHighlight,
    opacity: 0.7,
  },
  dangerBadge: {
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
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dangerLabel: {
    fontWeight: '900',
    color: DtwColors.dangerRedHighlight,
    letterSpacing: 1.5,
    marginTop: 3,
  },

  // Empty Idle State
  emptyTileSurface: {
    backgroundColor: 'rgba(21, 28, 37, 0.78)',
    borderColor: 'rgba(66, 217, 255, 0.18)',
  },
  emptyReticle: {
    borderWidth: 1,
    borderColor: 'rgba(66, 217, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCenterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(66, 217, 255, 0.5)',
  },
});

export default GameTile;
