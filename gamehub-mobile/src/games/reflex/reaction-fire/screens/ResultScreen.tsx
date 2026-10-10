// ============================================================
// REACTION FIRE — Screen 08: Result Summary & Records
// Hero reaction-time measurement, rank grade, telemetry metrics & replay loop
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArcadeButton } from '../components/ArcadeButton';
import { NeonBadge } from '../components/NeonBadge';
import { formatMs } from '../logic/timing';
import { getClassificationColor } from '../logic/reactionEngine';
import { RfAudio } from '../audio/audioManager';
import { RfHaptics } from '../haptics/hapticManager';
import { RfColors } from '../theme';
import { RF_MODES } from '../config';
import type { RunResult } from '../types';

interface ResultScreenProps {
  result: RunResult;
  previousBestMs: number | null;
  onPlayAgain: () => void;
  onModeSelect: () => void;
  onBackToHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  previousBestMs,
  onPlayAgain,
  onModeSelect,
  onBackToHome,
}) => {
  const insets = useSafeAreaInsets();
  const modeConfig = RF_MODES[result.mode];
  const isEndurance = result.mode === 'endurance';
  const isFiveRound = result.mode === 'five-round';

  const classificationColor = getClassificationColor(result.classification);
  const isFalseStart = result.reactionTimeMs === null;

  useEffect(() => {
    if (result.isNewBest) {
      RfAudio.playNewRecord();
      RfHaptics.newRecord();
    }
  }, [result.isNewBest]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 10, 20),
            paddingBottom: Math.max(insets.bottom + 24, 36),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Mode Badge */}
        <View style={styles.header}>
          <NeonBadge
            label={modeConfig.name}
            color={modeConfig.badgeColor}
            size="compact"
          />
          <Text style={styles.subtitle}>COMBAT TELEMETRY REPORT</Text>
        </View>

        {/* Conditional Personal Best Celebration */}
        {result.isNewBest && (
          <View style={styles.recordBanner}>
            <Text style={styles.recordCrown}>👑</Text>
            <Text style={styles.recordTitle}>NEW PERSONAL BEST!</Text>
            <Text style={styles.recordSub}>
              {previousBestMs !== null
                ? `Improved from ${previousBestMs}ms to ${result.reactionTimeMs}ms!`
                : 'First benchmark logged!'}
            </Text>
          </View>
        )}

        {/* Hero Score Card */}
        <View style={styles.heroCard}>
          {isEndurance ? (
            <>
              <Text style={[styles.heroNumber, { color: RfColors.rewardGold }]}>
                {result.totalValidHits || 0}
              </Text>
              <Text style={styles.heroUnit}>VALID REFLEX STRIKES</Text>
              <View style={styles.badgeRow}>
                <NeonBadge
                  label="30s ENDURANCE"
                  color={RfColors.rewardGold}
                  size="compact"
                />
              </View>
            </>
          ) : isFalseStart ? (
            <>
              <Text style={[styles.heroNumber, { color: RfColors.signalRed }]}>FAILED</Text>
              <Text style={[styles.heroUnit, { color: RfColors.signalRed }]}>
                FALSE START DETECTED
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.heroNumber, { color: classificationColor }]}>
                {result.reactionTimeMs}
              </Text>
              <Text style={styles.heroUnit}>MILLISECONDS</Text>
              <View style={[styles.gradePill, { borderColor: classificationColor }]}>
                <Text style={[styles.gradeText, { color: classificationColor }]}>
                  {result.classification.toUpperCase()}
                </Text>
              </View>
            </>
          )}

          {/* Target Status */}
          <View style={styles.targetStatusBox}>
            <Text style={styles.targetStatusText}>
              {result.targetReached
                ? `✓ TARGET ACHIEVED (<${modeConfig.targetMs} ms)`
                : `TARGET WAS <${modeConfig.targetMs} ms`}
            </Text>
          </View>
        </View>

        {/* Detailed Metrics Grid */}
        <View style={styles.metricsGrid}>
          {isFiveRound && (
            <>
              <View style={styles.metricCell}>
                <Text style={styles.metricLabel}>MEAN TIME</Text>
                <Text style={[styles.metricValue, { color: RfColors.secondaryCyan }]}>
                  {formatMs(result.meanTimeMs)}
                </Text>
              </View>
              <View style={styles.metricCell}>
                <Text style={styles.metricLabel}>MEDIAN TIME</Text>
                <Text style={[styles.metricValue, { color: RfColors.primaryBlue }]}>
                  {formatMs(result.medianTimeMs)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>VALID ROUNDS</Text>
            <Text style={[styles.metricValue, { color: RfColors.goLime }]}>
              {result.totalRoundsCompleted}
            </Text>
          </View>

          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>FALSE STARTS</Text>
            <Text
              style={[
                styles.metricValue,
                { color: result.falseStartsCount > 0 ? RfColors.signalRed : RfColors.textPrimary },
              ]}
            >
              {result.falseStartsCount}
            </Text>
          </View>

          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>PREVIOUS BEST</Text>
            <Text style={[styles.metricValue, { color: RfColors.rewardGold }]}>
              {formatMs(previousBestMs)}
            </Text>
          </View>

          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>SCORE EARNED</Text>
            <Text style={styles.metricValue}>{result.score} PTS</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionBlock}>
          <ArcadeButton
            title="TRY AGAIN"
            variant="lime"
            size="large"
            icon="🔄"
            onPress={onPlayAgain}
            style={styles.btn}
          />

          <ArcadeButton
            title="MODE SELECT"
            variant="cyan"
            icon="🎮"
            onPress={onModeSelect}
            style={styles.btn}
          />

          <ArcadeButton
            title="BACK TO HOME"
            variant="glass"
            onPress={onBackToHome}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: RfColors.secondaryCyan,
    letterSpacing: 2,
    marginTop: 6,
  },
  recordBanner: {
    backgroundColor: 'rgba(255, 200, 87, 0.15)',
    borderWidth: 1.5,
    borderColor: RfColors.rewardGold,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    shadowColor: RfColors.rewardGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
  },
  recordCrown: {
    fontSize: 28,
    marginBottom: 2,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: RfColors.rewardGold,
    letterSpacing: 2,
  },
  recordSub: {
    fontSize: 11,
    color: RfColors.textSecondary,
    marginTop: 4,
  },
  heroCard: {
    width: '100%',
    backgroundColor: 'rgba(10, 23, 41, 0.95)',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(83, 225, 255, 0.3)',
    marginVertical: 8,
  },
  heroNumber: {
    fontSize: 66,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 74,
  },
  heroUnit: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
  },
  badgeRow: {
    marginTop: 4,
  },
  gradePill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(5, 9, 20, 0.8)',
    marginTop: 6,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  targetStatusBox: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  targetStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textSecondary,
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginVertical: 10,
  },
  metricCell: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(10, 23, 41, 0.8)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: RfColors.textPrimary,
  },
  actionBlock: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  btn: {
    width: '100%',
  },
});

export default ResultScreen;
