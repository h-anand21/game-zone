// ============================================================
// Find One — Dynamic Leaderboard & Real Match Records Modal
// ============================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FORadius, FOSpacing } from '../theme';
import {
  useFindOneStore,
  formatGameDate,
  GLOBAL_BENCHMARK_PLAYERS,
  computeUserRank,
} from '../store/findOneStore';
import { GameButton } from './GameButton';
import type { LeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'history'>('ranking');
  const { stats, profile, history, startGame, loadPersistedData } = useFindOneStore();

  // Always re-hydrate data when modal opens so everything is fresh and up-to-date
  React.useEffect(() => {
    if (visible) {
      loadPersistedData();
    }
  }, [visible]);

  // Tier names based on user's best score
  const getLeagueTier = (score: number) => {
    if (score >= 40) return { name: 'GRANDMASTER', color: '#FF4B4B', icon: '👑' };
    if (score >= 30) return { name: 'MASTER LEAGUE', color: '#8A4BFF', icon: '💎' };
    if (score >= 20) return { name: 'DIAMOND LEAGUE', color: '#2488FF', icon: '🔷' };
    if (score >= 12) return { name: 'GOLD LEAGUE', color: '#FFC928', icon: '⭐' };
    if (score >= 6) return { name: 'SILVER LEAGUE', color: '#B0BFCF', icon: '🛡️' };
    return { name: 'BRONZE LEAGUE', color: '#CD7F32', icon: '🥉' };
  };

  const userTier = getLeagueTier(stats.bestScore);
  const userRank = computeUserRank(stats.bestScore, stats.accuracy);

  // Helper to render avatar correctly whether it's an image URL or an emoji
  const renderAvatar = (avatar: string | undefined, size: number = 32) => {
    if (avatar && (avatar.startsWith('http') || avatar.startsWith('file') || avatar.startsWith('data:'))) {
      return (
        <Image
          source={{ uri: avatar }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      );
    }
    return (
      <Text style={{ fontSize: size * 0.62 }}>
        {avatar || '🐼'}
      </Text>
    );
  };

  // Build real dynamic leaderboard list where user is placed at their exact earned rank!
  const generateDynamicRanking = (): LeaderboardEntry[] => {
    const userDate = history.length > 0 ? history[0].formattedDate : 'Today';
    const userEntry: LeaderboardEntry = {
      rank: userRank,
      playerName: profile.name || 'Champion',
      avatar: profile.avatar || '🐼',
      score: stats.bestScore,
      accuracy: stats.accuracy || 100,
      date: userDate,
      isCurrentPlayer: true,
    };

    // Combine benchmark community records with real player entry
    const allEntries: LeaderboardEntry[] = [
      ...GLOBAL_BENCHMARK_PLAYERS.map((p) => ({
        rank: 0,
        playerName: p.playerName,
        avatar: p.avatar,
        score: p.score,
        accuracy: p.accuracy,
        date: p.date,
        isCurrentPlayer: false,
      })),
      userEntry,
    ];

    // Sort strictly by Score (descending), then Accuracy (descending)
    allEntries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.accuracy - a.accuracy;
    });

    // Assign realistic sequential ranks 1, 2, 3...
    return allEntries.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  };

  const displayRanking = generateDynamicRanking();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCardWrapper}>
          <LinearGradient
            colors={['#142E4C', '#0B1C30', '#061322']}
            style={styles.modalCard}
          >
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.titleBadge}>
                <Text style={styles.titleIcon}>🏆</Text>
                <Text style={styles.modalTitle}>LEADERBOARD</Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Current Player Live Standing Banner */}
            <LinearGradient
              colors={['#1B4770', '#0D2947']}
              style={styles.playerBanner}
            >
              <View style={styles.playerBannerAvatar}>
                <Text style={{ fontSize: 28 }}>{profile.avatar || '🐼'}</Text>
              </View>

              <View style={styles.playerBannerInfo}>
                <View style={styles.playerBannerNameRow}>
                  <Text style={styles.playerBannerName}>{profile.name || 'Champion'}</Text>
                  <View style={[styles.tierTag, { backgroundColor: `${userTier.color}25`, borderColor: userTier.color }]}>
                    <Text style={[styles.tierTagText, { color: userTier.color }]}>
                      {userTier.icon} {userTier.name}
                    </Text>
                  </View>
                </View>

                <View style={styles.playerBannerStatsRow}>
                  <Text style={styles.playerBannerStat}>
                    Rank: <Text style={{ color: '#FFD700', fontWeight: '900' }}>#{userRank}</Text>
                  </Text>
                  <Text style={styles.playerBannerStat}>•</Text>
                  <Text style={styles.playerBannerStat}>
                    Best: <Text style={{ color: '#65B2F5', fontWeight: '900' }}>{stats.bestScore} PTS</Text>
                  </Text>
                  <Text style={styles.playerBannerStat}>•</Text>
                  <Text style={styles.playerBannerStat}>
                    Games: <Text style={{ color: '#FFFFFF', fontWeight: '900' }}>{stats.totalGames}</Text>
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Segmented Tabs */}
            <View style={styles.tabContainer}>
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === 'ranking' && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab('ranking')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'ranking' && styles.tabTextActive,
                  ]}
                >
                  GLOBAL STANDINGS
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === 'history' && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab('history')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'history' && styles.tabTextActive,
                  ]}
                >
                  MY MATCHES ({history.length})
                </Text>
              </Pressable>
            </View>

            {/* Tab 1: Global Standings Table */}
            {activeTab === 'ranking' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              >
                {displayRanking.map((item, index) => {
                  const isUser = item.isCurrentPlayer;

                  return (
                    <View
                      key={`${item.rank}-${index}`}
                      style={[
                        styles.rankRow,
                        isUser && styles.userRankRow,
                      ]}
                    >
                      {/* Rank Indicator */}
                      <View style={styles.rankBadgeHolder}>
                        <Text style={styles.rankBadgeText}>
                          {getRankBadge(item.rank)}
                        </Text>
                      </View>

                      {/* Avatar */}
                      <View style={styles.avatarHolder}>
                        <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
                      </View>

                      {/* Player Info */}
                      <View style={styles.playerInfo}>
                        <View style={styles.nameWrap}>
                          <Text
                            style={[
                              styles.playerName,
                              isUser && styles.userPlayerName,
                            ]}
                            numberOfLines={1}
                          >
                            {item.playerName}
                          </Text>
                          {isUser && (
                            <View style={styles.youBadge}>
                              <Text style={styles.youBadgeText}>YOU</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.dateAchieved}>{item.date}</Text>
                      </View>

                      {/* Score & Accuracy */}
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreValue}>{item.score} PTS</Text>
                        <Text style={styles.accValue}>{item.accuracy}% acc</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            {/* Tab 2: Real Match History with Real Dates */}
            {activeTab === 'history' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              >
                {history.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎮</Text>
                    <Text style={styles.emptyTitle}>No Matches Played Yet</Text>
                    <Text style={styles.emptySubtitle}>
                      Every game you finish will be recorded here with its real date, time, final score, and accuracy!
                    </Text>
                    <View style={{ marginTop: 16 }}>
                      <GameButton
                        title="PLAY FIRST MATCH"
                        variant="gold"
                        size="md"
                        onPress={() => {
                          onClose();
                          startGame();
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  history.map((record) => (
                    <View key={record.id} style={styles.historyCard}>
                      <View style={styles.historyHeader}>
                        <View style={styles.historyCategoryRow}>
                          <Text style={styles.historyCategoryIcon}>
                            {record.category === 'animals' ? '🐼' :
                             record.category === 'clothes' ? '👕' :
                             record.category === 'food' ? '🍔' :
                             record.category === 'vehicles' ? '🚗' : '🧢'}
                          </Text>
                          <Text style={styles.historyCategoryName}>
                            {record.category.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.historyDate}>{record.formattedDate}</Text>
                      </View>

                      <View style={styles.historyStatsRow}>
                        <View style={styles.historyStatCol}>
                          <Text style={styles.historyStatLabel}>SCORE</Text>
                          <Text style={styles.historyStatValue}>{record.score} PTS</Text>
                        </View>
                        <View style={styles.historyStatCol}>
                          <Text style={styles.historyStatLabel}>ACCURACY</Text>
                          <Text style={styles.historyStatValue}>{record.accuracy}%</Text>
                        </View>
                        <View style={styles.historyStatCol}>
                          <Text style={styles.historyStatLabel}>MAX STREAK</Text>
                          <Text style={styles.historyStatValue}>{record.streak} 🔥</Text>
                        </View>
                        <View style={styles.historyStatCol}>
                          <Text style={styles.historyStatLabel}>TIME</Text>
                          <Text style={styles.historyStatValue}>{record.durationSeconds}s</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '88%',
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    padding: FOSpacing.lg,
    borderWidth: 2,
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0E243C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4973',
  },
  closeIcon: {
    fontSize: 16,
    color: '#A8C5DE',
    fontWeight: '900',
  },
  playerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: FORadius.lg,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#265988',
    marginBottom: 12,
    gap: 10,
  },
  playerBannerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A1E33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFC928',
  },
  playerBannerInfo: {
    flex: 1,
  },
  playerBannerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerBannerName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  tierTag: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  playerBannerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  playerBannerStat: {
    fontSize: 11,
    color: '#8BAFCF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#091A2E',
    borderRadius: FORadius.md,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#173D63',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: FORadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1E4E7A',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7093B3',
    letterSpacing: 0.4,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2036',
    borderRadius: FORadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#163B61',
    gap: 10,
  },
  userRankRow: {
    backgroundColor: '#14385C',
    borderColor: '#FFC928',
    borderWidth: 2,
  },
  rankBadgeHolder: {
    width: 32,
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
  },
  avatarHolder: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#071626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#24598C',
  },
  playerInfo: {
    flex: 1,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userPlayerName: {
    color: '#FFD700',
  },
  youBadge: {
    backgroundColor: '#FFC928',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#061322',
  },
  dateAchieved: {
    fontSize: 10,
    color: '#6E90AF',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#65B2F5',
  },
  accValue: {
    fontSize: 10,
    color: '#8CA5BD',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#7093B3',
    textAlign: 'center',
    lineHeight: 17,
  },
  historyCard: {
    backgroundColor: '#0B2036',
    borderRadius: FORadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#173D63',
    gap: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#122E4D',
    paddingBottom: 6,
  },
  historyCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyCategoryIcon: {
    fontSize: 14,
  },
  historyCategoryName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  historyDate: {
    fontSize: 10,
    color: '#799EBE',
  },
  historyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  historyStatCol: {
    alignItems: 'center',
  },
  historyStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6E90AF',
    letterSpacing: 0.5,
  },
  historyStatValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
});
