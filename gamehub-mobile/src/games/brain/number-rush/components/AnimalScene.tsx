// ============================================================
// Number Rush — Dynamic Jungle Animal Scene Component
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Ellipse,
} from 'react-native-svg';
import type { AnimalItem, AnimalType } from '../types';
import { NRTheme } from '../theme';

interface AnimalSceneProps {
  animals: AnimalItem[];
  hintActive?: boolean;
}

const AnimalVector: React.FC<{
  type: AnimalType;
  isHinted?: boolean;
}> = ({ type, isHinted }) => {
  const renderGraphic = () => {
    switch (type) {
      case 'tiger':
        return (
          <G>
            {/* Ears */}
            <Circle cx="16" cy="14" r="8" fill="#E67E22" />
            <Circle cx="16" cy="14" r="4" fill="#FAD7A0" />
            <Circle cx="48" cy="14" r="8" fill="#E67E22" />
            <Circle cx="48" cy="14" r="4" fill="#FAD7A0" />
            {/* Head */}
            <Circle cx="32" cy="32" r="22" fill="#E67E22" />
            {/* White Muzzle */}
            <Ellipse cx="32" cy="38" rx="14" ry="10" fill="#FFFFFF" />
            {/* Stripes */}
            <Path d="M 32 12 L 32 20" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            <Path d="M 20 18 L 26 22" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 44 18 L 38 22" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 12 32 L 20 32" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 52 32 L 44 32" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <Circle cx="24" cy="28" r="3.5" fill="#2C3E50" />
            <Circle cx="40" cy="28" r="3.5" fill="#2C3E50" />
            <Circle cx="25" cy="27" r="1.2" fill="#FFFFFF" />
            <Circle cx="41" cy="27" r="1.2" fill="#FFFFFF" />
            {/* Nose */}
            <Path d="M 29 35 L 35 35 L 32 38 Z" fill="#E74C3C" />
            {/* Whiskers */}
            <Path d="M 16 38 L 8 36 M 16 41 L 8 42 M 48 38 L 56 36 M 48 41 L 56 42" stroke="#7F8C8D" strokeWidth="1.5" />
          </G>
        );

      case 'lion':
        return (
          <G>
            {/* Mane */}
            <Circle cx="32" cy="32" r="28" fill="#B9770E" />
            {/* Ears */}
            <Circle cx="16" cy="16" r="6" fill="#F39C12" />
            <Circle cx="48" cy="16" r="6" fill="#F39C12" />
            {/* Head */}
            <Circle cx="32" cy="32" r="18" fill="#F5B041" />
            {/* Muzzle */}
            <Ellipse cx="32" cy="36" rx="10" ry="7" fill="#FDEBD0" />
            {/* Eyes */}
            <Circle cx="26" cy="29" r="3" fill="#2C3E50" />
            <Circle cx="38" cy="29" r="3" fill="#2C3E50" />
            <Circle cx="27" cy="28" r="1" fill="#FFFFFF" />
            <Circle cx="39" cy="28" r="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <Path d="M 30 34 L 34 34 L 32 37 Z" fill="#784212" />
            <Path d="M 32 37 L 32 40" stroke="#784212" strokeWidth="1.5" />
          </G>
        );

      case 'monkey':
        return (
          <G>
            {/* Big Round Ears */}
            <Circle cx="12" cy="32" r="11" fill="#873600" />
            <Circle cx="12" cy="32" r="6" fill="#EDBB99" />
            <Circle cx="52" cy="32" r="11" fill="#873600" />
            <Circle cx="52" cy="32" r="6" fill="#EDBB99" />
            {/* Head */}
            <Circle cx="32" cy="32" r="20" fill="#873600" />
            {/* Face Mask */}
            <Ellipse cx="25" cy="28" rx="8" ry="10" fill="#EDBB99" />
            <Ellipse cx="39" cy="28" rx="8" ry="10" fill="#EDBB99" />
            <Ellipse cx="32" cy="37" rx="14" ry="10" fill="#EDBB99" />
            {/* Eyes */}
            <Circle cx="26" cy="27" r="3" fill="#2C3E50" />
            <Circle cx="38" cy="27" r="3" fill="#2C3E50" />
            {/* Nose & Smile */}
            <Circle cx="30" cy="35" r="1.5" fill="#873600" />
            <Circle cx="34" cy="35" r="1.5" fill="#873600" />
            <Path d="M 27 40 Q 32 44 37 40" stroke="#873600" strokeWidth="2" strokeLinecap="round" fill="none" />
          </G>
        );

      case 'elephant':
        return (
          <G>
            {/* Huge Ears */}
            <Ellipse cx="12" cy="30" rx="12" ry="16" fill="#7F8C8D" />
            <Ellipse cx="52" cy="30" rx="12" ry="16" fill="#7F8C8D" />
            {/* Head */}
            <Circle cx="32" cy="30" r="19" fill="#95A5A6" />
            {/* Trunk */}
            <Path
              d="M 29 34 C 29 44, 25 50, 32 54 C 36 50, 35 44, 35 34 Z"
              fill="#7F8C8D"
            />
            {/* Eyes */}
            <Circle cx="23" cy="26" r="2.5" fill="#2C3E50" />
            <Circle cx="41" cy="26" r="2.5" fill="#2C3E50" />
            {/* Tusks */}
            <Path d="M 26 40 L 22 46" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <Path d="M 38 40 L 42 46" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </G>
        );

      case 'giraffe':
        return (
          <G>
            {/* Horns / Ossicones */}
            <Path d="M 26 12 L 28 20 M 38 12 L 36 20" stroke="#784212" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="26" cy="11" r="3" fill="#B9770E" />
            <Circle cx="38" cy="11" r="3" fill="#B9770E" />
            {/* Ears */}
            <Path d="M 20 22 Q 10 20 18 26 Z" fill="#F4D03F" />
            <Path d="M 44 22 Q 54 20 46 26 Z" fill="#F4D03F" />
            {/* Head */}
            <Ellipse cx="32" cy="28" rx="14" ry="16" fill="#F4D03F" />
            {/* Muzzle */}
            <Ellipse cx="32" cy="38" rx="10" ry="8" fill="#F5B041" />
            {/* Brown Spots */}
            <Circle cx="26" cy="22" r="3" fill="#B9770E" />
            <Circle cx="37" cy="23" r="2.5" fill="#B9770E" />
            {/* Eyes */}
            <Circle cx="26" cy="28" r="3" fill="#2C3E50" />
            <Circle cx="38" cy="28" r="3" fill="#2C3E50" />
            {/* Nostrils */}
            <Circle cx="29" cy="39" r="1.5" fill="#784212" />
            <Circle cx="35" cy="39" r="1.5" fill="#784212" />
          </G>
        );

      case 'zebra':
      default:
        return (
          <G>
            {/* Ears */}
            <Path d="M 18 14 Q 16 8 22 18 Z" fill="#BDC3C7" />
            <Path d="M 46 14 Q 48 8 42 18 Z" fill="#BDC3C7" />
            {/* Head */}
            <Ellipse cx="32" cy="30" rx="16" ry="18" fill="#ECF0F1" />
            {/* Mane */}
            <Path d="M 30 10 L 34 10 L 32 20 Z" fill="#2C3E50" />
            {/* Black Stripes */}
            <Path d="M 20 22 L 28 26" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 44 22 L 36 26" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 18 30 L 26 31" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 46 30 L 38 31" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
            {/* Muzzle */}
            <Ellipse cx="32" cy="40" rx="10" ry="7" fill="#34495E" />
            {/* Eyes */}
            <Circle cx="24" cy="27" r="3" fill="#2C3E50" />
            <Circle cx="40" cy="27" r="3" fill="#2C3E50" />
          </G>
        );
    }
  };

  return (
    <Svg width="64" height="64" viewBox="0 0 64 64">
      {isHinted && (
        <Circle
          cx="32"
          cy="32"
          r="30"
          fill="#FFD700"
          opacity="0.45"
          stroke="#FFA000"
          strokeWidth="3"
        />
      )}
      {renderGraphic()}
    </Svg>
  );
};

export const AnimalScene: React.FC<AnimalSceneProps> = ({
  animals,
  hintActive = false,
}) => {
  return (
    <View style={styles.sceneContainer}>
      {/* Background Illustrated Jungle Art (SVG) */}
      <Svg
        width="100%"
        height="100%"
        style={styles.bgSvg}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="jungleSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0B3A26" />
            <Stop offset="50%" stopColor="#134E35" />
            <Stop offset="100%" stopColor="#1E6B48" />
          </LinearGradient>
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2D8659" />
            <Stop offset="100%" stopColor="#1B5E3B" />
          </LinearGradient>
        </Defs>

        {/* Sky / Deep Jungle Backdrop */}
        <Rect width="100%" height="100%" fill="url(#jungleSky)" />

        {/* Sunbeams */}
        <Path d="M 0 0 L 120 280 L 160 280 L 40 0 Z" fill="#FFEAA7" opacity="0.08" />
        <Path d="M 80 0 L 220 280 L 270 280 L 140 0 Z" fill="#FFEAA7" opacity="0.07" />

        {/* Distant Trees & Canopy */}
        <Circle cx="40" cy="20" r="70" fill="#0A3320" opacity="0.8" />
        <Circle cx="180" cy="10" r="90" fill="#072818" opacity="0.9" />
        <Circle cx="320" cy="25" r="75" fill="#0A3320" opacity="0.8" />

        {/* Foreground Vines & Hanging Leaves */}
        <Path d="M 0 10 Q 50 35 100 15 Q 150 40 200 20 Q 250 45 300 15 Q 350 35 400 10" stroke="#2ECC71" strokeWidth="4" fill="none" opacity="0.6" />

        {/* Hills / Ground Layers */}
        <Path d="M 0 210 Q 100 180 200 215 T 400 200 L 400 300 L 0 300 Z" fill="#1E5C3A" opacity="0.7" />
        <Path d="M 0 230 Q 120 205 240 235 T 400 220 L 400 300 L 0 300 Z" fill="url(#groundGrad)" />

        {/* Grass Tuft Details */}
        <Path d="M 30 240 L 35 225 L 40 240 L 45 220 L 50 242" stroke="#58D68D" strokeWidth="3" strokeLinecap="round" />
        <Path d="M 160 250 L 165 235 L 170 250 L 175 232 L 180 252" stroke="#58D68D" strokeWidth="3" strokeLinecap="round" />
        <Path d="M 310 245 L 315 230 L 320 245 L 325 228 L 330 247" stroke="#58D68D" strokeWidth="3" strokeLinecap="round" />
      </Svg>

      {/* Render Dynamic Animals */}
      {animals.map((item) => {
        const isHinted = hintActive && item.isTarget;

        return (
          <View
            key={item.id}
            style={[
              styles.animalWrapper,
              {
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
                transform: [
                  { scale: item.scale },
                  { scaleX: item.flipHorizontal ? -1 : 1 },
                ],
              },
            ]}
          >
            <AnimalVector type={item.type} isHinted={isHinted} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sceneContainer: {
    width: '100%',
    height: 290,
    borderRadius: NRTheme.radius.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#2ED573',
    ...NRTheme.shadows.glowGreen,
  },
  animalWrapper: {
    position: 'absolute',
    width: 64,
    height: 64,
    marginLeft: -32,
    marginTop: -32,
  },
  bgSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
