// ============================================================
// Number Rush — Screen 01: SPLASH (Brand Identity & Loading)
// Mind Lock inspired 3D Procedural Vector Logo + Mascot
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { MascotIllustration, NumberRushLogo } from '../components';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const SplashScreen: React.FC = () => {
  const { setScreen, loadPersistedData } = useNumberRushStore();
  const [progress, setProgress] = useState(0);

  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const logoScale = useSharedValue(0.78);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    loadPersistedData();

    // Pulse logo entrance
    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
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

    // Fast, smooth loading progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen('home');
          }, 350);
          return 100;
        }
        return prev + 12;
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const floatStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value }, { rotate: `${float1.value * 0.8}deg` }],
  }));

  const floatStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value }, { rotate: `${float2.value * -0.7}deg` }],
  }));

  const handleSkip = () => {
    setScreen('home');
  };

  return (
    <Pressable style={styles.container} onPress={handleSkip}>
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

      {/* Central Hero: 3D Procedural Vector Logo + Mascot Centerpiece */}
      <View style={styles.heroContent}>
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          <NumberRushLogo width={Math.min(width * 0.88, 330)} showTagline={true} />
        </Animated.View>

        {/* Mascot Centerpiece (Runner Boy with floating cubes) */}
        <View style={styles.mascotHolder}>
          <MascotIllustration size={185} character="runner_boy" mood="celebrate" showNumbers />
        </View>
      </View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.loadingContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.loadingStatus}>
            {progress < 100 ? 'ENTERING JUNGLE ARENA...' : 'READY TO RUSH!'}
          </Text>
          <Text style={styles.percentText}>{Math.min(100, progress)}%</Text>
        </View>

        <View style={styles.loadingTrack}>
          <View style={[styles.loadingFill, { width: `${Math.min(100, progress)}%` }]} />
          <View style={styles.progressShine} />
        </View>

        <Text style={styles.tapToSkipText}>TAP ANYWHERE TO START</Text>
      </View>
    </Pressable>
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
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.7)',
  },
  floatingNumber: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 14,
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
  num1: { top: '12%', left: '8%' },
  num2: { top: '18%', right: '10%', borderColor: '#00E5FF' },
  num3: { bottom: '32%', left: '6%', borderColor: '#2ED573' },
  num4: { bottom: '28%', right: '8%', borderColor: '#FF4757' },
  floatText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFD700',
  },
  heroContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  mascotHolder: {
    marginTop: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    width: '84%',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  loadingStatus: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  percentText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
  },
  loadingTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    shadowColor: '#2ED573',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 6,
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  tapToSkipText: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 12,
  },
});
