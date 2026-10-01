// ============================================================
// MEMORY RUSH — Physical Parchment Panel Component
// Warm ancient scroll parchment with rolled borders & aged tone
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ParchmentPanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}

export const ParchmentPanel: React.FC<ParchmentPanelProps> = ({
  children,
  style,
  innerStyle,
}) => {
  return (
    <View style={[styles.outerContainer, style]}>
      {/* 3D Drop Shadow */}
      <View style={styles.bottomShadow} />

      {/* Main Parchment Surface */}
      <LinearGradient
        colors={['#FFFDF4', '#F4E5BE', '#E5CE99']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.parchmentSurface}
      >
        {/* Curled Top Edge Highlight */}
        <View style={styles.topCurledEdge} />

        {/* Vintage Edge Vignette Borders */}
        <View style={styles.vignetteBorder} />

        {/* Content */}
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
  bottomShadow: {
    position: 'absolute',
    bottom: -4,
    left: 4,
    right: 4,
    height: 8,
    backgroundColor: 'rgba(30, 20, 10, 0.45)',
    borderRadius: 14,
  },
  parchmentSurface: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C6A867',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#2A1705',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  topCurledEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  vignetteBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(168, 128, 64, 0.25)',
    pointerEvents: 'none',
  },
  contentArea: {
    padding: 14,
  },
});
