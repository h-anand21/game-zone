// ============================================================
// DON'T TAP WRONG — Full-Screen Cosmic Background Layer
// Responsive sci-fi atmosphere with legibility overlay
// ============================================================

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { dtwAssets } from '../../theme/uiAssets';
import { DtwColors } from '../../theme/colors';

interface BackgroundLayerProps {
  variant?: 'splash' | 'main' | 'game' | 'lobby';
  dimOverlay?: boolean;
  overlayDarkness?: number;
  children?: React.ReactNode;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  variant = 'main',
  dimOverlay = true,
  overlayDarkness = 0.48,
  children,
}) => {
  const source = variant === 'splash' ? dtwAssets.backgrounds.splash : dtwAssets.backgrounds.main;

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {dimOverlay && (
        <View
          style={[styles.dimOverlay, { backgroundColor: `rgba(8, 11, 16, ${overlayDarkness})` }]}
          pointerEvents="none"
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DtwColors.bgMain,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

