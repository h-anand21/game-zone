// ============================================================
// REVERSE MIND — Splash Screen
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { ReverseMindLogo } from '../components/ReverseMindLogo';
import { MascotCompanion } from '../components/MascotCompanion';
import { RMTheme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Animated Mascot Duo */}
        <View style={styles.mascotArea}>
          <MascotCompanion
            state="happy"
            size="lg"
            showSpeechBubble={true}
            speechText="Ready to think in reverse?"
          />
        </View>

        {/* Central Vector Logo */}
        <View style={styles.logoArea}>
          <ReverseMindLogo size="lg" showSubtitle={true} />
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingArea}>
          <View style={styles.loadingBarTrack}>
            <View style={styles.loadingBarFill} />
          </View>
          <Text style={styles.loadingText}>SYNAPSE INVERSION READY...</Text>
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  mascotArea: {
    marginTop: 40,
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingArea: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  loadingBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 10,
  },
  loadingBarFill: {
    width: '85%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: RMTheme.colors.cyanNeon,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 2,
  },
});
