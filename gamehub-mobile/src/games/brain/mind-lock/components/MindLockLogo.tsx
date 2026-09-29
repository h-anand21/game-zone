// ============================================================
// Mind Lock — Procedural Vector 3D Logo Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
  Path,
  Rect,
  Circle,
  Polygon,
} from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';

interface MindLockLogoProps {
  width?: number;
  showTagline?: boolean;
  style?: ViewStyle;
}

export const MindLockLogo: React.FC<MindLockLogoProps> = ({
  width = 280,
  showTagline = true,
  style,
}) => {
  const height = width * 0.52;

  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 320 160">
        <Defs>
          {/* Cream 3D Text Gradient for "MIND" */}
          <SvgLinearGradient id="mindGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#FFF2DC" />
            <Stop offset="100%" stopColor="#E2CEAB" />
          </SvgLinearGradient>

          {/* Gold 3D Text Gradient for "LOCK" */}
          <SvgLinearGradient id="lockGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF280" />
            <Stop offset="45%" stopColor="#FFC928" />
            <Stop offset="100%" stopColor="#D48800" />
          </SvgLinearGradient>

          {/* Ray Glow Gradient */}
          <SvgLinearGradient id="rayGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFC928" stopOpacity="0.2" />
          </SvgLinearGradient>
        </Defs>

        {/* 1. Burst Energy Rays on Left and Right */}
        <G fill="url(#rayGrad)">
          {/* Left rays */}
          <Polygon points="30,45 60,54 25,58" />
          <Polygon points="20,70 54,75 22,82" />
          <Polygon points="26,95 58,92 28,105" />

          {/* Right rays */}
          <Polygon points="290,45 260,54 295,58" />
          <Polygon points="300,70 266,75 298,82" />
          <Polygon points="294,95 262,92 292,105" />
        </G>

        {/* 2. "MIND" 3D Text with Drop Shadow */}
        {/* Deep drop shadow */}
        <SvgText
          x="160"
          y="68"
          fontSize="56"
          fontWeight="900"
          fontFamily="System"
          fill="#060C14"
          textAnchor="middle"
          letterSpacing="4"
        >
          MIND
        </SvgText>
        {/* 3D Under-layer */}
        <SvgText
          x="160"
          y="64"
          fontSize="56"
          fontWeight="900"
          fontFamily="System"
          fill="#B59E7A"
          textAnchor="middle"
          letterSpacing="4"
        >
          MIND
        </SvgText>
        {/* Front Gloss Face */}
        <SvgText
          x="160"
          y="60"
          fontSize="56"
          fontWeight="900"
          fontFamily="System"
          fill="url(#mindGrad)"
          stroke="#5C4524"
          strokeWidth="2.5"
          textAnchor="middle"
          letterSpacing="4"
        >
          MIND
        </SvgText>

        {/* Brain symbol integrated into 'I' */}
        <G transform="translate(138, 22) scale(0.7)">
          <Path
            d="M12 4 C6 4 3 9 5 14 C2 17 4 23 9 24 C10 28 17 28 20 25 C23 28 30 28 31 24 C36 23 38 17 35 14 C37 9 34 4 28 4 C25 1 15 1 12 4 Z"
            fill="#FFF2DC"
            stroke="#5C4524"
            strokeWidth="2"
          />
          <Path d="M20 5 L20 25" stroke="#D1BA94" strokeWidth="2" />
        </G>

        {/* 3. "LOCK" 3D Text with Keyhole */}
        {/* Deep drop shadow */}
        <SvgText
          x="160"
          y="132"
          fontSize="66"
          fontWeight="900"
          fontFamily="System"
          fill="#060C14"
          textAnchor="middle"
          letterSpacing="5"
        >
          LOCK
        </SvgText>
        {/* 3D Under-layer */}
        <SvgText
          x="160"
          y="126"
          fontSize="66"
          fontWeight="900"
          fontFamily="System"
          fill="#8A5600"
          textAnchor="middle"
          letterSpacing="5"
        >
          LOCK
        </SvgText>
        {/* Front Gloss Face */}
        <SvgText
          x="160"
          y="122"
          fontSize="66"
          fontWeight="900"
          fontFamily="System"
          fill="url(#lockGrad)"
          stroke="#4D2E00"
          strokeWidth="3"
          textAnchor="middle"
          letterSpacing="5"
        >
          LOCK
        </SvgText>

        {/* Keyhole slot in the letter 'O' */}
        <G transform="translate(141, 88)">
          <Circle cx="8" cy="8" r="4.5" fill="#0A121D" />
          <Polygon points="6,9 10,9 11,18 5,18" fill="#0A121D" />
        </G>
      </Svg>

      {/* Tagline Pill */}
      {showTagline && (
        <View style={styles.taglinePill}>
          <Text style={styles.taglineText}>Train • Remember • Repeat</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglinePill: {
    backgroundColor: 'rgba(18, 35, 56, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.12)',
    marginTop: -8,
    ...MLShadows.sm,
  },
  taglineText: {
    color: MLColors.cream,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
    letterSpacing: 0.5,
  },
});
