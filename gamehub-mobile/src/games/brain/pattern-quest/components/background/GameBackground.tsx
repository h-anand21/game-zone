// ============================================================
// PATTERN QUEST — GameBackground Component
// Supports Splash (bg_splash), Home (bg_home), Universal (bg_universal)
// Layered atmospheric depth, vignette, and responsive scaling
// ============================================================

import React from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pqAssets, pqColors } from '../../theme';
import { PQScreen } from '../../types';

interface GameBackgroundProps {
  screen: PQScreen;
  children: React.ReactNode;
  overlayDarkness?: number; // 0 to 1
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GameBackground: React.FC<GameBackgroundProps> = ({
  screen,
  children,
  overlayDarkness = 0.15,
}) => {
  // Determine correct background according to screen-specific rules
  const getBackgroundImage = () => {
    if (screen === 'splash') {
      return pqAssets.backgrounds.splash;
    }
    if (screen === 'home') {
      return pqAssets.backgrounds.home;
    }
    return pqAssets.backgrounds.universal;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Layer 1: Base Jungle / Temple Background */}
      <Image
        source={getBackgroundImage()}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Layer 2: Ambient Vignette & Readability Dimmer */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: `rgba(10, 20, 28, ${
              screen === 'gameplay' || screen === 'rush_mode' || screen === 'memory_shift'
                ? 0.35
                : overlayDarkness
            })`,
          },
        ]}
      />

      {/* Layer 3: Safe Area Guided UI Content */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pqColors.jungleGreenDark,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 4,
  },
});
