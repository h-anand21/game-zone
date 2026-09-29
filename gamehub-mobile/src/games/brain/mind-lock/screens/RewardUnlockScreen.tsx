// ============================================================
// Mind Lock — Screen 17: Reward / Level Unlock Celebration Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { RewardCard } from '../components/RewardCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { useMindLockStore } from '../store/mindLockStore';

export const RewardUnlockScreen: React.FC = () => {
  const { dismissRewardModal } = useMindLockStore();

  return (
    <View style={styles.container}>
      <Confetti />
      <ScreenHeader title="" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title: LEVEL UNLOCKED */}
        <View style={styles.titleContainer}>
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.title}>LEVEL UNLOCKED!</Text>
        </View>

        {/* Mascot Cheering */}
        <View style={styles.mascotHolder}>
          <Mascot mood="unlock" size={240} />
        </View>

        {/* 3 Reward Cards Row */}
        <View style={styles.rewardsRow}>
          {/* 1. New Badge */}
          <RewardCard
            category="NEW BADGE"
            title="Pattern Pro"
            subtitle="Complete 25 complex patterns"
            accentColor={MLColors.primary}
            icon={
              <LinearGradient
                colors={MLColors.goldGradient as [string, string, ...string[]]}
                style={styles.badgeCircle}
              >
                <Text style={{ fontSize: 20 }}>🧠</Text>
              </LinearGradient>
            }
          />

          {/* 2. New Level */}
          <RewardCard
            category="NEW LEVEL"
            title="Forest Mind"
            subtitle="A new world is now unlocked!"
            accentColor={MLColors.padBlue}
            icon={
              <LinearGradient
                colors={MLColors.blueGradient as [string, string, ...string[]]}
                style={styles.levelCircle}
              >
                <Text style={styles.levelNumberText}>02</Text>
              </LinearGradient>
            }
          />

          {/* 3. XP Reward */}
          <RewardCard
            category="XP REWARD"
            title="+150 XP"
            subtitle="Great performance! Keep going!"
            accentColor={MLColors.purple}
            icon={
              <LinearGradient
                colors={MLColors.purpleGradient as [string, string, ...string[]]}
                style={styles.xpCircle}
              >
                <Text style={styles.xpText}>XP</Text>
              </LinearGradient>
            }
          />
        </View>

        {/* Next Level Preview Banner */}
        <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.nextLevelBanner}>
          <View style={styles.nextLevelThumbnail}>
            <LinearGradient
              colors={['#2A4736', '#142E1F']}
              style={styles.thumbBox}
            >
              <Text style={{ fontSize: 26 }}>🏛️</Text>
            </LinearGradient>
          </View>
          <View style={styles.nextLevelInfo}>
            <Text style={styles.nextLevelLabel}>Next Level</Text>
            <Text style={styles.nextLevelTitle}>
              <Text style={{ color: MLColors.primary }}>03</Text> Ancient Ruins
            </Text>
            <ProgressBar progress={0.4} colorVariant="gold" height={6} />
            <Text style={styles.roundsToUnlockText}>2 / 5 Rounds to unlock</Text>
          </View>
          <Text style={styles.nextArrow}>›</Text>
        </LinearGradient>

        {/* Action: CONTINUE */}
        <View style={styles.actionWrapper}>
          <PrimaryButton
            title="CONTINUE"
            size="lg"
            onPress={dismissRewardModal}
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
  titleContainer: {
    alignItems: 'center',
    marginVertical: MLSpacing.xs,
  },
  crownEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  title: {
    color: MLColors.primary,
    fontSize: MLTypography.h2,
    fontWeight: MLTypography.black,
    letterSpacing: 2,
    ...MLShadows.glowGold,
  },
  mascotHolder: {
    marginVertical: -12,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    width: '100%',
    marginVertical: MLSpacing.md,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.glowGold,
  },
  levelCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.glowBlue,
  },
  levelNumberText: {
    color: '#FFFFFF',
    fontSize: MLTypography.body,
    fontWeight: MLTypography.black,
  },
  xpCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.glowPurple,
  },
  xpText: {
    color: '#FFFFFF',
    fontSize: MLTypography.body,
    fontWeight: MLTypography.black,
  },
  nextLevelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    width: '100%',
    marginVertical: MLSpacing.sm,
    gap: MLSpacing.md,
  },
  nextLevelThumbnail: {
    width: 60,
    height: 50,
    borderRadius: MLRadius.md,
    overflow: 'hidden',
  },
  thumbBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MLRadius.md,
  },
  nextLevelInfo: {
    flex: 1,
    gap: 3,
  },
  nextLevelLabel: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.semibold,
  },
  nextLevelTitle: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  roundsToUnlockText: {
    color: MLColors.textDim,
    fontSize: 9,
  },
  nextArrow: {
    color: MLColors.textMuted,
    fontSize: 22,
    fontWeight: 'bold',
  },
  actionWrapper: {
    width: '100%',
    marginTop: MLSpacing.md,
  },
});
