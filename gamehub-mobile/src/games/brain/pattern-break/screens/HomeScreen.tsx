// ============================================================
// PATTERN BREAKER — 03 Home Screen
// Main hub: Profile card, Settings, Mascot, PLAY NOW CTA & Stats
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { Mascot } from '../components/mascot/Mascot';
import { RobotCompanion } from '../components/mascot/RobotCompanion';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { IconButton } from '../components/buttons/IconButton';
import { GlassCard } from '../components/cards/GlassCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const HomeScreen: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    bestScore,
    bestStreak,
    playerLevel,
  } = usePatternBreakStore();

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        {/* ============================================================ */}
        {/* TOP BAR: Profile Mini Card & Settings                        */}
        {/* ============================================================ */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.profileMiniCard}
            onPress={() => setScreen('profile')}
            accessibilityLabel="Open Profile"
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧭</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>SCOUT</Text>
              <Text style={styles.levelBadge}>LVL {playerLevel}</Text>
            </View>
          </Pressable>

          <IconButton
            name="settings-outline"
            size={42}
            iconSize={20}
            color={PBColors.accent}
            onPress={() => setScreen('settings')}
            accessibilityLabel="Open Settings"
          />
        </View>

        {/* ============================================================ */}
        {/* CENTER CONTENT: Mascot, Title & Primary CTA                  */}
        {/* ============================================================ */}
        <View style={styles.centerSection}>
          {/* Mascot Duo */}
          <View style={styles.mascotArea}>
            <View style={styles.floatingBot}>
              <RobotCompanion size={44} mood="happy" />
            </View>
            <Mascot pose="confident" size={145} />
          </View>

          {/* Title & Tagline */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleTop}>PATTERN</Text>
            <Text style={styles.titleBottom}>BREAKER</Text>
            <Text style={styles.subtitle}>Train your eyes. Sharpen your mind.</Text>
          </View>

          {/* Single Dominant Action: PLAY NOW */}
          <View style={styles.playNowRow}>
            <PrimaryButton
              title="PLAY NOW"
              variant="cyan"
              size="lg"
              icon="▶"
              onPress={() => setScreen('play_mode')}
              style={styles.playBtn}
            />
          </View>

          {/* Player Stats Mini Panel */}
          <GlassCard variant="cyan" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>BEST SCORE</Text>
                <Text style={styles.statValue}>{bestScore}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>MAX STREAK</Text>
                <Text style={[styles.statValue, { color: PBColors.accent }]}>
                  🔥 {bestStreak}
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* ============================================================ */}
        {/* BOTTOM NAVIGATION                                            */}
        {/* ============================================================ */}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 47, 57, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: PBRadius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.3)',
    gap: 8,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 14,
  },
  profileInfo: {
    paddingRight: 4,
  },
  profileName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  levelBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: PBColors.accent,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  mascotArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBot: {
    position: 'absolute',
    top: -10,
    right: -24,
  },
  titleWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  titleTop: {
    ...PBTypography.heroTitle,
    fontSize: 32,
    lineHeight: 34,
    color: '#FFFFFF',
  },
  titleBottom: {
    ...PBTypography.heroTitle,
    fontSize: 32,
    lineHeight: 34,
    color: PBColors.primary,
    ...PBShadows.cyanGlow,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: PBColors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  playNowRow: {
    width: '100%',
    marginVertical: 4,
  },
  playBtn: {
    width: '100%',
  },
  statsCard: {
    width: '100%',
    padding: 0,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1.2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
