// ============================================================
// PATTERN BREAKER — Robot Companion Component
// Small floating droid companion with white/black shell & cyan display
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Rect,
  Ellipse,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

interface RobotCompanionProps {
  size?: number;
  mood?: 'happy' | 'alert' | 'scanning';
}

export const RobotCompanion: React.FC<RobotCompanionProps> = ({ size = 46, mood = 'happy' }) => {
  return (
    <View style={[styles.container, { width: size, height: size * 1.1 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 60 66">
        <Defs>
          {/* Ceramic White Shell Gradient */}
          <SvgGradient id="shellGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </SvgGradient>

          {/* Cyan Visor Display */}
          <SvgGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0F172A" />
            <Stop offset="100%" stopColor="#0284C7" />
          </SvgGradient>
        </Defs>

        {/* Floating Hover Wave Beneath */}
        <Ellipse cx="30" cy="62" rx="14" ry="3" fill="#19D3FF" opacity={0.35} />

        {/* Top Antenna */}
        <Path d="M 30,14 L 30,6" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="30" cy="5" r="3" fill="#FFD54A" stroke="#B45309" strokeWidth="1" />

        {/* Small Left & Right Jet Thruster Wings */}
        <Rect x="6" y="26" width="6" height="12" rx="3" fill="#334155" />
        <Rect x="48" y="26" width="6" height="12" rx="3" fill="#334155" />

        {/* Main Spherical Shell */}
        <Circle
          cx="30"
          cy="32"
          r="18"
          fill="url(#shellGrad)"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* Cyan Digital Visor Screen */}
        <Rect
          x="18"
          y="26"
          width="24"
          height="12"
          rx="6"
          fill="url(#visorGrad)"
          stroke="#19D3FF"
          strokeWidth="1"
        />

        {/* Friendly Digital Eyes */}
        {mood === 'alert' ? (
          <Circle cx="30" cy="32" r="3.5" fill="#FF5C61" />
        ) : (
          <>
            <Circle cx="25" cy="32" r="2.2" fill="#19D3FF" />
            <Circle cx="35" cy="32" r="2.2" fill="#19D3FF" />
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
