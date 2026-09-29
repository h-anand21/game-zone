// ============================================================
// Mind Lock — Screen 10: Daily Challenge Screen
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { WoodenSign } from '../components/WoodenSign';
import { PrimaryButton } from '../components/PrimaryButton';
import { useMindLockStore } from '../store/mindLockStore';

export const DailyChallengeScreen: React.FC = () => {
  const { daily, startGame } = useMindLockStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Daily Challenge" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wooden Sign Title + Mascot with Map */}
        <View style={styles.topBanner}>
          <WoodenSign subtitle="A NEW PATTERN. A SHARPER YOU!" title="DAILY CHALLENGE" />
          <View style={styles.mascotHolder}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>Can you crack today's pattern?</Text>
            </View>
            <Mascot mood="daily" size={130} />
          </View>
        </View>

        {/* 3 Metric Pills */}
        <View style={styles.metricsRow}>
          {/* Time Left */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCardTimer}>
            <Text style={styles.metricIcon}>⏱️</Text>
            <View>
              <Text style={styles.metricLabel}>Time Left Today</Text>
              <Text style={styles.timerText}>
                {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
              </Text>
              <Text style={styles.timerSub}>Hours   Minutes   Seconds</Text>
            </View>
          </LinearGradient>

          {/* Streak */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricIcon}>🔥</Text>
            <Text style={styles.metricLabel}>Streak</Text>
            <Text style={styles.metricValue}>{daily.currentStreak}</Text>
          </LinearGradient>

          {/* Daily Score */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricIcon}>🏆</Text>
            <Text style={styles.metricLabel}>Daily Score</Text>
            <Text style={styles.metricValue}>{daily.dailyScore}</Text>
          </LinearGradient>
        </View>

        {/* Today's Pattern Challenge Card */}
        <LinearGradient colors={['#16283F', '#0D1A29']} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.lightbulb}>💡</Text>
            <View>
              <Text style={styles.cardTitle}>Today's Pattern Challenge</Text>
              <Text style={styles.cardSubtitle}>Memorize the pattern and repeat it!</Text>
            </View>
          </View>

          {/* 4 Mystery Question Mark Pads */}
          <View style={styles.padsRow}>
            {['#FF4B4B', '#2997FF', '#55D63F', '#FFC928'].map((c, i) => (
              <LinearGradient
                key={i}
                colors={[c, `${c}99`]}
                style={styles.mysteryPad}
              >
                <Text style={styles.questionMark}>?</Text>
              </LinearGradient>
            ))}
          </View>

          {/* Spec Row: Rounds, Difficulty, Mode */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🎯</Text>
              <View>
                <Text style={styles.specLabel}>Rounds</Text>
                <Text style={styles.specVal}>{daily.targetRounds}</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specIcon}>📊</Text>
              <View>
                <Text style={styles.specLabel}>Difficulty</Text>
                <Text style={styles.specVal}>Medium</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🧠</Text>
              <View>
                <Text style={styles.specLabel}>Mode</Text>
                <Text style={styles.specVal}>Classic</Text>
              </View>
            </View>
          </View>

          {/* START CHALLENGE BUTTON */}
          <PrimaryButton
            title="START CHALLENGE"
            size="lg"
            onPress={() => startGame('daily')}
            style={styles.startBtn}
          />
        </LinearGradient>

        {/* Today's Rewards Track */}
        <LinearGradient colors={['#16283F', '#0D1A29']} style={styles.rewardsTrackCard}>
          <View style={styles.rewardsHeader}>
            <Text style={styles.rewardBoxIcon}>🎁</Text>
            <View>
              <Text style={styles.rewardsTitle}>Today's Rewards</Text>
              <Text style={styles.rewardsSubtitle}>Complete more rounds to earn better rewards!</Text>
            </View>
          </View>

          <View style={styles.rewardsTrackRow}>
            {/* 3 Rounds */}
            <View style={styles.rewardNode}>
              <View style={[styles.rewardIconCircle, daily.claimed3 && styles.claimedCircle]}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                {daily.claimed3 && <Text style={styles.checkBadge}>✓</Text>}
              </View>
              <Text style={styles.roundStepText}>3 Rounds</Text>
              <Text style={styles.rewardDescText}>50 Coins</Text>
            </View>

            {/* 5 Rounds */}
            <View style={styles.rewardNode}>
              <View style={[styles.rewardIconCircle, daily.claimed5 && styles.claimedCircle]}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                {daily.claimed5 && <Text style={styles.checkBadge}>✓</Text>}
              </View>
              <Text style={styles.roundStepText}>5 Rounds</Text>
              <Text style={styles.rewardDescText}>100 XP</Text>
            </View>

            {/* 8 Rounds */}
            <View style={styles.rewardNode}>
              <View style={styles.rewardIconCircle}>
                <Text style={styles.rewardEmoji}>🎁</Text>
                <Text style={styles.lockBadgeIcon}>🔒</Text>
              </View>
              <Text style={styles.roundStepText}>8 Rounds</Text>
              <Text style={styles.rewardDescText}>Rare Chest</Text>
            </View>

            {/* 10 Rounds */}
            <View style={styles.rewardNode}>
              <View style={styles.rewardIconCircle}>
                <Text style={styles.rewardEmoji}>👑</Text>
                <Text style={styles.lockBadgeIcon}>🔒</Text>
              </View>
              <Text style={styles.roundStepText}>10 Rounds</Text>
              <Text style={styles.rewardDescText}>Special Badge</Text>
            </View>
          </View>
        </LinearGradient>
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
  },
  topBanner: {
    alignItems: 'center',
    marginVertical: MLSpacing.sm,
  },
  woodenSign: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: MLRadius.lg,
    borderWidth: 2,
    borderColor: '#4A2006',
    alignItems: 'center',
    ...MLShadows.md,
  },
  signTitle: {
    color: '#FFF8EB',
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  signSub: {
    color: '#FFE2B8',
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
  },
  mascotHolder: {
    alignItems: 'center',
    marginTop: -10,
    position: 'relative',
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: MLRadius.pill,
    position: 'absolute',
    top: 0,
    zIndex: 10,
    ...MLShadows.sm,
  },
  speechText: {
    color: '#0A121D',
    fontSize: 10,
    fontWeight: MLTypography.bold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    marginVertical: MLSpacing.md,
  },
  metricCardTimer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.sm,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: MLSpacing.sm,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  metricIcon: {
    fontSize: 16,
  },
  metricLabel: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.semibold,
  },
  timerText: {
    color: MLColors.primary,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  timerSub: {
    color: MLColors.textDim,
    fontSize: 8,
  },
  metricValue: {
    color: MLColors.white,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
    marginTop: 2,
  },
  challengeCard: {
    padding: MLSpacing.base,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.3)',
    marginBottom: MLSpacing.md,
    ...MLShadows.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
    marginBottom: MLSpacing.md,
  },
  lightbulb: {
    fontSize: 22,
  },
  cardTitle: {
    color: MLColors.white,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
  },
  cardSubtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  padsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MLSpacing.sm,
    marginVertical: MLSpacing.sm,
  },
  mysteryPad: {
    flex: 1,
    height: 70,
    borderRadius: MLRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...MLShadows.sm,
  },
  questionMark: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 32,
    fontWeight: MLTypography.black,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: MLSpacing.md,
    backgroundColor: '#091523',
    paddingVertical: 8,
    borderRadius: MLRadius.lg,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specIcon: {
    fontSize: 16,
  },
  specLabel: {
    color: MLColors.textDim,
    fontSize: 8,
  },
  specVal: {
    color: MLColors.white,
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.bold,
  },
  startBtn: {
    marginTop: 4,
  },
  rewardsTrackCard: {
    padding: MLSpacing.base,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
    marginBottom: MLSpacing.md,
  },
  rewardBoxIcon: {
    fontSize: 22,
  },
  rewardsTitle: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.black,
  },
  rewardsSubtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  rewardsTrackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardNode: {
    alignItems: 'center',
    gap: 4,
  },
  rewardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#091523',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  claimedCircle: {
    borderColor: MLColors.success,
  },
  rewardEmoji: {
    fontSize: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: MLColors.success,
    color: '#0A121D',
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  lockBadgeIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: 10,
  },
  roundStepText: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  rewardDescText: {
    color: MLColors.primary,
    fontSize: 9,
  },
});
