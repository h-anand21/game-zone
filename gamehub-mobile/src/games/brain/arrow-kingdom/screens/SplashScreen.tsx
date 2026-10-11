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
          {/* Neon Arrow Emblem Graphic */}
          <Svg width={120} height={120} viewBox="0 0 120 120">
            {/* Blue Arrow pointing right */}
            <Path
              d="M 20 40 L 60 40 L 60 70 L 90 70"
              stroke={COLORS.blue}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polygon points="104,70 88,58 88,82" fill={COLORS.blue} />

            {/* Pink Arrow pointing up */}
            <Path
              d="M 80 100 L 80 85 L 45 85 L 45 30"
              stroke={COLORS.pink}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polygon points="45,16 35,32 55,32" fill={COLORS.pink} />

            {/* Green Arrow pointing down */}
            <Path
              d="M 25 15 L 25 95"
              stroke={COLORS.green}
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
            />
            <Polygon points="25,108 15,92 35,92" fill={COLORS.green} />
          </Svg>

          <Text style={styles.gameTitle}>ARROW KINGDOM</Text>
          <Text style={styles.gameSubtitle}>SLIDE ESCAPE</Text>
        </Animated.View>

        {/* Bottom Loading Indicator */}
        <View style={styles.loadingSection}>
          <Text style={styles.loadingStatusText}>AWAKENING RUNIC PUZZLES...</Text>
          <View style={styles.trackBar}>
            <Animated.View style={[styles.fillBar, { width: barWidth }]}>
              <LinearGradient
                colors={['#78F329', '#22C51D']}
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
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emblemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 20,
    textShadowColor: COLORS.blue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  gameSubtitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 4,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  loadingSection: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  loadingStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  trackBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(8, 27, 47, 0.8)',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#3D1C08',
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default SplashScreen;
