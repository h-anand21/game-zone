// ============================================================
// DON'T TAP WRONG — Full-Screen Cosmic Background Layer
// Strictly uses authentic cosmic arena platforms without cropping
// ============================================================

import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { dtwAssets } from '../../theme/uiAssets';
import { DtwColors } from '../../theme/colors';

interface BackgroundLayerProps {
  variant?: 'splash' | 'main';
  dimOverlay?: boolean;
  children?: React.ReactNode;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  variant = 'main',
  dimOverlay = true,
  children,
}) => {
  const source = variant === 'splash' ? dtwAssets.backgrounds.splash : dtwAssets.backgrounds.main;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={source}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {dimOverlay && <View style={styles.dimOverlay} />}
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DtwColors.bgMain,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 16, 0.42)',
  },
});
