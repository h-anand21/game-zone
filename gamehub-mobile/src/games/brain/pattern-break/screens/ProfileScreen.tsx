// ============================================================
// PATTERN BREAKER — 18 Profile & Analytics Screen
// Visual analytics: Strongest Pattern, Weakest Pattern, High Scores & Metrics
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { Mascot } from '../components/mascot/Mascot';
import { GlassCard } from '../components/cards/GlassCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBTypography, PBRadius, PBShadows, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const ProfileScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    bestScore,
    bestStreak,
    playerLevel,
    playerXP,
    goBack,
  } = usePatternBreakStore();

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 3D Sculpted Screen Name Badge */}
          <ScreenPlaque type="profile_stats" height={105} />

          {/* Hero Profile Identification Card */}
          <GlassCard variant="cyan" style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Mascot pose="proud" size={90} />
              <View style={styles.profileDetails}>
                <View style={styles.rankPill}>
                  <Text style={styles.rankPillText}>CHIEF COGNITIVE SCOUT</Text>
                </View>
                <Text style={styles.userName}>AGENT PATTERN</Text>
                <Text style={styles.levelText}>
                  LEVEL {playerLevel} • {playerXP} XP
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Core Analytics Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>GAMES PLAYED</Text>
              <Text style={styles.statVal}>84</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={[styles.statVal, { color: PBColors.primary }]}>{bestScore}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <View style={styles.streakValueRow}>
                <Ionicons name="flame" size={16} color={PBColors.accent} style={{ marginRight: 3 }} />
                <Text style={[styles.statVal, { color: PBColors.accent }]}>{bestStreak}</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AVG REACTION</Text>
              <Text style={[styles.statVal, { color: PBColors.positive }]}>1.2s</Text>
            </View>
          </View>

          {/* Diagnostic Strength Cards */}
          <View style={styles.analysisRow}>
            <GlassCard variant="cyan" style={styles.analysisCard}>
              <Text style={styles.analysisHeader}>STRONGEST PATTERN</Text>
              <View style={styles.patternAssetBox}>
                <Image source={uiAssets.pattern.color} style={styles.patternAssetImg} resizeMode="contain" />
              </View>
              <Text style={styles.analysisAccuracy}>95% ACCURACY</Text>
            </GlassCard>

            <GlassCard variant="amber" style={styles.analysisCard}>
              <Text style={styles.analysisHeader}>TRAINING NEEDED</Text>
              <View style={styles.patternAssetBox}>
                <Image source={uiAssets.pattern.direction} style={styles.patternAssetImg} resizeMode="contain" />
              </View>
              <Text style={styles.analysisAccuracy}>35% ACCURACY</Text>
            </GlassCard>
          </View>

          {/* Achievements Shortcut Link */}
          <Pressable
            style={styles.achievementsShortcut}
            onPress={() => setScreen('achievements')}
          >
            <View style={styles.shortcutLeft}>
              <Image source={uiAssets.icons.trophy} style={styles.trophyIcon} resizeMode="contain" />
              <Text style={styles.shortcutTitle}>VIEW ALL ACHIEVEMENTS</Text>
            </View>
            <Text style={styles.shortcutArrow}>➔</Text>
          </Pressable>

          <View style={{ height: 20 }} />
        </ScrollView>

        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  profileCard: {
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  rankPill: {
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: PBColors.primary,
  },
  rankPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.primary,
    letterSpacing: 0.8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    color: PBColors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48.5%',
    backgroundColor: 'rgba(24, 47, 57, 0.88)',
    borderRadius: PBRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.18)',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 10,
  },
  analysisCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    gap: 4,
  },
  analysisHeader: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
  },
  patternAssetBox: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  patternAssetImg: {
    width: 100,
    height: 36,
  },
  analysisAccuracy: {
    fontSize: 9,
    fontWeight: '800',
    color: PBColors.textSecondary,
  },
  trophyIcon: {
    width: 22,
    height: 22,
  },
  achievementsShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 47, 57, 0.95)',
    padding: 16,
    borderRadius: PBRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 213, 74, 0.4)',
    marginTop: 4,
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophyEmoji: {
    fontSize: 20,
  },
  shortcutTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1,
  },
  shortcutArrow: {
    fontSize: 16,
    color: PBColors.accent,
    fontWeight: '900',
  },
});
