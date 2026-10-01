// ============================================================
// Number Rush — SVG Arcade Runner Boy Mascot
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
} from 'react-native-svg';

interface MascotProps {
  size?: number;
  mood?: 'happy' | 'celebrate' | 'thinking';
}

export const MascotIllustration: React.FC<MascotProps> = ({
  size = 180,
  mood = 'happy',
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <Defs>
          {/* Cap Gradient */}
          <LinearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF4757" />
            <Stop offset="100%" stopColor="#C0392B" />
          </LinearGradient>

          {/* Skin Tone */}
          <LinearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFDBAC" />
            <Stop offset="100%" stopColor="#F1C27D" />
          </LinearGradient>

          {/* Hoodie / Jacket */}
          <LinearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#1E90FF" />
            <Stop offset="100%" stopColor="#0B4CB0" />
          </LinearGradient>

          {/* Golden Glow for Backing */}
          <LinearGradient id="auraGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFD700" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#FFA000" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Aura Ring */}
        <Circle cx="100" cy="100" r="90" fill="url(#auraGlow)" />

        {/* Floating Sparks */}
        <Circle cx="45" cy="40" r="4" fill="#FFD700" />
        <Circle cx="160" cy="55" r="5" fill="#FFE082" />
        <Circle cx="30" cy="120" r="3" fill="#2ED573" />
        <Circle cx="170" cy="130" r="4" fill="#FF4757" />

        <G transform="translate(0, 5)">
          {/* Torso / Hoodie */}
          <Path
            d="M 60 145 C 60 115, 140 115, 140 145 L 148 185 C 148 190, 52 190, 52 185 Z"
            fill="url(#hoodieGrad)"
          />
          {/* Zipper / Detail */}
          <Rect x="97" y="125" width="6" height="58" rx="3" fill="#FFC107" />
          {/* Hoodie Collar */}
          <Path
            d="M 75 125 C 90 135, 110 135, 125 125 C 115 140, 85 140, 75 125 Z"
            fill="#FFA000"
          />

          {/* Neck */}
          <Rect x="88" y="105" width="24" height="22" rx="6" fill="#F1C27D" />

          {/* Head */}
          <Circle cx="100" cy="80" r="38" fill="url(#skinGrad)" />

          {/* Cheeks */}
          <Ellipse cx="76" cy="88" rx="7" ry="4" fill="#FF8A80" opacity="0.6" />
          <Ellipse cx="124" cy="88" rx="7" ry="4" fill="#FF8A80" opacity="0.6" />

          {/* Eyes */}
          {mood === 'celebrate' ? (
            // Smiling happy arc eyes
            <G stroke="#2C3E50" strokeWidth="3.5" strokeLinecap="round">
              <Path d="M 74 76 Q 82 66 90 76" />
              <Path d="M 110 76 Q 118 66 126 76" />
            </G>
          ) : (
            // Big anime round eyes with highlights
            <G>
              <Circle cx="82" cy="74" r="8" fill="#1A252F" />
              <Circle cx="84" cy="71" r="3" fill="#FFFFFF" />
              <Circle cx="80" cy="76" r="1.5" fill="#FFFFFF" />

              <Circle cx="118" cy="74" r="8" fill="#1A252F" />
              <Circle cx="120" cy="71" r="3" fill="#FFFFFF" />
              <Circle cx="116" cy="76" r="1.5" fill="#FFFFFF" />
            </G>
          )}

          {/* Smile / Mouth */}
          <Path
            d="M 88 92 Q 100 106 112 92"
            stroke="#C0392B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="#E74C3C"
          />

          {/* Ears */}
          <Circle cx="62" cy="80" r="9" fill="#F1C27D" />
          <Circle cx="138" cy="80" r="9" fill="#F1C27D" />

          {/* Hair Tufts */}
          <Path
            d="M 68 56 Q 60 70 65 78 Q 72 65 74 58 Z"
            fill="#4A2511"
          />
          <Path
            d="M 132 56 Q 140 70 135 78 Q 128 65 126 58 Z"
            fill="#4A2511"
          />

          {/* Backwards / Sideways Arcade Cap */}
          <Path
            d="M 62 58 C 62 30, 138 30, 138 58 C 145 52, 175 48, 168 58 C 145 66, 130 62, 126 62 L 74 62 Z"
            fill="url(#capGrad)"
          />
          {/* Cap Visor */}
          <Path
            d="M 130 54 Q 170 50 162 60 Q 130 65 126 62 Z"
            fill="#FFE082"
          />
          {/* Star Badge on Cap */}
          <Circle cx="100" cy="42" r="8" fill="#FFD700" />
          <Path
            d="M 100 36 L 102 40 L 106 41 L 103 44 L 104 48 L 100 45 L 96 48 L 97 44 L 94 41 L 98 40 Z"
            fill="#C67C00"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
