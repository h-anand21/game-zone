// ============================================================
// Color Bloom Sort — Transparent Glass Test Tube Component
// Glass rim, reflections, animated ball lift, and solved sparkles
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
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
  theme: ThemeConfig;
  onPress: (index: number) => void;
}

export const GlassTube: React.FC<GlassTubeProps> = ({
  tubeIndex,
  tube,
  ballSize,
  isSelected,
  isHintSource = false,
  isHintDest = false,
  theme,
  onPress,
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

  const bottomRadius = tubeWidth / 2;

  return (
    <Pressable
      onPress={() => onPress(tubeIndex)}
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
            shadowColor: isSolved ? '#FBBF24' : theme.accent,
            shadowOpacity: isSelected || isSolved || isHintSource ? 0.7 : 0.15,
            shadowRadius: isSelected || isSolved ? 10 : 4,
            elevation: isSelected || isSolved ? 8 : 2,
            transform: [{ scale: hintPulseAnim }],
          },
        ]}
      >
        {/* Glass Rim Top Opening (Elliptical collar) */}
        <View
          style={[
            styles.tubeRim,
            {
              width: tubeWidth + 6,
              left: -3,
              borderColor: isSelected ? theme.accent : theme.tubeOutline,
            },
          ]}
        />

        {/* Glass Reflection Gradient Background */}
        <LinearGradient
          colors={[
            theme.tubeGlass,
            'rgba(255, 255, 255, 0.04)',
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
          {/* Vertical Glass Specular Highlight Streak */}
          <View style={styles.glassReflectionStreak} />

          {/* Balls Stacked Bottom-To-Top */}
          <View style={styles.ballsColumn}>
            {tube.map((color, idx) => {
              const isTopBall = idx === tube.length - 1;
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
          <View style={styles.solvedBadge}>
            <Animated.Text style={styles.solvedSparkle}>✨</Animated.Text>
          </View>
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
  tubeFrame: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(10, 18, 36, 0.45)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    left: 4,
    width: 2.5,
    height: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 2,
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
    top: -14,
    alignSelf: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FBBF24',
    zIndex: 20,
  },
  solvedSparkle: {
    fontSize: 12,
  },
});
