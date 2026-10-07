// ============================================================
// AIM RUSH — Screen 09: ResultScreen
// Authentic arcade machine telemetry, score breakdown, and instant replay
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushRunResult } from '../types';

interface ResultScreenProps {
  result: AimRushRunResult;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onPlayAgain,
  onHome,
}) => {
  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Title */}
          <View style={styles.header}>
            <Text style={styles.title}>RUN TERMINATED</Text>
            <Text style={styles.subtitle}>TACTICAL PERFORMANCE REPORT</Text>
          </View>

          {/* New Personal Best Celebration Pill */}
          {result.isNewPersonalBest && (
            <View style={styles.bestBanner}>
              <Ionicons name="trophy" size={20} color={ARColors.gold} />
              <Text style={styles.bestText}>✦ NEW PERSONAL RECORD! ✦</Text>
            </View>
          )}

          {/* Master Score Display */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>TOTAL RUN SCORE</Text>
            <Text style={styles.scoreValue}>{result.score}</Text>
            <Text style={styles.scoreModeTag}>
              MODE: {result.mode.toUpperCase()}
            </Text>
          </View>

          {/* Key Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>TARGETS HIT</Text>
              <Text style={styles.metricValue}>{result.totalHits}</Text>
            </View>

            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>PERFECT HITS</Text>
              <Text style={[styles.metricValue, { color: ARColors.lime }]}>
                {result.perfectHits}
              </Text>
            </View>

            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>MAX CHAIN</Text>
              <Text style={[styles.metricValue, { color: ARColors.cyan }]}>
                ×{result.maxChain.toString().padStart(2, '0')}
              </Text>
            </View>

            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>ACCURACY</Text>
              <Text style={[styles.metricValue, { color: ARColors.gold }]}>
                {result.accuracy}%
              </Text>
            </View>
          </View>

          {/* Performance Skill Breakdown Bars */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>SKILL TELEMETRY</Text>

            <View style={styles.barGroup}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>PRECISION (SWEET-SPOT)</Text>
                <Text style={styles.barPercent}>
                  {result.totalHits > 0
                    ? Math.round((result.perfectHits / result.totalHits) * 100)
                    : 0}
                  %
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${
                        result.totalHits > 0
                          ? Math.round((result.perfectHits / result.totalHits) * 100)
                          : 0
                      }%`,
                      backgroundColor: ARColors.lime,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.barGroup}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>CONSISTENCY (CHAIN LENGTH)</Text>
                <Text style={styles.barPercent}>
                  {Math.min(100, result.maxChain * 7)}%
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(100, result.maxChain * 7)}%`,
                      backgroundColor: ARColors.cyan,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Fast Action Buttons */}
        <View style={styles.bottomButtons}>
          <Pressable style={styles.replayButton} onPress={onPlayAgain}>
            <Ionicons name="refresh" size={18} color="#07090C" />
            <Text style={styles.replayText}>PLAY AGAIN ▶</Text>
          </Pressable>

          <Pressable style={styles.homeButton} onPress={onHome}>
            <Ionicons name="home-outline" size={18} color={ARColors.white} />
            <Text style={styles.homeText}>HOME</Text>
          </Pressable>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 2,
    marginTop: 4,
  },
  bestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderWidth: 1.5,
    borderColor: ARColors.gold,
    borderRadius: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  bestText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.gold,
    letterSpacing: 1.2,
  },
  scoreCard: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    marginTop: 4,
  },
  scoreModeTag: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.white,
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.2,
  },
  barGroup: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  barPercent: {
    fontSize: 9,
    fontWeight: '900',
    color: ARColors.white,
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: ARColors.surfaceDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomButtons: {
    gap: 10,
    marginTop: 10,
  },
  replayButton: {
    width: '100%',
    height: 52,
    backgroundColor: ARColors.cyan,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  replayText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.5,
  },
  homeButton: {
    width: '100%',
    height: 44,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homeText: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 1,
  },
});
