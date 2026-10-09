// ============================================================
// REACTION FIRE — Screen 09: Daily Challenge
// Date-synchronized speed test with 5 attempts & local completion tracking
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { HeaderBar } from '../components/HeaderBar';
import { ArcadeButton } from '../components/ArcadeButton';
import { NeonBadge } from '../components/NeonBadge';
import { formatMs } from '../logic/timing';
import { DEFAULT_DAILY_CHALLENGE } from '../logic/dailyChallenge';
import { RfColors } from '../theme';
import type { DailyChallengeState } from '../types';

interface DailyChallengeScreenProps {
  dailyState: DailyChallengeState;
  onBack: () => void;
  onStartDaily: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  dailyState,
  onBack,
  onStartDaily,
}) => {
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const canPlay = dailyState.attemptsLeft > 0 && !dailyState.completed;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="DAILY CHALLENGE"
        subtitle="SYNCHRONIZED BENCHMARK"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <NeonBadge label={todayFormatted.toUpperCase()} color={RfColors.rewardGold} />
        </View>

        {/* Mission Card */}
        <View style={styles.missionCard}>
          <Text style={styles.missionIcon}>🌟</Text>
          <Text style={styles.missionTitle}>{DEFAULT_DAILY_CHALLENGE.title}</Text>
          <Text style={styles.missionDesc}>{DEFAULT_DAILY_CHALLENGE.objective}</Text>

          <View style={styles.rulesBox}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>Threshold: Sub-{DEFAULT_DAILY_CHALLENGE.targetMs} ms</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>Attempts: {dailyState.attemptsLeft} of {DEFAULT_DAILY_CHALLENGE.maxAttempts} remaining</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>Reward: +{DEFAULT_DAILY_CHALLENGE.rewardXp} XP upon victory</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>False starts consume an attempt quota</Text>
            </View>
          </View>
        </View>

        {/* Today's Status Box */}
        <View style={styles.statusBox}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>TODAY'S BEST</Text>
            <Text style={[styles.statusValue, { color: RfColors.goLime }]}>
              {formatMs(dailyState.bestTimeMs)}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>STATUS</Text>
            <Text
              style={[
                styles.statusValue,
                { color: dailyState.completed ? RfColors.goLime : RfColors.secondaryCyan },
              ]}
            >
              {dailyState.completed
                ? 'VICTORY SECURED'
                : dailyState.attemptsLeft === 0
                ? 'ATTEMPTS EXHAUSTED'
                : 'ACTIVE'}
            </Text>
          </View>
        </View>

        {/* Start Action */}
        <View style={styles.actionContainer}>
          <ArcadeButton
            title={
              dailyState.completed
                ? 'CHALLENGE COMPLETED'
                : dailyState.attemptsLeft === 0
                ? 'OUT OF ATTEMPTS'
                : `ATTEMPT RUN (${dailyState.attemptsLeft} LEFT)`
            }
            variant={dailyState.completed ? 'glass' : 'gold'}
            size="large"
            icon="⚡"
            disabled={!canPlay}
            onPress={onStartDaily}
            style={styles.actionBtn}
          />
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
    padding: 20,
    alignItems: 'center',
  },
  dateBadge: {
    marginVertical: 10,
  },
  missionCard: {
    width: '100%',
    backgroundColor: 'rgba(10, 23, 41, 0.95)',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 200, 87, 0.4)',
    marginVertical: 8,
    shadowColor: RfColors.rewardGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  missionIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: RfColors.rewardGold,
    letterSpacing: 2,
  },
  missionDesc: {
    fontSize: 12,
    color: RfColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 10,
    maxWidth: 300,
  },
  rulesBox: {
    width: '100%',
    backgroundColor: 'rgba(5, 9, 20, 0.7)',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginTop: 6,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleBullet: {
    color: RfColors.rewardGold,
    fontSize: 14,
    fontWeight: '900',
  },
  ruleText: {
    fontSize: 11,
    color: RfColors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  statusBox: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginVertical: 12,
  },
  statusItem: {
    flex: 1,
    backgroundColor: 'rgba(10, 23, 41, 0.85)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: RfColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    marginTop: 12,
  },
  actionBtn: {
    width: '100%',
  },
});

export default DailyChallengeScreen;
