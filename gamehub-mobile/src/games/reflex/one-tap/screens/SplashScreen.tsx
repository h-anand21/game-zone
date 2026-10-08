// ============================================================
// ONE TAP: PRECISION GAME — SplashScreen
// Cinematic entrance, concentric gold rings & auto loading track
// ============================================================

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import { OTColors } from '../theme/colors';

interface SplashScreenProps {
  onFinishLoading: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinishLoading }) => {
  const [progress, setProgress] = useState(0);

  // Reanimated rotation for concentric rings
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    // Auto-progress loading bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinishLoading, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  return (
    <BackgroundLayer screen="splash" overlayDarkness={0.4}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Atmospheric Space */}
          <View style={styles.topSpace} />

          {/* Center Hero Concentric Rings & Logo */}
          <View style={styles.heroCenter}>
            <Animated.View style={[styles.rotatingRing, ringStyle]}>
              <Svg width={220} height={220} viewBox="0 0 220 220">
                <Defs>
                  <LinearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFE875" />
                    <Stop offset="100%" stopColor="#D4AF37" stopOpacity={0.2} />
                  </LinearGradient>
                </Defs>
                <Circle
                  cx={110}
                  cy={110}
                  r={100}
                  stroke="url(#goldGlow)"
                  strokeWidth={2}
                  strokeDasharray="18 10"
                  fill="none"
                />
                <Circle
                  cx={110}
                  cy={110}
                  r={75}
                  stroke={OTColors.cyan}
                  strokeWidth={1.5}
                  strokeDasharray="8 6"
                  fill="none"
                  opacity={0.7}
                />
              </Svg>
            </Animated.View>

            {/* Glowing Golden Core */}
            <View style={styles.glowCore}>
              <View style={styles.innerOrb} />
            </View>

            {/* Master 3D Chrome & Gold Logo */}
            <View style={styles.logoWrap}>
              <OneTapLogo size="hero" showSubtitle={true} />
            </View>
          </View>

          {/* Bottom Futuristic Loading Track */}
          <View style={styles.bottomSection}>
            <View style={styles.loadingTrack}>
              <View style={[styles.loadingFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.loadingText}>LOADING... {progress}%</Text>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  topSpace: {
    height: 40,
  },
  heroCenter: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rotatingRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  innerOrb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE875',
  },
  logoWrap: {
    marginTop: 180,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  loadingTrack: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: OTColors.gold,
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2.5,
  },
});
