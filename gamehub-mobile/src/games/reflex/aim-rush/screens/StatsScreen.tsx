// ============================================================
// AIM RUSH — Screen 11: StatsScreen
// Lifetime player skill metrics and historical telemetry
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushUserProfile } from '../types';

interface StatsScreenProps {
  profile: AimRushUserProfile;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ profile, onBack }) => {
  const totalAttempts = profile.totalTargetsHit + profile.totalMisses;
  const careerAccuracy =
    totalAttempts > 0
      ? Math.round((profile.totalTargetsHit / totalAttempts) * 100)
      : 0;

  const playMinutes = Math.floor(profile.totalPlayTimeSeconds / 60);
  const playSeconds = profile.totalPlayTimeSeconds % 60;

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={ARColors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>CAREER STATS</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* Hero Best Score Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>PERSONAL BEST RECORD</Text>
            <Text style={styles.heroScore}>{profile.personalBestScore}</Text>
            <Text style={styles.heroSub}>
              MAX CHAIN STREAK: ×{profile.bestChain.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* Metrics Grid */}
          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>TOTAL RUNS</Text>
              <Text style={styles.cellValue}>{profile.totalRuns}</Text>
            </View>

            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>TARGETS HIT</Text>
              <Text style={[styles.cellValue, { color: ARColors.cyan }]}>
                {profile.totalTargetsHit}
              </Text>
            </View>

            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>PERFECT HITS</Text>
              <Text style={[styles.cellValue, { color: ARColors.lime }]}>
                {profile.totalPerfects}
              </Text>
            </View>

            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>CAREER ACCURACY</Text>
              <Text style={[styles.cellValue, { color: ARColors.gold }]}>
                {careerAccuracy}%
              </Text>
            </View>

            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>TOTAL MISSES</Text>
              <Text style={[styles.cellValue, { color: ARColors.red }]}>
                {profile.totalMisses}
              </Text>
            </View>

            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>TOTAL PLAYTIME</Text>
              <Text style={styles.cellValue}>
                {playMinutes}m {playSeconds}s
              </Text>
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  scrollList: {
    gap: 16,
    paddingBottom: 20,
  },
  heroCard: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.5,
  },
  heroScore: {
    fontSize: 48,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    marginTop: 4,
  },
  heroSub: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 1.2,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  cellLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  cellValue: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    marginTop: 4,
  },
});
