// ============================================================
// MEMORY RUSH — Physical Wood Panel Component
// Chunky wooden board with beveled edges, grain lines & corner pegs
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface WoodPanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  variant?: 'plank' | 'dark' | 'sign';
  showPegs?: boolean;
}

export const WoodPanel: React.FC<WoodPanelProps> = ({
  children,
  style,
  innerStyle,
  variant = 'plank',
  showPegs = true,
}) => {
  const gradientColors =
    variant === 'dark'
      ? (['#4E2810', '#321504'] as const)
      : variant === 'sign'
      ? (['#8B4513', '#5E2B08'] as const)
      : (['#6B3814', '#431F07'] as const);

  return (
    <View style={[styles.outerContainer, style]}>
      {/* Main Wood Beveled Slab */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.panelSurface}
      >
        {/* Top Sunlit Bevel Rim */}
        <View style={styles.topBevel} />

        {/* Subtle Horizontal Wood Plank Grooves */}
        <View style={styles.woodGrooveTop} />
        <View style={styles.woodGrooveBottom} />

        {/* Corner Rivets/Pegs */}
        {showPegs && (
          <>
            <View style={[styles.peg, styles.pegTL]}>
              <View style={styles.pegInner} />
            </View>
            <View style={[styles.peg, styles.pegTR]}>
              <View style={styles.pegInner} />
            </View>
            <View style={[styles.peg, styles.pegBL]}>
              <View style={styles.pegInner} />
            </View>
            <View style={[styles.peg, styles.pegBR]}>
              <View style={styles.pegInner} />
            </View>
          </>
        )}

        {/* Inner Content Area */}
        <View style={[styles.contentArea, innerStyle]}>{children}</View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    marginVertical: 6,
  },
  panelSurface: {
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#8A4A1C',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 218, 170, 0.45)',
  },
  woodGrooveTop: {
    position: 'absolute',
    top: 24,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  woodGrooveBottom: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  peg: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A1102',
    borderWidth: 1,
    borderColor: '#A86834',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pegInner: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFE1B3',
  },
  pegTL: { top: 8, left: 8 },
  pegTR: { top: 8, right: 8 },
  pegBL: { bottom: 8, left: 8 },
  pegBR: { bottom: 8, right: 8 },
  contentArea: {
    padding: 16,
  },
});
