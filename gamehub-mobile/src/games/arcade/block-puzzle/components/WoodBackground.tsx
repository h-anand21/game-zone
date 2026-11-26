// ============================================================
// Block Puzzle — Caramel Oak Brushed Wood Background
// Renders vertical wood plank tones & grain texture in pure RN + SVG
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Line, Path } from 'react-native-svg';
import { WOOD_PALETTE } from './woodTheme';

interface WoodBackgroundProps {
  children: React.ReactNode;
}

const PLANK_BANDS = [
  { x: 0, width: 18, color: 'rgba(92, 46, 12, 0.10)' },
  { x: 18, width: 16, color: 'rgba(255, 224, 172, 0.06)' },
  { x: 34, width: 22, color: 'rgba(92, 46, 12, 0.08)' },
  { x: 56, width: 14, color: 'rgba(255, 224, 172, 0.05)' },
  { x: 70, width: 18, color: 'rgba(80, 38, 8, 0.11)' },
  { x: 88, width: 12, color: 'rgba(255, 224, 172, 0.05)' },
];

const GRAIN_LINES = [6, 12, 18, 27, 34, 43, 51, 56, 63, 70, 79, 88, 94];

export const WoodBackground: React.FC<WoodBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={WOOD_PALETTE.bgGradient}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Vertical oak plank bands & fine brushed grain fibers */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        pointerEvents="none"
      >
        {PLANK_BANDS.map((band, idx) => (
          <Rect
            key={`band-${idx}`}
            x={band.x}
            y={0}
            width={band.width}
            height={200}
            fill={band.color}
          />
        ))}

        {GRAIN_LINES.map((xPos, idx) => (
          <Line
            key={`grain-${idx}`}
            x1={xPos}
            y1={0}
            x2={xPos}
            y2={200}
            stroke={idx % 2 === 0 ? 'rgba(66, 30, 7, 0.14)' : 'rgba(255, 232, 185, 0.09)'}
            strokeWidth={idx % 3 === 0 ? 0.6 : 0.35}
          />
        ))}

        {/* Subtle organic wood grain arcs */}
        <Path
          d="M 14 0 Q 17 55 13 115 T 15 200"
          stroke="rgba(66, 30, 7, 0.12)"
          strokeWidth={0.55}
          fill="none"
        />
        <Path
          d="M 48 0 Q 44 65 49 130 T 46 200"
          stroke="rgba(66, 30, 7, 0.11)"
          strokeWidth={0.5}
          fill="none"
        />
        <Path
          d="M 81 0 Q 85 70 80 140 T 83 200"
          stroke="rgba(255, 232, 185, 0.08)"
          strokeWidth={0.45}
          fill="none"
        />
      </Svg>

      {/* Soft top/bottom warm edge shading */}
      <LinearGradient
        colors={['rgba(52, 23, 5, 0.28)', 'transparent', 'rgba(42, 17, 3, 0.34)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WOOD_PALETTE.bgBase,
  },
});
