// ============================================================
// Number Rush — Screen 16: LEADERBOARD (Whimsical Jungle Leaderboard Reference)
// ============================================================

import React, { useState, useMemo } from 'react';
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

  // Filter or adjust data based on active tab
  const displayList = useMemo(() => {
    if (activeTab === 'weekly') {
      return leaderboard.slice(0, 12).map((item, idx) => ({
        ...item,
        score: Math.round(item.score * 0.85) - idx * 15,
      }));
    }
    if (activeTab === 'friends') {
      return leaderboard.slice(1, 8).map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
    }
    return leaderboard;
  }, [leaderboard, activeTab]);

  const top1 = displayList[0];
  const top2 = displayList[1];
  const top3 = displayList[2];
  const rest = displayList.slice(3);

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
              style={({ pressed }) => [
                styles.tab,
                isSelected && styles.activeTab,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                {tab === 'global' ? '🌍 ALL-TIME' : tab === 'weekly' ? '⚡ THIS WEEK' : '👥 FRIENDS'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Scrollable Champions List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        nestedScrollEnabled={true}
        bounces={true}
      >
        {/* 4. Carved Billboard Header with Tiger Mascot */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={72} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <Text style={styles.billboardSub}>JUNGLE HALL OF FAME</Text>
            <Text style={styles.billboardTitle}>CHAMPIONS ARENA</Text>
            <Text style={styles.billboardDesc}>Top brain rushers competing worldwide</Text>
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
              <Text style={styles.podiumName} numberOfLines={1}>
                {top2.name}
              </Text>
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
              <Text style={styles.podiumName} numberOfLines={1}>
                {top1.name}
              </Text>
              <Text style={[styles.podiumScore, { color: '#FFD700', fontSize: 13 }]}>
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
              <Text style={styles.podiumName} numberOfLines={1}>
                {top3.name}
              </Text>
              <Text style={styles.podiumScore}>{top3.score.toLocaleString()} 🪙</Text>
              <View style={[styles.pedestal, styles.pedestal3]}>
                <Text style={styles.pedestalRank}>3rd</Text>
              </View>
            </View>
          )}
        </View>

        {/* Section Header */}
        <View style={styles.rankingHeaderRow}>
          <Text style={styles.rankingHeaderTitle}>TOP RUNNERS</Text>
          <Text style={styles.rankingHeaderCount}>{displayList.length} RANKED</Text>
        </View>

        {/* 6. Rank List 4 to End */}
        <View style={styles.listContainer}>
          {rest.map((entry, index) => {
            const actualRank = entry.rank || index + 4;
            const isTopFive = actualRank <= 5;
            return (
              <View
                key={entry.id || index}
                style={[
                  styles.rankRow,
                  isTopFive && styles.rankRowHighlight,
                ]}
              >
                {/* Rank Badge */}
                <View
                  style={[
                    styles.rankPill,
                    actualRank === 4 && styles.rankPillFourth,
                    actualRank === 5 && styles.rankPillFifth,
                  ]}
                >
                  <Text
                    style={[
                      styles.rankText,
                      actualRank === 4 && styles.rankTextFourth,
                      actualRank === 5 && styles.rankTextFifth,
                    ]}
                  >
                    #{actualRank}
                  </Text>
                </View>

                {/* Avatar Icon */}
                <View style={styles.avatarWrapper}>
                  <Text style={styles.rowAvatar}>{entry.avatar}</Text>
                </View>

                {/* Player Info */}
                <View style={styles.rowInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.rowName}>{entry.name}</Text>
                    <Text style={styles.rowFlag}>{entry.countryBadge}</Text>
                  </View>
                  <Text style={styles.rowSub}>
                    {entry.mode} • x{entry.combo} streak
                  </Text>
                </View>

                {/* Score */}
                <View style={styles.scoreCol}>
                  <Text style={styles.rowScore}>{entry.score.toLocaleString()}</Text>
                  <Text style={styles.scoreUnit}>🪙 PTS</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Safe bottom spacer for sticky user bar + bottom nav */}
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
            Level {stats.level} • {stats.dailyStreak}d Streak • {stats.accuracy}% Acc
          </Text>
        </View>
        <View style={styles.userScoreCol}>
          <Text style={styles.userScore}>{stats.bestScore.toLocaleString()}</Text>
          <Text style={styles.userScoreUnit}>🪙 BEST</Text>
        </View>
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
    paddingVertical: 10,
    backgroundColor: 'rgba(7, 27, 52, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#2ED573',
    borderColor: '#FFFFFF',
    shadowColor: '#2ED573',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  activeTabText: {
    color: '#04160D',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerBillboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  mascotHolder: {
    marginRight: 10,
  },
  billboardBody: {
    flex: 1,
  },
  billboardSub: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  billboardDesc: {
    color: '#A0B4C8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
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
    flex: 1.18,
    zIndex: 2,
  },
  crownIcon: {
    fontSize: 26,
    marginBottom: -4,
  },
  avatarBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#0F2643',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  goldBorder: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderColor: '#FFD700',
    backgroundColor: '#162C4E',
  },
  silverBorder: {
    borderColor: '#D8E2DD',
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: 11,
    fontWeight: '900',
  },
  podiumName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    marginTop: 3,
    textAlign: 'center',
  },
  podiumScore: {
    color: '#FFE082',
    fontWeight: '900',
    fontSize: 12,
    marginBottom: 6,
  },
  pedestal: {
    width: '92%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pedestal1: {
    height: 98,
    backgroundColor: '#B38018',
  },
  pedestal2: {
    height: 74,
    backgroundColor: '#5C7491',
  },
  pedestal3: {
    height: 58,
    backgroundColor: '#82491A',
  },
  pedestalRank: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  rankingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  rankingHeaderTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  rankingHeaderCount: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '800',
  },
  listContainer: {
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rankRowHighlight: {
    backgroundColor: 'rgba(20, 50, 85, 0.45)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  rankPill: {
    width: 36,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankPillFourth: {
    backgroundColor: 'rgba(0, 229, 255, 0.18)',
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  rankPillFifth: {
    backgroundColor: 'rgba(255, 179, 0, 0.18)',
    borderWidth: 1,
    borderColor: '#FFB300',
  },
  rankText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 12,
  },
  rankTextFourth: {
    color: '#00E5FF',
  },
  rankTextFifth: {
    color: '#FFB300',
  },
  avatarWrapper: {
    width: 34,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  rowAvatar: {
    fontSize: 24,
  },
  rowInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  rowFlag: {
    fontSize: 12,
  },
  rowSub: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  rowScore: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 15,
  },
  scoreUnit: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '700',
  },
  userStickyRow: {
    position: 'absolute',
    bottom: 65,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2F20',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2ED573',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#2ED573',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 9,
  },
  userRankPill: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  userRankText: {
    color: '#04160D',
    fontWeight: '900',
    fontSize: 12,
  },
  userAvatar: {
    fontSize: 26,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  userSub: {
    color: '#A5D6A7',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  userScoreCol: {
    alignItems: 'flex-end',
  },
  userScore: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 16,
  },
  userScoreUnit: {
    color: '#A5D6A7',
    fontSize: 9,
    fontWeight: '800',
  },
});
