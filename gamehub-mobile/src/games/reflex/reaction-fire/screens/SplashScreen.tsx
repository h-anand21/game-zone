// ============================================================
// REACTION FIRE — Screen 01: Splash Screen
// Original lightning insignia, concentric radar reveal & brand intro
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { RfColors } from '../theme';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { width } = useWindowDimensions();
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  // Fast loading sequence (approx 1.2s)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 180);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topSpacer} />

      {/* Center Insignia */}
      <Animated.View style={[styles.heroWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.emblemContainer}>
          {/* Rotating Vector Radar Geometry */}
          <Animated.View style={[styles.rotatingRing, { transform: [{ rotate: spin }] }]}>
            <Svg width={110} height={110} viewBox="0 0 110 110">
              <Circle
                cx="55"
                cy="55"
                r="50"
                stroke={RfColors.secondaryCyan}
                strokeWidth="1.5"
                strokeDasharray="8, 6"
                strokeOpacity="0.6"
                fill="none"
              />
              <Circle
                cx="55"
                cy="55"
                r="36"
                stroke={RfColors.primaryBlue}
                strokeWidth="1.5"
                strokeOpacity="0.4"
                fill="none"
              />
              <Line x1="55" y1="5" x2="55" y2="105" stroke={RfColors.secondaryCyan} strokeWidth="1" strokeOpacity="0.3" />
              <Line x1="5" y1="55" x2="105" y2="55" stroke={RfColors.secondaryCyan} strokeWidth="1" strokeOpacity="0.3" />
            </Svg>
          </Animated.View>

          {/* Central Lightning Symbol */}
          <View style={styles.coreSymbol}>
            <Text style={styles.lightningText}>⚡</Text>
          </View>
        </View>

        <Text style={styles.prefixLabel}>PRECISION REFLEX ARENA</Text>
        <Text style={styles.titleMain}>REACTION</Text>
        <Text style={styles.titleFire}>FIRE</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>YOUR REFLEX. YOUR RECORD.</Text>
      </Animated.View>

      {/* Bottom Loading Progress */}
      <View style={[styles.loaderBox, { width: Math.min(width - 64, 280) }]}>
        <Text style={styles.loaderLabel}>CALIBRATING MONOTONIC TIMER {progress}%</Text>
        <View style={styles.loaderTrack}>
          <View style={[styles.loaderFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  topSpacer: {
    height: 24,
  },
  heroWrapper: {
    alignItems: 'center',
  },
  emblemContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  rotatingRing: {
    position: 'absolute',
    width: 110,
    height: 110,
  },
  coreSymbol: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(39, 183, 255, 0.15)',
    borderWidth: 2,
    borderColor: RfColors.goLime,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: RfColors.goLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  lightningText: {
    fontSize: 26,
    color: RfColors.goLime,
  },
  prefixLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.secondaryCyan,
    letterSpacing: 3,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  titleMain: {
    fontSize: 38,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  titleFire: {
    fontSize: 44,
    fontWeight: '900',
    color: RfColors.goLime,
    letterSpacing: 5,
    marginTop: -8,
    textShadowColor: RfColors.goLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  divider: {
    width: 120,
    height: 3,
    backgroundColor: RfColors.primaryBlue,
    borderRadius: 2,
    marginVertical: 12,
    shadowColor: RfColors.primaryBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textSecondary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  loaderBox: {
    alignItems: 'center',
  },
  loaderLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  loaderTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: RfColors.goLime,
    borderRadius: 3,
    shadowColor: RfColors.goLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

export default SplashScreen;
