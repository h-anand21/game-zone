// ============================================================
// Find One — Procedural 3D Game Logo Component
// ============================================================

import React from 'react';
import { View, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { WoodenSign } from './WoodenSign';
import { FOColors } from '../theme';

interface GameLogoProps {
  width?: number;
  subtitle?: string;
  showSubtitle?: boolean;
  style?: ViewStyle;
}

export const GameLogo: React.FC<GameLogoProps> = ({
  width: customWidth,
  subtitle = 'Spot the different one!',
  showSubtitle = true,
  style,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const logoWidth = customWidth || Math.min(windowWidth * 0.85, 340);
  const logoHeight = (logoWidth * 125) / 320;

  return (
    <View style={[styles.container, style]}>
      {/* SVG 3D Cartoon Text: FIND ONE */}
      <Svg width={logoWidth} height={logoHeight} viewBox="0 0 320 125">
        <Defs>
          {/* FIND White-Blue Gloss Gradient */}
          <SvgLinearGradient id="findGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="55%" stopColor="#EDF6FF" />
            <Stop offset="100%" stopColor="#C4E0FF" />
          </SvgLinearGradient>

          {/* ONE Gold-Orange Bevel Gradient */}
          <SvgLinearGradient id="oneGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF4A3" />
            <Stop offset="40%" stopColor="#FFC928" />
            <Stop offset="100%" stopColor="#FF8F00" />
          </SvgLinearGradient>

          {/* Magnifying Glass Lens Gradient */}
          <SvgLinearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#7CD0FF" />
            <Stop offset="50%" stopColor="#2488FF" />
            <Stop offset="100%" stopColor="#0B52B3" />
          </SvgLinearGradient>
        </Defs>

        {/* ── Word: FIND ── */}
        <G>
          {/* Shadow Pass */}
          <SvgText
            x="75"
            y="56"
            fontSize="46"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="#061A33"
            stroke="#041224"
            strokeWidth="12"
            strokeLinejoin="round"
          >
            FIN
          </SvgText>

          {/* Outline Pass */}
          <SvgText
            x="75"
            y="54"
            fontSize="46"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="#124E96"
            stroke="#124E96"
            strokeWidth="6"
            strokeLinejoin="round"
          >
            FIN
          </SvgText>

          {/* Fill Pass */}
          <SvgText
            x="75"
            y="52"
            fontSize="46"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="url(#findGrad)"
          >
            FIN
          </SvgText>

          {/* Magnifying Glass for letter 'D' */}
          <G transform="translate(195, 12)">
            {/* Glass Handle */}
            <Rect
              x="26"
              y="26"
              width="10"
              height="20"
              rx="4"
              transform="rotate(-40, 31, 36)"
              fill="#2488FF"
              stroke="#0B52B3"
              strokeWidth="2"
            />
            {/* Glass Rim Shadow */}
            <Circle cx="18" cy="18" r="18" fill="#041224" />
            {/* Glass Rim */}
            <Circle cx="18" cy="18" r="16" fill="url(#lensGrad)" stroke="#124E96" strokeWidth="3" />
            {/* Inner Lens Reflection */}
            <Circle cx="18" cy="18" r="11" fill="#47B0FF" opacity="0.6" />
            <Path
              d="M10,12 A10,10 0 0,1 26,12"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </G>
        </G>

        {/* ── Word: ONE ── */}
        <G>
          {/* Shadow Pass */}
          <SvgText
            x="85"
            y="112"
            fontSize="64"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="#5E3100"
            stroke="#5E3100"
            strokeWidth="14"
            strokeLinejoin="round"
          >
            ONE
          </SvgText>

          {/* Outline Pass */}
          <SvgText
            x="85"
            y="108"
            fontSize="64"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="#A65800"
            stroke="#A65800"
            strokeWidth="8"
            strokeLinejoin="round"
          >
            ONE
          </SvgText>

          {/* Fill Pass */}
          <SvgText
            x="85"
            y="105"
            fontSize="64"
            fontWeight="900"
            fontFamily="System"
            letterSpacing="2"
            fill="url(#oneGrad)"
          >
            ONE
          </SvgText>
        </G>
      </Svg>

      {/* Wooden Plank Subtitle */}
      {showSubtitle && (
        <WoodenSign
          text={subtitle}
          size="md"
          variant="wood"
          style={styles.woodenSign}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  woodenSign: {
    marginTop: -8,
  },
});
