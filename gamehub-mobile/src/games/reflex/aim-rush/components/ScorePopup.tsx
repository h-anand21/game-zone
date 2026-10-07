// ============================================================
// AIM RUSH — ScorePopup & Visual Hit Feedback Component
// Dynamic floating score callouts directly at touch coordinates
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { HitEffectItem } from '../types';
import { ARColors } from '../theme/colors';

interface ScorePopupProps {
  effect: HitEffectItem;
  onComplete: (id: string) => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ effect, onComplete }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    translateY.value = withTiming(-42, {
      duration: 550,
      easing: Easing.out(Easing.quad),
    });

    scale.value = withTiming(1.15, {
      duration: 180,
      easing: Easing.out(Easing.back(1.5)),
    });

    opacity.value = withTiming(0, {
      duration: 550,
      easing: Easing.in(Easing.quad),
    });

    const timer = setTimeout(() => {
      onComplete(effect.id);
    }, 580);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const isPerfect = effect.tier === 'perfect';
  const isGreat = effect.tier === 'great';
  const isMiss = effect.tier === 'miss';

  const textColor = isMiss
    ? ARColors.red
    : isPerfect
    ? ARColors.lime
    : isGreat
    ? ARColors.cyan
    : ARColors.white;

  const label = isMiss
    ? effect.points < 0 ? `${effect.points} DANGER!` : 'MISS'
    : isPerfect
    ? `+${effect.points} PERFECT!`
    : isGreat
    ? `+${effect.points} GREAT`
    : `+${effect.points}`;

  return (
    <View
      style={[
        styles.container,
        {
          left: effect.x - 60,
          top: effect.y - 30,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
