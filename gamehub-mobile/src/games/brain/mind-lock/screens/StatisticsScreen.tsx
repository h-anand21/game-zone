// ============================================================
// Mind Lock — Screen 14: Statistics Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { BottomNavigation } from '../components/BottomNavigation';
import { useMindLockStore } from '../store/mindLockStore';

export const StatisticsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { stats } = useMindLockStore();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'modes' | 'trends' | 'history'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'modes' as const, label: 'Game Modes', icon: '🎮' },
    { id: 'trends' as const, label: 'Trends', icon: '📈' },
    { id: 'history' as const, label: 'History', icon: '⏱️' },
  ];

  // SVG Chart Dimensions
  const chartWidth = width - 64;
  const chartHeight = 150;
  const points = stats.performanceHistory;
  const maxRounds = 20;

  // Build SVG Path
  const getCoordinates = (index: number, val: number) => {
    const x = (index / (points.length - 1)) * (chartWidth - 24) + 12;
    const y = chartHeight - (val / maxRounds) * (chartHeight - 30) - 15;
    return { x, y };
  };

  const pathD = points.reduce((acc: string, p: { date: string; rounds: number }, idx: number) => {
    const { x, y } = getCoordinates(idx, p.rounds);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Statistics" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner with Mascot */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>STATISTICS</Text>
            <Text style={styles.bannerSub}>
              Track your progress. See how your mind is growing!
            </Text>
          </View>
          <View style={styles.mascotSpeechContainer}>
            <View style={styles.speechPill}>
              <Text style={styles.speechText}>Keep Going!</Text>
            </View>
            <Mascot mood="stats" size={105} />
          </View>
        </View>

        {/* 4 Tabs Row */}
        <View style={styles.tabsRow}>
          {tabs.map((t) => {
            const isSelected = selectedTab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setSelectedTab(t.id)}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              >
                <Text style={styles.tabIcon}>{t.icon}</Text>
                <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 6 Key Metrics Cards Grid */}
        <View style={styles.metricsGrid}>
          {/* Average Round */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>⏱️</Text>
            <Text style={styles.metricLabel}>Average Round</Text>
            <Text style={styles.metricValue}>8.4</Text>
            <Text style={styles.trendGreen}>▲ +2.1 vs last 7 days</Text>
          </LinearGradient>

          {/* Highest Round */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>👑</Text>
            <Text style={styles.metricLabel}>Highest Round</Text>
            <Text style={styles.metricValue}>{stats.highestRound}</Text>
            <Text style={styles.trendGreen}>▲ +6 All time best</Text>
          </LinearGradient>

          {/* Accuracy */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>🎯</Text>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>{stats.accuracy}%</Text>
            <Text style={styles.trendGreen}>▲ +5% vs last 7 days</Text>
          </LinearGradient>

          {/* Total Games */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>🎮</Text>
            <Text style={styles.metricLabel}>Total Games</Text>
            <Text style={styles.metricValue}>{stats.totalGames}</Text>
            <Text style={styles.trendGreen}>▲ +12 Games played</Text>
          </LinearGradient>

          {/* Best Streak */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>🔥</Text>
            <Text style={styles.metricLabel}>Best Streak</Text>
            <Text style={styles.metricValue}>{stats.bestStreak}</Text>
            <Text style={styles.trendGreen}>▲ +3 Consecutive</Text>
          </LinearGradient>

          {/* Play Time */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.metricCard}>
            <Text style={styles.metricEmoji}>⏳</Text>
            <Text style={styles.metricLabel}>Total Play Time</Text>
            <Text style={styles.metricValue}>3h 45m</Text>
            <Text style={styles.trendGreen}>▲ +1h Time spent</Text>
          </LinearGradient>
        </View>

        {/* Performance Over Time (Interactive SVG Line Chart) */}
        <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleLeft}>
              <Text style={styles.chartIcon}>📈</Text>
              <Text style={styles.chartTitle}>Performance Over Time</Text>
            </View>
            <View style={styles.filterDropdown}>
              <Text style={styles.filterDropdownText}>Last 14 Days ▾</Text>
            </View>
          </View>

          {/* Tooltip highlight */}
          <View style={styles.tooltipBox}>
            <Text style={styles.tooltipText}>14 Rounds • Sep 20</Text>
          </View>

          {/* SVG Line Graph */}
          <View style={styles.svgWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Horizontal Grid lines */}
              {[0, 5, 10, 15, 20].map((val) => {
                const y = chartHeight - (val / maxRounds) * (chartHeight - 30) - 15;
                return (
                  <Line
                    key={val}
                    x1="10"
                    y1={y}
                    x2={chartWidth - 10}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Glowing Line */}
              <Path
                d={pathD}
                fill="none"
                stroke={MLColors.primary}
                strokeWidth="3.5"
              />

              {/* Dot Markers */}
              {points.map((p: { date: string; rounds: number }, idx: number) => {
                const { x, y } = getCoordinates(idx, p.rounds);
                return (
                  <Circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={idx === 4 ? 6 : 4}
                    fill={idx === 4 ? '#FFFFFF' : MLColors.primary}
                    stroke={MLColors.primaryDark}
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          </View>

          {/* Date Axis */}
          <View style={styles.dateAxis}>
            {points.map((p: { date: string; rounds: number }) => (
              <Text key={p.date} style={styles.dateLabel}>
                {p.date}
              </Text>
            ))}
          </View>
        </LinearGradient>

        {/* Round Distribution & Accuracy by Mode */}
        <View style={styles.distributionRow}>
          {/* Bar Chart: Round Distribution */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.subChartCard}>
            <Text style={styles.subChartTitle}>Round Distribution</Text>
            <View style={styles.barChartContainer}>
              {Object.entries(stats.roundDistribution).map(([range, countVal]) => {
                const count = countVal as number;
                const maxCount = 20;
                const barHeight = (count / maxCount) * 80;
                return (
                  <View key={range} style={styles.barCol}>
                    <Text style={styles.barCount}>{count}</Text>
                    <View style={[styles.bar, { height: barHeight }]}>
                      <LinearGradient
                        colors={MLColors.goldGradient as [string, string, ...string[]]}
                        style={styles.barFill}
                      />
                    </View>
                    <Text style={styles.barLabel}>{range}</Text>
                  </View>
                );
              })}
            </View>
          </LinearGradient>

          {/* Accuracy by Mode */}
          <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.subChartCard}>
            <Text style={styles.subChartTitle}>Accuracy by Mode</Text>
            <View style={styles.modesProgressList}>
              {[
                { name: 'Classic', val: stats.modeAccuracy.classic, color: MLColors.primary },
                { name: 'Speed', val: stats.modeAccuracy.speed, color: MLColors.padBlue },
                { name: 'Streak', val: stats.modeAccuracy.streak, color: MLColors.padRed },
                { name: 'Pattern', val: stats.modeAccuracy.pattern, color: MLColors.purple },
              ].map((m) => (
                <View key={m.name} style={styles.modeProgressRow}>
                  <Text style={styles.modeProgressName}>{m.name}</Text>
                  <View style={styles.modeMiniTrack}>
                    <View
                      style={[
                        styles.modeMiniFill,
                        { width: `${m.val}%`, backgroundColor: m.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.modeProgressPercent}>{m.val}%</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      <BottomNavigation currentTab="statistics" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  scrollContent: {
    paddingHorizontal: MLSpacing.base,
    paddingBottom: MLSpacing.xl,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F2033',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    marginVertical: MLSpacing.sm,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: MLColors.primary,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  bannerSub: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    marginTop: 2,
    lineHeight: 16,
  },
  mascotSpeechContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  speechPill: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: MLRadius.pill,
    zIndex: 10,
    ...MLShadows.sm,
  },
  speechText: {
    color: '#0A121D',
    fontSize: 9,
    fontWeight: MLTypography.black,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: MLSpacing.xs,
    marginVertical: MLSpacing.sm,
    backgroundColor: '#0A1523',
    padding: 3,
    borderRadius: MLRadius.pill,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: MLRadius.pill,
    gap: 4,
  },
  tabBtnActive: {
    backgroundColor: MLColors.primary,
    ...MLShadows.glowGold,
  },
  tabIcon: {
    fontSize: 12,
  },
  tabLabel: {
    color: MLColors.textMuted,
    fontSize: 11,
    fontWeight: MLTypography.bold,
  },
  tabLabelActive: {
    color: '#0A121D',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MLSpacing.sm,
    marginVertical: MLSpacing.sm,
  },
  metricCard: {
    width: '48%',
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
  },
  metricEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  metricLabel: {
    color: MLColors.textMuted,
    fontSize: 10,
    fontWeight: MLTypography.semibold,
  },
  metricValue: {
    color: MLColors.white,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    marginVertical: 2,
  },
  trendGreen: {
    color: MLColors.success,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  chartCard: {
    padding: MLSpacing.base,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    marginVertical: MLSpacing.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MLSpacing.sm,
  },
  chartTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartIcon: {
    fontSize: 16,
  },
  chartTitle: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  filterDropdown: {
    backgroundColor: '#091523',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
  },
  filterDropdownText: {
    color: MLColors.textMuted,
    fontSize: 10,
  },
  tooltipBox: {
    alignSelf: 'center',
    backgroundColor: '#1E3552',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: MLColors.primary,
    marginBottom: 4,
  },
  tooltipText: {
    color: MLColors.primary,
    fontSize: 10,
    fontWeight: MLTypography.bold,
  },
  svgWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  dateAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  dateLabel: {
    color: MLColors.textDim,
    fontSize: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    marginVertical: MLSpacing.sm,
  },
  subChartCard: {
    flex: 1,
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  subChartTitle: {
    color: MLColors.white,
    fontSize: 11,
    fontWeight: MLTypography.bold,
    marginBottom: MLSpacing.sm,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  barCol: {
    alignItems: 'center',
    gap: 4,
  },
  barCount: {
    color: MLColors.textDim,
    fontSize: 8,
  },
  bar: {
    width: 14,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#0A1523',
  },
  barFill: {
    width: '100%',
    height: '100%',
  },
  barLabel: {
    color: MLColors.textMuted,
    fontSize: 8,
  },
  modesProgressList: {
    gap: 8,
    justifyContent: 'center',
    height: 100,
  },
  modeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeProgressName: {
    color: MLColors.textMuted,
    fontSize: 9,
    width: 42,
  },
  modeMiniTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#091523',
    borderRadius: 3,
    overflow: 'hidden',
  },
  modeMiniFill: {
    height: '100%',
    borderRadius: 3,
  },
  modeProgressPercent: {
    color: MLColors.white,
    fontSize: 9,
    fontWeight: MLTypography.bold,
    width: 28,
    textAlign: 'right',
  },
});
