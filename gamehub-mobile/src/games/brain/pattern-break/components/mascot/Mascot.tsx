// ============================================================
// PATTERN BREAKER — Mascot Component: "PATTERN SCOUT"
// Young explorer with futuristic goggles, amber jacket & cyan badge
// Pure vector SVG character with multiple dynamic expressive poses
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  G,
  Circle,
  Path,
  Rect,
  Ellipse,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

export type MascotPose =
  | 'confident'
  | 'explaining'
  | 'pointing'
  | 'ready'
  | 'celebrating'
  | 'surprised'
  | 'victory'
  | 'proud';

interface MascotProps {
  pose?: MascotPose;
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({ pose = 'confident', size = 110 }) => {
  const isExcited = pose === 'celebrating' || pose === 'victory';
  const isSurprised = pose === 'surprised';
  const isPointing = pose === 'pointing' || pose === 'explaining';

  return (
    <View style={[styles.container, { width: size, height: size * 1.15 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 140">
        <Defs>
          {/* Hair Gradient */}
          <SvgGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#78350F" />
            <Stop offset="100%" stopColor="#451A03" />
          </SvgGradient>

          {/* Jacket Amber Gradient */}
          <SvgGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </SvgGradient>

          {/* Goggle Cyan Lens Glow */}
          <SvgGradient id="goggleGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#0284C7" />
          </SvgGradient>

          {/* Skin Tone */}
          <SvgGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FDE68A" />
            <Stop offset="100%" stopColor="#FCD34D" />
          </SvgGradient>
        </Defs>

        {/* Small Explorer Backpack */}
        <Rect x="26" y="70" width="14" height="26" rx="4" fill="#374151" stroke="#1F2937" strokeWidth="1.5" />
        <Rect x="80" y="70" width="14" height="26" rx="4" fill="#374151" stroke="#1F2937" strokeWidth="1.5" />

        {/* Jacket Body */}
        <Path
          d="M 38,72 L 82,72 L 88,110 L 32,110 Z"
          fill="url(#jacketGrad)"
          stroke="#B45309"
          strokeWidth="2"
        />

        {/* Cyan Tech Geometric Badge on Chest */}
        <Circle cx="48" cy="85" r="4.5" fill="#19D3FF" stroke="#FFFFFF" strokeWidth="1" />
        <Path d="M 48,82 L 50,86 L 46,86 Z" fill="#FFFFFF" />

        {/* Jacket Collar / Scarf */}
        <Path d="M 44,68 L 60,78 L 76,68 Z" fill="#0E7490" stroke="#155E75" strokeWidth="1.5" />

        {/* Left Arm & Hand */}
        {isExcited ? (
          // Arms raised up celebrating
          <G>
            <Path d="M 36,75 L 20,55" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
            <Circle cx="18" cy="52" r="5" fill="url(#skinGrad)" />
          </G>
        ) : isPointing ? (
          // Left arm pointing forward
          <G>
            <Path d="M 36,75 L 14,75" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
            <Circle cx="12" cy="75" r="5" fill="url(#skinGrad)" />
            {/* Magnifying Glass */}
            <Circle cx="4" cy="75" r="7" fill="none" stroke="#19D3FF" strokeWidth="2" />
            <Path d="M 9,79 L 14,84" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          </G>
        ) : (
          // Confident hand on hip
          <G>
            <Path d="M 36,76 Q 24,84 28,94" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
            <Circle cx="29" cy="95" r="4.5" fill="url(#skinGrad)" />
          </G>
        )}

        {/* Right Arm & Hand */}
        {isExcited ? (
          <G>
            <Path d="M 84,75 L 100,55" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
            <Circle cx="102" cy="52" r="5" fill="url(#skinGrad)" />
          </G>
        ) : (
          <G>
            <Path d="M 84,76 Q 96,84 92,94" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
            <Circle cx="91" cy="95" r="4.5" fill="url(#skinGrad)" />
          </G>
        )}

        {/* Head / Face */}
        <Ellipse cx="60" cy="50" rx="20" ry="19" fill="url(#skinGrad)" />

        {/* Messy Explorer Hair (Back/Top) */}
        <Path
          d="M 38,44 Q 40,24 60,22 Q 80,24 82,44 Q 86,30 76,20 Q 60,14 44,20 Q 34,28 38,44 Z"
          fill="url(#hairGrad)"
        />

        {/* Futuristic Explorer Goggles (On Forehead) */}
        <G>
          {/* Goggle Strap */}
          <Path d="M 38,36 Q 60,32 82,36" stroke="#1E293B" strokeWidth="4" fill="none" />
          {/* Left Lens */}
          <Circle cx="48" cy="34" r="9" fill="#1E293B" />
          <Circle cx="48" cy="34" r="7" fill="url(#goggleGrad)" />
          <Circle cx="46" cy="32" r="2.5" fill="#FFFFFF" opacity={0.7} />
          {/* Right Lens */}
          <Circle cx="72" cy="34" r="9" fill="#1E293B" />
          <Circle cx="72" cy="34" r="7" fill="url(#goggleGrad)" />
          <Circle cx="70" cy="32" r="2.5" fill="#FFFFFF" opacity={0.7} />
          {/* Bridge */}
          <Rect x="56" y="32" width="8" height="3" fill="#64748B" rx="1" />
        </G>

        {/* Expressive Eyes */}
        {isSurprised ? (
          // Wide surprised eyes
          <G>
            <Circle cx="52" cy="50" r="4.5" fill="#FFFFFF" />
            <Circle cx="52" cy="50" r="2.5" fill="#1E293B" />
            <Circle cx="68" cy="50" r="4.5" fill="#FFFFFF" />
            <Circle cx="68" cy="50" r="2.5" fill="#1E293B" />
          </G>
        ) : isExcited ? (
          // Happy curved eyes
          <G>
            <Path d="M 48,51 Q 52,46 56,51" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M 64,51 Q 68,46 72,51" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </G>
        ) : (
          // Confident friendly open eyes
          <G>
            <Circle cx="52" cy="50" r="3.5" fill="#1E293B" />
            <Circle cx="53" cy="49" r="1.2" fill="#FFFFFF" />
            <Circle cx="68" cy="50" r="3.5" fill="#1E293B" />
            <Circle cx="69" cy="49" r="1.2" fill="#FFFFFF" />
          </G>
        )}

        {/* Cheerful Blush */}
        <Circle cx="45" cy="56" r="3" fill="#F43F5E" opacity={0.35} />
        <Circle cx="75" cy="56" r="3" fill="#F43F5E" opacity={0.35} />

        {/* Mouth */}
        {isSurprised ? (
          <Circle cx="60" cy="60" r="3.5" fill="#881337" />
        ) : isExcited ? (
          <Path d="M 54,58 Q 60,67 66,58 Z" fill="#881337" stroke="#4C0519" strokeWidth="1" />
        ) : (
          <Path d="M 55,59 Q 60,63 65,59" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
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
