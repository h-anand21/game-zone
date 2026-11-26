// ============================================================
// Block Puzzle — Carved Honey-Gold Woodblock Cell Component
// Matches the 3D chamfered oak tiles & espresso tray recesses
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { JEWEL_COLORS } from '../shapes';
import { WOOD_PALETTE } from './woodTheme';
import type { BlockColor } from '../types';

interface BlockCellProps {
  size: number;
  filled?: boolean;
  colorKey?: BlockColor;
  isGhost?: boolean;
  isClearing?: boolean;
  checkerAlt?: boolean;
  style?: ViewStyle;
}

export const BlockCell: React.FC<BlockCellProps> = ({
  size,
  filled = false,
  colorKey = 'amber',
  isGhost = false,
  isClearing = false,
  checkerAlt = false,
  style,
}) => {
  const theme = JEWEL_COLORS[colorKey] || JEWEL_COLORS.amber;
  const radius = Math.max(2, Math.floor(size * 0.14));

  // 1. Recessed Dark Espresso Board Socket (Checkerboard Pattern)
  if (!filled && !isGhost) {
    return (
      <View
        style={[
          styles.emptySlot,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: checkerAlt ? WOOD_PALETTE.slotDark : WOOD_PALETTE.slotLight,
          },
          style,
        ]}
      />
    );
  }

  // 2. Warm Golden Ghost Landing Preview
  if (isGhost) {
    return (
      <View
        style={[
          styles.ghostSlot,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
          style,
        ]}
      />
    );
  }

  const bevelWidth = Math.max(1, Math.round(size * 0.08));

  // 3. Carved 3D Honey-Gold Woodblock Tile with Subtle Horizontal Grain
  return (
    <View
      style={[
        styles.cellWrapper,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme.shadow,
        },
        isClearing && styles.clearingCell,
        style,
      ]}
    >
      <LinearGradient
        colors={isClearing ? ['#FFF9D2', '#FDE047'] : theme.gradient}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={[
          styles.cellFace,
          {
            borderRadius: Math.max(1.5, radius - 0.5),
            borderTopWidth: bevelWidth,
            borderLeftWidth: bevelWidth,
            borderBottomWidth: bevelWidth,
            borderRightWidth: bevelWidth,
            borderTopColor: WOOD_PALETTE.tileHighlight,
            borderLeftColor: WOOD_PALETTE.tileHighlight,
            borderBottomColor: theme.shadow,
            borderRightColor: theme.shadow,
          },
        ]}
      >
        {/* Subtle horizontal wood-grain fibers inside tile */}
        <View
          style={[
            styles.grainLine,
            { top: '28%', backgroundColor: WOOD_PALETTE.tileGrainLight },
          ]}
        />
        <View
          style={[
            styles.grainLine,
            { top: '56%', backgroundColor: WOOD_PALETTE.tileGrainDark },
          ]}
        />
        {size >= 16 && (
          <View
            style={[
              styles.grainLine,
              { top: '76%', width: '68%', backgroundColor: WOOD_PALETTE.tileGrainLight },
            ]}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySlot: {
    borderWidth: 0.6,
    borderColor: WOOD_PALETTE.slotBorder,
  },
  ghostSlot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: WOOD_PALETTE.ghostBorder,
    backgroundColor: WOOD_PALETTE.ghostFill,
  },
  cellWrapper: {
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: WOOD_PALETTE.tileSeam,
    shadowColor: '#1E0D03',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cellFace: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  grainLine: {
    position: 'absolute',
    left: '8%',
    width: '84%',
    height: 1,
    borderRadius: 1,
  },
  clearingCell: {
    transform: [{ scale: 1.08 }],
    borderColor: '#FFFBEB',
  },
});
