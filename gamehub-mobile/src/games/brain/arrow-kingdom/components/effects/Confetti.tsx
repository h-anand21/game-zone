// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Confetti Burst Effect
// Celebratory multi-color confetti rain for Level Complete
// ============================================================

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const CONFETTI_COLORS = [
  COLORS.gold,
  COLORS.pink,
  COLORS.blue,
  COLORS.arrowGreen,
  COLORS.purple,
  COLORS.yellow,
  COLORS.gem,
];

interface Particle {
  id: number;
  startX: number;
  color: string;
  size: number;
  anim: Animated.Value;
  rotAnim: Animated.Value;
}

export const Confetti: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const particles = useRef<Particle[]>(
    Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      startX: Math.random() * width,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 8,
      anim: new Animated.Value(0),
      rotAnim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p, idx) => {
      Animated.parallel([
        Animated.timing(p.anim, {
          toValue: 1,
          duration: 1800 + Math.random() * 800,
          delay: idx * 35,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotAnim, {
          toValue: 1,
          duration: 1800 + Math.random() * 800,
          delay: idx * 35,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, height + 50],
        });
        const translateX = p.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [p.startX, p.startX + (p.id % 2 === 0 ? 30 : -30), p.startX + (p.id % 2 === 0 ? -20 : 20)],
        });
        const rotate = p.rotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${(p.id % 2 === 0 ? 1 : -1) * 720}deg`],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={`confetti-${p.id}`}
            style={[
              styles.confettiPiece,
              {
                width: p.size,
                height: p.size * 1.5,
                backgroundColor: p.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  confettiPiece: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 3,
  },
});

export default Confetti;
