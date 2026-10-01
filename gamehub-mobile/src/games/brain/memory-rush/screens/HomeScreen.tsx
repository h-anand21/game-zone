// ============================================================
// MEMORY RUSH — 02 Home Screen (World-Class Cyber Arcade Hub)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { BottomTabBar } from '../components/BottomTabBar';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { AppNavScreen } from '../types';

interface HomeScreenProps {
  onStartGame: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigate,
}) => {
  const { playerStats, dailyChallenge, setShowExitModal } = useMemoryRushStore();

  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingSmall}>Hey, Player</Text>
            <Text style={styles.greetingBold}>Ready?</Text>
          </View>

          <View style={styles.headerRight}>
            {/* Streak Badge */}
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakVal}>{playerStats.bestStreak}</Text>
            </View>

            {/* Profile Button */}
            <Pressable onPress={() => onNavigate('stats')} style={styles.profileBtn}>
              <Text style={styles.profileIcon}>👤</Text>
            </Pressable>

            {/* Exit Door */}
            <Pressable onPress={() => setShowExitModal(true)} style={styles.exitBtn}>
              <Text style={styles.exitIcon}>🚪</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO SECTION (Dominant CTA) */}
          <GlassCard glowing style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroTitleMain}>MEMORY</Text>
              <Text style={styles.heroTitleAccent}>RUSH</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Remember faster. Think quicker. Beat your best.
            </Text>

            <View style={styles.playCtaWrapper}>
              <PrimaryButton
                title="PLAY NOW →"
                size="lg"
                onPress={onStartGame}
              />
            </View>
          </GlassCard>

          {/* QUICK STATS (3 Compact Cards) */}
          <View style={styles.quickStatsRow}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={styles.statValueCyan}>{playerStats.bestScore.toLocaleString()}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <Text style={styles.statValueWhite}>×{playerStats.bestStreak}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={styles.statValueYellow}>{playerStats.accuracy}%</Text>
            </GlassCard>
          </View>

          {/* DAILY CHALLENGE CARD */}
          <GlassCard style={styles.dailyCard}>
            <View style={styles.dailyContent}>
              <View style={styles.dailyLeft}>
                <View style={styles.dailyTag}>
                  <Text style={styles.dailyTagText}>DAILY MEMORY</Text>
                </View>
                <Text style={styles.dailyRoundsText}>10 ROUNDS • No mistakes</Text>
                <Text style={styles.dailyXpText}>★ {dailyChallenge.rewardXp} XP REWARD</Text>
              </View>

              <Pressable
                onPress={() => onNavigate('daily')}
                style={({ pressed }) => [styles.dailyPlayBtn, pressed && styles.pressed]}
              >
                <Text style={styles.dailyPlayText}>PLAY →</Text>
              </Pressable>
            </View>
          </GlassCard>
        </ScrollView>

        {/* Floating Glass Bottom Navigation */}
        <BottomTabBar currentScreen="home" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  greetingCol: {
    justifyContent: 'center',
  },
  greetingSmall: {
    fontSize: 12,
    color: MRColors.textSecondary,
    fontWeight: '600',
  },
  greetingBold: {
    fontSize: 20,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  streakIcon: {
    fontSize: 12,
  },
  streakVal: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: MRColors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 14,
  },
  exitBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIcon: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    marginTop: 6,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroTitleMain: {
    fontSize: 34,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  heroTitleAccent: {
    fontSize: 38,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: MRColors.textSecondary,
    fontWeight: '600',
    marginVertical: 10,
  },
  playCtaWrapper: {
    marginTop: 10,
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValueCyan: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.cyanBright,
  },
  statValueWhite: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  statValueYellow: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  dailyCard: {
    marginTop: 2,
  },
  dailyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyLeft: {
    flex: 1,
  },
  dailyTag: {
    alignSelf: 'flex-start',
    backgroundColor: MRColors.cyanMuted,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    marginBottom: 6,
  },
  dailyTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  dailyRoundsText: {
    fontSize: 14,
    fontWeight: '800',
    color: MRColors.textPrimary,
  },
  dailyXpText: {
    fontSize: 11,
    fontWeight: '700',
    color: MRColors.yellowStatus,
    marginTop: 2,
  },
  dailyPlayBtn: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderWidth: 1,
    borderColor: MRColors.primaryCyan,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dailyPlayText: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});
