// ============================================================
// MEMORY RUSH — 10 Final Result Screen (Temple Victory Celebration)
// Golden Sunset Victory Temple with Altar Tablets, Rewards & Tactile CTAs
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { WoodPanel } from '../components/WoodPanel';
import { StonePanel } from '../components/StonePanel';
import { JungleButton } from '../components/JungleButton';
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
    <JungleWorldBackground variant="victory">
      <View style={styles.container}>
        {/* Victory Header */}
        <View style={styles.header}>
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.title}>RUN COMPLETE!</Text>
          <View style={styles.perfBadge}>
            <Text style={styles.perfText}>{perfTitle.toUpperCase()}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Huge Score Tablet */}
          <WoodPanel variant="sign" style={styles.scoreWood}>
            <View style={styles.scoreInner}>
              <Text style={styles.scoreLabel}>TEMPLE FINAL SCORE</Text>
              <Text style={styles.scoreVal}>{score.toLocaleString()}</Text>

              {/* 4 Carved Stone Metrics */}
              <View style={styles.metricsRow}>
                <View style={styles.metricCell}>
                  <MRIcon name="target" size={14} color="#FFD700" />
                  <Text style={styles.mVal}>{accuracy}%</Text>
                  <Text style={styles.mLabel}>ACCURACY</Text>
                </View>
                <View style={styles.metricCell}>
                  <MRIcon name="zap" size={14} color="#38BDF8" />
                  <Text style={styles.mVal}>×{maxCombo}</Text>
                  <Text style={styles.mLabel}>BEST COMBO</Text>
                </View>
                <View style={styles.metricCell}>
                  <MRIcon name="clock" size={14} color="#10B981" />
                  <Text style={styles.mVal}>0.72s</Text>
                  <Text style={styles.mLabel}>REACTION</Text>
                </View>
                <View style={styles.metricCell}>
                  <MRIcon name="award" size={14} color="#FFD700" />
                  <Text style={styles.mVal}>LVL 12</Text>
                  <Text style={styles.mLabel}>RANK</Text>
                </View>
              </View>
            </View>
          </WoodPanel>

          {/* Treasure Rewards Section */}
          <StonePanel variant="carved" style={styles.rewardStone}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardTitle}>TEMPLE EXPEDITION REWARDS</Text>
            </View>

            <View style={styles.rewardItemsRow}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardVal}>+500</Text>
                <Text style={styles.rewardLabel}>COINS</Text>
              </View>

              <View style={styles.rewardDivider} />

              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={styles.rewardVal}>+350</Text>
                <Text style={styles.rewardLabel}>EXP</Text>
              </View>

              <View style={styles.rewardDivider} />

              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>💎</Text>
                <Text style={styles.rewardVal}>+5</Text>
                <Text style={styles.rewardLabel}>GEMS</Text>
              </View>
            </View>
          </StonePanel>

          {/* Round Performance Breakdown */}
          <WoodPanel variant="dark" style={styles.perfWood}>
            <Text style={styles.perfSectionTitle}>ROUND TRIAL PROGRESSION</Text>

            <View style={styles.chartStack}>
              {[
                { round: 'Round 1', pct: '100%', color: '#10B981' },
                { round: 'Round 2', pct: '90%', color: '#10B981' },
                { round: 'Round 3', pct: '80%', color: '#FFD700' },
                { round: 'Round 4', pct: '100%', color: '#10B981' },
              ].map((r, i) => (
                <View key={i} style={styles.chartRow}>
                  <Text style={styles.rowLabel}>{r.round}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: r.pct as any, backgroundColor: r.color }]} />
                  </View>
                  <Text style={styles.pctText}>{r.pct}</Text>
                </View>
              ))}
            </View>
          </WoodPanel>

          {/* Action Buttons Stack */}
          <View style={styles.btnStack}>
            <JungleButton
              title="PLAY AGAIN ▶"
              size="hero"
              variant="gold"
              onPress={onPlayAgain}
            />
            <JungleButton
              title="CHANGE TRIAL MODE 📜"
              size="md"
              variant="wood"
              onPress={onChangeMode}
            />
            <JungleButton
              title="RETURN TO HOME 🏛️"
              size="md"
              variant="stone"
              onPress={onHome}
            />
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </JungleWorldBackground>
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
    marginBottom: 8,
  },
  crownEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  perfBadge: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  perfText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  scoreWood: {
    width: '100%',
  },
  scoreInner: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  scoreVal: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
    textShadowColor: '#4A2800',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    gap: 6,
  },
  metricCell: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 20, 0.85)',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#546A58',
    gap: 2,
  },
  mVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF8E7',
    marginTop: 2,
  },
  mLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 0.5,
  },
  rewardStone: {
    width: '100%',
  },
  rewardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  rewardItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  rewardItem: {
    alignItems: 'center',
    flex: 1,
  },
  rewardEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  rewardVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFD700',
  },
  rewardLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#A0B4A2',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  rewardDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  perfWood: {
    width: '100%',
  },
  perfSectionTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginBottom: 10,
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
    color: '#D1DEC8',
    width: 60,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#546A58',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  pctText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    width: 38,
    textAlign: 'right',
  },
  btnStack: {
    gap: 10,
    marginTop: 6,
  },
});
