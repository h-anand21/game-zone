// ============================================================
// DON'T TAP WRONG — Home Screen / Lobby
// Mode selection, stats, authentic styling and exit button
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions, Alert } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { NeonButton } from '../components/common/NeonButton';
import { NeonBadge } from '../components/common/NeonBadge';
import { DtwColors } from '../theme/colors';
import type { GameMode, PlayerRecord } from '../types';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  playerRecord: PlayerRecord;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onExitToHub: () => void;
}

interface ModeCardInfo {
  mode: GameMode;
  title: string;
  tagline: string;
  duration: string;
  dangerPenalty: string;
  difficulty: 'NORMAL' | 'FAST' | 'HARDCORE';
  color: string;
}

const MODES: ModeCardInfo[] = [
  {
    mode: 'CLASSIC',
    title: 'CLASSIC REFLEX',
    tagline: 'Standard 20-second precision challenge',
    duration: '20s',
    dangerPenalty: '-150 pts',
    difficulty: 'NORMAL',
    color: DtwColors.cyanAccent,
  },
  {
    mode: 'RUSH',
    title: 'NEON RUSH',
    tagline: 'High-speed frenzy with faster tile cycles',
    duration: '15s',
    dangerPenalty: '-200 pts',
    difficulty: 'FAST',
    color: DtwColors.streakGold,
  },
  {
    mode: 'SURVIVAL',
    title: 'SUDDEN DEATH',
    tagline: 'Endurance test: one wrong tap ends the run!',
    duration: '30s',
    dangerPenalty: 'INSTANT LOSS',
    difficulty: 'HARDCORE',
    color: DtwColors.dangerRed,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerRecord,
  selectedMode,
  onSelectMode,
  onStartGame,
  onOpenHowToPlay,
  onExitToHub,
}) => {
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const handleExitPress = () => {
    Alert.alert(
      'Exit to GameHub',
      'Are you sure you want to return to the main hub?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: onExitToHub },
      ]
    );
  };

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Pressable onPress={handleExitPress} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>✕ EXIT</Text>
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSub}>REFLEX MATRIX</Text>
          </View>

          <Pressable
            onPress={() => setSfxEnabled(!sfxEnabled)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>{sfxEnabled ? '🔊 SFX' : '🔇 OFF'}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Logo Plaque */}
          <View style={styles.logoPlaque}>
            <Text style={styles.logoSubtitle}>FAST PRECISION ARCADE</Text>
            <Text style={styles.logoTitleMain}>DON'T TAP</Text>
            <Text style={styles.logoTitleWrong}>WRONG</Text>
            <View style={styles.logoDivider} />
            <Text style={styles.logoRule}>GREEN = TAP  |  RED = AVOID</Text>
          </View>

          {/* Player Record Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsCardHeader}>
              <Text style={styles.statsCardTitle}>CAREER HIGHLIGHTS</Text>
              <NeonBadge
                label={`${playerRecord.totalGamesPlayed} RUNS`}
                color={DtwColors.safeGreen}
              />
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>CLASSIC BEST</Text>
                <Text style={styles.statNumber}>{playerRecord.highScoreClassic}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>RUSH BEST</Text>
                <Text style={styles.statNumber}>{playerRecord.highScoreRush}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>MAX STREAK</Text>
                <Text style={[styles.statNumber, { color: DtwColors.streakGold }]}>
                  🔥 {playerRecord.highestStreak}
                </Text>
              </View>
            </View>
          </View>

          {/* Mode Selector */}
          <Text style={styles.sectionHeading}>SELECT CHALLENGE MODE</Text>
          <View style={styles.modesContainer}>
            {MODES.map((m) => {
              const isSelected = selectedMode === m.mode;
              return (
                <Pressable
                  key={m.mode}
                  onPress={() => onSelectMode(m.mode)}
                  style={[
                    styles.modeCard,
                    isSelected && {
                      borderColor: m.color,
                      backgroundColor: 'rgba(10, 20, 32, 0.85)',
                      shadowColor: m.color,
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                      elevation: 6,
                    },
                  ]}
                >
                  <View style={styles.modeCardTop}>
                    <Text
                      style={[
                        styles.modeTitle,
                        isSelected && { color: m.color },
                      ]}
                    >
                      {m.title}
                    </Text>
                    <NeonBadge
                      label={m.difficulty}
                      color={m.color}
                      size="sm"
                    />
                  </View>
                  <Text style={styles.modeTagline}>{m.tagline}</Text>
                  <View style={styles.modeSpecsRow}>
                    <Text style={styles.modeSpecItem}>⏱ {m.duration}</Text>
                    <Text style={styles.modeSpecDivider}>•</Text>
                    <Text
                      style={[
                        styles.modeSpecItem,
                        m.mode === 'SURVIVAL' && { color: DtwColors.dangerRed },
                      ]}
                    >
                      ⚠️ {m.dangerPenalty}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Play & How to Play Buttons */}
          <View style={styles.actionButtons}>
            <NeonButton
              title="START CHALLENGE"
              onPress={onStartGame}
              color={DtwColors.safeGreen}
              size="lg"
              fullWidth
              style={styles.startButton}
            />
            <NeonButton
              title="HOW TO PLAY & RULES"
              onPress={onOpenHowToPlay}
              color={DtwColors.cyanAccent}
              variant="outline"
              size="md"
              fullWidth
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.textPrimary,
    letterSpacing: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: DtwColors.cyanAccent,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoPlaque: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 11, 16, 0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    width: '100%',
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    color: DtwColors.cyanAccent,
    marginBottom: 4,
  },
  logoTitleMain: {
    fontSize: 34,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 3,
    lineHeight: 38,
  },
  logoTitleWrong: {
    fontSize: 38,
    fontWeight: '900',
    color: DtwColors.dangerRed,
    letterSpacing: 4,
    lineHeight: 42,
    textShadowColor: DtwColors.dangerRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  logoDivider: {
    width: 100,
    height: 2,
    backgroundColor: DtwColors.safeGreen,
    marginVertical: 8,
  },
  logoRule: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: DtwColors.safeGreen,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(8, 14, 24, 0.7)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: DtwColors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  sectionHeading: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: DtwColors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  modesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  modeCard: {
    width: '100%',
    backgroundColor: 'rgba(8, 14, 24, 0.6)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  modeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: DtwColors.textPrimary,
  },
  modeTagline: {
    fontSize: 12,
    color: DtwColors.textSecondary,
    marginBottom: 8,
  },
  modeSpecsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeSpecItem: {
    fontSize: 11,
    fontWeight: '700',
    color: DtwColors.textMuted,
  },
  modeSpecDivider: {
    fontSize: 11,
    color: DtwColors.textMuted,
    marginHorizontal: 8,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    marginBottom: 10,
  },
});
