// ============================================================
// Number Rush — Screen 02: HOME SCREEN
// Reconstructed Native UI matching Reference Art (media_1790837111481.jpg)
// Features Leaping Boy Playing with 3D Numbers + PLAY NOW Gateway Flow
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
import {
  HeaderHUD,
  HeroBoyPlayingNumbers,
  BottomNavBar,
} from '../components';
import { MODE_CONFIGS } from '../data';
import type { GameModeId } from '../types';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const HomeScreen: React.FC = () => {
  const { stats, setScreen, setSelectedMode, difficulty, startCountdown } =
    useNumberRushStore();

  // PLAY NOW strictly acts as the gateway to Mode Selection screen
  const handlePlayNow = () => {
    setScreen('mode-hub');
  };

  // Direct launch from featured cards
  const handleDirectLaunch = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    startCountdown(modeId, difficulty);
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Deep Arcade Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Hero Section: Boy Playing with 3D Floating Numbers & 3D Title */}
        <HeroBoyPlayingNumbers />

        {/* 4. Your Best Score Pill Card */}
        <Pressable
          onPress={() => setScreen('leaderboard')}
          style={({ pressed }) => [
            styles.bestScorePill,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.bestScoreLeft}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <View>
              <Text style={styles.bestScoreLabel}>YOUR BEST SCORE</Text>
              <Text style={styles.bestScoreVal}>
                {stats.bestScore > 0 ? stats.bestScore.toLocaleString() : '842'}
              </Text>
            </View>
          </View>
          <Text style={styles.bestScoreArrow}>❯</Text>
        </Pressable>

        {/* 5. Primary Action Row: [DAILY RUSH] | [▶ PLAY NOW] | [LEADERBOARD] */}
        <View style={styles.actionRow}>
          {/* Daily Rush Button */}
          <Pressable
            onPress={() => setScreen('daily-rush')}
            style={({ pressed }) => [
              styles.secondaryActionBtn,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionBtnText}>DAILY RUSH</Text>
          </Pressable>

          {/* Massive 3D Golden PLAY NOW Capsule CTA */}
          <Pressable
            onPress={handlePlayNow}
            style={({ pressed }) => [
              styles.playNowWrapper,
              pressed && styles.playNowPressed,
            ]}
          >
            <View style={styles.playNowBevel}>
              <View style={styles.playNowHighlight} />
              <View style={styles.playNowContent}>
                <View style={styles.playTriangle}>
                  <Text style={styles.playTriangleText}>▶</Text>
                </View>
                <Text style={styles.playNowText}>PLAY NOW</Text>
              </View>
            </View>
          </Pressable>

          {/* Leaderboard Button */}
          <Pressable
            onPress={() => setScreen('leaderboard')}
            style={({ pressed }) => [
              styles.secondaryActionBtn,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionBtnText}>LEADERBOARD</Text>
          </Pressable>
        </View>

        {/* 6. GAME MODES Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>GAME MODES</Text>
          <Pressable onPress={() => setScreen('mode-hub')} style={styles.viewAllRow}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllArrow}>➔</Text>
          </Pressable>
        </View>

        {/* 4 Featured Cards Grid matching reference art */}
        <View style={styles.featuredGrid}>
          {/* Card 1: QUICK RUSH (Blue) */}
          <Pressable
            onPress={() => handleDirectLaunch('quick-rush')}
            style={({ pressed }) => [
              styles.featuredCard,
              styles.quickRushCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.cardArtBox, { backgroundColor: '#133E7C' }]}>
              <Text style={styles.cardBigIcon}>⚡</Text>
              <View style={styles.blocksMiniRow}>
                <Text style={styles.miniBlock}>1</Text>
                <Text style={styles.miniBlock}>2</Text>
                <Text style={styles.miniBlock}>3</Text>
              </View>
            </View>
            <Text style={styles.featuredTitle}>QUICK RUSH</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              Solve fast math challenges
            </Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.bestBadge}>👑 Best: {stats.bestScore > 0 ? stats.bestScore : 756}</Text>
              <Text style={styles.featuredChevron}>❯</Text>
            </View>
          </Pressable>

          {/* Card 2: ANIMAL COUNT (Coral/Orange) */}
          <Pressable
            onPress={() => handleDirectLaunch('animal-count')}
            style={({ pressed }) => [
              styles.featuredCard,
              styles.animalCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.cardArtBox, { backgroundColor: '#7C3413' }]}>
              <Text style={styles.cardBigIcon}>🐯</Text>
              <View style={styles.blocksMiniRow}>
                <Text style={styles.miniAnimal}>🐘</Text>
                <Text style={styles.miniAnimal}>🐼</Text>
              </View>
            </View>
            <Text style={styles.featuredTitle}>ANIMAL COUNT</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              Count objects in fun scenes
            </Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.bestBadge}>
                👑 Best: {stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.85) : 631}
              </Text>
              <Text style={styles.featuredChevron}>❯</Text>
            </View>
          </Pressable>

          {/* Card 3: EMOJI COUNT (Purple/Magenta) */}
          <Pressable
            onPress={() => handleDirectLaunch('emoji-count')}
            style={({ pressed }) => [
              styles.featuredCard,
              styles.emojiCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.cardArtBox, { backgroundColor: '#571675' }]}>
              <Text style={styles.cardBigIcon}>😎</Text>
              <View style={styles.blocksMiniRow}>
                <Text style={styles.miniEmoji}>😍</Text>
                <Text style={styles.miniEmoji}>🔥</Text>
              </View>
            </View>
            <Text style={styles.featuredTitle}>EMOJI COUNT</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              Find and count emojis
            </Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.bestBadge}>
                👑 Best: {stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.72) : 518}
              </Text>
              <Text style={styles.featuredChevron}>❯</Text>
            </View>
          </Pressable>

          {/* Card 4: NUMBER PUZZLE / NUMBER BOX (Emerald Green) */}
          <Pressable
            onPress={() => handleDirectLaunch('number-box')}
            style={({ pressed }) => [
              styles.featuredCard,
              styles.puzzleCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.cardArtBox, { backgroundColor: '#135C3A' }]}>
              <Text style={styles.cardBigIcon}>🧩</Text>
              <View style={styles.matrixMiniGrid}>
                <Text style={styles.miniGridCell}>4</Text>
                <Text style={styles.miniGridCell}>?</Text>
                <Text style={styles.miniGridCell}>9</Text>
              </View>
            </View>
            <Text style={styles.featuredTitle}>NUMBER PUZZLE</Text>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              Solve number logic puzzles
            </Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.bestBadge}>
                👑 Best: {stats.bestScore > 0 ? Math.floor(stats.bestScore * 0.9) : 694}
              </Text>
              <Text style={styles.featuredChevron}>❯</Text>
            </View>
          </Pressable>
        </View>

        {/* 4 Mini Mode Chips */}
        <View style={styles.chipsRow}>
          <Pressable
            onPress={() => handleDirectLaunch('quick-rush')}
            style={({ pressed }) => [styles.modeChip, pressed && styles.cardPressed]}
          >
            <Text style={styles.chipIcon}>🧠</Text>
            <Text style={styles.chipText}>MEMORY RUSH</Text>
            <Text style={styles.chipArrow}>❯</Text>
          </Pressable>

          <Pressable
            onPress={() => handleDirectLaunch('mixed-rush')}
            style={({ pressed }) => [styles.modeChip, pressed && styles.cardPressed]}
          >
            <Text style={styles.chipIcon}>🔗</Text>
            <Text style={styles.chipText}>NUMBER CHAIN</Text>
            <Text style={styles.chipArrow}>❯</Text>
          </Pressable>
        </View>

        <View style={styles.chipsRow}>
          <Pressable
            onPress={() => handleDirectLaunch('animal-count')}
            style={({ pressed }) => [styles.modeChip, pressed && styles.cardPressed]}
          >
            <Text style={styles.chipIcon}>🌍</Text>
            <Text style={styles.chipText}>WORLD COUNT</Text>
            <Text style={styles.chipArrow}>❯</Text>
          </Pressable>

          <Pressable
            onPress={() => setScreen('mode-hub')}
            style={({ pressed }) => [styles.modeChip, pressed && styles.cardPressed]}
          >
            <Text style={styles.chipIcon}>🔲</Text>
            <Text style={styles.chipText}>MORE MODES</Text>
            <Text style={styles.chipArrow}>❯</Text>
          </Pressable>
        </View>

        {/* 7. DAILY RUSH Showcase Banner */}
        <Pressable
          onPress={() => setScreen('daily-rush')}
          style={({ pressed }) => [
            styles.dailyRushBanner,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.calendarBadge}>
            <Text style={styles.calendarHeader}>TODAY</Text>
            <Text style={styles.calendarStar}>⭐</Text>
          </View>

          <View style={styles.dailyRushInfo}>
            <Text style={styles.dailyRushTitle}>DAILY RUSH ✨</Text>
            <Text style={styles.dailyRushSub}>5 Mixed Challenges</Text>
            <Text style={styles.dailyRushDesc}>Play Daily & Earn Rewards</Text>
          </View>

          <Pressable
            onPress={() => setScreen('daily-rush')}
            style={styles.playTodayBtn}
          >
            <Text style={styles.playTodayText}>PLAY TODAY ➔</Text>
          </Pressable>
        </Pressable>

        {/* 8. YOUR PROGRESS Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>
          <Pressable onPress={() => setScreen('profile')} style={styles.viewAllRow}>
            <Text style={styles.viewAllText}>View Stats</Text>
            <Text style={styles.viewAllArrow}>➔</Text>
          </Pressable>
        </View>

        {/* 4 Stat Cards Row */}
        <View style={styles.progressRow}>
          {/* Stat 1 */}
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>🏆</Text>
            <Text style={styles.progressLabel}>Games Played</Text>
            <Text style={styles.progressVal}>
              {stats.gamesPlayed > 0 ? stats.gamesPlayed : 126}
            </Text>
          </View>

          {/* Stat 2 */}
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>🎯</Text>
            <Text style={styles.progressLabel}>Best Score</Text>
            <Text style={styles.progressVal}>
              {stats.bestScore > 0 ? stats.bestScore : 842}
            </Text>
          </View>

          {/* Stat 3 */}
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>🔥</Text>
            <Text style={styles.progressLabel}>Best Combo</Text>
            <Text style={styles.progressVal}>
              x{stats.maxCombo > 0 ? stats.maxCombo : 19}
            </Text>
          </View>

          {/* Stat 4 */}
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>📊</Text>
            <Text style={styles.progressLabel}>Accuracy</Text>
            <Text style={styles.progressVal}>
              {stats.accuracy > 0 ? `${stats.accuracy}%` : '87%'}
            </Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Global Bottom Navigation Bar */}
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
    paddingTop: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  // Best Score Pill
  bestScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(11, 23, 44, 0.92)',
    borderWidth: 1.5,
    borderColor: '#1E3A6E',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  bestScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyIcon: {
    fontSize: 28,
  },
  bestScoreLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bestScoreVal: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bestScoreArrow: {
    color: '#8CA0BA',
    fontSize: 16,
    fontWeight: '900',
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 64, 0.95)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#244983',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  // Massive 3D Golden PLAY NOW Capsule CTA
  playNowWrapper: {
    flex: 2,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C67A00',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 8,
  },
  playNowPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#9A5F00',
  },
  playNowBevel: {
    flex: 1,
    backgroundColor: '#FFBE0B',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF3A8',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  playNowHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 10,
  },
  playNowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playTriangle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2A1800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangleText: {
    color: '#FFBE0B',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 2,
  },
  playNowText: {
    color: '#2A1800',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '700',
  },
  viewAllArrow: {
    color: '#8CA0BA',
    fontSize: 12,
  },

  // Featured 4 Cards Grid
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  featuredCard: {
    width: (width - 42) / 2,
    borderRadius: 18,
    borderWidth: 2,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  quickRushCard: {
    backgroundColor: '#0F264A',
    borderColor: '#1E60B5',
  },
  animalCard: {
    backgroundColor: '#4A1D0F',
    borderColor: '#B54B1E',
  },
  emojiCard: {
    backgroundColor: '#35104A',
    borderColor: '#862AB5',
  },
  puzzleCard: {
    backgroundColor: '#0F3C28',
    borderColor: '#1EB56D',
  },
  cardArtBox: {
    height: 70,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBigIcon: {
    fontSize: 32,
  },
  blocksMiniRow: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 4,
  },
  miniBlock: {
    backgroundColor: '#00E5FF',
    color: '#002B49',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  miniAnimal: {
    fontSize: 10,
  },
  miniEmoji: {
    fontSize: 10,
  },
  matrixMiniGrid: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 3,
  },
  miniGridCell: {
    backgroundColor: '#00E676',
    color: '#003314',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 3,
    borderRadius: 2,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  featuredSubtitle: {
    color: '#A0B2C6',
    fontSize: 9,
    lineHeight: 13,
    height: 26,
    marginBottom: 6,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bestBadge: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '900',
  },
  featuredChevron: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  // Mini Chips
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 33, 64, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#244983',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  chipArrow: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
  },

  // Daily Rush Showcase Banner
  dailyRushBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 36, 26, 0.95)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2ED573',
    padding: 14,
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  calendarBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  calendarHeader: {
    color: '#E11D48',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  calendarStar: {
    fontSize: 22,
    marginTop: -2,
  },
  dailyRushInfo: {
    flex: 1,
  },
  dailyRushTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dailyRushSub: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  dailyRushDesc: {
    color: '#A0B2C6',
    fontSize: 8,
  },
  playTodayBtn: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#2ED573',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  playTodayText: {
    color: '#061D12',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Your Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  progressCard: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.92)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E3A6E',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  progressIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  progressLabel: {
    color: '#8CA0BA',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  progressVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
