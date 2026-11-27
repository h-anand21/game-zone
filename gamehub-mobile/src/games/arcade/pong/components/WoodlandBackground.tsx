// ============================================================
// Woodland Bubble Shooter — Sunlit Oak & Bamboo Canopy Backdrop
// Warm wooden exterior with calm forest depth (zero purple UI)
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path, Circle, Polygon, Line } from 'react-native-svg';
import { WOOD_SHOOTER_PALETTE } from './woodTheme';

interface WoodlandBackgroundProps {
  children: React.ReactNode;
}

export const WoodlandBackground: React.FC<WoodlandBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.root}>
      {/* Warm Forest Oak Base Gradient */}
      <LinearGradient
        colors={WOOD_SHOOTER_PALETTE.forestBgGradient}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Forest Canopy Sunbeams, Bamboo Silhouette & Soft Mist */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        pointerEvents="none"
      >
        {/* Subtle vertical timber plank fibers */}
        <Line x1="12" y1="0" x2="12" y2="200" stroke="rgba(66, 30, 7, 0.14)" strokeWidth={0.5} />
        <Line x1="28" y1="0" x2="28" y2="200" stroke="rgba(255, 224, 172, 0.08)" strokeWidth={0.4} />
        <Line x1="50" y1="0" x2="50" y2="200" stroke="rgba(66, 30, 7, 0.12)" strokeWidth={0.45} />
        <Line x1="72" y1="0" x2="72" y2="200" stroke="rgba(255, 224, 172, 0.08)" strokeWidth={0.4} />
        <Line x1="88" y1="0" x2="88" y2="200" stroke="rgba(66, 30, 7, 0.15)" strokeWidth={0.5} />

        {/* Soft warm sunlit beams descending into the woods */}
        <Polygon points="15,0 38,0 64,200 22,200" fill="rgba(254, 240, 138, 0.06)" />
        <Polygon points="56,0 82,0 98,200 68,200" fill="rgba(254, 240, 138, 0.05)" />

        {/* Subtle lower meadow hills & sunlit leaf silhouettes */}
        <Path
          d="M0 168 Q26 154 52 166 T100 162 L100 200 L0 200 Z"
          fill="rgba(34, 62, 22, 0.36)"
        />
        <Path
          d="M0 178 Q34 166 68 178 T100 174 L100 200 L0 200 Z"
          fill="rgba(28, 48, 16, 0.45)"
        />

        {/* Delicate floating golden pollen / forest firefly motes */}
        <Circle cx="16" cy="52" r="1.2" fill="rgba(253, 224, 71, 0.35)" />
        <Circle cx="84" cy="40" r="1.4" fill="rgba(253, 224, 71, 0.30)" />
        <Circle cx="24" cy="144" r="1.3" fill="rgba(253, 224, 71, 0.42)" />
        <Circle cx="76" cy="152" r="1.5" fill="rgba(253, 224, 71, 0.38)" />
        <Rect x="0" y="0" width="100" height="2" fill="rgba(62, 28, 6, 0.35)" />
      </Svg>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#9E5E24',
  },
});
