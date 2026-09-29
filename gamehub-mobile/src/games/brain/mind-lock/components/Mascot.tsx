// ============================================================
// Mind Lock — Procedural Vector Brain-Lock Mascot Component
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Polygon,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export type MascotMood =
  | 'home'
  | 'gameplay'
  | 'correct'
  | 'broken'
  | 'victory'
  | 'daily'
  | 'challenges'
  | 'achievements'
  | 'stats'
  | 'settings'
  | 'pause'
  | 'unlock';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  style?: ViewStyle;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'home',
  size = 200,
  style,
}) => {
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    // Gentle floating breathing animation
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const isBroken = mood === 'broken';
  const isHappy = mood === 'correct' || mood === 'victory' || mood === 'unlock';
  const isPause = mood === 'pause';

  // SVG viewBox is 200 x 220
  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Svg width={size} height={(size * 220) / 200} viewBox="0 0 200 220">
        <Defs>
          {/* Gold Shackle Gradient */}
          <SvgLinearGradient id="shackleGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF099" />
            <Stop offset="50%" stopColor="#FFC928" />
            <Stop offset="100%" stopColor="#C78A00" />
          </SvgLinearGradient>

          {/* Brain Coral Body Gradient */}
          <SvgLinearGradient id="brainGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFA69E" />
            <Stop offset="60%" stopColor="#FF7A6E" />
            <Stop offset="100%" stopColor="#D9483B" />
          </SvgLinearGradient>

          {/* Visor Screen Gradient */}
          <SvgLinearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#182A3E" />
            <Stop offset="100%" stopColor="#081018" />
          </SvgLinearGradient>

          {/* Eye Glow Gradient */}
          <RadialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFF8B3" />
            <Stop offset="70%" stopColor="#FFD000" />
            <Stop offset="100%" stopColor="#FF9900" />
          </RadialGradient>
        </Defs>

        {/* 1. Gold Lock Shackle on Top */}
        {isBroken ? (
          // Broken / detached shackle
          <G>
            <Path
              d="M72 50 C72 20 85 12 100 12 C108 12 115 15 120 22"
              fill="none"
              stroke="url(#shackleGrad)"
              strokeWidth="15"
              strokeLinecap="round"
            />
            {/* Crack break piece */}
            <Path
              d="M128 32 L132 44"
              fill="none"
              stroke="url(#shackleGrad)"
              strokeWidth="15"
              strokeLinecap="round"
            />
          </G>
        ) : (
          // Full intact golden shackle arch
          <Path
            d="M72 56 C72 16 128 16 128 56"
            fill="none"
            stroke="url(#shackleGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        )}

        {/* 2. Podium or Feet underneath */}
        <G>
          {/* Left Sneaker */}
          <Ellipse cx="74" cy="188" rx="18" ry="10" fill="#0A121D" />
          <Ellipse cx="72" cy="186" rx="14" ry="7" fill="#FFC928" />
          <Rect x="58" y="186" width="30" height="6" rx="3" fill="#FFFFFF" />

          {/* Right Sneaker */}
          <Ellipse cx="126" cy="188" rx="18" ry="10" fill="#0A121D" />
          <Ellipse cx="128" cy="186" rx="14" ry="7" fill="#FFC928" />
          <Rect x="112" y="186" width="30" height="6" rx="3" fill="#FFFFFF" />
        </G>

        {/* 3. Brain Head Lobes & Convolutions */}
        <G>
          {/* Outer brain lobes outline */}
          <Path
            d="M48 100 
               C30 92 30 68 50 60 
               C46 44 68 34 84 44 
               C92 34 108 34 116 44 
               C132 34 154 44 150 60 
               C170 68 170 92 152 100 
               C172 118 164 148 140 152 
               C126 156 112 154 100 156 
               C88 154 74 156 60 152 
               C36 148 28 118 48 100 Z"
            fill="url(#brainGrad)"
            stroke="#C43B2E"
            strokeWidth="4"
          />

          {/* Brain folds & creases */}
          <Path
            d="M62 55 C70 65 74 78 70 90"
            fill="none"
            stroke="#D9483B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M138 55 C130 65 126 78 130 90"
            fill="none"
            stroke="#D9483B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M45 80 C55 86 60 98 56 115"
            fill="none"
            stroke="#D9483B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M155 80 C145 86 140 98 144 115"
            fill="none"
            stroke="#D9483B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </G>

        {/* 4. Glossy Robot Visor Face Screen */}
        <Rect
          x="54"
          y="72"
          width="92"
          height="62"
          rx="22"
          fill="url(#visorGrad)"
          stroke="#07101B"
          strokeWidth="3.5"
        />

        {/* Specular gloss streak on visor */}
        <Path
          d="M62 76 C76 74 124 74 138 76 C134 82 120 86 100 86 C80 86 66 82 62 76 Z"
          fill="rgba(255, 255, 255, 0.22)"
        />

        {/* 5. Mascot Eyes based on Mood */}
        {isBroken ? (
          // Cross Eyes (X X)
          <G stroke="#FFC928" strokeWidth="4.5" strokeLinecap="round">
            {/* Left X */}
            <Path d="M72 94 L88 110" />
            <Path d="M88 94 L72 110" />
            {/* Right X */}
            <Path d="M112 94 L128 110" />
            <Path d="M128 94 L112 110" />
          </G>
        ) : isHappy ? (
          // Happy Arched Eyes ( ^  ^ )
          <G stroke="url(#eyeGlow)" strokeWidth="6" strokeLinecap="round" fill="none">
            <Path d="M72 106 C74 94 86 94 88 106" />
            <Path d="M112 106 C114 94 126 94 128 106" />
          </G>
        ) : isPause ? (
          // Relaxed closed lines
          <G stroke="#FFC928" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <Path d="M72 102 Q80 106 88 102" />
            <Path d="M112 102 Q120 106 128 102" />
          </G>
        ) : (
          // Glowing Normal Eyes (vertical rounded capsules)
          <G fill="url(#eyeGlow)">
            <Rect x="72" y="92" width="16" height="22" rx="8" />
            <Rect x="112" y="92" width="16" height="22" rx="8" />
            {/* Eye pupil white sparkle */}
            <Circle cx="76" cy="97" r="3" fill="#FFFFFF" />
            <Circle cx="116" cy="97" r="3" fill="#FFFFFF" />
          </G>
        )}

        {/* 6. Gold Keyhole Mouth / Lock Base */}
        <G>
          <Circle cx="100" cy="146" r="16" fill="url(#shackleGrad)" stroke="#B37800" strokeWidth="2.5" />
          {/* Keyhole slot */}
          <Circle cx="100" cy="143" r="4.5" fill="#08101A" />
          <Polygon points="97,144 103,144 105,152 95,152" fill="#08101A" />
        </G>

        {/* 7. Cartoon Gloved Hands */}
        <G>
          {/* Left Hand Glove */}
          <Circle cx="40" cy="120" r="12" fill="#FFFFFF" stroke="#0A121D" strokeWidth="2.5" />
          <Circle cx="44" cy="114" r="5" fill="#FFFFFF" stroke="#0A121D" strokeWidth="2" />

          {/* Right Hand Glove */}
          <Circle cx="160" cy="120" r="12" fill="#FFFFFF" stroke="#0A121D" strokeWidth="2.5" />
          <Circle cx="156" cy="114" r="5" fill="#FFFFFF" stroke="#0A121D" strokeWidth="2" />
        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
