// ============================================================
// MEMORY RUSH — Physical Stone Panel Component
// Carved ancient stone tablet with chiseled borders & mossy accents
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface StonePanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  variant?: 'slate' | 'moss' | 'dark' | 'carved';
  activeBorder?: string;
}

export const StonePanel: React.FC<StonePanelProps> = ({
  children,
  style,
  innerStyle,
  variant = 'slate',
  activeBorder,
}) => {
  const gradientColors =
    variant === 'moss'
      ? (['#34483B', '#1E2D23'] as const)
      : variant === 'dark'
      ? (['#28333E', '#161D24'] as const)
      : variant === 'carved'
      ? (['#4E5E6E', '#2D3945'] as const)
      : (['#3E4C5A', '#242E38'] as const);

  const borderColor = activeBorder || (variant === 'moss' ? '#4A6953' : '#607284');

  return (
    <View style={[styles.outerContainer, style]}>
      {/* Main Stone Slab */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.stoneSurface,
          { borderColor },
        ]}
      >
        {/* Top Chiseled Highlight Rim */}
        <View style={styles.topBevel} />

        {/* Chiseled Inner Engraving Outline (Subtle warm highlight, not black) */}
        <View style={styles.innerEngravedLine} />

        {/* Moss corner accent if mossy variant */}
        {variant === 'moss' && (
          <>
            <View style={styles.mossBadgeTL} />
            <View style={styles.mossBadgeBR} />
          </>
        )}

        {/* Inner Content */}
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
  stoneSurface: {
    borderRadius: 18,
    borderWidth: 2.5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  innerEngravedLine: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
  },
  mossBadgeTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 12,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(74, 180, 94, 0.35)',
  },
  mossBadgeBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 14,
    borderTopLeftRadius: 12,
    backgroundColor: 'rgba(74, 180, 94, 0.30)',
  },
  contentArea: {
    padding: 16,
  },
});
