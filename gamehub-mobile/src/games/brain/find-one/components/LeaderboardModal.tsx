// ============================================================
// Find One — Leaderboard & Match History Modal (Real Dates & Records)
// ============================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FOColors, FORadius, FOSpacing } from '../theme';
import { useFindOneStore } from '../store/findOneStore';
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
  const { stats, profile, history } = useFindOneStore();

  // Dynamic Top Players Leaderboard
  const baseLeaderboard: LeaderboardEntry[] = [
    { rank: 1, playerName: 'Sophia Chen', avatar: '🦊', score: 48, accuracy: 98, date: '30 Sep, 08:15 PM' },
    { rank: 2, playerName: 'Marcus Vance', avatar: '🐯', score: 42, accuracy: 96, date: '30 Sep, 05:40 PM' },
    { rank: 3, playerName: 'Elena Rostova', avatar: '🐨', score: 37, accuracy: 94, date: '29 Sep, 09:20 PM' },
    { rank: 4, playerName: 'Liam Gallagher', avatar: '🦁', score: 32, accuracy: 91, date: '29 Sep, 03:10 PM' },
    { rank: 5, playerName: 'Aarav Sharma', avatar: '🐼', score: 28, accuracy: 90, date: '28 Sep, 11:05 PM' },
    { rank: 6, playerName: 'Chloe Dubois', avatar: '🐰', score: 24, accuracy: 88, date: '28 Sep, 04:30 PM' },
    { rank: 7, playerName: 'Kai Tanaka', avatar: '🐸', score: 20, accuracy: 86, date: '27 Sep, 07:15 PM' },
    { rank: 8, playerName: 'Zara Ahmed', avatar: '🐻', score: 17, accuracy: 85, date: '27 Sep, 01:25 PM' },
  ];

  // Insert or show current player in leaderboard
  const playerRank = profile.rank || 28;
  const playerEntry: LeaderboardEntry = {
    rank: playerRank,
    playerName: profile.name || 'You',
    avatar: profile.avatar || '🐼',
    score: stats.bestScore,
    accuracy: stats.accuracy,
    date: history.length > 0 ? history[0].formattedDate : 'Today',
    isCurrentPlayer: true,
  };

  const displayList = [...baseLeaderboard];
  if (playerRank <= 8) {
    displayList.splice(playerRank - 1, 0, playerEntry);
  } else {
    displayList.push(playerEntry);
  }

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
                <Text style={styles.titleIcon}>📊</Text>
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
                  GLOBAL RANKING
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
                  MATCH HISTORY ({history.length})
                </Text>
              </Pressable>
            </View>

            {/* Tab 1: Global Ranking Table */}
            {activeTab === 'ranking' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              >
                {displayList.map((item, index) => {
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

                      {/* Avatar & Player Info */}
                      <View style={styles.avatarHolder}>
                        <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
                      </View>

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

            {/* Tab 2: Real Match History with Dates */}
            {activeTab === 'history' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              >
                {history.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>⏳</Text>
                    <Text style={styles.emptyTitle}>No Matches Yet</Text>
                    <Text style={styles.emptySubtitle}>
                      Play a game of Find One to record your match history with real dates, scores and accuracy!
                    </Text>
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
                          <Text style={styles.historyStatLabel}>STREAK</Text>
                          <Text style={styles.historyStatValue}>{record.streak} 🔥</Text>
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
    maxHeight: '85%',
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
    marginBottom: 12,
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
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 38,
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
    lineHeight: 16,
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
    justifyContent: 'space-around',
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
