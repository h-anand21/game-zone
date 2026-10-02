// ============================================================
// PATTERN BREAKER — Reusable World Background Layer
// True Multi-Layered Architecture:
// 1. High-Fidelity Sci-Fi Ruins Environment Image
// 2. Atmospheric Volumetric Scrim & Floating Vector Particles
// 3. Controlled Center Contrast (Never competes with UI)
// ============================================================

import React, { useMemo } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { PBColors } from '../../theme';

export type BackgroundVariant = 'splash' | 'home' | 'observatory' | 'gameplay' | 'portal';

interface GameBackgroundProps {
  children?: React.ReactNode;
  variant?: BackgroundVariant;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Background Image Assets
const BG_IMAGES = {
  splash: require('../../../../../assets/game/backgrounds/Pattern Breaker_ Ruins of Neon Logic.png'),
  home: require('../../../../../assets/game/backgrounds/Pattern Breaker_ Neon Ruins Adventure (2).png'),
  gameplay: require('../../../../../assets/game/backgrounds/Neon Cosmic Floating Arena.png'),
};

export const GameBackground: React.FC<GameBackgroundProps> = ({
  children,
  variant = 'home',
}) => {
  // Determine background image based on screen role
  const bgSource =
    variant === 'splash' || variant === 'portal'
      ? BG_IMAGES.splash
      : variant === 'gameplay'
      ? BG_IMAGES.gameplay
      : BG_IMAGES.home;

  // Generate stable ambient floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      x: ((i * 37 + 13) % 94) + 3,
      y: ((i * 59 + 29) % 92) + 4,
      r: (i % 3) + 1.2,
      opacity: 0.25 + ((i % 5) * 0.12),
      isCyan: i % 2 === 0,
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* ============================================================ */}
      {/* LAYER 1: Deep Environmental Sci-Fi Artwork                   */}
      {/* ============================================================ */}
      <Image
        source={bgSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        fadeDuration={0}
      />

      {/* ============================================================ */}
      {/* LAYER 2: Atmospheric Volumetric Scrim & Depth Vignette        */}
      {/* Controls center contrast so gameplay tiles pop brilliantly   */}
      {/* ============================================================ */}
      <LinearGradient
        colors={[
          variant === 'splash' ? 'rgba(6, 16, 24, 0.40)' : 'rgba(6, 16, 24, 0.65)',
          variant === 'gameplay' ? 'rgba(8, 19, 26, 0.78)' : 'rgba(8, 19, 26, 0.70)',
          'rgba(6, 16, 24, 0.92)',
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ============================================================ */}
      {/* LAYER 3: Ambient Floating Particles Layer                    */}
      {/* ============================================================ */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox="0 0 400 800">
          {particles.map((p, idx) => (
            <Circle
              key={idx}
              cx={(p.x * 400) / 100}
              cy={(p.y * 800) / 100}
              r={p.r}
              fill={p.isCyan ? '#19D3FF' : '#FFD54A'}
              opacity={p.opacity}
            />
          ))}
        </Svg>
      </View>

      {/* ============================================================ */}
      {/* LAYER 4: Foreground Interactive UI Content Layer             */}
      {/* ============================================================ */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PBColors.backgroundDark,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
