// ============================================================
// Mind Lock — Screen 8: Victory / Pattern Master Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { useMindLockStore } from '../store/mindLockStore';

export const VictoryScreen: React.FC = () => {
  const { score, round, currentStreak, profile, activeLevelId, startLevel, startGame, setScreen } = useMindLockStore();


  return (
    <View style={styles.container}>
      <Confetti />
      <ScreenHeader title="" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title: PATTERN MASTER */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.title}>PATTERN MASTER</Text>
          <View style={styles.subPill}>
            <Text style={styles.subText}>Amazing! You nailed it!</Text>
          </View>
        </View>

        {/* Celebrating Mascot */}
        <View style={styles.mascotHolder}>
          <Mascot mood="victory" size={240} />
        </View>

        {/* 3 Stats Cards */}
        <View style={styles.statsRow}>
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score}</Text>
          </LinearGradient>

          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{round}</Text>
          </LinearGradient>

          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{currentStreak}</Text>
          </LinearGradient>
        </View>

        {/* XP Earned Card */}
        <LinearGradient colors={['#1A243F', '#0E1729']} style={styles.xpCard}>
          <View style={styles.xpLeft}>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>XP</Text>
            </View>
            <View>
              <Text style={styles.xpLabel}>XP Earned</Text>
              <Text style={styles.xpValue}>+150 XP</Text>
            </View>
          </View>

          <View style={styles.xpProgressContainer}>
            <View style={styles.xpLabelsRow}>
              <Text style={styles.xpLevelLabel}>Level {profile.level}</Text>
              <Text style={styles.xpLevelLabel}>Level {profile.level + 1}</Text>
            </View>
            <ProgressBar
              progress={profile.xp / profile.xpNextLevel}
              colorVariant="gold"
              height={6}
            />
            <Text style={styles.xpFractionText}>
              {profile.xp} / {profile.xpNextLevel}
            </Text>
          </View>
        </LinearGradient>

        {/* New Achievement Reveal Card */}
        <LinearGradient
          colors={['#2A2714', '#15150C']}
          style={styles.achievementCard}
        >
          <View style={styles.achievementTag}>
            <Text style={styles.achievementTagText}>NEW ACHIEVEMENT!</Text>
          </View>
          <View style={styles.achievementRow}>
            <View style={styles.achievementIcon}>
              <Text style={{ fontSize: 24 }}>👑</Text>
            </View>
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementTitle}>Pattern Master</Text>
              <Text style={styles.achievementDesc}>
                Complete 5 consecutive rounds without a single mistake.
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title={activeLevelId ? `NEXT LEVEL ${activeLevelId + 1}` : 'PLAY AGAIN'}
            size="lg"
            onPress={() => {
              if (activeLevelId && activeLevelId < 10) {
                startLevel(activeLevelId + 1);
              } else {
                startGame();
              }
            }}
          />
          <View style={styles.subActionsRow}>
            <SecondaryButton
              title="LEVEL MAP"
              onPress={() => setScreen('levels')}
              style={styles.actionBtn}
            />
            <SecondaryButton
              title="HOME"
              onPress={() => setScreen('home')}
              style={styles.actionBtn}
            />
          </View>
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
    paddingBottom: MLSpacing.xxl,
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    marginVertical: MLSpacing.xs,
  },
  crownEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  title: {
    color: MLColors.primary,
    fontSize: MLTypography.h2,
    fontWeight: MLTypography.black,
    letterSpacing: 1.5,
    ...MLShadows.glowGold,
  },
  subPill: {
    backgroundColor: 'rgba(18, 35, 56, 0.8)',
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    marginTop: 4,
  },
  subText: {
    color: MLColors.cream,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  mascotHolder: {
    marginVertical: -8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    width: '100%',
    marginVertical: MLSpacing.md,
  },
  statCard: {
    flex: 1,
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    color: MLColors.textMuted,
    fontSize: 10,
    fontWeight: MLTypography.semibold,
    marginTop: 2,
  },
  statValue: {
    color: MLColors.white,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
    marginTop: 2,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    width: '100%',
    marginBottom: MLSpacing.md,
    gap: MLSpacing.md,
  },
  xpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  xpBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: MLColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.glowPurple,
  },
  xpBadgeText: {
    color: '#FFFFFF',
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.black,
  },
  xpLabel: {
    color: MLColors.textMuted,
    fontSize: 10,
  },
  xpValue: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.black,
  },
  xpProgressContainer: {
    flex: 1,
  },
  xpLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLevelLabel: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  xpFractionText: {
    color: MLColors.textDim,
    fontSize: 9,
    textAlign: 'right',
    marginTop: 2,
  },
  achievementCard: {
    width: '100%',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1.5,
    borderColor: MLColors.primary,
    marginBottom: MLSpacing.lg,
    ...MLShadows.glowGold,
  },
  achievementTag: {
    alignSelf: 'flex-start',
    backgroundColor: MLColors.primary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: MLRadius.pill,
    marginBottom: 6,
  },
  achievementTagText: {
    color: '#0A121D',
    fontSize: 9,
    fontWeight: MLTypography.black,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.md,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 201, 40, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  achievementDesc: {
    color: MLColors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    gap: MLSpacing.sm,
  },
  subActionsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
