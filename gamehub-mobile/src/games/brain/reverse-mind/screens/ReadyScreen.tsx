// ============================================================
// REVERSE MIND — Pre-Game Readiness Scene
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { MascotCompanion } from '../components/MascotCompanion';
import type { GameMode, GameDifficulty } from '../types';
import { RMTheme } from '../theme';

interface ReadyScreenProps {
  mode: GameMode;
  difficulty: GameDifficulty;
  onStartGame: () => void;
  onBack: () => void;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({
  mode,
  difficulty,
  onStartGame,
  onBack,
}) => {
  return (
    <EnvironmentalBackground theme="ready">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>MISSION READINESS</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Mascot Ready Animation */}
        <View style={styles.mascotBox}>
          <MascotCompanion
            state="excited"
            size="lg"
            showSpeechBubble={true}
            speechText="Focus your brain! Sequence coming in 3..."
          />
        </View>

        {/* Mission Specs Card */}
        <View style={styles.specsCard}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>SELECTED MODE</Text>
            <Text style={styles.specValGold}>{mode.toUpperCase()}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>DIFFICULTY</Text>
            <Text style={styles.specValCyan}>{difficulty.toUpperCase()}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>MAX MISTAKES ALLOWED</Text>
            <Text style={styles.specValWhite}>
              {difficulty === 'easy' ? '2 Mistakes' : difficulty === 'medium' ? '1 Mistake' : '0 Mistakes'}
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>MEMORIZATION DISPLAY</Text>
            <Text style={styles.specValWhite}>
              {difficulty === 'easy' ? '3.0 Seconds' : difficulty === 'medium' ? '2.0 Seconds' : '1.2 Seconds'}
            </Text>
          </View>
        </View>

        {/* Big Start Button */}
        <View style={styles.actionWrapper}>
          <GlowButton
            title="LAUNCH COGNITIVE MISSION!"
            variant="gold"
            size="lg"
            icon="🚀"
            onPress={onStartGame}
          />
        </View>
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingBottom: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  mascotBox: {
    marginVertical: 10,
  },
  specsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderRadius: RMTheme.radii.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 8,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1,
  },
  specValGold: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  specValCyan: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  specValWhite: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionWrapper: {
    width: '100%',
  },
});
