// ============================================================
// AIM RUSH — Layered Sci-Fi Environment Background
// Renders the designated neon arena image with blur & dark ambient overlay
// ============================================================

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ARBackgrounds } from '../theme/backgrounds';
import { ARColors } from '../theme/colors';

interface BackgroundLayerProps {
  screen: 'home' | 'gameplay' | 'other';
  overlayDarkness?: number; // 0.0 to 1.0
  blurRadius?: number;      // Background blur radius
  children?: React.ReactNode;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  screen,
  overlayDarkness = 0.35,
  blurRadius,
  children,
}) => {
  const bgSource =
    screen === 'home'
      ? ARBackgrounds.home
      : screen === 'gameplay'
      ? ARBackgrounds.gameplay
      : ARBackgrounds.other;

  // Automatically apply tactical blur for gameplay arena
  const effectiveBlurRadius = blurRadius ?? (screen === 'gameplay' ? 14 : 0);

  return (
    <View style={styles.container}>
      {/* Background Image Layer with optional Blur */}
      <Image
        source={bgSource}
        style={styles.imageBackground}
        resizeMode="cover"
        blurRadius={effectiveBlurRadius}
      />

      {/* Futuristic Atmospheric Contrast Overlay */}
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(7, 9, 12, ${overlayDarkness})` },
        ]}
      />

      {/* Subtle Cyan Vignette Grid Effect */}
      <View style={styles.ambientVignette} pointerEvents="none" />

      {/* Foreground Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ARColors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ambientVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.06)',
  },
});
