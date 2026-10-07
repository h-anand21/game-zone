// ============================================================
// AIM RUSH — Screen 01: SplashScreen
// 1.2s Fast cinematic reticle expansion & logo reveal
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.6)),
    });
    opacity.value = withTiming(1, {
      duration: 600,
    });

    const timer = setTimeout(onFinish, 1300);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <BackgroundLayer screen="home" overlayDarkness={0.5}>
      <View style={styles.container}>
        <Animated.View style={[styles.centerBox, logoStyle]}>
          {/* Animated Reticle Vector */}
          <Svg width={110} height={110} viewBox="0 0 110 110">
            <Circle cx={55} cy={55} r={46} stroke={ARColors.cyan} strokeWidth={2.5} fill="none" />
            <Circle cx={55} cy={55} r={24} stroke={ARColors.lime} strokeWidth={2} fill="none" />
            <Circle cx={55} cy={55} r={5} fill={ARColors.cyan} />
            <Line x1={5} y1={55} x2={25} y2={55} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={85} y1={55} x2={105} y2={55} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={55} y1={5} x2={55} y2={25} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={55} y1={85} x2={55} y2={105} stroke={ARColors.cyan} strokeWidth={2} />
          </Svg>

          <Text style={styles.title}>AIM RUSH</Text>
          <Text style={styles.subtitle}>✦ TARGET CHAIN ✦</Text>
        </Animated.View>

        <Text style={styles.version}>REACTIVE ARCADE v2.0</Text>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerBox: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 4,
    marginTop: 18,
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 2.5,
    marginTop: 6,
  },
  version: {
    position: 'absolute',
    bottom: 30,
    fontSize: 10,
    fontWeight: '700',
    color: ARColors.textMuted,
    letterSpacing: 1.5,
  },
});
