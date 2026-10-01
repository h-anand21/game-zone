// ============================================================
// MEMORY RUSH — 09 Round Result Screen (Temple Trial Feedback)
// Carved Stone Metrics, Celebration Stars & Tactile 3D Next CTA
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { WoodPanel } from '../components/WoodPanel';
import { JungleButton } from '../components/JungleButton';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface RoundResultScreenProps {
  onNextRound: () => void;
}

export const RoundResultScreen: React.FC<RoundResultScreenProps> = ({ onNextRound }) => {
  const {
    score,
    combo,
    round,
    totalRounds,
    correctAnswers,
    totalAttempts,
    reactionTimeMs,
  } = useMemoryRushStore();

  const accuracy = Math.round((correctAnswers / Math.max(1, totalAttempts)) * 100);
  const isPerfect = accuracy >= 80;

  return (
    <JungleWorldBackground variant="arena">
      <View style={styles.container}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>TEMPLE TRIAL</Text>
          <Text style={styles.title}>{isPerfect ? 'PERFECT RUN!' : 'ROUND COMPLETE'}</Text>
          <View style={styles.roundPill}>
            <Text style={styles.roundTag}>
              ROUND {round} OF {totalRounds}
            </Text>
          </View>
        </View>

        {/* Central Physical Wood & Stone Board */}
        <WoodPanel variant="sign" style={styles.boardWood}>
          <View style={styles.boardInner}>
            <Text style={styles.pointsLabel}>RUN SCORE</Text>
            <Text style={styles.pointsVal}>{score.toLocaleString()}</Text>

            {/* 4 Carved Stone Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricStone}>
                <MRIcon name="target" size={16} color="#FFD700" />
                <Text style={styles.metricVal}>{accuracy}%</Text>
                <Text style={styles.metricLabel}>ACCURACY</Text>
              </View>

              <View style={styles.metricStone}>
                <MRIcon name="clock" size={16} color="#38BDF8" />
                <Text style={styles.metricVal}>{(reactionTimeMs / 1000).toFixed(2)}s</Text>
                <Text style={styles.metricLabel}>REACTION</Text>
              </View>

              <View style={styles.metricStone}>
                <MRIcon name="zap" size={16} color="#10B981" />
                <Text style={styles.metricVal}>×{combo}</Text>
                <Text style={styles.metricLabel}>COMBO</Text>
              </View>

              <View style={styles.metricStone}>
                <MRIcon name="star" size={16} color="#FFD700" />
                <Text style={styles.metricVal}>+150</Text>
                <Text style={styles.metricLabel}>TEMPLE XP</Text>
              </View>
            </View>
          </View>
        </WoodPanel>

        {/* Bottom CTA */}
        <View style={styles.ctaWrapper}>
          <JungleButton
            title="NEXT ROUND ▶"
            size="hero"
            variant="gold"
            onPress={onNextRound}
          />
        </View>
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  roundPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: '#718496',
  },
  roundTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  boardWood: {
    width: '100%',
  },
  boardInner: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  pointsVal: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
    textShadowColor: '#4A2800',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 14,
    gap: 8,
    justifyContent: 'space-between',
  },
  metricStone: {
    width: '48%',
    backgroundColor: 'rgba(16, 24, 20, 0.85)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#546A58',
    gap: 2,
  },
  metricLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 1,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF8E7',
    marginTop: 2,
  },
  ctaWrapper: {
    width: '100%',
  },
});
