import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GameButton } from '../components/buttons/GameButton';
import { GlassCard } from '../components/cards/GlassCard';
import { PBColors, PBTypography, PBRadius, PBShadows, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const DailyChallengeScreen: React.FC = () => {
  const { setScreen, startNewRun, dailyStreak, goBack } = usePatternBreakStore();

  const handleStartDaily = () => {
    startNewRun();
  };

  return (
    <GameBackground variant="gameplay">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="DAILY BREAK"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <View style={styles.centerContainer}>
          {/* Main Event Card */}
          <GlassCard variant="amber" style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View style={styles.badgePill}>
                <Image source={uiAssets.icons.calendar} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.badgeText}>SACRED MATRIX OF THE DAY</Text>
              </View>
              <View style={styles.rewardPill}>
                <Image source={uiAssets.icons.gift} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.rewardText}>+50 XP REWARD</Text>
              </View>
            </View>

            <View style={styles.mysteryBox}>
              <Ionicons name="help-circle-outline" size={48} color={PBColors.accent} style={styles.mysteryIcon} />
              <Text style={styles.mysteryTitle}>MYSTERY ANOMALY</Text>
              <Text style={styles.mysteryDesc}>
                10-round gauntlet with rapid rule shifts and no second chances.
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>DIFFICULTY</Text>
                <Text style={[styles.statVal, { color: PBColors.danger }]}>HARD</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>DAILY STREAK</Text>
                <View style={styles.streakValRow}>
                  <Ionicons name="flame" size={16} color={PBColors.accent} style={{ marginRight: 3 }} />
                  <Text style={[styles.statVal, { color: PBColors.accent }]}>
                    {dailyStreak} DAYS
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Calendar Day Dots */}
          <View style={styles.calendarRow}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => {
              const isDone = idx < 6;
              const isToday = idx === 6;
              return (
                <View key={day} style={styles.dayCol}>
                  <Text style={styles.dayLabel}>{day}</Text>
                  <View
                    style={[
                      styles.dayDot,
                      isDone && styles.dayDone,
                      isToday && styles.dayToday,
                    ]}
                  >
                    <Text style={styles.dayCheck}>
                      {isDone ? '✓' : isToday ? '★' : '•'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.challenge}
            height={72}
            onPress={handleStartDaily}
            accessibilityLabel="Play Daily Break Challenge"
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  eventCard: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  eventHeader: {
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: PBColors.accent,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.positive,
  },
  streakValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  mysteryBox: {
    alignItems: 'center',
    marginVertical: 4,
  },
  mysteryIcon: {
    fontSize: 34,
    marginBottom: 4,
  },
  mysteryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  mysteryDesc: {
    fontSize: 11,
    color: PBColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(24, 47, 57, 0.85)',
    padding: 12,
    borderRadius: PBRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.2)',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: PBColors.textMuted,
  },
  dayDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDone: {
    backgroundColor: 'rgba(56, 229, 140, 0.25)',
    borderWidth: 1,
    borderColor: PBColors.positive,
  },
  dayToday: {
    backgroundColor: 'rgba(255, 213, 74, 0.25)',
    borderWidth: 1.5,
    borderColor: PBColors.accent,
  },
  dayCheck: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bottomBar: {
    padding: 16,
  },
});
