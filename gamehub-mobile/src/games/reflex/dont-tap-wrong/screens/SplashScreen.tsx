// ============================================================
// DON'T TAP WRONG — Splash Screen
// Authentic Cosmic Arena background with automated neon loading bar
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { DtwColors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for title
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Automated 1.5s loading bar
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 250);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <BackgroundLayer variant="splash">
      <View style={styles.container}>
        {/* Center Title Hero */}
        <Animated.View style={[styles.titleWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.titlePrefix}>ULTRA REFLEX ARENA</Text>
          <Text style={styles.mainTitle}>DON'T TAP</Text>
          <Text style={styles.subTitle}>WRONG</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.tagline}>PRECISION SPEED CHALLENGE</Text>
        </Animated.View>

        {/* Automated Single-Line Loading Bar */}
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderLabel}>INITIALIZING NEON MATRIX {progress}%</Text>
          <View style={styles.loaderTrack}>
            <View style={[styles.loaderFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  titlePrefix: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    color: DtwColors.cyanAccent,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subTitle: {
    fontSize: 50,
    fontWeight: '900',
    color: DtwColors.dangerRed,
    letterSpacing: 4,
    marginTop: -8,
    textShadowColor: DtwColors.dangerRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  dividerLine: {
    width: 140,
    height: 3,
    backgroundColor: DtwColors.safeGreen,
    marginVertical: 12,
    borderRadius: 2,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: DtwColors.textSecondary,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    width: Math.min(width - 64, 320),
    alignItems: 'center',
  },
  loaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
  },
  loaderTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: DtwColors.safeGreen,
    borderRadius: 3,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
});
