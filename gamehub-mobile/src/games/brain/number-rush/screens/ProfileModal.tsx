// ============================================================
// Number Rush — Screen 17: PROFILE + STATS (Jungle Game Profile Dashboard)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, WoodPanel, BottomNavBar } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ProfileModal: React.FC = () => {
  const { setScreen, stats, achievements } = useNumberRushStore();

  const xpRequired = 500;
  const currentXpInLevel = stats.xp % xpRequired;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / xpRequired) * 100));

  const getPlayerTitle = (level: number) => {
    if (level >= 10) return '👑 ARCADE LEGEND';
    if (level >= 5) return '🌿 JUNGLE MASTER';
    if (level >= 3) return '⚡ NUMBER HUNTER';
    if (level >= 2) return '🐾 JUNGLE SCOUT';
    return '🌱 NOVICE EXPLORER';
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalStars = Math.floor(stats.totalScore / 250) + (stats.bestScore > 0 ? 3 : 0);

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="PROFILE & STATS" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 3. Compact Hero Profile Dashboard Card */}
        <WoodPanel style={styles.profileCard} variant="wood" hasRivets={false}>
          <View style={styles.profileTopRow}>
            {/* Left: Avatar with Level Badge */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarDisk}>
                <Text style={styles.avatarEmoji}>🏃</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>L{stats.level}</Text>
              </View>
            </View>

            {/* Right: Player Name, Title Pill & XP Bar */}
            <View style={styles.profileInfoCol}>
              <View style={styles.playerNameRow}>
                <Text style={styles.playerName} numberOfLines={1}>{stats.playerName || 'Player'}</Text>
                <Pressable
                  onPress={() => setScreen('settings')}
                  style={styles.settingsMiniBtn}
                >
                  <Text style={styles.settingsMiniIcon}>⚙️ SETTINGS</Text>
                </Pressable>
              </View>

              <View style={styles.titlePill}>
                <Text style={styles.titlePillText}>{getPlayerTitle(stats.level)}</Text>
              </View>

              {/* XP Progress Bar */}
              <View style={styles.xpSection}>
                <View style={styles.xpLabelRow}>
                  <Text style={styles.xpLabel}>PROGRESS</Text>
                  <Text style={styles.xpVal}>
                    {currentXpInLevel}/{xpRequired} XP ({progressPercent}%)
                  </Text>
                </View>
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${progressPercent}%` }]} />
                  <View style={styles.xpShine} />
                </View>
              </View>
            </View>
          </View>
        </WoodPanel>

        {/* 4. Career Performance Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>CAREER STATISTICS</Text>
          <Text style={styles.sectionSubtitle}>LIFETIME METRICS</Text>
        </View>

        <View style={styles.statsGrid}>
          {/* Best Score */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
              <Text style={styles.statIcon}>🏆</Text>
            </View>
            <Text style={[styles.statVal, { color: '#FFD700' }]}>
              {stats.bestScore.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>BEST SCORE</Text>
          </View>

          {/* Max Streak */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 109, 0, 0.15)' }]}>
              <Text style={styles.statIcon}>🔥</Text>
            </View>
            <Text style={[styles.statVal, { color: '#FF9100' }]}>
              x{stats.maxCombo}
            </Text>
            <Text style={styles.statLabel}>MAX STREAK</Text>
          </View>

          {/* Accuracy */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(46, 213, 115, 0.15)' }]}>
              <Text style={styles.statIcon}>🎯</Text>
            </View>
            <Text style={[styles.statVal, { color: '#00E676' }]}>
              {stats.gamesPlayed > 0 ? stats.accuracy : 87}%
            </Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </View>

          {/* Games Played */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(30, 144, 255, 0.15)' }]}>
              <Text style={styles.statIcon}>🎮</Text>
            </View>
            <Text style={[styles.statVal, { color: '#40C4FF' }]}>
              {stats.gamesPlayed}
            </Text>
            <Text style={styles.statLabel}>GAMES PLAYED</Text>
          </View>

          {/* Total Stars */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]}>
              <Text style={styles.statIcon}>⭐</Text>
            </View>
            <Text style={[styles.statVal, { color: '#FFD54F' }]}>
              {totalStars}
            </Text>
            <Text style={styles.statLabel}>TOTAL STARS</Text>
          </View>

          {/* Arcade Coins */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 235, 59, 0.15)' }]}>
              <Text style={styles.statIcon}>🪙</Text>
            </View>
            <Text style={[styles.statVal, { color: '#FFEE58' }]}>
              {stats.coins.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>ARCADE COINS</Text>
          </View>
        </View>

        {/* 5. Streak & Gauntlet Highlight Card */}
        <View style={styles.streakHighlightCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakBigFlame}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>{stats.dailyStreak} DAY ACTIVE STREAK</Text>
              <Text style={styles.streakDesc}>Play daily challenges to keep your multiplier burning!</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setScreen('daily-rush')}
            style={styles.dailyRushBtn}
          >
            <Text style={styles.dailyRushBtnText}>DAILY RUSH ▶</Text>
          </Pressable>
        </View>

        {/* 6. Achievements Trophy Room Card */}
        <Pressable
          onPress={() => setScreen('achievements')}
          style={({ pressed }) => [
            styles.achievementsCard,
            pressed && { opacity: 0.85 },
          ]}
        >
          <View style={styles.achLeft}>
            <View style={styles.achIconDisk}>
              <Text style={styles.achIcon}>🎖️</Text>
            </View>
            <View style={styles.achInfo}>
              <Text style={styles.achTitle}>TROPHY COLLECTION</Text>
              <Text style={styles.achSub}>
                {unlockedCount} of {achievements.length} Badges Claimed ({Math.round((unlockedCount / (achievements.length || 1)) * 100)}%)
              </Text>
            </View>
          </View>
          <View style={styles.achPill}>
            <Text style={styles.achPillText}>VIEW ALL →</Text>
          </View>
        </Pressable>

        {/* Safe bottom spacer for BottomNavBar */}
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
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarDisk: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F2643',
    borderWidth: 2.5,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#FF6D00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  profileInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  playerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  settingsMiniBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  settingsMiniIcon: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '900',
  },
  titlePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46, 213, 115, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2ED573',
    marginBottom: 6,
  },
  titlePillText: {
    color: '#2ED573',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  xpSection: {
    width: '100%',
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  xpLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  xpVal: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
  },
  xpTrack: {
    width: '100%',
    height: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 5,
  },
  xpShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  sectionSubtitle: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '31%',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIcon: {
    fontSize: 20,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  streakHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(66, 33, 8, 0.85)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FF9100',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  streakBigFlame: {
    fontSize: 32,
    marginRight: 10,
  },
  streakTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  streakDesc: {
    color: '#FFCC80',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  dailyRushBtn: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  dailyRushBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  achievementsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 14,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  achLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achIconDisk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  achIcon: {
    fontSize: 24,
  },
  achInfo: {
    flex: 1,
  },
  achTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  achSub: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  achPill: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2ED573',
  },
  achPillText: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '900',
  },
});
