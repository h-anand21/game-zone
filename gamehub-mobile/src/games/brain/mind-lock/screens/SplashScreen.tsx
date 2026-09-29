// ============================================================
// Mind Lock — Screen 1: Splash Screen
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLSpacing } from '../theme';
import { Mascot } from '../components/Mascot';
import { MindLockLogo } from '../components/MindLockLogo';
import { ProgressBar } from '../components/ProgressBar';
import { useMindLockStore } from '../store/mindLockStore';

export const SplashScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { setScreen, hasSeenOnboarding, loadPersistedData } = useMindLockStore();

  useEffect(() => {
    loadPersistedData();
    const timer = setTimeout(() => {
      if (hasSeenOnboarding) {
        setScreen('home');
      } else {
        setScreen('onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#091829', '#07111C', '#040B13']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* MIND LOCK 3D Vector Procedural Logo */}
        <MindLockLogo width={Math.min(width * 0.85, 320)} showTagline={true} />

        {/* Mascot Center */}
        <View style={styles.mascotWrapper}>
          <Mascot mood="home" size={240} />
        </View>

        {/* Loading Progress Bar */}
        <View style={styles.loadingSection}>
          <ProgressBar progress={0.85} colorVariant="gold" height={8} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: MLSpacing.xl,
    gap: MLSpacing.lg,
  },
  logo: {
    marginBottom: MLSpacing.md,
  },
  mascotWrapper: {
    marginVertical: MLSpacing.md,
  },
  loadingSection: {
    width: 200,
    marginTop: MLSpacing.xl,
  },
});
