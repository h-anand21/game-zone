// ============================================================
// Number Rush — Screen 01: SPLASH (Brand Identity & Loading)
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { MascotIllustration } from '../components/MascotIllustration';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const SplashScreen: React.FC = () => {
  const { setScreen } = useNumberRushStore();
  const [progress, setProgress] = useState(0);

  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const logoScale = useSharedValue(0.85);

  useEffect(() => {
    // Pulse logo entrance
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.4)),
    });

    // Floating number animations
    float1.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(12, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    float2.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1900, easing: Easing.inOut(Easing.quad) }),
        withTiming(-10, { duration: 1900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Simulate game initialization progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen('home');
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const floatStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value }, { rotate: `${float1.value * 0.8}deg` }],
  }));

  const floatStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value }, { rotate: `${float2.value * -0.7}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Background with Ambient Overlay */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* Floating 3D Arcade Number Badges */}
      <Animated.View style={[styles.floatingNumber, styles.num1, floatStyle1]}>
        <Text style={styles.floatText}>3</Text>
      </Animated.View>
      <Animated.View style={[styles.floatingNumber, styles.num2, floatStyle2]}>
        <Text style={[styles.floatText, { color: '#00E5FF' }]}>+</Text>
      </Animated.View>
      <Animated.View style={[styles.floatingNumber, styles.num3, floatStyle1]}>
        <Text style={[styles.floatText, { color: '#2ED573' }]}>7</Text>
      </Animated.View>
      <Animated.View style={[styles.floatingNumber, styles.num4, floatStyle2]}>
        <Text style={[styles.floatText, { color: '#FF4757' }]}>×</Text>
      </Animated.View>

      {/* Central Hero Logo & Mascot */}
      <View style={styles.heroContent}>
        <Animated.View style={[styles.logoCard, logoAnimatedStyle]}>
          <Text style={styles.arcadeBadge}>ARCADE BRAIN ADVENTURE</Text>
          <Text style={styles.logoTitle}>NUMBER</Text>
          <Text style={styles.logoTitleRush}>RUSH</Text>
          <Text style={styles.logoTagline}>THINK • TAP • RUSH</Text>
        </Animated.View>

        {/* Mascot Centerpiece */}
        <View style={styles.mascotHolder}>
          <MascotIllustration size={200} character="runner_boy" mood="celebrate" />
        </View>
      </View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingStatus}>
          {progress < 100 ? 'ENTERING THE JUNGLE ARENA...' : 'READY TO RUSH!'}
        </Text>
        <View style={styles.loadingTrack}>
          <View style={[styles.loadingFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.versionText}>v2.0 • HIGH PERFORMANCE ARCADE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  floatingNumber: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(12, 32, 56, 0.85)',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  num1: { top: '15%', left: '10%' },
  num2: { top: '22%', right: '12%', borderColor: '#00E5FF' },
  num3: { bottom: '30%', left: '8%', borderColor: '#2ED573' },
  num4: { bottom: '26%', right: '10%', borderColor: '#FF4757' },
  floatText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFD700',
  },
  heroContent: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderWidth: 3,
    borderColor: '#FFC107',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  arcadeBadge: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
    marginBottom: 2,
  },
  logoTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  logoTitleRush: {
    color: '#FFD700',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: -8,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  logoTagline: {
    color: '#2ED573',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  mascotHolder: {
    marginTop: 20,
  },
  loadingContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  loadingStatus: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  loadingTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#2ED573',
    borderRadius: 6,
  },
  versionText: {
    color: '#5C7491',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 10,
  },
});
