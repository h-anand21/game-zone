// ============================================================
// REACTION FIRE — Layered Neon Arena Environment Background
// Renders responsive sci-fi arena art with dark atmospheric overlay
// ============================================================

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { RfBackgrounds, RfBgVariant } from '../theme/backgrounds';
import { RfColors } from '../theme';

interface BackgroundLayerProps {
  variant?: RfBgVariant;
  overlayDarkness?: number; // 0.0 to 1.0 (defaults to 0.45)
  blurRadius?: number;
  children?: React.ReactNode;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  variant = 'other',
  overlayDarkness = 0.45,
  blurRadius,
  children,
}) => {
  const bgSource = RfBackgrounds[variant] || RfBackgrounds.other;
  const effectiveBlur = blurRadius ?? (variant === 'gameplay' ? 1.5 : 0);

  return (
    <View style={styles.container}>
      <Image
        source={bgSource}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={effectiveBlur}
      />
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(5, 9, 20, ${overlayDarkness})` },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BackgroundLayer;
