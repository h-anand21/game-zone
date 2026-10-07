// ============================================================
// PATTERN QUEST — Screen 01: SplashScreen
// Full-screen cinematic jungle background (bg_splash),
// rotating sacred geometry symbols, and automated single-line loading progress
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Polygon, Path } from 'react-native-svg';
import { GameBackground } from '../components/background/GameBackground';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const setScreen = usePatternQuestStore((s) => s.setScreen);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // 1. Symbol rotation and scaling
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Track animated percentage for text display
    const listenerId = progressAnim.addListener(({ value }) => {
      setPercent(Math.min(100, Math.round(value * 100)));
    });

    // 3. Single-line loading bar animation that automatically enters 'home'
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          setScreen('home');
        }, 250);
      }
    });

    return () => {
      progressAnim.removeListener(listenerId);
    };
  }, [setScreen]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <GameBackground screen="splash" overlayDarkness={0.25}>
      <View style={styles.container}>
        {/* Sacred Geometry Glyphs Center */}
        <Animated.View
          style={[
            styles.symbolRing,
            {
              transform: [{ rotate: spin }, { scale: scaleAnim }],
            },
          ]}
        >
          <Svg width={140} height={140} viewBox="0 0 140 140">
            {/* Outer magic orbit */}
            <Circle cx="70" cy="70" r="62" stroke={pqColors.crystalCyan} strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6, 6" />
            {/* Triangle */}
            <Polygon points="70,18 116,98 24,98" stroke={pqColors.goldBright} strokeWidth="3" fill="none" opacity="0.8" />
            {/* Diamond */}
            <Polygon points="70,26 114,70 70,114 26,70" stroke={pqColors.turquoiseLight} strokeWidth="2.5" fill="none" opacity="0.7" />
            {/* Star */}
            <Path
              d="M70 42l5.5 17.5H94l-15 11 5.8 17.5L70 77.2l-14.8 10.8 5.8-17.5-15-11h18.5z"
              fill={pqColors.crystalCyan}
              opacity="0.9"
            />
          </Svg>
        </Animated.View>

        {/* Title & Tagline */}
        <View style={styles.titleSection}>
          <Text style={styles.gameTitle}>PATTERN QUEST</Text>
          <Text style={styles.tagline}>
            "Find the pattern. Continue the adventure."
          </Text>
        </View>

        {/* Automated Single-Line Loading Bar (No ready image, No tap to enter) */}
        <View style={styles.loadingStage}>
          <View style={styles.singleLinePanel}>
            {/* Rivets */}
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />

            <View style={styles.singleLineRow}>
              <Text style={styles.loadingLabel}>LOADING</Text>

              <View style={styles.gaugeTrack}>
                <Animated.View style={[styles.gaugeFill, { width: progressWidth }]} />
              </View>

              <Text style={styles.percentText}>{percent}%</Text>
            </View>
          </View>
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  symbolRing: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pqSpacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: pqSpacing.xl,
  },
  gameTitle: {
    ...pqTypography.h1,
    color: pqColors.textGold,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    ...pqTypography.caption,
    color: pqColors.turquoiseLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  loadingStage: {
    width: Math.min(SCREEN_WIDTH - 40, 340),
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  singleLinePanel: {
    width: '100%',
    backgroundColor: 'rgba(12, 20, 28, 0.94)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#7A5424',
    borderTopColor: '#C49448',
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'relative',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  rivet: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFE066',
    borderWidth: 1,
    borderColor: '#7A4D10',
    opacity: 0.85,
  },
  rivetTL: { top: 4, left: 6 },
  rivetTR: { top: 4, right: 6 },
  rivetBL: { bottom: 4, left: 6 },
  rivetBR: { bottom: 4, right: 6 },

  singleLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gaugeTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#071017',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#263745',
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 1.5,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00F0FF',
    minWidth: 38,
    textAlign: 'right',
  },
});
