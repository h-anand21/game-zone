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
import { MRIcon } from '../components/MRIcon';
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
            <Text style={styles.greetingSmall}>HEY, PLAYER</Text>
            <Text style={styles.greetingBold}>READY TO RUSH?</Text>
          </View>

          <View style={styles.headerRight}>
            {/* Streak Badge */}
            <View style={styles.streakBadge}>
              <MRIcon name="zap" size={14} color={MRColors.yellowStatus} />
              <Text style={styles.streakVal}>{playerStats.bestStreak}</Text>
            </View>

            {/* Profile / Stats Button */}
            <Pressable onPress={() => onNavigate('stats')} style={styles.headerBtn}>
              <MRIcon name="user" size={16} color={MRColors.cyanBright} />
            </Pressable>

            {/* Exit Door */}
            <Pressable onPress={() => setShowExitModal(true)} style={styles.exitBtn}>
              <MRIcon name="log-out" size={16} color={MRColors.dangerRose} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO SECTION (Dominant 2.5D Arcade CTA) */}
          <GlassCard glowing style={styles.heroCard}>
            <View style={styles.arcadeBadge}>
              <Text style={styles.arcadeBadgeText}>CYBER BRAIN ARCADE</Text>
            </View>

            <View style={styles.heroHeader}>
              <Text style={styles.heroTitleMain}>MEMORY</Text>
              <Text style={styles.heroTitleAccent}>RUSH</Text>
            </View>

            <Text style={styles.heroSubtitle}>
              REMEMBER FASTER. THINK QUICKER. BEAT YOUR BEST.
            </Text>

            <View style={styles.playCtaWrapper}>
              <PrimaryButton
                title="PLAY NOW →"
                size="lg"
                variant="cyan"
                onPress={onStartGame}
              />
            </View>
          </GlassCard>

          {/* QUICK STATS (3 Compact Arcade Meter Cards) */}
          <View style={styles.quickStatsRow}>
            <GlassCard style={styles.statCard}>
              <MRIcon name="star" size={14} color={MRColors.cyanBright} />
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={styles.statValueCyan}>{playerStats.bestScore.toLocaleString()}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <MRIcon name="zap" size={14} color={MRColors.yellowStatus} />
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <Text style={styles.statValueWhite}>×{playerStats.bestStreak}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <MRIcon name="target" size={14} color={MRColors.successGreen} />
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={styles.statValueYellow}>{playerStats.accuracy}%</Text>
            </GlassCard>
          </View>

          {/* DAILY CHALLENGE CARD */}
          <GlassCard style={styles.dailyCard}>
            <View style={styles.dailyContent}>
              <View style={styles.dailyLeft}>
                <View style={styles.dailyTag}>
                  <MRIcon name="star" size={11} color={MRColors.yellowStatus} />
                  <Text style={styles.dailyTagText}>DAILY MISSION</Text>
                </View>
                <Text style={styles.dailyRoundsText}>10 ROUNDS • NO MISTAKES</Text>
                <Text style={styles.dailyXpText}>+500 XP REWARD</Text>
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
    fontSize: 10,
    color: MRColors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1.5,
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
    borderWidth: 1.2,
    borderColor: 'rgba(250, 204, 21, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  streakVal: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MRColors.surfaceElevated,
    borderWidth: 1.2,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(251, 113, 133, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    marginTop: 6,
    padding: 20,
  },
  arcadeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  arcadeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 2,
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
    textShadowColor: MRColors.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 11,
    color: MRColors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
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
    gap: 4,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
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
    padding: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    marginBottom: 6,
  },
  dailyTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  dailyRoundsText: {
    fontSize: 13,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 0.5,
  },
  dailyXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: MRColors.cyanBright,
    marginTop: 2,
  },
  dailyPlayBtn: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderWidth: 1.2,
    borderColor: MRColors.primaryCyan,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
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
