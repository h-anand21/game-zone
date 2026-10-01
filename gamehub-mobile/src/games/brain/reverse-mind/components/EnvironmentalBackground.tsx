// ============================================================
// REVERSE MIND — 6-Layer Environmental Background System
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { RMTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type EnvTheme =
  | 'home'
  | 'modes'
  | 'difficulty'
  | 'rule-preview'
  | 'ready'
  | 'gameplay'
  | 'level-complete'
  | 'result'
  | 'rewards'
  | 'daily'
  | 'stats'
  | 'progress'
  | 'achievements'
  | 'collection'
  | 'profile'
  | 'practice'
  | 'settings';

interface EnvironmentalBackgroundProps {
  theme?: EnvTheme;
  children?: React.ReactNode;
}

export const EnvironmentalBackground: React.FC<EnvironmentalBackgroundProps> = ({
  theme = 'home',
  children,
}) => {
  const getGradientColors = (): [string, string, string] => {
    switch (theme) {
      case 'home':
        return ['#050C1A', '#081628', '#0D2036'];
      case 'modes':
        return ['#140A28', '#0D1A30', '#07111F'];
      case 'difficulty':
        return ['#1F0E14', '#12091A', '#07111F'];
      case 'rule-preview':
        return ['#061828', '#0A2238', '#050D18'];
      case 'ready':
        return ['#1A1408', '#0F1A28', '#060D16'];
      case 'gameplay':
        return ['#040B16', '#07111F', '#0A182A'];
      case 'level-complete':
      case 'rewards':
        return ['#221A05', '#16281C', '#07111F'];
      case 'daily':
        return ['#220F06', '#141E2D', '#07111F'];
      case 'stats':
      case 'progress':
        return ['#08192E', '#0D2644', '#05101E'];
      case 'achievements':
      case 'collection':
        return ['#1A0C28', '#101C34', '#07111F'];
      case 'settings':
      default:
        return ['#06101C', '#0A1828', '#040A12'];
    }
  };

  const colors = getGradientColors();

  const getBackgroundImage = () => {
    if (theme === 'home') {
      return require('../../../../../assets/images/rm_bg_home_master.jpg');
    }
    if (theme === 'rewards' || theme === 'level-complete') {
      return require('../../../../../assets/images/rm_bg_treasure_rewards.jpg');
    }
    if (
      theme === 'rule-preview' ||
      theme === 'ready' ||
      theme === 'practice' ||
      theme === 'settings'
    ) {
      return require('../../../../../assets/images/rm_bg_master_environment.jpg');
    }
    return require('../../../../../assets/images/rm_bg_adventure_world.jpg');
  };

  return (
    <View style={styles.container}>
      {/* Layer 1: Base Canvas Gradient */}
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Layer 2: Real Full-Bleed Environmental Art Illustration */}
      <Image
        source={getBackgroundImage()}
        style={[
          StyleSheet.absoluteFill,
          styles.bgArtImage,
          theme === 'home' && { opacity: 0.78 },
        ]}
        resizeMode="cover"
      />

      {/* Layer 3: Ambient Lighting & Radial Glow Auras */}
      <Svg style={StyleSheet.absoluteFill} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
        <Defs>
          <RadialGradient id="topAura" cx="50%" cy="12%" rx="65%" ry="40%">
            <Stop offset="0%" stopColor="#4DE7FF" stopOpacity="0.18" />
            <Stop offset="60%" stopColor="#4DA3FF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bottomAura" cx="50%" cy="88%" rx="70%" ry="40%">
            <Stop offset="0%" stopColor="#8D6BFF" stopOpacity="0.14" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT * 0.12} r={SCREEN_WIDTH * 0.75} fill="url(#topAura)" />
        <Circle cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT * 0.88} r={SCREEN_WIDTH * 0.8} fill="url(#bottomAura)" />

        {/* Ambient Stars & Dust Particles */}
        <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.1} r={1.5} fill="#FFF" opacity={0.8} />
        <Circle cx={SCREEN_WIDTH * 0.82} cy={SCREEN_HEIGHT * 0.18} r={2.0} fill="#FFF" opacity={0.9} />
        <Circle cx={SCREEN_WIDTH * 0.25} cy={SCREEN_HEIGHT * 0.45} r={1.2} fill="#4DE7FF" opacity={0.6} />
        <Circle cx={SCREEN_WIDTH * 0.88} cy={SCREEN_HEIGHT * 0.6} r={1.8} fill="#FFD83D" opacity={0.7} />
        <Circle cx={SCREEN_WIDTH * 0.1} cy={SCREEN_HEIGHT * 0.75} r={2.2} fill="#FFF" opacity={0.8} />
      </Svg>

      {/* Layer 4: Foreground Content UI */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RMTheme.colors.bgVoid,
  },
  bgArtImage: {
    opacity: 0.85,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
});
