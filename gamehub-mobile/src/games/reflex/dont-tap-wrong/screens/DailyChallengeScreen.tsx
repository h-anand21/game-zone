// ============================================================
// DON'T TAP WRONG — Screen 12: Daily Challenge
// Seeded daily board sequence, benchmark target & local record
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { NeonBadge } from '../components/common/NeonBadge';
import { DtwColors } from '../theme/colors';

interface DailyChallengeScreenProps {
  dailyHighScore: number;
  runsCompleted: number;
  onBack: () => void;
  onStartDaily: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  dailyHighScore,
  runsCompleted,
  onBack,
  onStartDaily,
}) => {
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        <HeaderBar
          title="DAILY CHALLENGE"
          subtitle="SEED-SYNCHRONIZED BENCHMARK"
          onBack={onBack}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Calendar Badge */}
          <View style={styles.dateBadge}>
            <NeonBadge label={todayStr.toUpperCase()} color={DtwColors.streakGold} />
          </View>

          {/* Daily Card */}
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🌟</Text>
            <Text style={styles.cardTitle}>TODAY'S MISSION</Text>
            <Text style={styles.cardTagline}>Identical 20s board sequence for all players</Text>

            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>Duration: 20 Seconds Blitz</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>Target Benchmark: 18 Correct Hits</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>Deterministic Seed: Same tile sequence every run</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>One mistake on a Red Tile immediately ends the run</Text>
              </View>
            </View>
          </View>

          {/* Player Daily Record */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TODAY'S BEST</Text>
              <Text style={[styles.statValue, { color: DtwColors.streakGold }]}>
                {dailyHighScore} PTS
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DAILY ATTEMPTS</Text>
              <Text style={styles.statValue}>{runsCompleted}</Text>
            </View>
          </View>

          {/* Start Action */}
          <View style={styles.actionContainer}>
            <ArcadeButton
              title="START TODAY'S CHALLENGE"
              variant="gold"
              size="large"
              icon="⚡"
              onPress={onStartDaily}
              style={styles.startBtn}
            />
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
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  dateBadge: {
    marginVertical: 12,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(21, 28, 37, 0.9)',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 214, 90, 0.4)',
    marginVertical: 10,
    shadowColor: DtwColors.streakGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: DtwColors.streakGold,
    letterSpacing: 2,
  },
  cardTagline: {
    fontSize: 11,
    color: DtwColors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  rulesList: {
    width: '100%',
    backgroundColor: 'rgba(8, 11, 16, 0.6)',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleBullet: {
    color: DtwColors.streakGold,
    fontSize: 16,
    fontWeight: '900',
  },
  ruleText: {
    fontSize: 12,
    color: DtwColors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginVertical: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(21, 28, 37, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  actionContainer: {
    width: '100%',
    marginTop: 10,
  },
  startBtn: {
    width: '100%',
  },
});

export default DailyChallengeScreen;
