// ============================================================
// PATTERN BREAKER — Reusable World Background Layer
// Dark Cinematic Fantasy-Tech Ruins & Floating Island Observatory
// Controlled center noise: Environment supports UI, never competes!
// ============================================================

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  RadialGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Polygon,
} from 'react-native-svg';
import { PBColors } from '../../theme';

interface GameBackgroundProps {
  children?: React.ReactNode;
  variant?: 'observatory' | 'gameplay' | 'portal';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GameBackground: React.FC<GameBackgroundProps> = ({
  children,
  variant = 'observatory',
}) => {
  // Generate stable ambient floating particle coordinates
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
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
      {/* LAYER 1: Deep Cinematic Void Gradient Base                   */}
      {/* ============================================================ */}
      <LinearGradient
        colors={[PBColors.backgroundElevated, PBColors.background, PBColors.backgroundDark]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* ============================================================ */}
      {/* LAYER 2: Floating Sci-Fi Tech Ruins & Ancient Monoliths       */}
      {/* ============================================================ */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox="0 0 400 800">
          <Defs>
            {/* Cyan Energy Glow */}
            <RadialGradient id="portalGlow" cx="50%" cy="32%" r="45%">
              <Stop offset="0%" stopColor="#19D3FF" stopOpacity="0.28" />
              <Stop offset="50%" stopColor="#19D3FF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#08131A" stopOpacity="0" />
            </RadialGradient>

            {/* Amber Horizon Strip */}
            <RadialGradient id="amberHorizon" cx="80%" cy="15%" r="35%">
              <Stop offset="0%" stopColor="#FFD54A" stopOpacity="0.22" />
              <Stop offset="60%" stopColor="#FFD54A" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#08131A" stopOpacity="0" />
            </RadialGradient>

            {/* Floating Island Gradient */}
            <SvgGradient id="stoneIslandGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#182F39" stopOpacity="0.8" />
              <Stop offset="60%" stopColor="#10232C" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#061018" stopOpacity="0.95" />
            </SvgGradient>

            {/* Neon Cyan Seam Stroke */}
            <SvgGradient id="cyanSeam" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#19D3FF" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#19D3FF" stopOpacity="0.1" />
            </SvgGradient>
          </Defs>

          {/* Central Atmospheric Glow Spot */}
          <Circle cx="200" cy="260" r="220" fill="url(#portalGlow)" />
          <Circle cx="320" cy="120" r="140" fill="url(#amberHorizon)" />

          {/* Distant Geometric Portal Frame (Triangular/Hexagonal Ruins) */}
          <Polygon
            points="200,60 360,320 40,320"
            fill="none"
            stroke="url(#cyanSeam)"
            strokeWidth="1.2"
            strokeDasharray="6,4"
            opacity={0.35}
          />
          <Circle cx="200" cy="220" r="90" fill="none" stroke="#19D3FF" strokeWidth="0.8" opacity={0.2} />

          {/* Floating Left Tech Island */}
          <Path
            d="M -20,190 L 70,170 L 110,210 L 80,250 L -30,240 Z"
            fill="url(#stoneIslandGrad)"
            stroke="#19D3FF"
            strokeWidth="0.8"
            opacity={0.55}
          />
          {/* Moss / Light strip on island */}
          <Path d="M 0,185 L 65,172 L 95,200" fill="none" stroke="#38E58C" strokeWidth="1.5" opacity={0.4} />

          {/* Floating Right Ancient Monolith */}
          <Path
            d="M 330,130 L 410,120 L 420,200 L 320,180 Z"
            fill="url(#stoneIslandGrad)"
            stroke="#FFD54A"
            strokeWidth="0.8"
            opacity={0.45}
          />
          <Path d="M 340,135 L 390,128" fill="none" stroke="#FFD54A" strokeWidth="1.5" opacity={0.5} />

          {/* Lower Floating Foundation Platform */}
          <Path
            d="M 60,720 L 340,720 L 380,780 L 20,780 Z"
            fill="url(#stoneIslandGrad)"
            stroke="#19D3FF"
            strokeWidth="0.8"
            opacity={0.6}
          />

          {/* Ambient Particles */}
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
      {/* LAYER 3: Volumetric Vignette & Center Scrim                  */}
      {/* Controls center contrast so gameplay tiles pop brilliantly   */}
      {/* ============================================================ */}
      <LinearGradient
        colors={[
          'rgba(6, 16, 24, 0.45)',
          'rgba(8, 19, 26, 0.70)',
          'rgba(6, 16, 24, 0.88)',
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Foreground Content */}
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
