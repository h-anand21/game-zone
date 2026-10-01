// ============================================================
// REVERSE MIND — Welcome Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { ReverseMindLogo } from '../components/ReverseMindLogo';
import { MascotCompanion } from '../components/MascotCompanion';
import { GlowButton } from '../components/GlowButton';
import type { AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface WelcomeScreenProps {
  onStart: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onNavigate }) => {
  return (
    <EnvironmentalBackground theme="home">
      <View style={styles.container}>
        {/* Top Header Logo */}
        <View style={styles.heroHeader}>
          <ReverseMindLogo size="lg" showSubtitle={true} />
        </View>

        {/* Mascot Center Stage */}
        <View style={styles.mascotArea}>
          <MascotCompanion
            state="happy"
            size="lg"
            showSpeechBubble={true}
            speechText="Welcome! Train your brain to invert visual sequences!"
          />
        </View>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>MENTAL INVERSION GYM</Text>
          <Text style={styles.introDesc}>
            Memorize visual sequences of animals, cars, stars & food — then enter them in EXACT REVERSE ORDER!
          </Text>

          <View style={styles.previewRow}>
            <Text style={styles.previewStep}>🐶 ➔ 🚗 ➔ ⭐</Text>
            <Text style={styles.arrowFlip}>⟲</Text>
            <Text style={styles.previewTarget}>⭐ ➔ 🚗 ➔ 🐶</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsArea}>
          <GlowButton
            title="ENTER GAME HUB"
            variant="gold"
            size="lg"
            icon="🚀"
            onPress={onStart}
          />
          <View style={{ height: 10 }} />
          <GlowButton
            title="HOW IT WORKS (TUTORIAL)"
            variant="glass"
            size="md"
            onPress={() => onNavigate('how-it-works')}
          />
        </View>
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroHeader: {
    alignItems: 'center',
  },
  mascotArea: {
    marginVertical: 10,
  },
  introCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.5,
  },
  introDesc: {
    fontSize: 12,
    color: RMTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RMTheme.radii.md,
  },
  previewStep: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  arrowFlip: {
    fontSize: 16,
    color: RMTheme.colors.cyanNeon,
    fontWeight: '900',
  },
  previewTarget: {
    fontSize: 12,
    fontWeight: '800',
    color: RMTheme.colors.primaryGold,
  },
  actionsArea: {
    width: '100%',
  },
});
