// ============================================================
// Color Bloom Sort — 3D Glossy Ball Component
// Rich radial gradients, specular highlight reflections & smooth animations
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BALL_VISUALS } from '../colors';
import type { BallColor } from '../types';

interface GlossyBallProps {
  color: BallColor;
  size: number;
  isSelected?: boolean;
  isHinted?: boolean;
  style?: object;
}

export const GlossyBall: React.FC<GlossyBallProps> = ({
  color,
  size,
  isSelected = false,
  isHinted = false,
  style,
}) => {
  const visual = BALL_VISUALS[color] || BALL_VISUALS.red;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Selection bounce animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.08 : 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scaleAnim]);

  // Hint pulse animation
  useEffect(() => {
    if (isHinted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.14,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isHinted, pulseAnim]);

  const radius = size / 2;
  const specularSize = size * 0.32;

  return (
    <Animated.View
      style={[
        styles.ballContainer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: visual.shadow,
          shadowColor: visual.main,
          shadowOpacity: isSelected || isHinted ? 0.65 : 0.35,
          shadowRadius: isSelected ? 8 : 4,
          elevation: isSelected ? 8 : 4,
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
        style,
      ]}
    >
      {/* Base Spherical Gradient */}
      <LinearGradient
        colors={[visual.gradient[0], visual.gradient[1], visual.gradient[2]]}
        start={{ x: 0.25, y: 0.15 }}
        end={{ x: 0.85, y: 0.95 }}
        style={[
          styles.gradientBody,
          {
            borderRadius: radius,
            borderColor: visual.highlight,
          },
        ]}
      >
        {/* Top-Left 3D Specular Highlight Reflection Oval */}
        <View
          style={[
            styles.specularOval,
            {
              width: specularSize,
              height: specularSize * 0.65,
              borderRadius: specularSize * 0.5,
              top: size * 0.12,
              left: size * 0.16,
            },
          ]}
        />

        {/* Secondary soft ambient reflection curve */}
        <View
          style={[
            styles.ambientRim,
            {
              width: size * 0.6,
              height: size * 0.2,
              borderRadius: size * 0.3,
              bottom: size * 0.08,
              alignSelf: 'center',
            },
          ]}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ballContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
  },
  gradientBody: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  specularOval: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    transform: [{ rotate: '-25deg' }],
  },
  ambientRim: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
