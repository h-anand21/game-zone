// ============================================================
// Number Rush — Procedural Vector 3D Arcade Logo Component
// Inspired by Mind Lock procedural vector architecture
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
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

interface NumberRushLogoProps {
  width?: number;
  showTagline?: boolean;
  style?: ViewStyle;
}

export const NumberRushLogo: React.FC<NumberRushLogoProps> = ({
  width = 300,
  showTagline = true,
  style,
}) => {
  const height = width * 0.54;

  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 340 180">
        <Defs>
          {/* 3D Cyan / Ice Blue Gradient for "NUMBER" */}
          <SvgLinearGradient id="numberGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="30%" stopColor="#E0F7FA" />
            <Stop offset="65%" stopColor="#00E5FF" />
            <Stop offset="100%" stopColor="#0091EA" />
          </SvgLinearGradient>

          {/* 3D Gold / Blaze Orange Gradient for "RUSH" */}
          <SvgLinearGradient id="rushGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF9C4" />
            <Stop offset="35%" stopColor="#FFD54F" />
            <Stop offset="70%" stopColor="#FF9800" />
            <Stop offset="100%" stopColor="#E65100" />
          </SvgLinearGradient>

          {/* Golden Ribbon Banner Gradient */}
          <SvgLinearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#4A2508" />
            <Stop offset="20%" stopColor="#7A3F15" />
            <Stop offset="50%" stopColor="#9C5420" />
            <Stop offset="80%" stopColor="#7A3F15" />
            <Stop offset="100%" stopColor="#4A2508" />
          </SvgLinearGradient>

          {/* Ray Burst Gradient */}
          <SvgLinearGradient id="rayBurst" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
          </SvgLinearGradient>

          {/* Lightning Bolt Gradient */}
          <SvgLinearGradient id="lightningGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFDE7" />
            <Stop offset="50%" stopColor="#FFEE58" />
            <Stop offset="100%" stopColor="#FF8F00" />
          </SvgLinearGradient>
        </Defs>

        {/* 1. Ambient Energy Rays / Sparkles in Background */}
        <G fill="url(#rayBurst)">
          {/* Left Rays */}
          <Polygon points="35,35 70,45 32,50" />
          <Polygon points="22,65 62,68 25,75" />
          <Polygon points="30,90 68,85 34,98" />

          {/* Right Rays */}
          <Polygon points="305,35 270,45 308,50" />
          <Polygon points="318,65 278,68 315,75" />
          <Polygon points="310,90 272,85 306,98" />
        </G>

        {/* Sparkle Stars */}
        <Circle cx="55" cy="30" r="3" fill="#00E5FF" />
        <Circle cx="285" cy="30" r="3" fill="#FFD700" />
        <Circle cx="25" cy="85" r="2.5" fill="#FFE082" />
        <Circle cx="315" cy="85" r="2.5" fill="#80D8FF" />

        {/* 2. Top Arcade Pill Badge: "ARCADE BRAIN ADVENTURE" */}
        <G>
          <Rect
            x="70"
            y="6"
            width="200"
            height="18"
            rx="9"
            fill="rgba(7, 27, 52, 0.95)"
            stroke="#00E5FF"
            strokeWidth="1.5"
          />
          <SvgText
            x="170"
            y="19"
            fontSize="9"
            fontWeight="900"
            fill="#00E5FF"
            textAnchor="middle"
            letterSpacing="2.5"
          >
            ARCADE BRAIN ADVENTURE
          </SvgText>
        </G>

        {/* 3. "NUMBER" 3D Vector Layer */}
        {/* Deep Under-Shadow */}
        <SvgText
          x="170"
          y="72"
          fontSize="48"
          fontWeight="900"
          fill="#020814"
          textAnchor="middle"
          letterSpacing="3"
        >
          NUMBER
        </SvgText>
        {/* 3D Extruded Bevel */}
        <SvgText
          x="170"
          y="68"
          fontSize="48"
          fontWeight="900"
          fill="#005B96"
          textAnchor="middle"
          letterSpacing="3"
        >
          NUMBER
        </SvgText>
        {/* Front Gloss Face */}
        <SvgText
          x="170"
          y="64"
          fontSize="48"
          fontWeight="900"
          fill="url(#numberGrad)"
          textAnchor="middle"
          letterSpacing="3"
        >
          NUMBER
        </SvgText>

        {/* 4. "RUSH" 3D Vector Layer with Energy Outline */}
        {/* Deep Under-Shadow */}
        <SvgText
          x="170"
          y="126"
          fontSize="56"
          fontWeight="900"
          fill="#1A0800"
          textAnchor="middle"
          letterSpacing="5"
        >
          RUSH
        </SvgText>
        {/* 3D Extruded Bevel */}
        <SvgText
          x="170"
          y="122"
          fontSize="56"
          fontWeight="900"
          fill="#B23C00"
          textAnchor="middle"
          letterSpacing="5"
        >
          RUSH
        </SvgText>
        {/* Front Blazing Face */}
        <SvgText
          x="170"
          y="118"
          fontSize="56"
          fontWeight="900"
          fill="url(#rushGrad)"
          textAnchor="middle"
          letterSpacing="5"
        >
          RUSH
        </SvgText>

        {/* 5. Electric Lightning Bolts beside "RUSH" */}
        {/* Left Bolt */}
        <Path
          d="M 54 94 L 66 94 L 59 108 L 72 108 L 48 128 L 56 113 L 46 113 Z"
          fill="url(#lightningGrad)"
          stroke="#E65100"
          strokeWidth="1"
        />
        {/* Right Bolt */}
        <Path
          d="M 286 94 L 274 94 L 281 108 L 268 108 L 292 128 L 284 113 L 294 113 Z"
          fill="url(#lightningGrad)"
          stroke="#E65100"
          strokeWidth="1"
        />

        {/* 6. Carved Golden Tagline Banner (Optional) */}
        {showTagline && (
          <G>
            {/* Banner Backing with Carved Endings */}
            <Polygon
              points="45,148 60,138 280,138 295,148 280,158 60,158"
              fill="url(#ribbonGrad)"
              stroke="#FFD700"
              strokeWidth="2"
            />
            {/* Rivets */}
            <Circle cx="66" cy="148" r="2" fill="#FFD700" stroke="#7A3F15" strokeWidth="0.8" />
            <Circle cx="274" cy="148" r="2" fill="#FFD700" stroke="#7A3F15" strokeWidth="0.8" />

            {/* Tagline Text */}
            <SvgText
              x="170"
              y="152"
              fontSize="11"
              fontWeight="900"
              fill="#FFE082"
              textAnchor="middle"
              letterSpacing="3"
            >
              THINK • TAP • RUSH
            </SvgText>
          </G>
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
