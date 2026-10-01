// ============================================================
// Number Rush — Screen 16: LEADERBOARD (Whimsical Jungle Leaderboard Reference)
// ============================================================

import React, { useState } from 'react';
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
import { HeaderHUD, BottomNavBar, MascotIllustration } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const LeaderboardModal: React.FC = () => {
  const { setScreen, leaderboard, stats } = useNumberRushStore();
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends'>('global');

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);
  const userRankNum = leaderboard.filter((e) => e.score > stats.bestScore).length + 1;
  const userRank = stats.bestScore > 0 ? `#${userRankNum}` : '#--';

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="LEADERBOARD" />

      {/* 3. Filter Tabs Row */}
      <View style={styles.tabsRow}>
        {(['global', 'weekly', 'friends'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, isSelected && styles.activeTab]}
            >
              <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4. Carved Billboard Header with Tiger Mascot */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={75} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <Text style={styles.billboardSub}>JUNGLE HALL OF FAME</Text>
            <Text style={styles.billboardTitle}>CHAMPIONS ARENA</Text>
          </View>
        </View>

        {/* 5. 3D TOP 3 PODIUM */}
        <View style={styles.podiumContainer}>
          {/* 2nd Place (Silver) */}
          {top2 && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarBox, styles.silverBorder]}>
                <Text style={styles.avatarEmoji}>{top2.avatar}</Text>
                <View style={[styles.rankBadge, styles.silverBadge]}>
                  <Text style={styles.rankNum}>2</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top2.name}</Text>
              <Text style={styles.podiumScore}>{top2.score.toLocaleString()} 🪙</Text>
              <View style={[styles.pedestal, styles.pedestal2]}>
                <Text style={styles.pedestalRank}>2nd</Text>
              </View>
            </View>
          )}

          {/* 1st Place (Gold Crown) */}
          {top1 && (
            <View style={[styles.podiumCol, styles.podiumCenter]}>
              <Text style={styles.crownIcon}>👑</Text>
              <View style={[styles.avatarBox, styles.goldBorder]}>
                <Text style={styles.avatarEmoji}>{top1.avatar}</Text>
                <View style={[styles.rankBadge, styles.goldBadge]}>
                  <Text style={styles.rankNum}>1</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top1.name}</Text>
              <Text style={[styles.podiumScore, { color: '#FFD700' }]}>
                {top1.score.toLocaleString()} 🪙
              </Text>
              <View style={[styles.pedestal, styles.pedestal1]}>
                <Text style={styles.pedestalRank}>1st</Text>
              </View>
            </View>
          )}

          {/* 3rd Place (Bronze) */}
          {top3 && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarBox, styles.bronzeBorder]}>
                <Text style={styles.avatarEmoji}>{top3.avatar}</Text>
                <View style={[styles.rankBadge, styles.bronzeBadge]}>
                  <Text style={styles.rankNum}>3</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3.name}</Text>
              <Text style={styles.podiumScore}>{top3.score.toLocaleString()} 🪙</Text>
              <View style={[styles.pedestal, styles.pedestal3]}>
                <Text style={styles.pedestalRank}>3rd</Text>
              </View>
            </View>
          )}
        </View>

        {/* 6. Rank List 4 to 100 */}
        <View style={styles.listContainer}>
          {rest.map((entry) => (
            <View key={entry.id} style={styles.rankRow}>
              <View style={styles.rankPill}>
                <Text style={styles.rankText}>#{entry.rank}</Text>
              </View>
              <Text style={styles.rowAvatar}>{entry.avatar}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{entry.name}</Text>
                <Text style={styles.rowSub}>
                  {entry.countryBadge} • {entry.mode} • x{entry.combo} streak
                </Text>
              </View>
              <Text style={styles.rowScore}>{entry.score.toLocaleString()} 🪙</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* 7. Sticky User Rank Row */}
      <View style={styles.userStickyRow}>
        <View style={styles.userRankPill}>
          <Text style={styles.userRankText}>{userRank}</Text>
        </View>
        <Text style={styles.userAvatar}>🏃</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>YOU ({stats.playerName || 'Player 1'})</Text>
          <Text style={styles.userSub}>
            Level {stats.level} • {stats.dailyStreak}d Streak
          </Text>
        </View>
        <Text style={styles.userScore}>
          {stats.bestScore.toLocaleString()} 🪙
        </Text>
      </View>

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
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(7, 27, 52, 0.75)',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#2ED573',
    borderColor: '#FFFFFF',
  },
  tabText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#04160D',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBillboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: 12,
    marginBottom: 14,
  },
  mascotHolder: {
    marginRight: 10,
  },
  billboardBody: {
    flex: 1,
  },
  billboardSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  podiumCenter: {
    flex: 1.15,
    zIndex: 2,
  },
  crownIcon: {
    fontSize: 24,
    marginBottom: -4,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F2643',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  goldBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderColor: '#FFD700',
  },
  silverBorder: {
    borderColor: '#D8E2DD',
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  goldBadge: { backgroundColor: '#FFD700' },
  silverBadge: { backgroundColor: '#D8E2DD' },
  bronzeBadge: { backgroundColor: '#CD7F32' },
  rankNum: {
    color: '#071324',
    fontSize: 10,
    fontWeight: '900',
  },
  podiumName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    marginTop: 2,
  },
  podiumScore: {
    color: '#FFE082',
    fontWeight: '900',
    fontSize: 12,
    marginBottom: 6,
  },
  pedestal: {
    width: '90%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 2,
    borderColor: '#FFFFFF',
  },
  pedestal1: {
    height: 95,
    backgroundColor: '#996515',
  },
  pedestal2: {
    height: 70,
    backgroundColor: '#5C7491',
  },
  pedestal3: {
    height: 55,
    backgroundColor: '#784212',
  },
  pedestalRank: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  listContainer: {
    backgroundColor: 'rgba(7, 27, 52, 0.85)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    padding: 10,
    gap: 8,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    padding: 10,
  },
  rankPill: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 12,
  },
  rowAvatar: {
    fontSize: 22,
    marginHorizontal: 8,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  rowSub: {
    color: '#8CA0BA',
    fontSize: 9,
    marginTop: 1,
  },
  rowScore: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 13,
  },
  userStickyRow: {
    position: 'absolute',
    bottom: 65,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2F20',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2ED573',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#2ED573',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  userRankPill: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  userRankText: {
    color: '#04160D',
    fontWeight: '900',
    fontSize: 10,
  },
  userAvatar: {
    fontSize: 24,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  userSub: {
    color: '#A5D6A7',
    fontSize: 9,
  },
  userScore: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 14,
  },
});
