// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 10: Daily Puzzle Screen
// 24-hour synchronized special challenge with bonus rewards & streak
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { GameButton } from '../components/ui/GameButton';
import { useGameStore } from '../store/gameStore';

interface DailyPuzzleScreenProps {
  onBack: () => void;
  onPlayDaily: () => void;
  onOpenShop: () => void;
}

export const DailyPuzzleScreen: React.FC<DailyPuzzleScreenProps> = ({
  onBack,
  onPlayDaily,
  onOpenShop,
}) => {
  const insets = useSafeAreaInsets();
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const dailyCompletedDate = useGameStore((state) => state.dailyCompletedDate);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isCompletedToday = dailyCompletedDate === todayStr;

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="DAILY PUZZLE"
          subtitle="SEED OF THE DAY"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Badge */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>📅 {todayFormatted.toUpperCase()}</Text>
          </View>

          {/* Daily Challenge Card */}
          <View style={styles.mainCard}>
            <LinearGradient
              colors={['#10395C', '#071F36']}
              style={styles.cardGradient}
            >
              <Text style={styles.cardEmoji}>🌟</Text>
              <Text style={styles.cardTitle}>TODAY'S ROYAL TRIAL</Text>
              <Text style={styles.cardTagline}>
                An intricate 8-arrow labyrinth synchronized for all kingdom players
              </Text>

              {/* Rules Box */}
              <View style={styles.rulesBox}>
                <View style={styles.ruleRow}>
                  <Text style={styles.ruleBullet}>•</Text>
                  <Text style={styles.ruleText}>Solve with 3-Star efficiency to claim the bonus chest</Text>
                </View>
                <View style={styles.ruleRow}>
                  <Text style={styles.ruleBullet}>•</Text>
                  <Text style={styles.ruleText}>New trial refreshes automatically every midnight</Text>
                </View>
                <View style={styles.ruleRow}>
                  <Text style={styles.ruleBullet}>•</Text>
                  <Text style={styles.ruleText}>Daily streak grants multiplying coin tributes</Text>
                </View>
              </View>

              {/* Bonus Rewards Banner */}
              <View style={styles.rewardBanner}>
                <Text style={styles.rewardTitle}>COMPLETION TRIBUTE:</Text>
                <View style={styles.rewardsRow}>
                  <Text style={styles.rewardItem}>+250 🪙</Text>
                  <Text style={[styles.rewardItem, { color: COLORS.gem }]}>+20 💎</Text>
                </View>
              </View>

              {/* Streak Counter */}
              <View style={styles.streakBox}>
                <Text style={styles.streakLabel}>CURRENT DAILY STREAK</Text>
                <Text style={styles.streakValue}>{dailyStreak} DAYS 🔥</Text>
              </View>

              {/* Play CTA */}
              <GameButton
                title={isCompletedToday ? 'TRIAL COMPLETED ✓' : 'START DAILY TRIAL ▶'}
                variant={isCompletedToday ? 'wood' : 'green'}
                size="large"
                onPress={onPlayDaily}
                disabled={isCompletedToday}
                style={styles.playBtn}
              />
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 10,
  },
  dateBadge: {
    backgroundColor: 'rgba(8, 27, 47, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  mainCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardGradient: {
    padding: 22,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(32, 191, 255, 0.3)',
  },
  cardEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 2,
  },
  cardTagline: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 16,
    marginVertical: 10,
  },
  rulesBox: {
    width: '100%',
    backgroundColor: 'rgba(6, 18, 32, 0.8)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginVertical: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  ruleBullet: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '900',
  },
  ruleText: {
    flex: 1,
    fontSize: 11,
    color: '#E2EEF9',
    lineHeight: 16,
  },
  rewardBanner: {
    alignItems: 'center',
    marginVertical: 8,
  },
  rewardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.gold,
  },
  streakBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF8C22',
    marginTop: 2,
  },
  playBtn: {
    width: '100%',
    marginTop: 10,
  },
});

export default DailyPuzzleScreen;
