// ============================================================
// AIM RUSH — Screen 07: CountdownScreen
// High-tension 3-2-1-RUSH central scale sequence
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushHaptics } from '../haptics/hapticManager';

interface CountdownScreenProps {
  onCountdownComplete: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  onCountdownComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<'3' | '2' | '1' | 'RUSH'>('3');
  const scale = useSharedValue(1.8);
  const opacity = useSharedValue(0);

  const triggerAnim = () => {
    scale.value = 1.8;
    opacity.value = 0;
    scale.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.back(1.5)) });
    opacity.value = withTiming(1, { duration: 180 });
  };

  useEffect(() => {
    triggerAnim();
    AimRushHaptics.hitNormal();

    const t2 = setTimeout(() => {
      setCurrentStep('2');
      triggerAnim();
      AimRushHaptics.hitNormal();
    }, 700);

    const t1 = setTimeout(() => {
      setCurrentStep('1');
      triggerAnim();
      AimRushHaptics.hitNormal();
    }, 1400);

    const tRush = setTimeout(() => {
      setCurrentStep('RUSH');
      triggerAnim();
      AimRushHaptics.comboMilestone();
    }, 2100);

    const tEnd = setTimeout(() => {
      onCountdownComplete();
    }, 2800);

    return () => {
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tRush);
      clearTimeout(tEnd);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const isRush = currentStep === 'RUSH';

  return (
    <BackgroundLayer screen="gameplay" overlayDarkness={0.45}>
      <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text style={[styles.countdownText, isRush && styles.rushText]}>
            {currentStep}
          </Text>
          <Text style={styles.subtext}>
            {isRush ? '✦ TOUCH TARGETS DIRECTLY ✦' : 'GET READY'}
          </Text>
        </Animated.View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 90,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 4,
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  rushText: {
    fontSize: 72,
    color: ARColors.lime,
    textShadowColor: ARColors.lime,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 2,
    marginTop: 12,
  },
});
