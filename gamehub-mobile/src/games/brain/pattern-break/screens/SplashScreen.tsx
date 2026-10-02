// ============================================================
// PATTERN BREAKER — 01 Splash Screen
// Cinematic Game Intro:
// TITLE: PATTERN BREAKER (NOT Home!)
// MASCOT: Explorer Scout & Robot Companion
// TAGLINE: SPOT THE RULE. BREAK THE PATTERN.
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
    // Cinematic delay 2.4 seconds before transitioning to Home
    const timer = setTimeout(() => {
      setScreen('home');
    }, 2400);

    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <GameBackground variant="splash">
      <Pressable style={styles.container} onPress={() => setScreen('home')}>
        {/* Floating Robot Companion */}
        <View style={styles.robotHolder}>
          <RobotCompanion size={52} mood="happy" />
        </View>

        {/* Cinematic PATTERN BREAKER Title */}
        <View style={styles.titleBox}>
          <Text style={styles.gameTitleTop}>PATTERN</Text>
          <Text style={styles.gameTitleBottom}>BREAKER</Text>
        </View>

        {/* Hero Scout Mascot */}
        <View style={styles.mascotHolder}>
          <Mascot pose="ready" size={180} />
        </View>

        {/* Tagline */}
        <View style={styles.taglinePill}>
          <Text style={styles.taglineText}>SPOT THE RULE. BREAK THE PATTERN.</Text>
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
    gap: 12,
  },
  robotHolder: {
    position: 'absolute',
    top: 70,
    right: 48,
  },
  titleBox: {
    alignItems: 'center',
    gap: 0,
    marginBottom: 4,
  },
  gameTitleTop: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 48,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  gameTitleBottom: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 50,
    textTransform: 'uppercase',
    color: PBColors.primary,
    textShadowColor: 'rgba(25, 211, 255, 0.95)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
  },
  mascotHolder: {
    marginVertical: 8,
    ...PBShadows.cyanGlow,
  },
  taglinePill: {
    backgroundColor: 'rgba(24, 47, 57, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: PBRadius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 213, 74, 0.55)',
    marginTop: 8,
    ...PBShadows.amberGlow,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.8,
  },
  tapPrompt: {
    position: 'absolute',
    bottom: 36,
    fontSize: 11,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
});
