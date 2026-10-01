// ============================================================
// Number Rush — Screen 17: PROFILE + STATS (Jungle Game Profile Dashboard Reference)
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
import { HeaderHUD, WoodPanel, MascotIllustration, BottomNavBar } from '../components';

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
      >
        {/* 3. Hero Profile Dashboard Card */}
        <WoodPanel style={styles.profileCard} variant="wood">
          {/* Avatar with Golden Frame */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarDisk}>
              <Text style={styles.avatarEmoji}>🏃</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {stats.level}</Text>
            </View>
          </View>

          <Text style={styles.playerName}>{stats.playerName || 'Player 1'}</Text>
          <View style={styles.titlePill}>
            <Text style={styles.titlePillText}>{getPlayerTitle(stats.level)}</Text>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>EXPERIENCE (XP)</Text>
              <Text style={styles.xpVal}>
                {currentXpInLevel} / {xpRequired} XP ({progressPercent}%)
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Edit Profile Action */}
          <Pressable
            onPress={() => setScreen('settings')}
            style={styles.editProfileBtn}
          >
            <Text style={styles.editProfileText}>SETTINGS & PREFERENCES ⚙️</Text>
          </Pressable>
        </WoodPanel>

        {/* 4. Career Performance Grid (6 Cards) */}
        <Text style={styles.sectionHeader}>CAREER STATISTICS</Text>

        <View style={styles.statsGrid}>
          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statVal}>
              {stats.bestScore.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>BEST SCORE</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statVal}>x{stats.maxCombo}</Text>
            <Text style={styles.statLabel}>MAX STREAK</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statVal}>{stats.gamesPlayed > 0 ? stats.accuracy : 0}%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🎮</Text>
            <Text style={styles.statVal}>{stats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>GAMES PLAYED</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statVal}>{totalStars}</Text>
            <Text style={styles.statLabel}>TOTAL STARS</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🪙</Text>
            <Text style={styles.statVal}>{stats.coins.toLocaleString()}</Text>
            <Text style={styles.statLabel}>ARCADE COINS</Text>
          </WoodPanel>
        </View>

        {/* 5. Achievements Snapshot Card */}
        <Pressable
          onPress={() => setScreen('achievements')}
          style={({ pressed }) => [
            styles.achievementsCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.achLeft}>
            <Text style={styles.achIcon}>🎖️</Text>
            <View>
              <Text style={styles.achTitle}>ACHIEVEMENTS COLLECTION</Text>
              <Text style={styles.achSub}>
                {unlockedCount} / {achievements.length} Badges Unlocked ({Math.round((unlockedCount / (achievements.length || 1)) * 100)}%)
              </Text>
            </View>
          </View>
          <Text style={styles.achArrow}>VIEW ALL →</Text>
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
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarDisk: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#0F2643',
    borderWidth: 3,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 38,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FF6D00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titlePill: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2ED573',
    marginTop: 4,
    marginBottom: 12,
  },
  titlePillText: {
    color: '#2ED573',
    fontSize: 9,
    fontWeight: '900',
  },
  xpSection: {
    width: '100%',
    marginVertical: 4,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
  },
  xpVal: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
  },
  xpTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#2ED573',
    borderRadius: 5,
  },
  editProfileBtn: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editProfileText: {
    color: '#D8E2DD',
    fontSize: 10,
    fontWeight: '900',
  },
  sectionHeader: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  statVal: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
  },
  statLabel: {
    color: '#8CA0BA',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  },
  achievementsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 14,
  },
  cardPressed: {
    opacity: 0.85,
  },
  achLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  achTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  achSub: {
    color: '#8CA0BA',
    fontSize: 10,
    marginTop: 2,
  },
  achArrow: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '900',
  },
});
