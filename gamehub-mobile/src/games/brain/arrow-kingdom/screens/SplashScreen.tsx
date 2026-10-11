// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 01: Splash Screen
// Fantasy kingdom grand portal, glowing neon emblem, progress bar
// ============================================================

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';

interface SplashScreenProps {
  onLoaded: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLoaded }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse logo glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Loading bar progress
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onLoaded();
    });
  }, [progressAnim, pulseAnim, onLoaded]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <FantasyBackground>
      <View style={styles.container}>
        {/* Center Emblem & Title */}
        <Animated.View style={[styles.emblemContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.flag}>🚩</Text>
          <Text style={styles.logoTop}>ARROW</Text>
          <Text style={styles.logoBottom}>KINGDOM</Text>

          <Text style={styles.castleTrees}>🏰 🌲 🌲</Text>

          {/* Neon Arrow Demo Glyphs */}
          <View style={styles.arrowsBox}>
            <Text style={[styles.arrowGlyph, { color: '#FF45B5' }]}>┗━━━━━━→</Text>
            <Text style={[styles.arrowGlyph, { color: '#20BFFF' }]}>←━━━━━━┓</Text>
            <Text style={[styles.arrowGlyph, { color: '#49E67A' }]}>↑━━━━━━┛</Text>
          </View>

          <Text style={styles.tagline}>TAP • CLEAR • CONQUER</Text>
        </Animated.View>

        {/* Bottom Loading Indicator */}
        <View style={styles.loadingSection}>
          <Text style={styles.loadingStatusText}>Loading kingdom…</Text>
          <View style={styles.trackBar}>
            <Animated.View style={[styles.fillBar, { width: barWidth }]}>
              <LinearGradient
                colors={['#83F23A', '#35D521', '#159919']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emblemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: 42,
    marginBottom: 4,
  },
  logoTop: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFD33D',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#7A3200',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  logoBottom: {
    fontSize: 38,
    fontWeight: '900',
    color: '#20BFFF',
    letterSpacing: 4,
    marginTop: -10,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  castleTrees: {
    fontSize: 56,
    marginVertical: 12,
  },
  arrowsBox: {
    alignItems: 'center',
    gap: 4,
    marginVertical: 14,
  },
  arrowGlyph: {
    fontSize: 30,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2.5,
    marginTop: 8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingSection: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  loadingStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9AB4CA',
    letterSpacing: 1,
    marginBottom: 10,
  },
  trackBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#061426',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#5B2E12',
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default SplashScreen;
