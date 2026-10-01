// ============================================================
// Number Rush — Player Profile & Dashboard Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, WoodPanel, MascotIllustration, BottomNavBar } from '../components';

export const ProfileModal: React.FC = () => {
  const { setScreen, stats } = useNumberRushStore();

  const xpRequired = 500;
  const currentXpInLevel = stats.xp % xpRequired;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / xpRequired) * 100));

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="PROFILE & STATS" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <WoodPanel style={styles.profileCard} variant="card">
          <View style={styles.mascotHolder}>
            <MascotIllustration size={130} mood="happy" />
          </View>

          <Text style={styles.playerName}>RUSH EXPLORER</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LEVEL {stats.level}</Text>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>EXPERIENCE (XP)</Text>
              <Text style={styles.xpVal}>
                {currentXpInLevel} / {xpRequired} XP
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </WoodPanel>

        {/* Career Statistics Grid */}
        <Text style={styles.sectionHeader}>CAREER PERFORMANCE</Text>

        <View style={styles.statsGrid}>
          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statVal}>{stats.bestScore}</Text>
            <Text style={styles.statLabel}>BEST SCORE</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statVal}>x{stats.maxCombo}</Text>
            <Text style={styles.statLabel}>MAX STREAK</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statVal}>{stats.accuracy}%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🎮</Text>
            <Text style={styles.statVal}>{stats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>GAMES PLAYED</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statVal}>{stats.totalCorrect}</Text>
            <Text style={styles.statLabel}>TOTAL CORRECT</Text>
          </WoodPanel>

          <WoodPanel style={styles.statCard} variant="glass" hasRivets={false}>
            <Text style={styles.statIcon}>🪙</Text>
            <Text style={styles.statVal}>{stats.coins}</Text>
            <Text style={styles.statLabel}>ARCADE COINS</Text>
          </WoodPanel>
        </View>

        <View style={{ height: 100 }} />
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
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  mascotHolder: {
    marginBottom: 8,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  levelBadge: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginTop: 6,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  xpSection: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
  },
  xpVal: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
  },
  xpTrack: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 6,
  },
  sectionHeader: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
