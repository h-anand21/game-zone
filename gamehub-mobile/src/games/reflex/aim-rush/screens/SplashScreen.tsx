// ============================================================
// AIM RUSH — Screen 01: SplashScreen
// High-tech reticle reveal with animated cyber loading bar
// Smoothly fills to 100% and automatically launches directly to Home
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 1. Logo pop animation
    scale.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.back(1.5)),
    });
    opacity.value = withTiming(1, {
      duration: 500,
    });

    // 2. Automated smooth loading line tracker (0% to 100% over ~1.3s)
    const startTime = Date.now();
    const duration = 1350;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <BackgroundLayer screen="home" overlayDarkness={0.45}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(16, insets.top + 10),
            paddingBottom: Math.max(20, insets.bottom + 12),
          },
        ]}
      >
        <View style={styles.topSpace} />

        {/* Center: Glowing Reticle + Master Title */}
        <Animated.View style={[styles.centerBox, logoStyle]}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle cx={50} cy={50} r={42} stroke={ARColors.cyan} strokeWidth={2.5} fill="none" />
            <Circle cx={50} cy={50} r={22} stroke={ARColors.lime} strokeWidth={2} fill="none" />
            <Circle cx={50} cy={50} r={5} fill={ARColors.cyan} />
            <Line x1={4} y1={50} x2={22} y2={50} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={78} y1={50} x2={96} y2={50} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={50} y1={4} x2={50} y2={22} stroke={ARColors.cyan} strokeWidth={2} />
            <Line x1={50} y1={78} x2={50} y2={96} stroke={ARColors.cyan} strokeWidth={2} />
          </Svg>

          <Text style={styles.title}>AIM RUSH</Text>
          <Text style={styles.subtitle}>— TARGET CHAIN —</Text>
        </Animated.View>

        {/* Bottom Loading Section: Track + Percentage + Version */}
        <View style={styles.bottomSection}>
          <View style={styles.loadingInfoRow}>
            <Text style={styles.loadingStatus}>INITIALIZING SYSTEM</Text>
            <Text style={styles.loadingPct}>{progress}%</Text>
          </View>

          {/* Glowing Cyber Loading Line Track */}
          <View style={styles.loadingTrack}>
            <View style={[styles.loadingFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.versionText}>TACTICAL REFLEX ENGINE • v2.0</Text>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  topSpace: {
    height: 30,
  },
  centerBox: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 3.5,
    fontStyle: 'italic',
    marginTop: 14,
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: ARColors.lime,
    letterSpacing: 2.2,
    marginTop: 4,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 8,
  },
  loadingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
  },
  loadingStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.5,
  },
  loadingPct: {
    fontSize: 10,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1,
  },
  loadingTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: ARColors.cyan,
    borderRadius: 3,
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  versionText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: 'rgba(148, 163, 184, 0.6)',
    letterSpacing: 1.2,
    marginTop: 6,
  },
});
