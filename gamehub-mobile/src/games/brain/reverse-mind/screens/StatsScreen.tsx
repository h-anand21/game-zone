// ============================================================
// REVERSE MIND — Stats & Achievements Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { BottomTabBar } from '../components/BottomTabBar';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { AppNavScreen, AchievementItem } from '../types';
import { RMTheme } from '../theme';

interface StatsScreenProps {
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_step',
    title: 'First Inversion',
    desc: 'Complete your first Reverse Mind game',
    icon: '🌱',
    progress: 1,
    goal: 1,
    unlocked: true,
    rewardCoins: 50,
    rarity: 'common',
  },
  {
    id: 'combo_master',
    title: 'Combo Master',
    desc: 'Reach an 8x combo streak without errors',
    icon: '🔥',
    progress: 8,
    goal: 8,
    unlocked: true,
    rewardCoins: 100,
    rarity: 'rare',
  },
  {
    id: 'perfect_round',
    title: 'Flawless Inversion',
    desc: 'Solve 5 rounds in a row with 100% accuracy',
    icon: '⭐',
    progress: 3,
    goal: 5,
    unlocked: false,
    rewardCoins: 200,
    rarity: 'epic',
  },
  {
    id: 'speed_thinker',
    title: 'Speed Thinker',
    desc: 'Clear a Quick Flip round in under 1 second',
    icon: '⚡',
    progress: 1,
    goal: 1,
    unlocked: true,
    rewardCoins: 150,
    rarity: 'rare',
  },
  {
    id: 'mind_shift_pro',
    title: 'Mind Shift Pro',
    desc: 'Clear 10 rounds under dynamic Mind Shift rules',
    icon: '🧠',
    progress: 6,
    goal: 10,
    unlocked: false,
    rewardCoins: 300,
    rarity: 'epic',
  },
  {
    id: 'master_mind',
    title: 'Master Mind',
    desc: 'Reach Level 10 and invert 8 objects in Hard mode',
    icon: '👑',
    progress: 1,
    goal: 10,
    unlocked: false,
    rewardCoins: 500,
    rarity: 'legendary',
  },
];

export const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate, onBack }) => {
  const { playerStats } = useReverseMindStore();
  const [tab, setTab] = useState<'progress' | 'achievements'>('progress');

  const accuracy = Math.round(
    (playerStats.totalCorrect / Math.max(1, playerStats.totalCorrect + playerStats.totalWrong)) * 100
  );

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>STATS & ACHIEVEMENTS</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setTab('progress')}
            style={[styles.tabBtn, tab === 'progress' && styles.tabActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'progress' && styles.tabTextActive]}>
              COGNITIVE PROGRESS
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('achievements')}
            style={[styles.tabBtn, tab === 'achievements' && styles.tabActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'achievements' && styles.tabTextActive]}>
              ACHIEVEMENTS
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tab === 'progress' ? (
            <>
              {/* Level & XP Card */}
              <LinearGradient
                colors={['#162842', '#0E1A2C']}
                style={styles.heroCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroLvl}>LEVEL {playerStats.level}</Text>
                    <Text style={styles.heroSub}>Apprentice Mental Invertor</Text>
                  </View>
                  <Text style={styles.heroXpText}>{playerStats.xp} / 300 XP</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${(playerStats.xp / 300) * 100}%` }]} />
                </View>
              </LinearGradient>

              {/* Cognitive Metric Grid */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricVal}>{accuracy}%</Text>
                  <Text style={styles.metricLabel}>Inversion Accuracy</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricVal}>{playerStats.bestCombo}x</Text>
                  <Text style={styles.metricLabel}>Best Combo Streak</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricVal}>{playerStats.gamesPlayed}</Text>
                  <Text style={styles.metricLabel}>Games Played</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricVal}>{playerStats.classicBest}</Text>
                  <Text style={styles.metricLabel}>High Score</Text>
                </View>
              </View>

              {/* Mode High Scores */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>HIGH SCORES BY MODE</Text>

                <View style={styles.scoreRow}>
                  <Text style={styles.scoreMode}>Classic Mode</Text>
                  <Text style={styles.scoreValGold}>{playerStats.classicBest} pts</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreMode}>Quick Flip Blitz</Text>
                  <Text style={styles.scoreValCyan}>{playerStats.quickFlipBest} pts</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreMode}>Mind Shift Rules</Text>
                  <Text style={styles.scoreValOrange}>{playerStats.mindShiftBest} pts</Text>
                </View>
              </View>
            </>
          ) : (
            /* Achievements Tab */
            <View style={styles.achievementsList}>
              {ACHIEVEMENTS.map((ach) => (
                <View
                  key={ach.id}
                  style={[
                    styles.achCard,
                    ach.unlocked && styles.achUnlocked,
                  ]}
                >
                  <View style={styles.achIconBox}>
                    <Text style={styles.achIcon}>{ach.icon}</Text>
                  </View>
                  <View style={styles.achCenter}>
                    <Text style={styles.achTitle}>{ach.title}</Text>
                    <Text style={styles.achDesc}>{ach.desc}</Text>
                    {/* Progress Bar */}
                    <View style={styles.achTrack}>
                      <View
                        style={[
                          styles.achFill,
                          { width: `${Math.min(100, (ach.progress / ach.goal) * 100)}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.achReward}>
                    <Text style={styles.rewardCoins}>+{ach.rewardCoins} 🪙</Text>
                    <Text style={[styles.achStatus, ach.unlocked && styles.statusDone]}>
                      {ach.unlocked ? 'CLAIMED' : `${ach.progress}/${ach.goal}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <BottomTabBar currentScreen="stats" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
    letterSpacing: 1.2,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RMTheme.radii.full,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabActive: {
    backgroundColor: 'rgba(77, 231, 255, 0.18)',
    borderColor: RMTheme.colors.cyanNeon,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: RMTheme.colors.cyanNeon,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLvl: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 11,
    color: RMTheme.colors.cyanNeon,
    fontWeight: '600',
  },
  heroXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: RMTheme.colors.textSecondary,
  },
  xpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: RMTheme.colors.primaryGold,
    borderRadius: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 27, 43, 0.7)',
    borderRadius: RMTheme.radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  metricLabel: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionBox: {
    backgroundColor: 'rgba(16, 27, 43, 0.7)',
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  scoreMode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreValGold: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  scoreValCyan: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  scoreValOrange: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.orangeNeon,
  },
  achievementsList: {
    gap: 10,
  },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 27, 43, 0.6)',
    borderRadius: RMTheme.radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  achUnlocked: {
    borderColor: 'rgba(255, 216, 61, 0.4)',
    backgroundColor: 'rgba(22, 36, 58, 0.8)',
  },
  achIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  achIcon: {
    fontSize: 20,
  },
  achCenter: {
    flex: 1,
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  achDesc: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    marginTop: 2,
  },
  achTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 6,
    overflow: 'hidden',
  },
  achFill: {
    height: '100%',
    backgroundColor: RMTheme.colors.cyanNeon,
  },
  achReward: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  rewardCoins: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFE082',
  },
  achStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
    marginTop: 4,
  },
  statusDone: {
    color: RMTheme.colors.emeraldGreen,
  },
});
