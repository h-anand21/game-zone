// ============================================================
// Number Rush — Daily Rush & Streak Reward Screen
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
import { HeaderHUD, GameButton, WoodPanel, BottomNavBar } from '../components';

export const DailyRushModal: React.FC = () => {
  const { setScreen, stats, claimDailyReward, startCountdown } =
    useNumberRushStore();

  const [claimSuccess, setClaimSuccess] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimed = stats.lastDailyClaimDate === today;

  const handleClaim = () => {
    const success = claimDailyReward();
    if (success) {
      setClaimSuccess(true);
    }
  };

  const days = [
    { day: 1, reward: '100 🪙', claimed: stats.dailyStreak >= 1 },
    { day: 2, reward: '150 🪙', claimed: stats.dailyStreak >= 2 },
    { day: 3, reward: '200 🪙 + 1💎', claimed: stats.dailyStreak >= 3 },
    { day: 4, reward: '250 🪙', claimed: stats.dailyStreak >= 4 },
    { day: 5, reward: '300 🪙 + 2💎', claimed: stats.dailyStreak >= 5 },
    { day: 6, reward: '400 🪙', claimed: stats.dailyStreak >= 6 },
    { day: 7, reward: '1000 🪙 + 5💎', claimed: stats.dailyStreak >= 7, isGrand: true },
  ];

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="DAILY RUSH" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Header Card */}
        <WoodPanel style={styles.streakCard} variant="gold">
          <Text style={styles.flameIcon}>🔥</Text>
          <Text style={styles.streakCount}>{stats.dailyStreak} DAY STREAK!</Text>
          <Text style={styles.streakSub}>
            Play daily to multiply your rewards and unlock rare mascots!
          </Text>

          <GameButton
            title={alreadyClaimed ? 'CLAIMED TODAY' : 'CLAIM REWARD'}
            icon="🎁"
            variant={alreadyClaimed ? 'wood' : 'gold'}
            size="lg"
            disabled={alreadyClaimed}
            onPress={handleClaim}
            style={{ marginTop: 14 }}
          />

          {claimSuccess && (
            <Text style={styles.claimedSuccessText}>
              🎉 Claimed! +{200 + stats.dailyStreak * 50} Coins & Gems added!
            </Text>
          )}
        </WoodPanel>

        {/* 7-Day Calendar */}
        <Text style={styles.calendarTitle}>7-DAY STREAK CALENDAR</Text>

        <View style={styles.daysGrid}>
          {days.map((d) => (
            <View
              key={d.day}
              style={[
                styles.dayCard,
                d.claimed && styles.dayClaimed,
                d.isGrand && styles.dayGrand,
              ]}
            >
              <Text style={styles.dayNum}>DAY {d.day}</Text>
              <Text style={styles.dayIcon}>{d.isGrand ? '👑' : '🎁'}</Text>
              <Text style={styles.dayReward}>{d.reward}</Text>
              {d.claimed && <Text style={styles.checkMark}>✓</Text>}
            </View>
          ))}
        </View>

        {/* Today's Special Challenge */}
        <WoodPanel style={styles.specialChallengeCard} variant="card">
          <Text style={styles.challengeBadge}>TODAY'S SPECIAL EVENT</Text>
          <Text style={styles.challengeTitle}>🐅 TIGER COUNT FEVER</Text>
          <Text style={styles.challengeDesc}>
            Clear 10 fast rounds of Animal Count with 2x point rewards!
          </Text>

          <GameButton
            title="PLAY DAILY EVENT"
            icon="▶"
            variant="green"
            size="md"
            fullWidth
            onPress={() => startCountdown('animal-count', 'medium')}
            style={{ marginTop: 12 }}
          />
        </WoodPanel>

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
  streakCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  flameIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  streakCount: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  streakSub: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  claimedSuccessText: {
    color: '#2ED573',
    fontWeight: '900',
    fontSize: 13,
    marginTop: 10,
  },
  calendarTitle: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCard: {
    width: '23%',
    backgroundColor: '#0E223D',
    borderRadius: NRTheme.radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  dayGrand: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: '#FFD700',
    backgroundColor: '#1E1906',
  },
  dayClaimed: {
    borderColor: '#2ED573',
    backgroundColor: 'rgba(46, 213, 115, 0.1)',
  },
  dayNum: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
  },
  dayIcon: {
    fontSize: 20,
    marginVertical: 4,
  },
  dayReward: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 2,
    right: 4,
    color: '#2ED573',
    fontWeight: '900',
    fontSize: 14,
  },
  specialChallengeCard: {
    padding: 16,
  },
  challengeBadge: {
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
  },
  challengeDesc: {
    color: '#8CA0BA',
    fontSize: 12,
    lineHeight: 16,
  },
});
