// ============================================================
// DON'T TAP WRONG — Screen 02: Home Screen
// Header, Career Stats, 3x3 Hero Showcase, and Launch Actions
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { DtwColors } from '../theme/colors';
import { DtwAudio } from '../audio/audioManager';
import type { UserProfile, GameModeId } from '../types';

interface HomeScreenProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayMode: (mode: GameModeId) => void;
  onOpenModeSelect: () => void;
  onOpenDailyChallenge: () => void;
  onOpenHowToPlay: () => void;
  onOpenPractice: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onExitToHub: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onPlayMode,
  onOpenModeSelect,
  onOpenDailyChallenge,
  onOpenHowToPlay,
  onOpenPractice,
  onOpenStats,
  onOpenSettings,
  onExitToHub,
}) => {
  const { width } = useWindowDimensions();

  // Idle animation for the 3x3 hero preview (cycles the safe green position)
  const [safeIndex, setSafeIndex] = useState(4); // Start at center

  useEffect(() => {
    const timer = setInterval(() => {
      setSafeIndex((prev) => (prev + 3) % 9);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Pressable onPress={onOpenSettings} style={styles.headerBtn}>
            <Text style={styles.headerBtnIcon}>⚙️</Text>
          </Pressable>

          <Pressable onPress={onExitToHub} style={styles.hubBtn}>
            <Text style={styles.hubBtnText}>✕ HUB</Text>
          </Pressable>

          <Pressable onPress={onToggleSound} style={styles.headerBtn}>
            <Text style={styles.headerBtnIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Area */}
          <View style={styles.titleArea}>
            <Text style={styles.subtitlePrefix}>REFLEX • RECOGNITION • SURVIVAL</Text>
            <Text style={styles.mainTitle}>DON'T TAP</Text>
            <Text style={styles.dangerTitle}>WRONG</Text>
          </View>

          {/* Quick Stats Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={[styles.statValue, { color: DtwColors.safeGreen }]}>
                {profile.classicHighScore}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <Text style={[styles.statValue, { color: DtwColors.streakGold }]}>
                {profile.bestStreak}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL PLAYS</Text>
              <Text style={styles.statValue}>{profile.totalRuns}</Text>
            </View>
          </View>

          {/* 3x3 Stylized Hero Showcase */}
          <View style={styles.heroGridContainer}>
            <View style={styles.heroGrid}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                const isSafe = idx === safeIndex;
                const isDanger = idx === (safeIndex + 2) % 9 || idx === (safeIndex + 5) % 9;

                return (
                  <View
                    key={idx}
                    style={[
                      styles.heroTile,
                      isSafe && styles.heroSafeTile,
                      isDanger && styles.heroDangerTile,
                    ]}
                  >
                    {isSafe && (
                      <View style={styles.heroTileInner}>
                        <Text style={styles.heroSafeSymbol}>✓</Text>
                        <Text style={styles.heroSafeLabel}>SAFE</Text>
                      </View>
                    )}
                    {isDanger && (
                      <View style={styles.heroTileInner}>
                        <Text style={styles.heroDangerSymbol}>✕</Text>
                        <Text style={styles.heroDangerLabel}>DANGER</Text>
                      </View>
                    )}
                    {!isSafe && !isDanger && <View style={styles.heroEmptyDot} />}
                  </View>
                );
              })}
            </View>
            <Text style={styles.heroCaption}>TAP GREEN • AVOID RED • 20s ARENA</Text>
          </View>

          {/* Primary Action — PLAY NOW */}
          <View style={styles.primaryActionContainer}>
            <ArcadeButton
              title="PLAY CLASSIC (20s)"
              variant="green"
              size="large"
              icon="⚡"
              onPress={() => onPlayMode('classic')}
              style={styles.mainPlayBtn}
            />
          </View>

          {/* Secondary Actions Grid */}
          <View style={styles.secondaryGrid}>
            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
              onPress={onOpenModeSelect}
            >
              <Text style={styles.cardIcon}>🎮</Text>
              <Text style={styles.cardTitle}>MODE SELECT</Text>
              <Text style={styles.cardDesc}>Rush, Survival & Daily</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, styles.dailyCard, pressed && styles.cardPressed]}
              onPress={onOpenDailyChallenge}
            >
              <Text style={styles.cardIcon}>🌟</Text>
              <Text style={[styles.cardTitle, { color: DtwColors.streakGold }]}>DAILY SEED</Text>
              <Text style={styles.cardDesc}>Equal Board Benchmark</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
              onPress={onOpenHowToPlay}
            >
              <Text style={styles.cardIcon}>📖</Text>
              <Text style={styles.cardTitle}>HOW TO PLAY</Text>
              <Text style={styles.cardDesc}>Visual Step-by-Step</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && styles.cardPressed]}
              onPress={onOpenPractice}
            >
              <Text style={styles.cardIcon}>🎯</Text>
              <Text style={[styles.cardTitle, { color: DtwColors.cyanAccent }]}>PRACTICE</Text>
              <Text style={styles.cardDesc}>Zero-Pressure Demo</Text>
            </Pressable>
          </View>

          {/* Career Stats Utility */}
          <View style={styles.bottomRow}>
            <ArcadeButton
              title="CAREER STATISTICS"
              variant="glass"
              size="compact"
              icon="📊"
              onPress={onOpenStats}
              style={styles.statsBtn}
            />
          </View>
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnIcon: {
    fontSize: 18,
  },
  hubBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 82, 93, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 93, 0.3)',
  },
  hubBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.dangerRed,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  titleArea: {
    alignItems: 'center',
    marginVertical: 10,
  },
  subtitlePrefix: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: DtwColors.cyanAccent,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 3,
  },
  dangerTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: DtwColors.dangerRed,
    letterSpacing: 4,
    marginTop: -8,
    textShadowColor: DtwColors.dangerRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  statsStrip: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(21, 28, 37, 0.85)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroGridContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  heroGrid: {
    width: 190,
    height: 190,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 19, 26, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(66, 217, 255, 0.35)',
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  heroTile: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSafeTile: {
    backgroundColor: '#162D0B',
    borderColor: DtwColors.safeGreen,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  heroDangerTile: {
    backgroundColor: '#300F13',
    borderColor: DtwColors.dangerRed,
    shadowColor: DtwColors.dangerRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTileInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSafeSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: DtwColors.safeGreen,
  },
  heroSafeLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    letterSpacing: 1,
    marginTop: -2,
  },
  heroDangerSymbol: {
    fontSize: 16,
    fontWeight: '900',
    color: DtwColors.dangerRed,
  },
  heroDangerLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: DtwColors.dangerRed,
    letterSpacing: 1,
    marginTop: -2,
  },
  heroEmptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroCaption: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
    marginTop: 8,
  },
  primaryActionContainer: {
    width: '100%',
    marginVertical: 12,
  },
  mainPlayBtn: {
    width: '100%',
  },
  secondaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  gridCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(21, 28, 37, 0.75)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dailyCard: {
    borderColor: 'rgba(255, 214, 90, 0.3)',
    backgroundColor: 'rgba(255, 214, 90, 0.08)',
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 10,
    color: DtwColors.textMuted,
  },
  bottomRow: {
    width: '100%',
    marginTop: 14,
    alignItems: 'center',
  },
  statsBtn: {
    width: '100%',
  },
});

export default HomeScreen;
