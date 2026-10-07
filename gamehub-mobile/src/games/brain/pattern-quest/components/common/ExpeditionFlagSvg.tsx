// ============================================================
// PATTERN QUEST — Expedition Flag SVG Component
// Authentic Waving Silk Adventure Pennant on Golden Shaded Pole
// ============================================================

import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface ExpeditionFlagSvgProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  idPrefix?: string;
}

export const ExpeditionFlagSvg: React.FC<ExpeditionFlagSvgProps> = ({
  size = 36,
  style,
  idPrefix = 'pq_flag',
}) => {
  const width = size;
  const height = size;

  const redGradId = `${idPrefix}_redGrad`;
  const poleGradId = `${idPrefix}_poleGrad`;
  const finialGradId = `${idPrefix}_finialGrad`;

  return (
    <View style={style}>
      <Svg width={width} height={height} viewBox="0 0 48 48">
        <Defs>
          {/* Flag Red Silk Gradient with highlight and shadow */}
          <LinearGradient id={redGradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF4D4D" />
            <Stop offset="45%" stopColor="#D32F2F" />
            <Stop offset="100%" stopColor="#7F0000" />
          </LinearGradient>

          {/* Pole Brass / Gold Gradient */}
          <LinearGradient id={poleGradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="50%" stopColor="#FFB300" />
            <Stop offset="100%" stopColor="#8D5B00" />
          </LinearGradient>

          {/* Finial Gold Orb */}
          <LinearGradient id={finialGradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF9C4" />
            <Stop offset="60%" stopColor="#FFC107" />
            <Stop offset="100%" stopColor="#FF8F00" />
          </LinearGradient>
        </Defs>

        {/* 1. Flagpole with Metallic Shading */}
        <Path d="M 12 5 L 12 44" stroke={`url(#${poleGradId})`} strokeWidth="3" strokeLinecap="round" />
        <Path d="M 13.2 6 L 13.2 43" stroke="#5D3A00" strokeWidth="0.8" />

        {/* 2. Gold Spearhead / Orb Finial at Top */}
        <Circle cx="12" cy="5" r="3.5" fill={`url(#${finialGradId})`} stroke="#B26A00" strokeWidth="0.8" />
        <Circle cx="10.8" cy="4" r="1.2" fill="#FFFFFF" opacity="0.8" />

        {/* 3. Base Stone Pedestal Ring */}
        <Circle cx="12" cy="44" r="3" fill="#2E3A46" stroke="#C5832B" strokeWidth="1" />

        {/* 4. Waving Silk Swallowtail Pennant Flag with Bézier Folds */}
        <Path
          d="M 13.5 7.5 C 22 4.5, 27 12, 38 7.5 C 41.5 6.2, 43 7.8, 41.5 11.5 L 36.5 19 L 41.5 26.5 C 43 30.2, 41.5 31.8, 38 30.5 C 27 26, 22 33.5, 13.5 30.5 Z"
          fill={`url(#${redGradId})`}
          stroke="#5B0007"
          strokeWidth="1.2"
        />

        {/* 5. Flag Wave Crease & Highlight Lines for 3D Fabric Illusion */}
        <Path
          d="M 14 11 C 22 8, 26 15, 37 11"
          stroke="#FFA8A8"
          strokeWidth="1"
          fill="none"
          opacity="0.65"
        />
        <Path
          d="M 14 27 C 22 24, 26 31, 37 27"
          stroke="#4A0005"
          strokeWidth="1.2"
          fill="none"
          opacity="0.75"
        />

        {/* 6. Gold Star Crest on Flag */}
        <G transform="translate(24, 19) scale(0.65)">
          <Path
            d="M 0 -8 L 2.4 -2.5 L 8 -2.4 L 3.8 1.8 L 5.4 7.6 L 0 4.2 L -5.4 7.6 L -3.8 1.8 L -8 -2.4 L -2.4 -2.5 Z"
            fill="#FFE082"
            stroke="#B26A00"
            strokeWidth="0.8"
          />
        </G>
      </Svg>
    </View>
  );
};
