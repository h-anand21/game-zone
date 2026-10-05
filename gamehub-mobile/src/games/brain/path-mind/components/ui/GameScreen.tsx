// ============================================================
// PATH MIND — Component: GameScreen
// Full-Screen Fantasy Viewport with Safe Insets, Depth & Vignette
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pmAssets } from '../../design-system/uiAssets';

interface GameScreenProps {
  children: React.ReactNode;
  variant?: 'splash' | 'home' | 'universal';
  overlayDarkness?: number; // Subtle overlay to ensure UI readability while keeping background visible
  safeTop?: boolean;
  safeBottom?: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  children,
  variant = 'universal',
  overlayDarkness = 0.22,
  safeTop = true,
  safeBottom = true,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

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
    <View style={[styles.container, { width, height }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Layer 1: Complete Full Fantasy Background Image (Never cropped into UI, full environment) */}
      <Image
        source={getSource()}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        resizeMode="cover"
      />

      {/* Layer 2: Subtle Readability Overlay (Jungle ruins, waterfall, lantern depth visible) */}
      {overlayDarkness > 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `rgba(6, 14, 22, ${overlayDarkness})` },
          ]}
        />
      )}

      {/* Layer 3: Atmospheric Vignette Borders */}
      <View style={[StyleSheet.absoluteFill, styles.vignetteOverlay]} pointerEvents="none" />

      {/* Layer 4: UI Content Layer adhering to OS Safe Area */}
      <View
        style={[
          styles.contentLayer,
          {
            paddingTop: safeTop ? Math.max(insets.top, 10) : 0,
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
    backgroundColor: '#061017',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentLayer: {
    flex: 1,
    zIndex: 10,
  },
});
