// ============================================================
// PATH MIND — Component 09: ExplorerCharacter
// Pixel-art hero adventurer with idle breathing & beacon aura
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';
import { pmColors } from '../../design-system/colors';

interface ExplorerCharacterProps {
  size?: number;
  mood?: 'idle' | 'happy' | 'thinking' | 'alert';
}

export const ExplorerCharacter: React.FC<ExplorerCharacterProps> = ({
  size = 64,
  mood = 'idle',
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: floatAnim }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 48 48">
        {/* Soft Rune Aura Glow */}
        <Circle cx="24" cy="24" r="22" fill="rgba(0, 240, 255, 0.12)" />
        <Circle cx="24" cy="24" r="18" fill="rgba(0, 240, 255, 0.18)" />

        {/* Explorer Body & Cape */}
        <G>
          {/* Blue Scout Cape */}
          <Path d="M16 22 L32 22 L36 40 L12 40 Z" fill="#0077B6" />
          <Path d="M19 22 L29 22 L31 40 L17 40 Z" fill="#0096C7" />

          {/* Leather Belt & Gold Buckle */}
          <Rect x="18" y="32" width="12" height="4" rx="1" fill="#5C341A" />
          <Rect x="22" y="32" width="4" height="4" rx="1" fill="#FFD700" />

          {/* Explorer Hat & Goggles */}
          {/* Head Base */}
          <Circle cx="24" cy="16" r="8" fill="#F0C987" />

          {/* Hair / Beard Details */}
          <Path d="M16 16 Q18 22 24 23 Q30 22 32 16 Z" fill="#6B3E26" />

          {/* Explorer Hat */}
          <Path d="M12 12 Q24 6 36 12 L38 14 L10 14 Z" fill="#8A522A" />
          <Rect x="14" y="9" width="20" height="5" rx="2" fill="#5C341A" />
          <Rect x="16" y="11" width="16" height="2" fill="#FFD700" />

          {/* Brass Goggles on Hat */}
          <Circle cx="20" cy="11" r="3" fill="#D4AF37" />
          <Circle cx="20" cy="11" r="2" fill="#00F0FF" />
          <Circle cx="28" cy="11" r="3" fill="#D4AF37" />
          <Circle cx="28" cy="11" r="2" fill="#00F0FF" />

          {/* Hero Eyes */}
          <Circle cx="21" cy="16" r="1.5" fill="#1C2D37" />
          <Circle cx="27" cy="16" r="1.5" fill="#1C2D37" />
          <Circle cx="21.5" cy="15.5" r="0.5" fill="#FFFFFF" />
          <Circle cx="27.5" cy="15.5" r="0.5" fill="#FFFFFF" />

          {/* Friendly Smile */}
          <Path
            d={mood === 'happy' ? 'M22 19 Q24 22 26 19' : 'M22 19 L26 19'}
            stroke="#6B3E26"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
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
