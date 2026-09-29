// ============================================================
// Mind Lock — Screen 7: Game Over / Lock Broken Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useMindLockStore } from '../store/mindLockStore';

export const GameOverScreen: React.FC = () => {
  const { score, round, currentStreak, stats, startGame, setScreen } = useMindLockStore();

  return (
    <View style={styles.container}>
      <ScreenHeader title="" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Broken Lock Mascot */}
        <View style={styles.mascotHolder}>
          <Mascot mood="broken" size={240} />
        </View>

        {/* Title: LOCK BROKEN */}
        <View style={styles.titleSection}>
          <Text style={styles.lockBrokenText}>LOCK BROKEN</Text>
          <View style={styles.subPill}>
            <Text style={styles.subText}>Better luck next time!</Text>
          </View>
        </View>

        {/* 4 Stats Cards Grid */}
        <View style={styles.statsGrid}>
          {/* Score */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score}</Text>
          </LinearGradient>

          {/* Round */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>ROUND</Text>
            <Text style={styles.statValue}>{round}</Text>
          </LinearGradient>

          {/* Best Score */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>👑</Text>
            <Text style={styles.statLabel}>BEST SCORE</Text>
            <Text style={styles.statValue}>{stats.bestScore}</Text>
          </LinearGradient>

          {/* Streak */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{currentStreak}</Text>
          </LinearGradient>
        </View>

        {/* Motivational Brain Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.brainEmoji}>🧠</Text>
          <Text style={styles.quoteText}>
            “Every mistake is a step to a sharper mind.”
          </Text>
        </View>

        {/* Action Buttons: RETRY and HOME */}
        <View style={styles.actionsRow}>
          <PrimaryButton
            title="RETRY"
            onPress={() => startGame()}
            style={styles.retryBtn}
          />
          <SecondaryButton
            title="HOME"
            onPress={() => setScreen('home')}
            style={styles.homeBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  scrollContent: {
    paddingHorizontal: MLSpacing.base,
    paddingBottom: MLSpacing.xl,
    alignItems: 'center',
  },
  mascotHolder: {
    marginVertical: MLSpacing.xs,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: MLSpacing.md,
  },
  lockBrokenText: {
    color: MLColors.padRed,
    fontSize: MLTypography.h1,
    fontWeight: MLTypography.black,
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...MLShadows.glowRed,
  },
  subPill: {
    backgroundColor: 'rgba(18, 35, 56, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    marginTop: 4,
  },
  subText: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MLSpacing.sm,
    width: '100%',
    marginVertical: MLSpacing.md,
  },
  statCard: {
    width: '48%',
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    color: MLColors.textMuted,
    fontSize: 10,
    fontWeight: MLTypography.bold,
    letterSpacing: 0.5,
  },
  statValue: {
    color: MLColors.white,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    marginTop: 2,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2033',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    gap: MLSpacing.sm,
    width: '100%',
    marginVertical: MLSpacing.md,
  },
  brainEmoji: {
    fontSize: 24,
  },
  quoteText: {
    flex: 1,
    color: MLColors.cream,
    fontSize: MLTypography.caption,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: MLSpacing.md,
    width: '100%',
    marginTop: MLSpacing.sm,
  },
  retryBtn: {
    flex: 1,
  },
  homeBtn: {
    flex: 1,
  },
});
