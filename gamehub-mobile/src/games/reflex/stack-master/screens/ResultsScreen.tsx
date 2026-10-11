// ============================================================
// STACK MASTER — Screen 09: Game Over Results Screen
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';
import type { RunRecord } from '../types';

interface ResultsScreenProps {
  run: RunRecord;
  onPlayAgain: () => void;
  onViewBreakdown: () => void;
  onHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  run,
  onPlayAgain,
  onViewBreakdown,
  onHome,
}) => {
  const insets = useSafeAreaInsets();
  const bestHeight = useStackStore((state) => state.bestHeight);
  const bestScore = useStackStore((state) => state.bestScore);

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header Title */}
          <Text style={styles.headerTitle}>SPIRE CONCLUDED</Text>
          <Text style={styles.headerSubtitle}>TOWER COMPLETED</Text>

          {/* Main Hero Card */}
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.heroCard}
          >
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>HEIGHT REACHED</Text>
                <Text style={styles.heightVal}>{run.height}</Text>
                <Text style={styles.bestSub}>RECORD: {bestHeight}</Text>
              </View>

              <View style={styles.scoreDivider} />

              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
                <Text style={styles.scoreVal}>{run.score}</Text>
                <Text style={styles.bestSub}>BEST: {bestScore}</Text>
              </View>
            </View>

            {/* Performance Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>✨</Text>
                <Text style={styles.statNum}>{run.perfectPlacements}</Text>
                <Text style={styles.statName}>PERFECTS</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statNum}>x{run.maxCombo}</Text>
                <Text style={styles.statName}>MAX COMBO</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statNum}>{run.accuracy}%</Text>
                <Text style={styles.statName}>ACCURACY</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statNum}>{run.durationSeconds}s</Text>
                <Text style={styles.statName}>TIME</Text>
              </View>
            </View>

            {/* Reward summary */}
            <View style={styles.rewardPill}>
              <Text style={styles.rewardText}>
                🪙 +{run.height * 2 + run.perfectPlacements * 3} COINS EARNED
              </Text>
            </View>
          </LinearGradient>

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryButton
              title="PLAY AGAIN ▶"
              variant="green"
              size="large"
              onPress={onPlayAgain}
            />

            <SecondaryButton
              title="RUN BREAKDOWN 📊"
              onPress={onViewBreakdown}
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
    paddingHorizontal: 20,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  heroCard: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: '#244B82',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  heightVal: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2,
  },
  scoreVal: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.gold,
    marginTop: 2,
  },
  bestSub: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#1E3B68',
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(7, 19, 41, 0.65)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3B68',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
  statName: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.muted,
    marginTop: 2,
  },
  rewardPill: {
    backgroundColor: 'rgba(255, 211, 78, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
