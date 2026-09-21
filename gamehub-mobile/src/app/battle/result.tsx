// ============================================================
// GameHub — Battle: Match Result Screen
// ============================================================

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface PlayerResult {
  rank: number;
  name: string;
  kills: number;
  deaths: number;
  score: number;
  isYou: boolean;
}

const DEMO_RESULTS: PlayerResult[] = [
  { rank: 1, name: 'You', kills: 15, deaths: 3, score: 1500, isYou: true },
  { rank: 2, name: 'AimBot_Pro', kills: 12, deaths: 5, score: 1200, isYou: false },
  { rank: 3, name: 'ProSniper_X', kills: 10, deaths: 7, score: 1000, isYou: false },
  { rank: 4, name: 'RajGamer99', kills: 8, deaths: 9, score: 800, isYou: false },
  { rank: 5, name: 'NightHawk', kills: 7, deaths: 10, score: 700, isYou: false },
  { rank: 6, name: 'BlazeFire', kills: 5, deaths: 11, score: 500, isYou: false },
  { rank: 7, name: 'IronWolf', kills: 4, deaths: 12, score: 400, isYou: false },
  { rank: 8, name: 'NovicePlayer', kills: 2, deaths: 14, score: 200, isYou: false },
];

const XP_EARNED = 120;
const COINS_EARNED = 35;

export default function BattleResultScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const yourResult = DEMO_RESULTS.find((p) => p.isYou)!;
  const isWin = yourResult.rank === 1;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Victory / Defeat Banner */}
        <Animated.View style={[styles.banner, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.bannerEmoji}>{isWin ? '🏆' : '💀'}</Text>
          <Text style={[styles.bannerTitle, isWin ? styles.winText : styles.loseText]}>
            {isWin ? 'VICTORY!' : `#${yourResult.rank} PLACE`}
          </Text>
          <Text style={styles.bannerMode}>{mode?.replace(/-/g, ' ').toUpperCase() || 'FREE FOR ALL'}</Text>
        </Animated.View>

        {/* Your Stats */}
        <Animated.View style={[styles.statsBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{yourResult.kills}</Text>
              <Text style={styles.statLabel}>Kills</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{yourResult.deaths}</Text>
              <Text style={styles.statLabel}>Deaths</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{(yourResult.kills / Math.max(yourResult.deaths, 1)).toFixed(1)}</Text>
              <Text style={styles.statLabel}>K/D</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{yourResult.score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rewards */}
        <Animated.View style={[styles.rewardsBox, { opacity: fadeAnim }]}>
          <Text style={styles.rewardsTitle}>Rewards Earned</Text>
          <View style={styles.rewardRow}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>⭐</Text>
              <Text style={styles.rewardValue}>+{XP_EARNED} XP</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>🪙</Text>
              <Text style={styles.rewardValue}>+{COINS_EARNED} Coins</Text>
            </View>
          </View>
        </Animated.View>

        {/* Scoreboard */}
        <Animated.View style={[styles.scoreboardBox, { opacity: fadeAnim }]}>
          <Text style={styles.scoreboardTitle}>Scoreboard</Text>
          {DEMO_RESULTS.map((player) => (
            <View key={player.rank} style={[styles.scoreRow, player.isYou && styles.scoreRowYou]}>
              <Text style={[styles.scoreRank, player.rank <= 3 && styles.scoreRankTop]}>
                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
              </Text>
              <Text style={[styles.scoreName, player.isYou && styles.scoreNameYou]}>
                {player.name} {player.isYou ? '(You)' : ''}
              </Text>
              <Text style={styles.scoreKills}>{player.kills}K</Text>
              <Text style={styles.scoreDeaths}>{player.deaths}D</Text>
              <Text style={styles.scorePoints}>{player.score}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.playAgainBtn} onPress={() => router.replace(('/battle/matchmaking?mode=' + (mode || 'free-for-all')) as any)}>
          <Text style={styles.playAgainText}>Play Again 🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)/battle')}>
          <Text style={styles.homeBtnText}>Back to Battle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: 120 },
  banner: { alignItems: 'center', marginBottom: Spacing.lg },
  bannerEmoji: { fontSize: 64, marginBottom: Spacing.sm },
  bannerTitle: { fontSize: 36, fontWeight: Typography.extrabold, textAlign: 'center' },
  winText: { color: Colors.warning },
  loseText: { color: Colors.textPrimary },
  bannerMode: { color: Colors.textMuted, fontSize: Typography.caption, fontWeight: Typography.semibold, marginTop: 4 },
  statsBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold },
  statLabel: { color: Colors.textMuted, fontSize: Typography.tiny, marginTop: 2 },
  rewardsBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  rewardsTitle: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold, marginBottom: Spacing.sm },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  rewardItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rewardIcon: { fontSize: 20 },
  rewardValue: { color: Colors.success, fontSize: Typography.body, fontWeight: Typography.bold },
  scoreboardBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  scoreboardTitle: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: Typography.bold, marginBottom: Spacing.sm },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  scoreRowYou: { backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.sm },
  scoreRank: { width: 36, color: Colors.textSecondary, fontSize: Typography.bodySmall, fontWeight: Typography.bold },
  scoreRankTop: { fontSize: Typography.body },
  scoreName: { flex: 1, color: Colors.textSecondary, fontSize: Typography.bodySmall },
  scoreNameYou: { color: Colors.primary, fontWeight: Typography.bold },
  scoreKills: { width: 36, color: Colors.success, fontSize: Typography.caption, textAlign: 'center' },
  scoreDeaths: { width: 36, color: Colors.error, fontSize: Typography.caption, textAlign: 'center' },
  scorePoints: { width: 50, color: Colors.textPrimary, fontSize: Typography.caption, fontWeight: Typography.bold, textAlign: 'right' },
  bottomActions: { paddingHorizontal: Spacing.md, paddingBottom: 40, gap: Spacing.sm },
  playAgainBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  playAgainText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  homeBtn: {
    backgroundColor: Colors.surface, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  homeBtnText: { color: Colors.textSecondary, fontSize: Typography.body, fontWeight: Typography.semibold },
});
