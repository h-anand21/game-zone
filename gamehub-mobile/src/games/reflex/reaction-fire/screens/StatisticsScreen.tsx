// ============================================================
// REACTION FIRE — Screen 11: Statistics & Performance Analytics
// Overview metrics, mode comparisons & native SVG trend/distribution charts
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBar } from '../components/HeaderBar';
import { TrendChart } from '../components/TrendChart';
import { DistributionChart } from '../components/DistributionChart';
import { formatMs } from '../logic/timing';
import { getMean, getMedian } from '../logic/reactionEngine';
import { RfColors } from '../theme';
import type { ReactionStats } from '../types';

interface StatisticsScreenProps {
  stats: ReactionStats;
  onBack: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ stats, onBack }) => {
  const insets = useSafeAreaInsets();
  const validTimes = stats.recentAttempts
    .filter((a) => a.reactionTimeMs !== null && a.status === 'success')
    .map((a) => a.reactionTimeMs!);

  const averageMs = validTimes.length > 0 ? getMean(validTimes) : null;
  const medianMs = validTimes.length > 0 ? getMedian(validTimes) : null;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="STATISTICS"
        subtitle="COMBAT TELEMETRY LOG"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>🏆 OVERVIEW BENCHMARKS</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>PERSONAL BEST</Text>
              <Text style={[styles.metricValue, { color: RfColors.goLime }]}>
                {formatMs(stats.bestTimeMs)}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>AVERAGE (RECENT)</Text>
              <Text style={[styles.metricValue, { color: RfColors.secondaryCyan }]}>
                {formatMs(averageMs)}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>MEDIAN (RECENT)</Text>
              <Text style={[styles.metricValue, { color: RfColors.primaryBlue }]}>
                {formatMs(medianMs)}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>GAMES PLAYED</Text>
              <Text style={styles.metricValue}>{stats.completedGames}</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>VALID HITS</Text>
              <Text style={[styles.metricValue, { color: RfColors.goLime }]}>
                {stats.successfulAttempts}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>FALSE STARTS</Text>
              <Text style={[styles.metricValue, { color: RfColors.signalRed }]}>
                {stats.falseStarts}
              </Text>
            </View>
          </View>
        </View>

        {/* Mode Performance Comparison */}
        <View style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>🎮 MODE BEST RECORDS</Text>

          <View style={styles.modeRow}>
            <Text style={styles.modeRowLabel}>CLASSIC (1-SIGNAL):</Text>
            <Text style={[styles.modeRowValue, { color: RfColors.goLime }]}>
              {formatMs(stats.classicBestMs)}
            </Text>
          </View>

          <View style={styles.modeRow}>
            <Text style={styles.modeRowLabel}>5-ROUND (MEAN):</Text>
            <Text style={[styles.modeRowValue, { color: RfColors.secondaryCyan }]}>
              {formatMs(stats.fiveRoundBestMs)}
            </Text>
          </View>

          <View style={styles.modeRow}>
            <Text style={styles.modeRowLabel}>ENDURANCE (30s):</Text>
            <Text style={[styles.modeRowValue, { color: RfColors.rewardGold }]}>
              {stats.enduranceBestScore} HITS
            </Text>
          </View>

          <View style={styles.modeRow}>
            <Text style={styles.modeRowLabel}>FAKEOUT ARENA:</Text>
            <Text style={[styles.modeRowValue, { color: RfColors.primaryBlue }]}>
              {formatMs(stats.fakeoutBestMs)}
            </Text>
          </View>
        </View>

        {/* Reaction Time Trend Line Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📈 LATENCY TREND (LAST 10 RUNS)</Text>
          <TrendChart attempts={stats.recentAttempts} />
        </View>

        {/* Reaction Time Distribution Histogram */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📊 PERFORMANCE DISTRIBUTION</Text>
          <DistributionChart attempts={stats.recentAttempts} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  overviewCard: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: RfColors.secondaryCyan,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(5, 9, 20, 0.8)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: RfColors.textPrimary,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modeRowLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: RfColors.textSecondary,
    letterSpacing: 1,
  },
  modeRowValue: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chartSection: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});

export default StatisticsScreen;
