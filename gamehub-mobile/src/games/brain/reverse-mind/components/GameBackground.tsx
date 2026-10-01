// ============================================================
// REVERSE MIND — Procedural Cozy Night Study Background
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { RMTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Procedural stars for ambient night atmosphere
const STARS = [
  { cx: 35, cy: 90, r: 1.5, opacity: 0.7 },
  { cx: 120, cy: 150, r: 2.2, opacity: 0.85 },
  { cx: 280, cy: 80, r: 1.2, opacity: 0.6 },
  { cx: 340, cy: 190, r: 2.0, opacity: 0.9 },
  { cx: 70, cy: 320, r: 1.0, opacity: 0.5 },
  { cx: 310, cy: 380, r: 1.8, opacity: 0.75 },
  { cx: 190, cy: 260, r: 1.4, opacity: 0.6 },
  { cx: 45, cy: 520, r: 2.0, opacity: 0.8 },
  { cx: 320, cy: 590, r: 1.6, opacity: 0.7 },
  { cx: 150, cy: 670, r: 1.2, opacity: 0.5 },
  { cx: 260, cy: 740, r: 1.8, opacity: 0.8 },
];

export const GameBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Deep Canvas Gradient */}
      <LinearGradient
        colors={[RMTheme.colors.bgVoid, RMTheme.colors.bgDark, RMTheme.colors.bgMid]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Atmospheric Starfield and Ambient Radial Glows */}
      <Svg style={StyleSheet.absoluteFill} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
        <Defs>
          <RadialGradient id="topAura" cx="50%" cy="15%" rx="60%" ry="35%" fx="50%" fy="15%">
            <Stop offset="0%" stopColor="#4DE7FF" stopOpacity="0.12" />
            <Stop offset="60%" stopColor="#4DA3FF" stopOpacity="0.04" />
            <Stop offset="100%" stopColor="#07111F" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bottomAura" cx="50%" cy="85%" rx="70%" ry="40%" fx="50%" fy="85%">
            <Stop offset="0%" stopColor="#8D6BFF" stopOpacity="0.09" />
            <Stop offset="80%" stopColor="#07111F" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT * 0.15} r={SCREEN_WIDTH * 0.7} fill="url(#topAura)" />
        <Circle cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT * 0.85} r={SCREEN_WIDTH * 0.8} fill="url(#bottomAura)" />

        {/* Ambient Stars */}
        {STARS.map((star, i) => (
          <Circle
            key={i}
            cx={(star.cx / 375) * SCREEN_WIDTH}
            cy={(star.cy / 812) * SCREEN_HEIGHT}
            r={star.r}
            fill="#FFFFFF"
            opacity={star.opacity}
          />
        ))}
      </Svg>

      {/* Foreground Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RMTheme.colors.bgVoid,
  },
  content: {
    flex: 1,
  },
});
