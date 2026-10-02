// ============================================================
// PATTERN BREAKER — 01 Splash Screen
// Cinematic Game Intro: World Background, 3D Title, Mascot & Tagline
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { Mascot } from '../components/mascot/Mascot';
import { RobotCompanion } from '../components/mascot/RobotCompanion';
import { PBColors, PBTypography, PBShadows, PBRadius } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const SplashScreen: React.FC = () => {
  const { setScreen } = usePatternBreakStore();

  useEffect(() => {
    // Cinematic delay 2.2 seconds before transitioning to Home
    const timer = setTimeout(() => {
      setScreen('home');
    }, 2200);

    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <GameBackground variant="portal">
      <Pressable style={styles.container} onPress={() => setScreen('home')}>
        {/* Upper Floating Robot */}
        <View style={styles.robotWrapper}>
          <RobotCompanion size={54} mood="happy" />
        </View>

        {/* Center Hero Mascot */}
        <View style={styles.mascotWrapper}>
          <Mascot pose="ready" size={170} />
        </View>

        {/* Hero 3D Title */}
        <View style={styles.titleBox}>
          <Text style={styles.gameTitleTop}>PATTERN</Text>
          <Text style={styles.gameTitleBottom}>BREAKER</Text>
          <View style={styles.taglinePill}>
            <Text style={styles.taglineText}>SPOT THE RULE. BREAK THE PATTERN.</Text>
          </View>
        </View>

        {/* Touch to Skip Prompt */}
        <Text style={styles.tapPrompt}>TAP ANYWHERE TO ENTER</Text>
      </Pressable>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  robotWrapper: {
    position: 'absolute',
    top: 90,
    right: 50,
  },
  mascotWrapper: {
    marginBottom: 20,
    ...PBShadows.cyanGlow,
  },
  titleBox: {
    alignItems: 'center',
    gap: 2,
  },
  gameTitleTop: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 44,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  gameTitleBottom: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 46,
    textTransform: 'uppercase',
    color: PBColors.primary,
    textShadowColor: 'rgba(25, 211, 255, 0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  taglinePill: {
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 74, 0.4)',
    marginTop: 14,
  },
  taglineText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
  },
  tapPrompt: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
});
