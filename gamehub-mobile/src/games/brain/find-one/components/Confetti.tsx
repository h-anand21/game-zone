// ============================================================
// Find One — Programmatic Reanimated Confetti Burst Component
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const COLORS = ['#FFC928', '#FF4B4B', '#2997FF', '#55D63F', '#FF8F00', '#D64BFF', '#FFFFFF'];

const Particle: React.FC<ParticleProps> = ({ x, color, size, delay, duration }) => {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(x);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height * 0.9, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );

    const drift = (Math.random() - 0.5) * 120;
    translateX.value = withDelay(
      delay,
      withTiming(x + drift, { duration, easing: Easing.inOut(Easing.quad) })
    );

    rotation.value = withDelay(
      delay,
      withTiming(720 + Math.random() * 360, { duration, easing: Easing.linear })
    );

    opacity.value = withDelay(
      delay + duration * 0.6,
      withTiming(0, { duration: duration * 0.4 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size * (Math.random() > 0.5 ? 1.8 : 1),
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        },
        animStyle,
      ]}
    />
  );
};

export const Confetti: React.FC<{ count?: number }> = ({ count = 42 }) => {
  const { width } = useWindowDimensions();

  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: 0,
    color: COLORS[i % COLORS.length],
    size: 7 + Math.random() * 8,
    delay: Math.random() * 400,
    duration: 1800 + Math.random() * 1200,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
