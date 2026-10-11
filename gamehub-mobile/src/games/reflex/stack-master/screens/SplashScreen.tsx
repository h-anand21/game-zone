// ============================================================
// STACK MASTER — Screen 01: Cinematic Splash Screen
// Uses: 'Skylands Block Tower.png' & 'Stack Master Crowned Game Logo.png'
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { COLORS } from '../theme/colors';

const LOGO_IMG = require('@/assets/game/backgrounds/Stack Master Crowned Game Logo.png');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const barProgress = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 120 });

    // Progress bar fill
    barProgress.value = withTiming(1, {
      duration: 1800,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [barProgress, logoOpacity, logoScale, onFinish]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%`,
  }));

  return (
    <ScreenBackground type="splash" dimAmount={0.35}>
      <View style={styles.container}>
        {/* Crowned Game Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={LOGO_IMG}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Subtitle tag */}
        <Text style={styles.tagline}>PRECISION TOWER ARCADE</Text>

        {/* Loading Progress Bar */}
        <View style={styles.loaderContainer}>
          <View style={styles.track}>
            <Animated.View style={[styles.progressFill, barAnimatedStyle]} />
          </View>
          <Text style={styles.loadingText}>AWAKENING THE SKYLANDS...</Text>
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 280,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.cyanLight,
    letterSpacing: 2.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 64,
    width: '80%',
    maxWidth: 260,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    borderWidth: 1.5,
    borderColor: '#244577',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.cyan,
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1.2,
    marginTop: 10,
    textTransform: 'uppercase',
  },
});
