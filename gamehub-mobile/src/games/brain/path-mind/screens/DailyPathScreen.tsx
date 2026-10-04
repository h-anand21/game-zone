// ============================================================
// PATH MIND — Screen 15: DailyPathScreen
// Daily Expedition Challenge, Calendar Streak & Relic Chest
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS = [
  { day: 1, label: 'MON', status: 'done', reward: '10' },
  { day: 2, label: 'TUE', status: 'done', reward: '15' },
  { day: 3, label: 'WED', status: 'done', reward: '20' },
  { day: 4, label: 'THU', status: 'done', reward: '25' },
  { day: 5, label: 'FRI', status: 'today', reward: '50' },
  { day: 6, label: 'SAT', status: 'locked', reward: '75' },
  { day: 7, label: 'SUN', status: 'chest', reward: 'CHEST' },
];

export const DailyPathScreen: React.FC = () => {
  const { setScreen, streak, hearts, coins } = usePathMindStore();

  const handlePlayDaily = () => {
    usePathMindStore.setState({ selectedMode: 'DAILY PATH' });
    setScreen('gameplay');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('home')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <View style={styles.container}>
        <TitlePlaque
          title="DAILY EXPEDITION"
          subtitle="TODAY'S SACRED PUZZLE"
          variant="gold"
          size="medium"
          style={styles.titlePlaque}
        />

        {/* Streak & Timer Banner */}
        <View style={styles.streakBanner}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streak}-DAY EXPEDITION STREAK</Text>
        </View>

        {/* 7-Day Streak Timeline */}
        <GamePanel variant="stone" style={styles.calendarPanel}>
          <Text style={styles.panelTitle}>WEEKLY EXPEDITION TRAIL</Text>
          <View style={styles.daysRow}>
            {DAYS.map((d) => (
              <View
                key={d.day}
                style={[
                  styles.dayCard,
                  d.status === 'today' && styles.todayCard,
                  d.status === 'done' && styles.doneCard,
                ]}
              >
                <Text style={styles.dayLabel}>{d.label}</Text>
                <View style={styles.rewardIconWrap}>
                  {d.status === 'done' ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : d.status === 'chest' ? (
                    <Text style={styles.chestIcon}>🎁</Text>
                  ) : (
                    <Text style={styles.coinReward}>◉ {d.reward}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.dayStatus,
                    d.status === 'today' && { color: pmColors.goldBright, fontWeight: '900' },
                  ]}
                >
                  {d.status === 'today' ? 'TODAY' : d.status === 'done' ? 'DONE' : 'LOCK'}
                </Text>
              </View>
            ))}
          </View>
        </GamePanel>

        {/* Grand Chest Teaser */}
        <GamePanel variant="wood" style={styles.chestPanel}>
          <Text style={styles.chestHeader}>🏺 WEEKEND REWARD CHEST</Text>
          <Text style={styles.chestSub}>
            Complete today to unlock the ancient Valley Cartographer Relic and +150 bonus coins!
          </Text>
        </GamePanel>

        {/* CTA Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            label="PLAY TODAY'S PUZZLE"
            iconName="play"
            variant="gold"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 280)}
            height={60}
            onPress={handlePlayDaily}
            accessibilityLabel="Play Today's Puzzle"
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginTop: 4,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
    borderWidth: 1.5,
    borderColor: pmColors.warningOrange,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    ...pmShadows.medium,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.8,
  },
  calendarPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.textCyan,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 12, 18, 0.8)',
    borderRadius: pmRadii.sm,
    borderWidth: 1,
    borderColor: pmColors.stoneBorder,
    paddingVertical: 6,
    width: (SCREEN_WIDTH - 84) / 7,
  },
  todayCard: {
    borderColor: pmColors.goldBright,
    backgroundColor: 'rgba(50, 35, 10, 0.9)',
    ...pmShadows.glowGold,
  },
  doneCard: {
    borderColor: pmColors.successGreen,
    backgroundColor: 'rgba(10, 30, 15, 0.8)',
  },
  dayLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: pmColors.textMuted,
  },
  rewardIconWrap: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.successGreen,
  },
  chestIcon: {
    fontSize: 16,
  },
  coinReward: {
    fontSize: 8,
    fontWeight: '700',
    color: pmColors.gold,
  },
  dayStatus: {
    fontSize: 7,
    fontWeight: '800',
    color: pmColors.textSecondary,
  },
  chestPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    alignItems: 'center',
  },
  chestHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  chestSub: {
    ...pmTypography.caption,
    color: pmColors.textWood,
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
