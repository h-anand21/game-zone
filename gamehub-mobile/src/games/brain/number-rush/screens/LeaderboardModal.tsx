// ============================================================
// Number Rush — Arcade Leaderboard & Podium Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, BottomNavBar } from '../components';

export const LeaderboardModal: React.FC = () => {
  const { setScreen, leaderboard, stats } = useNumberRushStore();
  const [activeTab, setActiveTab] = useState<'global' | 'daily' | 'friends'>('global');

  // Sorted list
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="LEADERBOARD" />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['global', 'daily', 'friends'] as const).map((tab) => {
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
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          {top2 && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarBox, styles.silverBorder]}>
                <Text style={styles.avatarEmoji}>{top2.avatar}</Text>
                <View style={[styles.rankBadge, styles.silverBadge]}>
                  <Text style={styles.rankNum}>2</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top2.name}</Text>
              <Text style={styles.podiumScore}>{top2.score}</Text>
              <View style={[styles.pedestal, styles.pedestal2]}>
                <Text style={styles.pedestalRank}>2nd</Text>
              </View>
            </View>
          )}

          {/* 1st Place */}
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
              <Text style={styles.podiumScore}>{top1.score}</Text>
              <View style={[styles.pedestal, styles.pedestal1]}>
                <Text style={styles.pedestalRank}>1st</Text>
              </View>
            </View>
          )}

          {/* 3rd Place */}
          {top3 && (
            <View style={styles.podiumCol}>
              <View style={[styles.avatarBox, styles.bronzeBorder]}>
                <Text style={styles.avatarEmoji}>{top3.avatar}</Text>
                <View style={[styles.rankBadge, styles.bronzeBadge]}>
                  <Text style={styles.rankNum}>3</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3.name}</Text>
              <Text style={styles.podiumScore}>{top3.score}</Text>
              <View style={[styles.pedestal, styles.pedestal3]}>
                <Text style={styles.pedestalRank}>3rd</Text>
              </View>
            </View>
          )}
        </View>

        {/* List of remaining ranks */}
        <View style={styles.listContainer}>
          {rest.map((entry) => (
            <View key={entry.id} style={styles.rankRow}>
              <Text style={styles.rankText}>#{entry.rank}</Text>
              <Text style={styles.rowAvatar}>{entry.avatar}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{entry.name}</Text>
                <Text style={styles.rowMode}>{entry.mode} • x{entry.combo} streak</Text>
              </View>
              <Text style={styles.rowScore}>{entry.score}</Text>
            </View>
          ))}
        </View>

        {/* User's Current Performance Row */}
        <View style={styles.userStickyRow}>
          <Text style={styles.userRank}>#4</Text>
          <Text style={styles.rowAvatar}>🏃</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.userName}>You (Champion)</Text>
            <Text style={styles.rowMode}>Your Best: {stats.bestScore} pts</Text>
          </View>
          <Text style={styles.userScore}>{stats.bestScore}</Text>
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: NRTheme.radius.md,
    backgroundColor: '#0E223D',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: '#1E4575',
    borderColor: '#FFC107',
  },
  tabText: {
    color: '#8CA0BA',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#FFC107',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: 16,
    paddingTop: 10,
  },
  podiumCol: {
    width: 100,
    alignItems: 'center',
  },
  podiumCenter: {
    width: 120,
    zIndex: 2,
  },
  crownIcon: {
    fontSize: 26,
    marginBottom: -6,
  },
  avatarBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#143154',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  goldBorder: {
    borderColor: '#FFD700',
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  silverBorder: {
    borderColor: '#BDC3C7',
  },
  bronzeBorder: {
    borderColor: '#D35400',
  },
  avatarEmoji: {
    fontSize: 28,
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
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  silverBadge: {
    backgroundColor: '#BDC3C7',
  },
  bronzeBadge: {
    backgroundColor: '#D35400',
  },
  rankNum: {
    color: '#071324',
    fontSize: 11,
    fontWeight: '900',
  },
  podiumName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  podiumScore: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 6,
  },
  pedestal: {
    width: '100%',
    backgroundColor: '#143154',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pedestal1: {
    height: 80,
    backgroundColor: '#1B4576',
    borderColor: '#FFD700',
  },
  pedestal2: {
    height: 56,
  },
  pedestal3: {
    height: 42,
  },
  pedestalRank: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  listContainer: {
    gap: 8,
    marginTop: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D223B',
    padding: 12,
    borderRadius: NRTheme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  rankText: {
    color: '#8CA0BA',
    fontSize: 13,
    fontWeight: '900',
    width: 32,
  },
  rowAvatar: {
    fontSize: 22,
    marginRight: 10,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  rowMode: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
  },
  rowScore: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '900',
  },
  userStickyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#183B64',
    padding: 14,
    borderRadius: NRTheme.radius.lg,
    borderWidth: 2,
    borderColor: '#FFC107',
    marginTop: 16,
    ...NRTheme.shadows.glowGold,
  },
  userRank: {
    color: '#FFE082',
    fontSize: 14,
    fontWeight: '900',
    width: 32,
  },
  userName: {
    color: '#FFE082',
    fontSize: 15,
    fontWeight: '900',
  },
  userScore: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
