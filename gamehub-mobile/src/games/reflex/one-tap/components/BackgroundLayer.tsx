// ============================================================
// ONE TAP: PRECISION GAME — BackgroundLayer
// Custom dual-background system with gameplay blur effect
// Golden Portal (Splash/Home) & Golden Nebula (Gameplay/Other)
// ============================================================

import React from 'react';
import { StyleSheet, View, Image, ImageSourcePropType } from 'react-native';

const BG_PORTAL: ImageSourcePropType = require('../../../../../assets/game/backgrounds/Golden Portal Sci-Fi Arena.png');
const BG_NEBULA: ImageSourcePropType = require('../../../../../assets/game/backgrounds/Golden Nebula Sci-Fi Arena.png');

interface BackgroundLayerProps {
  screen?: 'splash' | 'home' | 'gameplay' | 'other';
  blurRadius?: number;
  overlayDarkness?: number; // 0.0 to 1.0
  children?: React.ReactNode;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  screen = 'other',
  blurRadius,
  overlayDarkness = 0.35,
  children,
}) => {
  // Portal for Splash/Home, Nebula for Gameplay/Other
  const bgSource =
    screen === 'splash' || screen === 'home' ? BG_PORTAL : BG_NEBULA;

  // Apply subtle blur effect when gameplay is active
  const effectiveBlur =
    blurRadius !== undefined ? blurRadius : screen === 'gameplay' ? 3.5 : 0;

  return (
    <View style={styles.container}>
      {/* Background Image Layer */}
      <Image
        source={bgSource}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={effectiveBlur}
      />

      {/* Atmospheric Contrast Overlay */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: `rgba(7, 9, 12, ${overlayDarkness})`,
          },
        ]}
      />

      {/* Children Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07090C',
    position: 'relative',
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
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});
