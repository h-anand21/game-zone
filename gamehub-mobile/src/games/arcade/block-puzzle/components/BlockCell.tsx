// ============================================================
// Block Blast — Compact 2.5D Jewel Block Cell Component
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { JEWEL_COLORS } from '../shapes';
import type { BlockColor } from '../types';

interface BlockCellProps {
  size: number;
  filled?: boolean;
  colorKey?: BlockColor;
  isGhost?: boolean;
  isClearing?: boolean;
  style?: ViewStyle;
}

export const BlockCell: React.FC<BlockCellProps> = ({
  size,
  filled = false,
  colorKey = 'cyan',
  isGhost = false,
  isClearing = false,
  style,
}) => {
  const theme = JEWEL_COLORS[colorKey] || JEWEL_COLORS.cyan;
  const radius = Math.max(2, Math.floor(size * 0.18));

  // 1. Empty grooved slot
  if (!filled && !isGhost) {
    return (
      <View
        style={[
          styles.emptySlot,
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

  // 2. Ghost Landing Shadow
  if (isGhost) {
    return (
      <View
        style={[
          styles.ghostSlot,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor: theme.main,
            backgroundColor: `${theme.main}2E`,
          },
          style,
        ]}
      />
    );
  }

  // 3. Active 2.5D Jewel Cell
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
        colors={theme.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[
          styles.cellGradient,
          {
            borderRadius: radius,
            borderColor: theme.highlight,
          },
        ]}
      >
        {/* Specular gloss shine at top left */}
        <View
          style={[
            styles.specularShine,
            {
              width: size * 0.5,
              height: size * 0.25,
              borderRadius: radius * 0.7,
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySlot: {
    backgroundColor: 'rgba(13, 23, 38, 0.7)',
    borderWidth: 0.8,
    borderColor: '#172B47',
  },
  ghostSlot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  cellWrapper: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
    paddingBottom: 1.5,
  },
  cellGradient: {
    flex: 1,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specularShine: {
    position: 'absolute',
    top: 1,
    left: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  clearingCell: {
    transform: [{ scale: 1.15 }],
    opacity: 0.9,
  },
});
