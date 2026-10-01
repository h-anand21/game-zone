// ============================================================
// Number Rush — Screen 02: HOME (Neon Arcade Adventure Reference)
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
  GameButton,
  MascotIllustration,
  BottomNavBar,
  WoodPanel,
} from '../components';
import { MODE_CONFIGS } from '../data';
import type { GameModeId } from '../types';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const HomeScreen: React.FC = () => {
  const {
    stats,
    setScreen,
    selectedMode,
    setSelectedMode,
    leaderboard,
    startCountdown,
  } = useNumberRushStore();

  const handlePlayNow = () => {
    // Open the Mode Selection screen
    setScreen('mode-hub');
  };

  const handleModeSelect = (modeId: GameModeId) => {
    // Open that specific game directly
    setSelectedMode(modeId);
    startCountdown(modeId, 'medium');
  };

  const allModes = [
    MODE_CONFIGS['quick-rush'],
    MODE_CONFIGS['animal-count'],
    MODE_CONFIGS['emoji-count'],
    MODE_CONFIGS['number-box'],
    MODE_CONFIGS['mixed-rush'],
  ];

  const userRank =
    stats.bestScore > 0
      ? `#${leaderboard.filter((e) => e.score > stats.bestScore).length + 1}`
      : '#--';

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Hero Section: 3D Logo Signboard (Carved Jungle Wood) */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            {/* Corner Brass Rivets */}
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />

            <Text style={styles.logoArcade}>ARCADE BRAIN CHALLENGE</Text>
            <Text style={styles.logoTitle}>NUMBER RUSH</Text>
            <Text style={styles.logoTagline}>THINK • TAP • RUSH</Text>
          </View>

          {/* Floating Number Accents */}
          <View style={[styles.floatingBadge, styles.badgeLeft]}>
            <Text style={styles.badgeNum}>7</Text>
          </View>
          <View style={[styles.floatingBadge, styles.badgeRight]}>
            <Text style={[styles.badgeNum, { color: '#00E5FF' }]}>+</Text>
          </View>

          {/* Mascot Centerpiece */}
          <View style={styles.mascotWrapper}>
            <MascotIllustration size={175} character="runner_boy" mood="celebrate" showNumbers />
          </View>

          {/* Best Score & Streak Highlight Card (Warm Wood Panel) */}
          <WoodPanel style={styles.bestScoreCard} variant="wood" hasRivets={false}>
            <View style={styles.bestScoreRow}>
              <View style={styles.bestScoreCol}>
                <Text style={styles.bestScoreLabel}>YOUR BEST SCORE</Text>
                <Text style={styles.bestScoreVal}>
                  {stats.bestScore.toLocaleString()} PTS
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakFlame}>🔥</Text>
                <Text style={styles.streakVal}>{stats.dailyStreak}D STREAK</Text>
              </View>
            </View>
          </WoodPanel>

          {/* 4. Massive 2.5D Primary Action CTA: PLAY NOW */}
          <GameButton
            title="PLAY NOW"
            icon="▶"
            variant="green"
            size="lg"
            fullWidth
            onPress={handlePlayNow}
            style={styles.playNowBtn}
          />

          {/* 5. Secondary Quick Action Row */}
          <View style={styles.quickActionRow}>
            <Pressable
              onPress={() => setScreen('daily-rush')}
              style={({ pressed }) => [
                styles.quickCard,
                styles.dailyCardBorder,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.quickIcon}>🎁</Text>
              <View style={styles.quickInfo}>
                <Text style={styles.quickTitle}>DAILY RUSH</Text>
                <Text style={styles.quickSub}>Claim Daily Chest</Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>READY</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setScreen('leaderboard')}
              style={({ pressed }) => [
                styles.quickCard,
                styles.ranksCardBorder,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.quickIcon}>🏆</Text>
              <View style={styles.quickInfo}>
                <Text style={styles.quickTitle}>LEADERBOARD</Text>
                <Text style={styles.quickSub}>Top Champions</Text>
              </View>
              <View style={[styles.freeBadge, { backgroundColor: '#1E90FF' }]}>
                <Text style={styles.freeBadgeText}>{userRank}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* 6. Featured Game Modes Section */}
        <View style={styles.modesHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>CHOOSE YOUR RUSH</Text>
          <Pressable onPress={() => setScreen('mode-hub')} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>ALL MODES (5) →</Text>
          </Pressable>
        </View>

        <View style={styles.modesGrid}>
          {allModes.map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() => handleModeSelect(mode.id)}
              style={({ pressed }) => [
                styles.modeCard,
                { borderColor: mode.themeColor },
                selectedMode === mode.id && styles.modeCardSelected,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.modeCardHeader, { backgroundColor: mode.themeColor }]}>
                <Text style={styles.modeCardBadge}>{mode.badge}</Text>
                <Text style={styles.modeCardStar}>
                  {selectedMode === mode.id ? '✓ ACTIVE' : '⭐ PLAY'}
                </Text>
              </View>

              <View style={styles.modeCardBody}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeTagline} numberOfLines={2}>
                  {mode.tagline}
                </Text>

                <View style={styles.playNowRow}>
                  <Text style={[styles.cardPlayText, { color: mode.themeColor }]}>
                    SELECT & PLAY ▶
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Global Bottom Navigation */}
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
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    position: 'relative',
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: '#351A0D', // Rich warm wood brown
    borderWidth: 3,
    borderColor: '#7A3F1D', // Carved wood border
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    position: 'relative',
  },
  rivet: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: '#C67C00',
    zIndex: 5,
  },
  rivetTL: { top: 6, left: 6 },
  rivetTR: { top: 6, right: 6 },
  rivetBL: { bottom: 6, left: 6 },
  rivetBR: { bottom: 6, right: 6 },
  logoArcade: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  logoTitle: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2.5,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  logoTagline: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  floatingBadge: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#2E1508',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeLeft: { top: 60, left: 16 },
  badgeRight: { top: 75, right: 16, borderColor: '#00E5FF' },
  badgeNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
  },
  mascotWrapper: {
    marginVertical: 4,
  },
  bestScoreCard: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#2D1407',
    borderColor: '#6E3A1A',
    borderWidth: 2,
  },
  bestScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestScoreCol: {
    justifyContent: 'center',
  },
  bestScoreLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bestScoreVal: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 109, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF6D00',
  },
  streakFlame: {
    fontSize: 14,
    marginRight: 4,
  },
  streakVal: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '900',
  },
  selectedModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(43, 20, 8, 0.95)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  selectedModeLabel: {
    color: '#FFC107',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  selectedModeValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  selectedModeChange: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '900',
  },
  playNowBtn: {
    marginBottom: 12,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#331709',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7A3F1D',
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  dailyCardBorder: { borderColor: '#B87333' },
  ranksCardBorder: { borderColor: '#8A522A' },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  quickIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  quickInfo: {
    flex: 1,
  },
  quickTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  quickSub: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '700',
  },
  freeBadge: {
    position: 'absolute',
    top: -6,
    right: 8,
    backgroundColor: '#2ED573',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  freeBadgeText: {
    color: '#04160D',
    fontSize: 8,
    fontWeight: '900',
  },
  modesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    color: '#FFE082',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: '#2ED573',
    fontSize: 12,
    fontWeight: '900',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modeCard: {
    width: (width - 44) / 2,
    backgroundColor: '#2B1307',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6E3A1A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  modeCardSelected: {
    borderWidth: 2.5,
    borderColor: '#FFD700',
    backgroundColor: '#35180A',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeCardBadge: {
    color: '#071324',
    fontSize: 9,
    fontWeight: '900',
  },
  modeCardStar: {
    color: '#071324',
    fontSize: 8,
    fontWeight: '900',
  },
  modeCardBody: {
    padding: 12,
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 34,
    marginVertical: 4,
  },
  modeName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 2,
  },
  modeTagline: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 8,
    height: 26,
  },
  playNowRow: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  cardPlayText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
