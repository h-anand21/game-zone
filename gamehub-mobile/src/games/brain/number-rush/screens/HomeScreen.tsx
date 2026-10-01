// ============================================================
// Number Rush — Main Arcade Home Dashboard
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
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

export const HomeScreen: React.FC = () => {
  const { stats, startCountdown, setScreen, setSelectedMode } = useNumberRushStore();

  const handlePlayNow = () => {
    startCountdown('animal-count', 'easy');
  };

  const handleModeSelect = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    startCountdown(modeId, 'easy');
  };

  const modesList = Object.values(MODE_CONFIGS);

  return (
    <View style={styles.container}>
      <HeaderHUD />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Title & Mascot Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoSub}>ARCADE BRAIN CHALLENGE</Text>
            <Text style={styles.logoTitle}>NUMBER RUSH</Text>
            <Text style={styles.tagline}>THINK • TAP • RUSH</Text>
          </View>

          <View style={styles.mascotWrapper}>
            <MascotIllustration size={160} mood="happy" />
          </View>

          {/* Primary Action Button */}
          <GameButton
            title="PLAY NOW"
            icon="▶"
            variant="green"
            size="lg"
            fullWidth
            onPress={handlePlayNow}
            style={styles.playNowBtn}
          />

          {/* Secondary Quick Action Row */}
          <View style={styles.quickActionRow}>
            <GameButton
              title="DAILY RUSH"
              icon="🎁"
              variant="gold"
              size="md"
              style={styles.halfBtn}
              onPress={() => setScreen('daily-rush')}
            />
            <GameButton
              title="RANKS"
              icon="🏆"
              variant="blue"
              size="md"
              style={styles.halfBtn}
              onPress={() => setScreen('leaderboard')}
            />
          </View>
        </View>

        {/* Daily Challenge Banner */}
        <Pressable
          onPress={() => setScreen('daily-rush')}
          style={styles.dailyBanner}
        >
          <View style={styles.dailyLeft}>
            <Text style={styles.dailyFlame}>🔥</Text>
            <View>
              <Text style={styles.dailyTitle}>TODAY'S SPECIAL</Text>
              <Text style={styles.dailySub}>Tiger Count Challenge</Text>
            </View>
          </View>
          <View style={styles.rewardPill}>
            <Text style={styles.rewardText}>+250 🪙</Text>
          </View>
        </Pressable>

        {/* Featured Game Modes Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>CHOOSE YOUR RUSH</Text>
          <Pressable onPress={() => setScreen('mode-hub')}>
            <Text style={styles.seeAllText}>VIEW ALL →</Text>
          </Pressable>
        </View>

        <View style={styles.modesGrid}>
          {modesList.map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() => handleModeSelect(mode.id)}
              style={({ pressed }) => [
                styles.modeCard,
                { borderColor: mode.themeColor },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.cardHeader, { backgroundColor: mode.themeColor }]}>
                <Text style={styles.cardBadge}>{mode.badge}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeTagline} numberOfLines={2}>
                  {mode.tagline}
                </Text>

                <View style={styles.cardPlayRow}>
                  <Text style={[styles.playText, { color: mode.themeColor }]}>
                    START ▶
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Player Stats Summary Panel */}
        <WoodPanel style={styles.statsPanel} variant="card" hasRivets={false}>
          <Text style={styles.statsHeader}>YOUR ARCADE RECORD</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{stats.bestScore}</Text>
              <Text style={styles.statLabel}>BEST SCORE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>x{stats.maxCombo}</Text>
              <Text style={styles.statLabel}>MAX STREAK</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>GAMES</Text>
            </View>
          </View>
        </WoodPanel>

        {/* Spacing for Bottom Nav */}
        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    alignItems: 'center',
    marginBottom: 6,
  },
  logoSub: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logoTitle: {
    color: '#FFD700',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  tagline: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  mascotWrapper: {
    marginVertical: 4,
  },
  playNowBtn: {
    marginVertical: 10,
  },
  quickActionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  },
  dailyBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#261805',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: NRTheme.radius.lg,
    padding: 14,
    marginVertical: 10,
    ...NRTheme.shadows.glowGold,
  },
  dailyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyFlame: {
    fontSize: 26,
    marginRight: 10,
  },
  dailyTitle: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dailySub: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  rewardPill: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  rewardText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  seeAllText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '800',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modeCard: {
    width: '48%',
    backgroundColor: '#0E223D',
    borderRadius: NRTheme.radius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    ...NRTheme.shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cardBadge: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 12,
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 34,
    marginVertical: 4,
  },
  modeName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  modeTagline: {
    color: '#8CA0BA',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    minHeight: 28,
  },
  cardPlayRow: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    alignItems: 'center',
  },
  playText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsPanel: {
    marginTop: 18,
  },
  statsHeader: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#5C7491',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
});
