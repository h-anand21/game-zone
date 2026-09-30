// ============================================================
// Find One — Procedural Mascot & Character Artwork
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
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

interface MascotProps {
  mood?: 'home' | 'sad' | 'winner' | 'peeking';
  size?: number;
  style?: ViewStyle;
}

export const PandaIllustration: React.FC<MascotProps> = ({
  mood = 'home',
  size = 180,
  style,
}) => {
  const breathAnim = useSharedValue(0);

  useEffect(() => {
    breathAnim.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: breathAnim.value }],
  }));

  const isWinner = mood === 'winner';

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Svg width={size} height={size * 1.05} viewBox="0 0 160 168">
        <Defs>
          {/* Panda White Fur Gradient */}
          <RadialGradient id="pandaFur" cx="50%" cy="35%" r="60%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="85%" stopColor="#F0F4F8" />
            <Stop offset="100%" stopColor="#D5DEE8" />
          </RadialGradient>

          {/* Dark Ear & Eye Gradient */}
          <SvgLinearGradient id="pandaDark" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2A3542" />
            <Stop offset="100%" stopColor="#141B24" />
          </SvgLinearGradient>

          {/* Bamboo Leaf Gradient */}
          <SvgLinearGradient id="bambooGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#8DF55B" />
            <Stop offset="100%" stopColor="#3DB31C" />
          </SvgLinearGradient>

          {/* Crown Gold Gradient */}
          <SvgLinearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF2A3" />
            <Stop offset="50%" stopColor="#FFC928" />
            <Stop offset="100%" stopColor="#C78A00" />
          </SvgLinearGradient>
        </Defs>

        {/* Golden Winner Crown */}
        {isWinner && (
          <G transform="translate(48, 2)">
            <Path
              d="M0,28 L8,6 L28,20 L48,4 L56,28 L64,6 L64,36 L0,36 Z"
              fill="url(#crownGrad)"
              stroke="#A66F00"
              strokeWidth="2"
            />
            <Circle cx="8" cy="6" r="3" fill="#FFE57F" />
            <Circle cx="32" cy="18" r="3" fill="#FFE57F" />
            <Circle cx="56" cy="6" r="3" fill="#FFE57F" />
            {/* Center Ruby */}
            <Circle cx="32" cy="28" r="4" fill="#FF4B4B" />
          </G>
        )}

        {/* Ears */}
        <Circle cx="38" cy={isWinner ? 48 : 42} r="22" fill="url(#pandaDark)" />
        <Circle cx="38" cy={isWinner ? 48 : 42} r="14" fill="#202A36" />
        <Circle cx="122" cy={isWinner ? 48 : 42} r="22" fill="url(#pandaDark)" />
        <Circle cx="122" cy={isWinner ? 48 : 42} r="14" fill="#202A36" />

        {/* Face / Head */}
        <Ellipse cx="80" cy="92" rx="56" ry="50" fill="url(#pandaFur)" stroke="#D5DEE8" strokeWidth="2" />

        {/* Eye Patches */}
        <Ellipse cx="54" cy="88" rx="16" ry="20" fill="url(#pandaDark)" transform="rotate(-15, 54, 88)" />
        <Ellipse cx="106" cy="88" rx="16" ry="20" fill="url(#pandaDark)" transform="rotate(15, 106, 88)" />

        {/* Big Sparkly Eyes */}
        <Circle cx="56" cy="86" r="7" fill="#0C1014" />
        <Circle cx="54" cy="83" r="3" fill="#FFFFFF" />
        <Circle cx="58" cy="88" r="1.5" fill="#FFFFFF" />

        <Circle cx="104" cy="86" r="7" fill="#0C1014" />
        <Circle cx="102" cy="83" r="3" fill="#FFFFFF" />
        <Circle cx="106" cy="88" r="1.5" fill="#FFFFFF" />

        {/* Cute Pink Blush */}
        <Ellipse cx="38" cy="102" rx="8" ry="4.5" fill="#FFA5A5" opacity="0.6" />
        <Ellipse cx="122" cy="102" rx="8" ry="4.5" fill="#FFA5A5" opacity="0.6" />

        {/* Nose */}
        <Path d="M74,98 Q80,95 86,98 Q80,105 74,98 Z" fill="#141B24" />

        {/* Happy Mouth */}
        <Path
          d="M72,106 Q80,116 88,106 Q80,122 72,106 Z"
          fill="#D63A3A"
          stroke="#141B24"
          strokeWidth="1.5"
        />
        {/* Tongue */}
        <Path d="M75,114 Q80,118 85,114 Q80,122 75,114 Z" fill="#FFA5A5" />

        {/* Little Paws peeking */}
        <Ellipse cx="38" cy="144" rx="14" ry="12" fill="url(#pandaDark)" />
        <Ellipse cx="122" cy="144" rx="14" ry="12" fill="url(#pandaDark)" />

        {/* Bamboo Stalk in Paw */}
        <G transform="translate(100, 110)">
          <Path d="M8,30 Q18,10 32,0 Q24,18 20,34 Z" fill="url(#bambooGrad)" />
          <Path d="M0,32 Q12,18 24,14" stroke="#2D8A14" strokeWidth="2" fill="none" />
        </G>
      </Svg>
    </Animated.View>
  );
};

export const FoxIllustration: React.FC<MascotProps> = ({
  mood = 'home',
  size = 180,
  style,
}) => {
  const breathAnim = useSharedValue(0);

  useEffect(() => {
    breathAnim.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: breathAnim.value }],
  }));

  const isSad = mood === 'sad';

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Svg width={size} height={size * 1.05} viewBox="0 0 160 168">
        <Defs>
          {/* Orange Fox Fur */}
          <SvgLinearGradient id="foxFur" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FF9B42" />
            <Stop offset="50%" stopColor="#FF7A1A" />
            <Stop offset="100%" stopColor="#E65800" />
          </SvgLinearGradient>

          {/* White Fur Chest */}
          <SvgLinearGradient id="whiteFur" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F0F4F8" />
          </SvgLinearGradient>
        </Defs>

        {/* Fox Ears */}
        {/* Left Ear */}
        <Path d="M22,78 L42,18 L68,64 Z" fill="url(#foxFur)" />
        <Path d="M30,72 L42,28 L58,62 Z" fill="#4A2612" />

        {/* Right Ear */}
        <Path d="M138,78 L118,18 L92,64 Z" fill="url(#foxFur)" />
        <Path d="M130,72 L118,28 L102,62 Z" fill="#4A2612" />

        {/* Head */}
        <Path
          d="M26,84 C20,98 28,122 48,128 C64,134 80,140 80,140 C80,140 96,134 112,128 C132,122 140,98 134,84 C128,70 108,66 80,66 C52,66 32,70 26,84 Z"
          fill="url(#foxFur)"
          stroke="#D95200"
          strokeWidth="2"
        />

        {/* White Cheeks Mask */}
        <Path
          d="M44,102 C34,116 52,132 80,138 C108,132 126,116 116,102 C104,96 92,104 80,108 C68,104 56,96 44,102 Z"
          fill="url(#whiteFur)"
        />

        {/* Eyes */}
        {isSad ? (
          // Sad Puppy Eyes
          <G>
            <Path d="M48,88 Q58,82 66,90" stroke="#2B1508" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <Circle cx="56" cy="95" r="7" fill="#1C0E06" />
            <Circle cx="54" cy="92" r="3" fill="#FFFFFF" />
            {/* Tear */}
            <Ellipse cx="46" cy="106" rx="2.5" ry="4" fill="#68B6FF" />

            <Path d="M112,88 Q102,82 94,90" stroke="#2B1508" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <Circle cx="104" cy="95" r="7" fill="#1C0E06" />
            <Circle cx="102" cy="92" r="3" fill="#FFFFFF" />
          </G>
        ) : (
          // Winking Playful Eyes
          <G>
            {/* Left Eye Open */}
            <Circle cx="56" cy="92" r="8" fill="#1C0E06" />
            <Circle cx="54" cy="89" r="3.5" fill="#FFFFFF" />
            <Circle cx="58" cy="94" r="1.5" fill="#FFFFFF" />

            {/* Right Eye Winking */}
            <Path
              d="M96,94 Q106,84 116,94"
              stroke="#2B1508"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </G>
        )}

        {/* Pink Blush */}
        <Ellipse cx="42" cy="110" rx="7" ry="4" fill="#FFA5A5" opacity="0.6" />
        <Ellipse cx="118" cy="110" rx="7" ry="4" fill="#FFA5A5" opacity="0.6" />

        {/* Nose */}
        <Circle cx="80" cy="108" r="5" fill="#1C0E06" />

        {/* Mouth */}
        {isSad ? (
          <Path d="M74,124 Q80,118 86,124" stroke="#2B1508" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <Path
            d="M74,116 Q80,126 86,116 Q80,130 74,116 Z"
            fill="#D63A3A"
            stroke="#2B1508"
            strokeWidth="1.5"
          />
        )}

        {/* Paws */}
        <Ellipse cx="48" cy="148" rx="12" ry="10" fill="url(#foxFur)" stroke="#D95200" strokeWidth="1.5" />
        <Ellipse cx="112" cy="148" rx="12" ry="10" fill="url(#foxFur)" stroke="#D95200" strokeWidth="1.5" />
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
