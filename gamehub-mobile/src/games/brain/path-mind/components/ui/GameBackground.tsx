// ============================================================
// PATH MIND — Component 01: GameBackground
// Layered full-screen fantasy background with readability overlays
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { pmAssets } from '../../design-system/uiAssets';

interface GameBackgroundProps {
  variant?: 'splash' | 'home' | 'universal';
  overlayDarkness?: number; // 0.0 to 1.0
  children?: React.ReactNode;
  safeTop?: boolean;
  safeBottom?: boolean;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({
  variant = 'universal',
  overlayDarkness = 0.35,
  children,
  safeTop = true,
  safeBottom = true,
}) => {
  const insets = useSafeAreaInsets();

  const getSource = () => {
    switch (variant) {
      case 'splash':
        return pmAssets.backgrounds.splash;
      case 'home':
        return pmAssets.backgrounds.home;
      case 'universal':
      default:
        return pmAssets.backgrounds.universal;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Layer 1: Full-Screen Fantasy Background Image */}
      <Image
        source={getSource()}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Layer 2: Readability Overlay */}
      {overlayDarkness > 0 && (
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(4, 12, 18, ${overlayDarkness})` },
          ]}
        />
      )}

      {/* Layer 3: Content Container with Safe Area Insets */}
      <View
        style={[
          styles.contentLayer,
          {
            paddingTop: safeTop ? Math.max(insets.top, 12) : 0,
            paddingBottom: safeBottom ? Math.max(insets.bottom, 12) : 0,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071318',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  contentLayer: {
    flex: 1,
  },
});
