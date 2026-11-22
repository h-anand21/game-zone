// ============================================================
// Color Bloom Sort — Transparent Glass Test Tube Component
// Glass rim, reflections, animated ball lift, and solved sparkles
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlossyBall } from './GlossyBall';
import { isTubeSolved } from '../logic';
import type { Tube, ThemeConfig } from '../types';

interface GlassTubeProps {
  tubeIndex: number;
  tube: Tube;
  ballSize: number;
  isSelected: boolean;
  isHintSource?: boolean;
  isHintDest?: boolean;
  isShaking?: boolean;
  hiddenTopBall?: boolean;
  theme: ThemeConfig;
  onPress: (index: number) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export const GlassTube: React.FC<GlassTubeProps> = ({
  tubeIndex,
  tube,
  ballSize,
  isSelected,
  isHintSource = false,
  isHintDest = false,
  isShaking = false,
  hiddenTopBall = false,
  theme,
  onPress,
  onLayout,
}) => {
  const isSolved = isTubeSolved(tube);
  const tubeWidth = ballSize + 14;
  const tubeHeight = ballSize * 4 + 24;

  // Lift animation for the top ball when selected
  const liftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(liftAnim, {
      toValue: isSelected ? -ballSize * 0.95 : 0,
      friction: 7,
      tension: 110,
      useNativeDriver: true,
    }).start();
  }, [isSelected, liftAnim, ballSize]);

  // Hint pulse animation
  const hintPulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isHintSource || isHintDest) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintPulseAnim, {
            toValue: 1.08,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulseAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      hintPulseAnim.setValue(1);
    }
  }, [isHintSource, isHintDest, hintPulseAnim]);

  // Shake animation on illegal move
  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isShaking) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [isShaking, shakeAnim]);

  const bottomRadius = tubeWidth / 2;

  return (
    <Pressable
      onPress={() => onPress(tubeIndex)}
      onLayout={onLayout}
      style={({ pressed }) => [
        styles.tubeOuter,
        {
          width: tubeWidth,
          height: tubeHeight + ballSize * 0.95, // extra clearance for lifted ball
        },
        pressed && styles.pressed,
      ]}
    >
      <Animated.View
        style={[
          styles.tubeFrame,
          {
            width: tubeWidth,
            height: tubeHeight,
            borderBottomLeftRadius: bottomRadius,
            borderBottomRightRadius: bottomRadius,
            borderColor: isSolved
              ? '#FBBF24'
              : isHintSource
              ? '#00E5FF'
              : isHintDest
              ? '#34D399'
              : isSelected
              ? theme.accent
              : theme.tubeOutline,
            borderWidth: isSelected || isHintSource || isHintDest || isSolved ? 2.5 : 1.5,
            shadowColor: isSolved ? '#FBBF24' : isSelected ? theme.accent : '#000000',
            shadowOpacity: isSelected || isSolved ? 0.8 : isHintSource ? 0.6 : 0.25,
            shadowRadius: isSelected || isSolved ? 12 : 5,
            elevation: isSelected || isSolved ? 10 : 3,
            transform: [{ scale: hintPulseAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        {/* Soft Grounding Drop Shadow Under Tube */}
        <View
          style={[
            styles.tubeGroundShadow,
            {
              width: tubeWidth * 0.88,
              bottom: -6,
            },
          ]}
        />

        {/* Glass Rim Top Opening (Elliptical collar) */}
        <LinearGradient
          colors={
            isSelected
              ? [theme.accent, 'rgba(255, 255, 255, 0.3)']
              : isSolved
              ? ['#FBBF24', '#F59E0B']
              : ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.12)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.tubeRim,
            {
              width: tubeWidth + 6,
              left: -3,
              borderColor: isSelected ? theme.accent : isSolved ? '#FBBF24' : theme.tubeOutline,
            },
          ]}
        />

        {/* Glass Reflection Gradient Background */}
        <LinearGradient
          colors={[
            theme.tubeGlass,
            'rgba(255, 255, 255, 0.05)',
            theme.tubeGlass,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.glassBody,
            {
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
            },
          ]}
        >
          {/* Vertical Glass Specular Highlight Streak (Left) */}
          <View style={styles.glassReflectionStreak} />

          {/* Secondary Soft Ambient Reflection Streak (Right) */}
          <View style={styles.glassReflectionRight} />

          {/* Bottom Hemispherical Ambient Rim */}
          <View
            style={[
              styles.bottomReflection,
              {
                width: tubeWidth * 0.6,
              },
            ]}
          />

          {/* Balls Stacked Bottom-To-Top */}
          <View style={styles.ballsColumn}>
            {tube.map((color, idx) => {
              const isTopBall = idx === tube.length - 1;
              if (isTopBall && hiddenTopBall) {
                return null;
              }

              const ballTransform =
                isTopBall && isSelected
                  ? [{ translateY: liftAnim }]
                  : [];

              return (
                <Animated.View
                  key={`tube-${tubeIndex}-ball-${idx}`}
                  style={[
                    styles.ballWrapper,
                    {
                      width: ballSize,
                      height: ballSize,
                      transform: ballTransform,
                    },
                  ]}
                >
                  <GlossyBall
                    color={color}
                    size={ballSize}
                    isSelected={isTopBall && isSelected}
                    isHinted={isTopBall && isHintSource}
                  />
                </Animated.View>
              );
            })}
          </View>
        </LinearGradient>

        {/* Solved Sparkle Badge */}
        {isSolved && (
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.solvedBadge}
          >
            <Animated.Text style={styles.solvedSparkle}>✨ 100%</Animated.Text>
          </LinearGradient>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tubeOuter: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 5,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  tubeGroundShadow: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignSelf: 'center',
    zIndex: -1,
  },
  tubeFrame: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(10, 18, 36, 0.55)',
    borderTopWidth: 0,
    overflow: 'visible',
    shadowOffset: { width: 0, height: 4 },
  },
  tubeRim: {
    position: 'absolute',
    top: -4,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    zIndex: 10,
  },
  glassBody: {
    flex: 1,
    overflow: 'visible',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  glassReflectionStreak: {
    position: 'absolute',
    top: 6,
    left: 3.5,
    width: 2.5,
    height: '84%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 2,
  },
  glassReflectionRight: {
    position: 'absolute',
    top: 10,
    right: 3.5,
    width: 1.5,
    height: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1,
  },
  bottomReflection: {
    position: 'absolute',
    bottom: 3,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
  },
  ballsColumn: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    gap: 2,
    zIndex: 5,
  },
  ballWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedBadge: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 20,
  },
  solvedSparkle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
