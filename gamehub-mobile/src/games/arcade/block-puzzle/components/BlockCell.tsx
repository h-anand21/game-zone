// ============================================================
// Block Blast — 2.5D Jewel Block Cell Component
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
  const radius = Math.max(3, Math.floor(size * 0.16));

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

  // Ghost Preview Cell (semi-transparent glowing highlight)
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
            backgroundColor: `${theme.main}4D`,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.ghostInner,
            {
              borderRadius: radius - 2,
              borderColor: theme.highlight,
            },
          ]}
        />
      </View>
    );
  }

  // Active 2.5D Jewel Cell
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
        {/* Top-left specular gloss highlight */}
        <View
          style={[
            styles.specularShine,
            {
              width: size * 0.45,
              height: size * 0.22,
              borderRadius: radius * 0.7,
            },
          ]}
        />

        {/* Center Jewel Core */}
        <View
          style={[
            styles.jewelCore,
            {
              width: size * 0.38,
              height: size * 0.38,
              borderRadius: radius * 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySlot: {
    backgroundColor: '#0F1B2E',
    borderWidth: 1.2,
    borderColor: '#182B46',
  },
  ghostSlot: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  ghostInner: {
    width: '75%',
    height: '75%',
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  cellWrapper: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
    paddingBottom: 2, // 2.5D lower lip
  },
  cellGradient: {
    flex: 1,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specularShine: {
    position: 'absolute',
    top: 2,
    left: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  jewelCore: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  clearingCell: {
    transform: [{ scale: 1.15 }],
    opacity: 0.9,
  },
});
