// ============================================================
// AIM RUSH — HitParticleBurst Component
// Kinetic expanding shockwave ring and particle flashes on impact
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { HitAccuracyTier } from '../types';
import { ARColors } from '../theme/colors';

interface HitParticleBurstProps {
  x: number;
  y: number;
  tier: HitAccuracyTier;
  onComplete: () => void;
}

export const HitParticleBurst: React.FC<HitParticleBurstProps> = ({
  x,
  y,
  tier,
  onComplete,
}) => {
  const ringScale = useSharedValue(0.4);
  const ringOpacity = useSharedValue(0.9);

  const color =
    tier === 'perfect'
      ? ARColors.lime
      : tier === 'great'
      ? ARColors.cyan
      : tier === 'miss'
      ? ARColors.red
      : ARColors.white;

  useEffect(() => {
    ringScale.value = withTiming(2.2, {
      duration: 320,
      easing: Easing.out(Easing.quad),
    });

    ringOpacity.value = withTiming(0, {
      duration: 320,
      easing: Easing.in(Easing.quad),
    });

    const timer = setTimeout(onComplete, 340);
    return () => clearTimeout(timer);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={[styles.container, { left: x - 32, top: y - 32 }]} pointerEvents="none">
      <Animated.View style={[styles.shockwaveRing, { borderColor: color }, ringStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
  },
  shockwaveRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
  },
});
