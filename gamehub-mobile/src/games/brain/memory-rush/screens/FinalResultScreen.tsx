// ============================================================
// MEMORY RUSH — 10 Final Result Screen (Performance Analytics)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import { getPerformanceTitle } from '../logic/scoring';

interface FinalResultScreenProps {
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onHome: () => void;
}

export const FinalResultScreen: React.FC<FinalResultScreenProps> = ({
  onPlayAgain,
  onChangeMode,
  onHome,
}) => {
  const { score, maxCombo, correctAnswers, totalAttempts } = useMemoryRushStore();

  const accuracy = Math.round((correctAnswers / Math.max(1, totalAttempts)) * 100);
  const perfTitle = getPerformanceTitle(accuracy, maxCombo, score);

  return (
    <GameBackground theme="stats">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>RUN COMPLETE</Text>
          <View style={styles.perfBadge}>
            <MRIcon name="star" size={11} color={MRColors.cyanBright} />
            <Text style={styles.perfText}>{perfTitle}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Huge Score Card */}
          <GlassCard glowing style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreVal}>{score.toLocaleString()}</Text>

            {/* 4 Compact Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCell}>
                <MRIcon name="target" size={12} color={MRColors.yellowStatus} />
                <Text style={styles.mLabel}>ACCURACY</Text>
                <Text style={styles.mValYellow}>{accuracy}%</Text>
              </View>
              <View style={styles.metricCell}>
                <MRIcon name="zap" size={12} color={MRColors.cyanBright} />
                <Text style={styles.mLabel}>BEST COMBO</Text>
                <Text style={styles.mValCyan}>×{maxCombo}</Text>
              </View>
              <View style={styles.metricCell}>
                <MRIcon name="clock" size={12} color={MRColors.textPrimary} />
                <Text style={styles.mLabel}>REACTION</Text>
                <Text style={styles.mValWhite}>0.76s</Text>
              </View>
              <View style={styles.metricCell}>
                <MRIcon name="award" size={12} color={MRColors.cyanBright} />
                <Text style={styles.mLabel}>MEMORY LVL</Text>
                <Text style={styles.mValCyan}>12</Text>
              </View>
            </View>
          </GlassCard>

          {/* Simple Performance Chart */}
          <GlassCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <MRIcon name="bar-chart-2" size={14} color={MRColors.cyanBright} />
              <Text style={styles.chartTitle}>ROUND PERFORMANCE</Text>
            </View>

            <View style={styles.chartStack}>
              <View style={styles.chartRow}>
                <Text style={styles.rowLabel}>Round 1</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '85%' }]} />
                </View>
              </View>
              <View style={styles.chartRow}>
                <Text style={styles.rowLabel}>Round 2</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '95%' }]} />
                </View>
              </View>
              <View style={styles.chartRow}>
                <Text style={styles.rowLabel}>Round 3</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '70%' }]} />
                </View>
              </View>
              <View style={styles.chartRow}>
                <Text style={styles.rowLabel}>Round 4</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '100%' }]} />
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Buttons Stack */}
          <View style={styles.btnStack}>
            <PrimaryButton
              title="PLAY AGAIN →"
              size="lg"
              variant="cyan"
              onPress={onPlayAgain}
            />
            <SecondaryButton
              title="CHANGE MODE"
              size="md"
              onPress={onChangeMode}
            />
            <Pressable onPress={onHome} style={styles.homeLink}>
              <Text style={styles.homeLinkText}>BACK HOME →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  perfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(34, 211, 238, 0.35)',
    marginTop: 4,
  },
  perfText: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  scoreCard: {
    alignItems: 'center',
    padding: 18,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  scoreVal: {
    fontSize: 48,
    fontWeight: '900',
    color: MRColors.cyanBright,
    marginVertical: 4,
    textShadowColor: MRColors.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
    gap: 6,
  },
  metricCell: {
    flex: 1,
    backgroundColor: 'rgba(8, 10, 13, 0.85)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
    gap: 3,
  },
  mLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 0.5,
  },
  mValYellow: {
    fontSize: 13,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  mValCyan: {
    fontSize: 13,
    fontWeight: '900',
    color: MRColors.cyanBright,
  },
  mValWhite: {
    fontSize: 13,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  chartCard: {
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.textSecondary,
    letterSpacing: 1.2,
  },
  chartStack: {
    gap: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.textMuted,
    width: 55,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: MRColors.surfaceElevated,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: MRColors.primaryCyan,
  },
  btnStack: {
    gap: 10,
    marginTop: 6,
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  homeLinkText: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
  },
});
