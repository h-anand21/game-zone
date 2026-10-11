// ============================================================
// STACK MASTER — Screen 11: Stats & Performance Dashboard
// Career metrics, mode performance, and recent run history
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';

interface StatsScreenProps {
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const bestScore = useStackStore((state) => state.bestScore);
  const bestHeight = useStackStore((state) => state.bestHeight);
  const highestCombo = useStackStore((state) => state.highestCombo);
  const totalRuns = useStackStore((state) => state.totalRuns);
  const totalPlacements = useStackStore((state) => state.totalPlacements);
  const totalPerfects = useStackStore((state) => state.totalPerfects);
  const totalPlayTimeSeconds = useStackStore((state) => state.totalPlayTimeSeconds);
  const modeBest = useStackStore((state) => state.modeBest);
  const runHistory = useStackStore((state) => state.runHistory);

  const perfectRate = totalPlacements > 0 ? Math.round((totalPerfects / totalPlacements) * 100) : 0;
  const minutesPlayed = Math.round(totalPlayTimeSeconds / 60);

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="CAREER STATS"
          subtitle="PERFORMANCE METRICS"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Lifetime Metrics Grid */}
          <View style={styles.metricsGrid}>
            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>BEST HEIGHT</Text>
              <Text style={styles.metricVal}>{bestHeight}</Text>
              <Text style={styles.metricSub}>SKY APEX</Text>
            </LinearGradient>

            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>HIGH SCORE</Text>
              <Text style={[styles.metricVal, { color: COLORS.gold }]}>{bestScore}</Text>
              <Text style={styles.metricSub}>LIFETIME BEST</Text>
            </LinearGradient>

            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>MAX COMBO</Text>
              <Text style={[styles.metricVal, { color: COLORS.magenta }]}>x{highestCombo}</Text>
              <Text style={styles.metricSub}>PERFECT STREAK</Text>
            </LinearGradient>

            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>PERFECT RATE</Text>
              <Text style={[styles.metricVal, { color: COLORS.cyan }]}>{perfectRate}%</Text>
              <Text style={styles.metricSub}>{totalPerfects} LANDED</Text>
            </LinearGradient>

            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>TOTAL RUNS</Text>
              <Text style={styles.metricVal}>{totalRuns}</Text>
              <Text style={styles.metricSub}>ASCENTS</Text>
            </LinearGradient>

            <LinearGradient colors={['#102E56', '#091C38']} style={styles.metricCard}>
              <Text style={styles.metricLabel}>TIME PLAYED</Text>
              <Text style={styles.metricVal}>{minutesPlayed}m</Text>
              <Text style={styles.metricSub}>IN ARENA</Text>
            </LinearGradient>
          </View>

          {/* Mode High Scores Breakdown */}
          <Text style={styles.sectionTitle}>MODE BREAKDOWN</Text>
          <LinearGradient colors={['#102E56', '#091C38']} style={styles.modesCard}>
            <View style={styles.modeRow}>
              <Text style={styles.modeName}>🏰 CLASSIC</Text>
              <Text style={styles.modeVal}>H: {modeBest.classic.height} | {modeBest.classic.score} PTS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.modeRow}>
              <Text style={styles.modeName}>🌸 ZEN REALM</Text>
              <Text style={styles.modeVal}>H: {modeBest.zen.height} | {modeBest.zen.score} PTS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.modeRow}>
              <Text style={styles.modeName}>⚡ SPEED RUSH</Text>
              <Text style={styles.modeVal}>H: {modeBest.rush.height} | {modeBest.rush.score} PTS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.modeRow}>
              <Text style={styles.modeName}>🎯 PRECISION</Text>
              <Text style={styles.modeVal}>H: {modeBest.precision.height} | {modeBest.precision.score} PTS</Text>
            </View>
          </LinearGradient>

          {/* Recent Runs History */}
          <Text style={styles.sectionTitle}>RECENT RUNS</Text>
          {runHistory.length === 0 ? (
            <Text style={styles.emptyText}>No ascents completed yet. Go stack your first spire!</Text>
          ) : (
            runHistory.slice(0, 10).map((r) => (
              <LinearGradient
                key={r.id}
                colors={['#13335E', '#0B1E38']}
                style={styles.historyRow}
              >
                <View>
                  <Text style={styles.histMode}>{r.mode.toUpperCase()}</Text>
                  <Text style={styles.histDate}>{r.date}</Text>
                </View>
                <View style={styles.histStats}>
                  <Text style={styles.histHeight}>H: {r.height}</Text>
                  <Text style={styles.histScore}>{r.score} pts</Text>
                </View>
                <View style={styles.histAccBadge}>
                  <Text style={styles.histAcc}>{r.accuracy}% ACC</Text>
                </View>
              </LinearGradient>
            ))
          )}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 14,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  metricVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.muted,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  modesCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 16,
    marginBottom: 20,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  modeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
  modeVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gold,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E3B68',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#244B82',
    padding: 12,
    marginBottom: 8,
  },
  histMode: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
  histDate: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  histStats: {
    alignItems: 'center',
  },
  histHeight: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.cyan,
  },
  histScore: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '700',
  },
  histAccBadge: {
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  histAcc: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
});
