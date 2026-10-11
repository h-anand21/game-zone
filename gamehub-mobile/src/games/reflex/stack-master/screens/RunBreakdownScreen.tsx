// ============================================================
// STACK MASTER — Screen 16: Run Breakdown Dashboard
// In-depth post-run precision analysis & metrics
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { COLORS } from '../theme/colors';
import type { RunRecord } from '../types';

interface RunBreakdownScreenProps {
  run: RunRecord;
  onPlayAgain: () => void;
  onBackToResults: () => void;
  onHome: () => void;
}

export const RunBreakdownScreen: React.FC<RunBreakdownScreenProps> = ({
  run,
  onPlayAgain,
  onBackToResults,
  onHome,
}) => {
  const insets = useSafeAreaInsets();
  const perfectPct = run.totalPlacements > 0
    ? Math.round((run.perfectPlacements / run.totalPlacements) * 100)
    : 0;

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="RUN ANALYSIS"
          subtitle="SPIRE METRICS"
          onBack={onBackToResults}
          showCurrency={false}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Score Banner */}
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.heroCard}
          >
            <View style={styles.heroHeader}>
              <Text style={styles.modeBadge}>{run.mode.toUpperCase()} RUN</Text>
              <Text style={styles.dateText}>{run.date}</Text>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatLabel}>FINAL HEIGHT</Text>
                <Text style={styles.heroStatVal}>{run.height}</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatLabel}>TOTAL SCORE</Text>
                <Text style={[styles.heroStatVal, { color: COLORS.gold }]}>{run.score}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Precision Breakdown */}
          <Text style={styles.sectionTitle}>PRECISION BREAKDOWN</Text>
          <LinearGradient colors={['#102E56', '#091C38']} style={styles.breakdownCard}>
            {/* Accuracy bar */}
            <View style={styles.accBarWrap}>
              <View style={styles.accBarLabels}>
                <Text style={styles.accLabel}>ALIGNMENT ACCURACY</Text>
                <Text style={styles.accVal}>{run.accuracy}%</Text>
              </View>
              <View style={styles.accTrack}>
                <View style={[styles.accFill, { width: `${run.accuracy}%` }]} />
              </View>
            </View>

            <View style={styles.metricsList}>
              <View style={styles.metricRow}>
                <Text style={styles.rowLabel}>✨ Perfect Alignments</Text>
                <Text style={[styles.rowVal, { color: COLORS.cyan }]}>
                  {run.perfectPlacements} ({perfectPct}%)
                </Text>
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.metricRow}>
                <Text style={styles.rowLabel}>✂️ Sliced Overhangs</Text>
                <Text style={styles.rowVal}>{run.partialPlacements}</Text>
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.metricRow}>
                <Text style={styles.rowLabel}>🔥 Longest Combo</Text>
                <Text style={[styles.rowVal, { color: COLORS.magenta }]}>
                  x{run.maxCombo}
                </Text>
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.metricRow}>
                <Text style={styles.rowLabel}>⏱️ Run Duration</Text>
                <Text style={styles.rowVal}>{run.durationSeconds} seconds</Text>
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.metricRow}>
                <Text style={styles.rowLabel}>🪙 Gold Rewards</Text>
                <Text style={[styles.rowVal, { color: COLORS.gold }]}>
                  +{run.height * 2 + run.perfectPlacements * 3}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <PrimaryButton
              title="PLAY AGAIN ▶"
              variant="green"
              onPress={onPlayAgain}
            />

            <SecondaryButton
              title="MAIN MENU 🏠"
              variant="panel"
              onPress={onHome}
            />
          </View>
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
  heroCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#244B82',
    padding: 18,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
  },
  heroStatVal: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#1E3B68',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  breakdownCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 18,
    marginBottom: 24,
  },
  accBarWrap: {
    marginBottom: 18,
  },
  accBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  accLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  accVal: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.success,
  },
  accTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#07162C',
    overflow: 'hidden',
  },
  accFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  metricsList: {
    gap: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  rowVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#1E3B68',
  },
  actions: {
    gap: 12,
  },
});
