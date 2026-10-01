// ============================================================
// Number Rush — Screen 15: DAILY RUSH (Derived Visual System)
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
import { HeaderHUD, GameButton, WoodPanel, MascotIllustration } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const DailyRushModal: React.FC = () => {
  const { setScreen, startCountdown, stats, claimDailyReward } = useNumberRushStore();

  const handleStartDailyChallenge = () => {
    startCountdown('mixed-rush', 'medium');
  };

  const streakDays = [
    { day: 1, reward: '100 🪙', claimed: true },
    { day: 2, reward: '150 🪙', claimed: true },
    { day: 3, reward: '200 🪙', claimed: stats.dailyStreak >= 3 },
    { day: 4, reward: '250 🪙', claimed: stats.dailyStreak >= 4 },
    { day: 5, reward: '300 🪙', claimed: stats.dailyStreak >= 5 },
    { day: 6, reward: '400 🪙', claimed: stats.dailyStreak >= 6 },
    { day: 7, reward: '🎁 CHEST', claimed: stats.dailyStreak >= 7, isChest: true },
  ];

  const challenges = [
    { num: 1, title: 'Wild Tiger Sprint', mode: 'Animal Count', reward: '+100 🪙', done: true },
    { num: 2, title: 'Lightning Arithmetic', mode: 'Quick Rush', reward: '+120 🪙', done: true },
    { num: 3, title: 'Emoji Radar', mode: 'Emoji Count', reward: '+150 🪙', done: false, active: true },
    { num: 4, title: 'Matrix Mystery', mode: 'Number Box', reward: '+180 🪙', done: false },
    { num: 5, title: 'Grand Jungle Finale', mode: 'Mixed Rush', reward: '+250 🪙 + 10 💎', done: false, isBoss: true },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="DAILY RUSH" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Daily Rush Header Billboard */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={80} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <Text style={styles.billboardSub}>DAILY BRAIN EXPEDITION</Text>
            <Text style={styles.billboardTitle}>DAILY RUSH</Text>
            <Text style={styles.billboardDesc}>
              Complete today's 5-stage gauntlet for exclusive rewards!
            </Text>
          </View>
        </View>

        {/* 4. 7-Day Streak Calendar */}
        <WoodPanel style={styles.streakPanel} variant="card" hasRivets={false}>
          <View style={styles.streakHeader}>
            <View style={styles.streakTitleRow}>
              <Text style={styles.flameIcon}>🔥</Text>
              <Text style={styles.streakTitle}>
                {stats.dailyStreak}-DAY RUSH STREAK
              </Text>
            </View>
            <Text style={styles.streakSubtitle}>Keep your streak alive!</Text>
          </View>

          <View style={styles.calendarRow}>
            {streakDays.map((item) => (
              <View
                key={item.day}
                style={[
                  styles.dayCard,
                  item.claimed && styles.dayCardClaimed,
                  item.isChest && styles.dayCardChest,
                ]}
              >
                <Text style={styles.dayLabel}>DAY {item.day}</Text>
                <Text style={styles.dayRewardText}>{item.reward}</Text>
                {item.claimed && <Text style={styles.checkMini}>✓</Text>}
              </View>
            ))}
          </View>
        </WoodPanel>

        {/* 5. 5-Stage Daily Gauntlet List */}
        <Text style={styles.sectionHeaderTitle}>TODAY'S 5-STAGE GAUNTLET</Text>

        <View style={styles.challengeList}>
          {challenges.map((c) => (
            <View
              key={c.num}
              style={[
                styles.challengeRow,
                c.done && styles.challengeDone,
                c.active && styles.challengeActive,
                c.isBoss && styles.challengeBoss,
              ]}
            >
              <View
                style={[
                  styles.numCircle,
                  c.done && { backgroundColor: '#2ED573' },
                  c.active && { backgroundColor: '#FFD700' },
                ]}
              >
                <Text
                  style={[
                    styles.numCircleText,
                    (c.done || c.active) && { color: '#04160D' },
                  ]}
                >
                  {c.done ? '✓' : c.num}
                </Text>
              </View>

              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{c.title}</Text>
                <Text style={styles.challengeMode}>
                  {c.mode} • {c.reward}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  c.done && styles.statusBadgeDone,
                  c.active && styles.statusBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    c.active && { color: '#04160D' },
                  ]}
                >
                  {c.done ? 'DONE' : c.active ? 'READY' : 'LOCKED'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 6. Primary Action CTA Button */}
        <GameButton
          title="START TODAY'S RUSH"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={handleStartDailyChallenge}
          style={styles.startBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerBillboard: {
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#FFC107',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotHolder: {
    marginBottom: 4,
  },
  billboardBody: {
    alignItems: 'center',
  },
  billboardSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  billboardDesc: {
    color: '#D8E2DD',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  streakPanel: {
    padding: 14,
    marginBottom: 16,
  },
  streakHeader: {
    marginBottom: 10,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  streakTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  streakSubtitle: {
    color: '#8CA0BA',
    fontSize: 10,
    marginTop: 2,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayCardClaimed: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    borderColor: '#2ED573',
  },
  dayCardChest: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  dayLabel: {
    color: '#8CA0BA',
    fontSize: 8,
    fontWeight: '900',
    marginBottom: 2,
  },
  dayRewardText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  checkMini: {
    color: '#2ED573',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
  sectionHeaderTitle: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  challengeList: {
    gap: 10,
    marginBottom: 18,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
  },
  challengeDone: {
    borderColor: '#2ED573',
    opacity: 0.8,
  },
  challengeActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(11, 40, 72, 0.95)',
  },
  challengeBoss: {
    borderColor: '#FF4757',
  },
  numCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  challengeMode: {
    color: '#8CA0BA',
    fontSize: 10,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusBadgeDone: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
  },
  statusBadgeActive: {
    backgroundColor: '#FFD700',
  },
  statusBadgeText: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '900',
  },
  startBtn: {
    marginTop: 4,
  },
});
