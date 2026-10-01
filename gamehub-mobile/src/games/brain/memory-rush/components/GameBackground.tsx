// ============================================================
// MEMORY RUSH — Environment Background Layer
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameBackgroundProps {
  theme?: 'home' | 'gameplay' | 'stats' | 'daily';
  variant?: 'home' | 'gameplay' | 'stats' | 'daily';
  children?: React.ReactNode;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({
  theme,
  variant,
  children,
}) => {
  const activeTheme = variant || theme || 'home';
  const getBackgroundImage = () => {
    if (activeTheme === 'gameplay') {
      return require('../../../../../assets/images/mr_bg_gameplay.jpg');
    }
    return require('../../../../../assets/images/mr_arcade_home_bg.jpg');
  };

  const getOpacity = () => {
    switch (activeTheme) {
      case 'gameplay':
        return 0.18; // Very subtle for zero distraction behind grid
      case 'daily':
        return 0.35;
      case 'stats':
        return 0.30;
      case 'home':
      default:
        return 0.60;
    }
  };

  return (
    <View style={styles.container}>
      {/* Base Dark Canvas Gradient */}
      <LinearGradient
        colors={[MRColors.bgVoid, MRColors.bgDark, MRColors.surface]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Real Full-Bleed Atmospheric Background Image */}
      <Image
        source={getBackgroundImage()}
        style={[
          StyleSheet.absoluteFill,
          styles.bgArt,
          { opacity: getOpacity() },
        ]}
        resizeMode="cover"
      />

      {/* Dark Translucent Scrim Overlay for Contrast */}
      <View style={styles.darkScrim} />

      {/* Foreground Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MRColors.bgVoid,
  },
  bgArt: {
    width: '100%',
    height: '100%',
  },
  darkScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 10, 13, 0.22)',
  },
  content: {
    flex: 1,
  },
});
