// ============================================================
// Mind Lock — Screen 16: Pause Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { DangerButton } from '../components/DangerButton';
import { ToggleRow } from '../components/ToggleRow';
import { useMindLockStore } from '../store/mindLockStore';

export const PauseScreen: React.FC = () => {
  const { resumeGame, restartGame, exitGame, settings, updateSettings } = useMindLockStore();

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#172B45', '#0E1A29']}
        style={styles.modalCard}
      >
        {/* Top glossy bevel */}
        <View style={styles.topBevel} />

        {/* Title: PAUSED with sparkles */}
        <View style={styles.titleRow}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.pausedTitle}>PAUSED</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>

        <Text style={styles.pausedSub}>Take a break. Your progress is saved!</Text>

        {/* Mascot Sitting on Stone Ledge */}
        <View style={styles.mascotHolder}>
          <Mascot mood="pause" size={170} />
        </View>

        {/* Actions List */}
        <View style={styles.actionsContainer}>
          {/* RESUME */}
          <PrimaryButton
            title="RESUME"
            size="md"
            onPress={resumeGame}
          />

          {/* RESTART */}
          <SecondaryButton
            title="RESTART"
            size="md"
            icon={
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
              </Svg>
            }
            onPress={restartGame}
          />

          {/* Sound Toggle */}
          <ToggleRow
            title="SOUND"
            description="Sound effects during match"
            value={settings.soundEffects}
            iconBgColor={MLColors.padBlue}
            onToggle={(val) => updateSettings({ soundEffects: val })}
            icon={
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </Svg>
            }
          />

          {/* EXIT GAME */}
          <DangerButton
            title="EXIT GAME"
            size="md"
            onPress={exitGame}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 12, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MLSpacing.base,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: MLRadius.xxl,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 244, 222, 0.15)',
    padding: MLSpacing.lg,
    alignItems: 'center',
    ...MLShadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkle: {
    fontSize: 20,
  },
  pausedTitle: {
    color: MLColors.primary,
    fontSize: MLTypography.h2,
    fontWeight: MLTypography.black,
    letterSpacing: 2,
    ...MLShadows.glowGold,
  },
  pausedSub: {
    color: MLColors.cream,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
    marginTop: 2,
    textAlign: 'center',
  },
  mascotHolder: {
    marginVertical: -8,
  },
  actionsContainer: {
    width: '100%',
    gap: MLSpacing.sm,
    marginTop: MLSpacing.xs,
  },
});
