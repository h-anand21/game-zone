// ============================================================
// DON'T TAP WRONG — Screen 13: Career Statistics
// Real saved player progression, high score records & metrics
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { DtwColors } from '../theme/colors';
import { calculateAccuracy } from '../engine/gameEngine';
import type { UserProfile } from '../types';

interface StatsScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ profile, onBack }) => {
  const lifetimeAccuracy = calculateAccuracy(profile.totalSafeTaps, profile.totalDangerTaps);
  const minutesPlayed = Math.round(profile.totalTimePlayedSeconds / 60);

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        <HeaderBar
          title="STATISTICS"
          subtitle="CAREER SERVICE RECORD"
          onBack={onBack}
        />

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* High Scores Arena Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🏆 HIGH SCORE RECORDS</Text>

            <View style={styles.recordRow}>
              <Text style={styles.recordLabel}>CLASSIC (20s):</Text>
              <Text style={[styles.recordValue, { color: DtwColors.safeGreen }]}>
                {profile.classicHighScore} PTS
              </Text>
            </View>

            <View style={styles.recordRow}>
              <Text style={styles.recordLabel}>STREAK RUSH (15s):</Text>
              <Text style={[styles.recordValue, { color: DtwColors.cyanAccent }]}>
                {profile.rushHighScore} PTS
              </Text>
            </View>

            <View style={styles.recordRow}>
              <Text style={styles.recordLabel}>ENDLESS SURVIVAL:</Text>
              <Text style={[styles.recordValue, { color: DtwColors.dangerRed }]}>
                {profile.survivalHighScore} PTS
              </Text>
            </View>

            <View style={styles.recordRow}>
              <Text style={styles.recordLabel}>DAILY BENCHMARK:</Text>
              <Text style={[styles.recordValue, { color: DtwColors.streakGold }]}>
                {profile.dailyHighScore} PTS
              </Text>
            </View>
          </View>

          {/* Combat Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>LIFETIME ACCURACY</Text>
              <Text style={[styles.metricBigNum, { color: DtwColors.cyanAccent }]}>
                {lifetimeAccuracy}%
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>BEST STREAK</Text>
              <Text style={[styles.metricBigNum, { color: DtwColors.streakGold }]}>
                {profile.bestStreak}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>TOTAL SAFE TAPS</Text>
              <Text style={[styles.metricBigNum, { color: DtwColors.safeGreen }]}>
                {profile.totalSafeTaps}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>HAZARDS TRIGGERED</Text>
              <Text style={[styles.metricBigNum, { color: DtwColors.dangerRed }]}>
                {profile.totalDangerTaps}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>TOTAL RUNS</Text>
              <Text style={styles.metricBigNum}>{profile.totalRuns}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>TIME PLAYED</Text>
              <Text style={styles.metricBigNum}>{minutesPlayed}m</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollList: {
    padding: 16,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: 'rgba(21, 28, 37, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(66, 217, 255, 0.35)',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: DtwColors.cyanAccent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: DtwColors.textSecondary,
    letterSpacing: 1,
  },
  recordValue: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(21, 28, 37, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  metricBigNum: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
});

export default StatsScreen;
