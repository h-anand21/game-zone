// ============================================================
// STACK MASTER — 3D-Styled Isometric Block Face
// ============================================================

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const BLOCK_HEIGHT = 28;

interface BlockViewProps {
  x: number; // Percentage 0 - 100
  width: number; // Percentage 0 - 100
  bottom: number; // Pixel bottom position
  color: string;
  isPerfect?: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({
  x,
  width,
  bottom,
  color,
  isPerfect = false,
}) => {
  return (
    <View
      style={[
        styles.blockWrapper,
        {
          left: `${x}%`,
          width: `${width}%`,
          bottom,
          shadowColor: isPerfect ? '#FFF' : color,
        },
      ]}
    >
      <LinearGradient
        colors={[color, color, 'rgba(0,0,0,0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.blockFace,
          isPerfect && styles.perfectGlow,
        ]}
      >
        {/* Top 3D beveled light stripe */}
        <View style={styles.topBevel} />

        {/* Subtle grid crystal highlight */}
        <View style={styles.crystalShine} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  blockWrapper: {
    position: 'absolute',
    height: BLOCK_HEIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 4,
  },
  blockFace: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    overflow: 'hidden',
  },
  perfectGlow: {
    borderColor: '#FFF',
    borderWidth: 2,
    shadowColor: '#FFF',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  crystalShine: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 14,
    height: 8,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
