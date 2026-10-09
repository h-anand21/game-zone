// ============================================================
// REACTION FIRE — Radar Rings & Vector Targeting Geometry
// Native SVG concentric circles, crosshairs & dynamic state glow
// ============================================================

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { RfColors } from '../theme';
import type { GameplayState } from '../types';

interface RadarRingsProps {
  size: number;
  state: GameplayState;
}

export const RadarRings: React.FC<RadarRingsProps> = ({ size, state }) => {
  const center = size / 2;

  // Determine state-based ring colors
  let ringColor = RfColors.secondaryCyan;
  let accentColor = RfColors.primaryBlue;

  if (state === 'go') {
    ringColor = RfColors.goLime;
    accentColor = RfColors.goLimeBorder;
  } else if (state === 'tooEarly') {
    ringColor = RfColors.signalRed;
    accentColor = RfColors.signalRedBorder;
  } else if (state === 'decoy') {
    ringColor = RfColors.decoyYellow;
    accentColor = RfColors.decoyYellow;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer concentric boundary ring */}
        <Circle
          cx={center}
          cy={center}
          r={center - 6}
          stroke={ringColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Mid radar ring with dashed stroke */}
        <Circle
          cx={center}
          cy={center}
          r={center * 0.72}
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray="6, 6"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Inner focus ring */}
        <Circle
          cx={center}
          cy={center}
          r={center * 0.44}
          stroke={ringColor}
          strokeWidth="2"
          strokeOpacity="0.75"
          fill="none"
        />

        {/* Core bullseye ring */}
        <Circle
          cx={center}
          cy={center}
          r={center * 0.22}
          stroke={accentColor}
          strokeWidth="1.5"
          strokeOpacity="0.8"
          fill="none"
        />

        {/* Crosshair Horizontal Line */}
        <Line
          x1={center - center * 0.85}
          y1={center}
          x2={center + center * 0.85}
          y2={center}
          stroke={ringColor}
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Crosshair Vertical Line */}
        <Line
          x1={center}
          y1={center - center * 0.85}
          x2={center}
          y2={center + center * 0.85}
          stroke={ringColor}
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* 4 Diagonal Targeting Ticks */}
        <Line
          x1={center - 12}
          y1={center - 12}
          x2={center - 24}
          y2={center - 24}
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        <Line
          x1={center + 12}
          y1={center - 12}
          x2={center + 24}
          y2={center - 24}
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        <Line
          x1={center - 12}
          y1={center + 12}
          x2={center - 24}
          y2={center + 24}
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        <Line
          x1={center + 12}
          y1={center + 12}
          x2={center + 24}
          y2={center + 24}
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.6"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

export default RadarRings;
