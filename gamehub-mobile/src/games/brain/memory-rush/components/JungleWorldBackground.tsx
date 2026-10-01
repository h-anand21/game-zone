// ============================================================
// MEMORY RUSH — 4-Layer Jungle Temple World Background System
// Layer 1: World Environment Canvas (9:16 Portrait)
// Layer 2: Environmental Atmosphere (Light rays, leaves, vignette)
// Layer 3: UI Structure Boundary
// Layer 4: Interactive Gameplay Content
// ============================================================

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type JungleBgVariant =
  | 'home'
  | 'arena'
  | 'gameplay'
  | 'victory'
  | 'stats'
  | 'daily'
  | 'settings'
  | 'forest'
  | 'tutorial';

interface JungleWorldBackgroundProps {
  variant?: JungleBgVariant;
  dimmed?: boolean;
  blurRadius?: number;
  children?: React.ReactNode;
}

export const JungleWorldBackground: React.FC<JungleWorldBackgroundProps> = ({
  variant = 'home',
  dimmed = false,
  blurRadius,
  children,
}) => {
  const bgSource: ImageSourcePropType = useMemo(() => {
    switch (variant) {
      case 'gameplay':
      case 'arena':
        return require('../../../../../assets/images/jungle/jungle_temple_arena.jpg');
      case 'victory':
        return require('../../../../../assets/images/jungle/jungle_temple_victory.jpg');
      case 'daily':
        return require('../../../../../assets/images/jungle/jungle_temple_victory.jpg');
      case 'stats':
      case 'settings':
      case 'tutorial':
      case 'forest':
        return require('../../../../../assets/images/jungle/jungle_bg.webp');
      case 'home':
      default:
        return require('../../../../../assets/game/backgrounds/mystical_temple_valley.png');
    }
  }, [variant]);

  // Adjust darkness/contrast per screen so text remains 100% legible
  const scrimGradient = useMemo(() => {
    if (dimmed) {
      return ['rgba(10, 16, 12, 0.85)', 'rgba(6, 10, 8, 0.92)'];
    }
    switch (variant) {
      case 'gameplay':
        // Arena needs clear center for tile numbers
        return ['rgba(15, 26, 18, 0.45)', 'rgba(8, 14, 10, 0.65)'];
      case 'settings':
      case 'stats':
        return ['rgba(15, 26, 18, 0.55)', 'rgba(10, 18, 13, 0.75)'];
      case 'home':
        return ['rgba(15, 26, 18, 0.25)', 'rgba(10, 18, 13, 0.55)'];
      case 'victory':
        return ['rgba(30, 20, 10, 0.25)', 'rgba(15, 12, 8, 0.60)'];
      default:
        return ['rgba(15, 26, 18, 0.35)', 'rgba(10, 18, 13, 0.60)'];
    }
  }, [variant, dimmed]);

  const effectiveBlur = blurRadius !== undefined ? blurRadius : (variant === 'home' ? 1.8 : 0);

  return (
    <View style={styles.container}>
      {/* LAYER 1 — WORLD BACKGROUND (9:16 Portrait Canvas) */}
      <Image
        source={bgSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        blurRadius={effectiveBlur}
      />

      {/* LAYER 2 — ENVIRONMENTAL ATMOSPHERE & CONTRAST VIGNETTE */}
      <LinearGradient
        colors={scrimGradient as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Top subtle sunlight / sky rim glow */}
      <LinearGradient
        colors={['rgba(255, 235, 170, 0.18)', 'transparent']}
        style={styles.topSunlight}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      {/* Bottom deep grounding shadow */}
      <LinearGradient
        colors={['transparent', 'rgba(10, 18, 13, 0.85)']}
        style={styles.bottomShadow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      {/* LAYER 3 & 4 — UI STRUCTURE & INTERACTIVE CONTENT */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MRColors.bgVoid,
    overflow: 'hidden',
  },
  topSunlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  contentContainer: {
    flex: 1,
  },
});
