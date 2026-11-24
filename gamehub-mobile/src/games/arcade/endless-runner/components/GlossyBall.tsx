// ============================================================
// Color Bloom Sort — 3D Glossy Ball Component
// Rich radial gradients, specular highlight reflections & smooth animations
// ============================================================

import React, { useEffect, useState } from 'react';
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
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [pulseAnim] = useState(() => new Animated.Value(1));

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
  const specularSize = size * 0.36;

  return (
    <Animated.View
      style={[
        styles.ballContainer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          shadowColor: visual.main,
          shadowOpacity: isSelected || isHinted ? 0.75 : 0.38,
          shadowRadius: isSelected ? 8 : 4,
          shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
          elevation: isSelected ? 10 : 4,
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
        style,
      ]}
    >
      {/* Base Spherical Gradient Body */}
      <LinearGradient
        colors={[visual.gradient[0], visual.gradient[1], visual.gradient[2]]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.85, y: 0.95 }}
        style={[
          styles.gradientBody,
          {
            borderRadius: radius,
            borderColor: visual.highlight,
          },
        ]}
      >
        {/* Top-Left 3D Specular Highlight Oval */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.12)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.specularOval,
            {
              width: specularSize,
              height: specularSize * 0.65,
              borderRadius: specularSize * 0.45,
              top: size * 0.1,
              left: size * 0.14,
            },
          ]}
        />

        {/* Pinpoint Specular Glint Dot */}
        <View
          style={[
            styles.specularDot,
            {
              width: size * 0.12,
              height: size * 0.12,
              borderRadius: size * 0.06,
              top: size * 0.14,
              left: size * 0.22,
            },
          ]}
        />

        {/* Secondary Soft Ambient Rim Reflection Curve */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.24)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.ambientRim,
            {
              width: size * 0.68,
              height: size * 0.22,
              borderRadius: size * 0.35,
              bottom: size * 0.06,
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  gradientBody: {
    width: '100%',
    height: '100%',
    borderWidth: 0.8,
    overflow: 'hidden',
    position: 'relative',
  },
  specularOval: {
    position: 'absolute',
    transform: [{ rotate: '-25deg' }],
  },
  specularDot: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  ambientRim: {
    position: 'absolute',
  },
});
