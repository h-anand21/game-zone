// ============================================================
// MEMORY RUSH — 01 Splash Screen
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { MRColors } from '../constants/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onFinish();
    });
  }, [onFinish, progressAnim]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../../assets/images/mr_bg_home.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.darkOverlay} />

      <View style={styles.content}>
        <View style={styles.headerArea}>
          <Text style={styles.appTitle}>MEMORY</Text>
          <Text style={styles.appTitleAccent}>RUSH</Text>
          <View style={styles.subtitlePill}>
            <Text style={styles.subtitleText}>TRAIN YOUR MEMORY</Text>
          </View>
        </View>

        <View style={styles.loadingBox}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: widthInterpolate }]} />
          </View>
          <Text style={styles.loadingText}>SYNAPSE LOADING...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MRColors.bgVoid,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 10, 13, 0.55)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 70,
    paddingHorizontal: 24,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: 80,
  },
  appTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 4,
    lineHeight: 48,
  },
  appTitleAccent: {
    fontSize: 52,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 6,
    lineHeight: 56,
    textShadowColor: MRColors.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitlePill: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: MRColors.cyanMuted,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 2,
  },
  loadingBox: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
    marginBottom: 10,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: MRColors.primaryCyan,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 2,
  },
});
