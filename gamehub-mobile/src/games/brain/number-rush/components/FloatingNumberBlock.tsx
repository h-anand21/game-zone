// ============================================================
// Number Rush — 3D Floating Number Block Component
// Handcrafted isometric arcade cubes with glossy bevels & physics bobbing
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface FloatingNumberBlockProps {
  value: string | number;
  size?: number;
  color: string;
  topColor: string;
  shadowColor: string;
  initialRotate?: number;
  floatDelay?: number;
  floatDistance?: number;
  duration?: number;
  style?: any;
}

export const FloatingNumberBlock: React.FC<FloatingNumberBlockProps> = ({
  value,
  size = 48,
  color,
  topColor,
  shadowColor,
  initialRotate = 0,
  floatDelay = 0,
  floatDistance = 8,
  duration = 1800,
  style,
}) => {
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(initialRotate);

  useEffect(() => {
    const timer = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-floatDistance, {
            duration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(floatDistance * 0.4, {
            duration,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      );

      rotateZ.value = withRepeat(
        withSequence(
          withTiming(initialRotate + 4, {
            duration: duration * 1.2,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(initialRotate - 4, {
            duration: duration * 1.2,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    }, floatDelay);

    return () => clearTimeout(timer);
  }, [initialRotate, floatDelay, floatDistance, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const bevelHeight = Math.max(size * 0.12, 4);

  return (
    <Animated.View style={[styles.wrapper, { width: size, height: size + bevelHeight }, animatedStyle, style]}>
      {/* Soft Ambient Drop Shadow */}
      <View
        style={[
          styles.dropShadow,
          {
            width: size * 0.85,
            height: size * 0.35,
            bottom: -bevelHeight * 0.6,
          },
        ]}
      />

      {/* 3D Isometric Cube Container */}
      <View style={[styles.cubeBase, { width: size, height: size + bevelHeight, backgroundColor: shadowColor }]}>
        {/* Top Gloss Highlight Edge */}
        <View style={[styles.cubeTopHighlight, { backgroundColor: topColor, height: size * 0.28 }]} />

        {/* Main Front Face */}
        <View style={[styles.cubeFace, { width: size, height: size, backgroundColor: color }]}>
          {/* Inner Light Bevel */}
          <View style={styles.innerBevel} />

          {/* Embossed Bold Number */}
          <Text
            style={[
              styles.numberText,
              {
                fontSize: size > 44 ? size * 0.52 : size * 0.46,
              },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  dropShadow: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    transform: [{ scaleY: 0.5 }],
  },
  cubeBase: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cubeTopHighlight: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    opacity: 0.9,
  },
  cubeFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerBevel: {
    ...StyleSheet.absoluteFill,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderRightColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
