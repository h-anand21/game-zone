// ============================================================
// Number Rush — Screen 03: MODE SELECTION (Gateway from PLAY NOW)
// Displays all game modes and directly launches selected mode's gameplay
// Flow: HOME -> [PLAY NOW] -> MODE SELECTION -> Select Mode -> Gameplay
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, BottomNavBar } from '../components';
import { MODE_CONFIGS } from '../data';
import type { Difficulty, GameModeId } from '../types';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ModeHubScreen: React.FC = () => {
  const {
    setScreen,
    setSelectedMode,
    selectedMode,
    difficulty,
    setDifficulty,
    startCountdown,
    stats,
  } = useNumberRushStore();

  // Selecting a mode opens that specific game directly via startCountdown
  const handleLaunchMode = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    startCountdown(modeId, difficulty);
  };

  const playableModes = [
    {
      ...MODE_CONFIGS['quick-rush'],
      displayName: 'Quick Rush (Number Rush)',
      accentColor: '#00E5FF',
      bgGradient: '#0D2B54',
      badge: '⚡ SPEED SPRINT',
      sub: 'Rapid mental arithmetic and speed calculations',
      bestScore: stats.bestScore > 0 ? stats.bestScore : 756,
    },
    {
      ...MODE_CONFIGS['animal-count'],
      displayName: 'Animal Count',
      accentColor: '#FF9100',
      bgGradient: '#4A1F0D',
      badge: '🦁 OBSERVE & SPOT',
      sub: 'Find & count wild animals in jungle landscapes',
      bestScore: stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.85) : 631,
    },
    {
      ...MODE_CONFIGS['emoji-count'],
      displayName: 'Emoji Count (Find Different)',
      accentColor: '#E040FB',
      bgGradient: '#3D0D54',
      badge: '😎 FOCUS & ATTENTION',
      sub: 'Scan dynamic grids to spot and count target emojis',
      bestScore: stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.72) : 518,
    },
    {
      ...MODE_CONFIGS['number-box'],
      displayName: 'Number Puzzle (Logic Box)',
      accentColor: '#00E676',
      bgGradient: '#0D4A2B',
      badge: '🧩 LOGIC MATRIX',
      sub: 'Decode 3x3 pattern matrices to find the missing tile',
      bestScore: stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.9) : 694,
    },
    {
      ...MODE_CONFIGS['mixed-rush'],
      displayName: 'Mixed Rush (Grand Gauntlet)',
      accentColor: '#FFD700',
      bgGradient: '#4A3B0D',
      badge: '🔥 ALL CHALLENGES',
      sub: 'Rounds shift unpredictably between math, spotting, and logic',
      bestScore: stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.95) : 812,
    },
  ];

  const difficulties: { id: Difficulty; label: string; icon: string; color: string }[] = [
    { id: 'easy', label: 'EASY', icon: '🌱', color: '#2ED573' },
    { id: 'medium', label: 'MEDIUM', icon: '⚡', color: '#FFA502' },
    { id: 'hard', label: 'HARD', icon: '🔥', color: '#FF4757' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Header HUD with Back Button */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="MODE SELECTION" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Title */}
        <View style={styles.hubBanner}>
          <Text style={styles.hubSub}>CHOOSE YOUR DISCIPLINE</Text>
          <Text style={styles.hubTitle}>SELECT A GAME MODE</Text>
          <Text style={styles.hubDesc}>
            Tap any mode below to start playing that challenge directly!
          </Text>
        </View>

        {/* Difficulty Selector Bar */}
        <View style={styles.diffSection}>
          <Text style={styles.diffLabel}>SELECT DIFFICULTY:</Text>
          <View style={styles.diffRow}>
            {difficulties.map((diff) => {
              const isSelected = difficulty === diff.id;
              return (
                <Pressable
                  key={diff.id}
                  onPress={() => setDifficulty(diff.id)}
                  style={({ pressed }) => [
                    styles.diffBtn,
                    isSelected && {
                      backgroundColor: diff.color,
                      borderColor: '#FFFFFF',
                    },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Text style={styles.diffIcon}>{diff.icon}</Text>
                  <Text
                    style={[
                      styles.diffText,
                      isSelected && { color: '#04160D', fontWeight: '900' },
                    ]}
                  >
                    {diff.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* All Available Game Modes List */}
        <View style={styles.modesList}>
          {playableModes.map((mode) => {
            const isCurrent = selectedMode === mode.id;

            return (
              <Pressable
                key={mode.id}
                onPress={() => handleLaunchMode(mode.id as GameModeId)}
                style={({ pressed }) => [
                  styles.modeCard,
                  { borderColor: mode.accentColor },
                  pressed && styles.cardPressed,
                ]}
              >
                {/* Left 3D Icon Box */}
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: mode.bgGradient,
                      borderColor: mode.accentColor,
                    },
                  ]}
                >
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                </View>

                {/* Center Information */}
                <View style={styles.modeInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.modeBadge, { color: mode.accentColor }]}>
                      {mode.badge}
                    </Text>
                    {isCurrent && (
                      <View style={styles.lastPlayedPill}>
                        <Text style={styles.lastPlayedText}>CURRENT</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.modeTitle}>{mode.displayName}</Text>
                  <Text style={styles.modeSub} numberOfLines={2}>
                    {mode.sub}
                  </Text>

                  <View style={styles.modeScoreRow}>
                    <Text style={styles.scoreCrown}>👑</Text>
                    <Text style={styles.scoreText}>
                      Best Score: {mode.bestScore.toLocaleString()} PTS
                    </Text>
                  </View>
                </View>

                {/* Right Direct Launch Play Button */}
                <Pressable
                  onPress={() => handleLaunchMode(mode.id as GameModeId)}
                  style={[
                    styles.launchBtn,
                    { backgroundColor: mode.accentColor },
                  ]}
                >
                  <Text style={styles.launchText}>PLAY</Text>
                  <Text style={styles.launchArrow}>▶</Text>
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        {/* Back to Home Button */}
        <Pressable
          onPress={() => setScreen('home')}
          style={({ pressed }) => [
            styles.backHomeBtn,
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.backHomeText}>← BACK TO HOME</Text>
        </Pressable>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Global Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.72)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  // Banner
  hubBanner: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  hubSub: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  hubTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  hubDesc: {
    color: '#A0B2C6',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  // Difficulty Selector Bar
  diffSection: {
    backgroundColor: 'rgba(11, 23, 44, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E3A6E',
    padding: 10,
    marginBottom: 16,
  },
  diffLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 33, 64, 0.9)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#244983',
    paddingVertical: 8,
  },
  diffIcon: {
    fontSize: 13,
  },
  diffText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Modes List
  modesList: {
    gap: 12,
    marginBottom: 20,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 28, 48, 0.95)',
    borderRadius: 20,
    borderWidth: 2,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modeIcon: {
    fontSize: 30,
  },
  modeInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  modeBadge: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  lastPlayedPill: {
    backgroundColor: 'rgba(46, 213, 115, 0.25)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2ED573',
  },
  lastPlayedText: {
    color: '#2ED573',
    fontSize: 7,
    fontWeight: '900',
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  modeSub: {
    color: '#A0B2C6',
    fontSize: 9,
    lineHeight: 13,
    marginBottom: 6,
  },
  modeScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreCrown: {
    fontSize: 10,
  },
  scoreText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '800',
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  launchText: {
    color: '#04160D',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  launchArrow: {
    color: '#04160D',
    fontSize: 11,
    fontWeight: '900',
  },

  // Back to Home Button
  backHomeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
