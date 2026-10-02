// ============================================================
// PATTERN QUEST — Screen 01: SplashScreen
// Full-screen cinematic jungle background (bg_splash),
// rotating sacred geometry symbols (circle, triangle, diamond, star),
// and settled Pattern Quest plaque with tap to start
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import Svg, { Circle, Polygon, Path } from 'react-native-svg';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqColors, pqSpacing, pqTypography } from '../theme';

export const SplashScreen: React.FC = () => {
  const setScreen = usePatternQuestStore((s) => s.setScreen);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const plaqueOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Symbol rotation and scaling
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Plaque settles in
      Animated.timing(plaqueOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // 3. Pulse prompt
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <GameBackground screen="splash" overlayDarkness={0.25}>
      <Pressable style={styles.container} onPress={() => setScreen('home')}>
        {/* Sacred Geometry Glyphs Center */}
        <Animated.View
          style={[
            styles.symbolRing,
            {
              transform: [{ rotate: spin }, { scale: scaleAnim }],
            },
          ]}
        >
          <Svg width={140} height={140} viewBox="0 0 140 140">
            {/* Outer magic orbit */}
            <Circle cx="70" cy="70" r="62" stroke={pqColors.crystalCyan} strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6, 6" />
            {/* Triangle */}
            <Polygon points="70,18 116,98 24,98" stroke={pqColors.goldBright} strokeWidth="3" fill="none" opacity="0.8" />
            {/* Diamond */}
            <Polygon points="70,26 114,70 70,114 26,70" stroke={pqColors.turquoiseLight} strokeWidth="2.5" fill="none" opacity="0.7" />
            {/* Star */}
            <Path
              d="M70 42l5.5 17.5H94l-15 11 5.8 17.5L70 77.2l-14.8 10.8 5.8-17.5-15-11h18.5z"
              fill={pqColors.crystalCyan}
              opacity="0.9"
            />
          </Svg>
        </Animated.View>

        {/* Settling Plaque & Tagline */}
        <Animated.View style={[styles.plaqueWrapper, { opacity: plaqueOpacity }]}>
          <ScreenPlaque screen="ready" width={280} height={150} />
          
          <Text style={styles.tagline}>
            "Find the pattern. Continue the adventure."
          </Text>

          <Animated.View style={[styles.tapPrompt, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.tapText}>TAP ANYWHERE TO ENTER</Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  symbolRing: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pqSpacing.xl,
    shadowColor: pqColors.crystalCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  plaqueWrapper: {
    alignItems: 'center',
  },
  tagline: {
    ...pqTypography.body,
    color: pqColors.textGold,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: pqSpacing.sm,
    marginBottom: pqSpacing.xxl,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tapPrompt: {
    backgroundColor: 'rgba(15, 25, 35, 0.85)',
    borderWidth: 1.5,
    borderColor: pqColors.gold,
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: pqSpacing.lg,
    paddingVertical: pqSpacing.sm,
  },
  tapText: {
    ...pqTypography.buttonMedium,
    color: pqColors.goldBright,
    letterSpacing: 1.5,
  },
});
