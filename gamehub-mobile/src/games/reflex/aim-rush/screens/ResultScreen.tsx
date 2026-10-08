// ============================================================
// AIM RUSH — Screen 09: ResultScreen
// Recreated from "Neon Sci-Fi Level Complete HUD.png" reference
// 3-Star celebration, chamfered telemetry grid, & safe bottom actions
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const timeSeconds = Math.round(result.durationMs / 1000);
  const timeFormatted = `00:${timeSeconds.toString().padStart(2, '0')}`;

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.3}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 1. TOP HEADER ROW */}
          <View style={styles.topHeader}>
            <Pressable style={styles.headerBtn} onPress={onHome}>
              <Ionicons name="home" size={16} color={ARColors.cyan} />
            </Pressable>

            <View style={styles.brandTag}>
              <Text style={styles.brandTitle}>AIM RUSH</Text>
              <Text style={styles.brandSub}>TARGET CHAIN</Text>
            </View>

            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{result.mode.toUpperCase()}</Text>
            </View>
          </View>

          {/* 2. LEVEL COMPLETE PLAQUE BANNER */}
          <View style={styles.plaqueBanner}>
            <Text style={styles.plaqueText}>LEVEL COMPLETE!</Text>
          </View>

          {/* 3. THREE GOLDEN STARS CELEBRATION */}
          <View style={styles.starsRow}>
            <Ionicons name="star" size={38} color={ARColors.gold} style={styles.sideStar} />
            <Ionicons name="star" size={48} color={ARColors.gold} style={styles.centerStar} />
            <Ionicons name="star" size={38} color={ARColors.gold} style={styles.sideStar} />
          </View>

          {/* New Personal Record Pill */}
          {result.isNewPersonalBest && (
            <View style={styles.recordPill}>
              <Ionicons name="trophy" size={16} color={ARColors.gold} />
              <Text style={styles.recordPillText}>✦ NEW PERSONAL RECORD! ✦</Text>
            </View>
          )}

          {/* 4. MASTER STATS FRAME */}
          <View style={styles.statsFrame}>
            {/* Top Score & Chain Row */}
            <View style={styles.scoreChainRow}>
              <View style={styles.scoreBlock}>
                <Text style={styles.metricLabel}>SCORE</Text>
                <Text style={styles.scoreValue}>{result.score}</Text>
              </View>

              <View style={styles.chainBlock}>
                <Text style={[styles.metricLabel, { color: ARColors.gold }]}>CHAIN</Text>
                <Text style={styles.chainValue}>x{result.maxChain}</Text>
              </View>
            </View>

            {/* Middle: 4 Chamfered Metric Squares */}
            <View style={styles.quadGrid}>
              {/* Hit */}
              <View style={[styles.quadCell, { borderColor: ARColors.cyan }]}>
                <Ionicons name="disc-outline" size={18} color={ARColors.cyan} />
                <Text style={styles.quadLabel}>HIT</Text>
                <Text style={[styles.quadValue, { color: ARColors.cyan }]}>{result.totalHits}</Text>
              </View>

              {/* Perfect */}
              <View style={[styles.quadCell, { borderColor: ARColors.lime }]}>
                <Ionicons name="checkmark-circle-outline" size={18} color={ARColors.lime} />
                <Text style={styles.quadLabel}>PERFECT</Text>
                <Text style={[styles.quadValue, { color: ARColors.lime }]}>{result.perfectHits}</Text>
              </View>

              {/* Good */}
              <View style={[styles.quadCell, { borderColor: ARColors.gold }]}>
                <Ionicons name="radio-button-on-outline" size={18} color={ARColors.gold} />
                <Text style={styles.quadLabel}>GOOD</Text>
                <Text style={[styles.quadValue, { color: ARColors.gold }]}>{result.goodHits}</Text>
              </View>

              {/* Miss */}
              <View style={[styles.quadCell, { borderColor: ARColors.red }]}>
                <Ionicons name="close-circle-outline" size={18} color={ARColors.red} />
                <Text style={styles.quadLabel}>MISS</Text>
                <Text style={[styles.quadValue, { color: ARColors.red }]}>{result.misses}</Text>
              </View>
            </View>

            {/* Bottom: Time Taken & Accuracy */}
            <View style={styles.timeAccuracyRow}>
              <View style={styles.timeCell}>
                <Ionicons name="time-outline" size={16} color={ARColors.cyan} />
                <View>
                  <Text style={styles.subMetricLabel}>TIME TAKEN</Text>
                  <Text style={styles.subMetricValue}>{timeFormatted}</Text>
                </View>
              </View>

              <View style={styles.accuracyCell}>
                <Ionicons name="locate-outline" size={16} color={ARColors.cyan} />
                <View>
                  <Text style={styles.subMetricLabel}>ACCURACY</Text>
                  <Text style={styles.subMetricValue}>{result.accuracy}%</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 5. BOTTOM ACTIONS (SAFELY ELEVATED ABOVE GESTURE NAV) */}
        <View style={styles.bottomActionsRow}>
          <Pressable style={styles.replayBtn} onPress={onPlayAgain}>
            <Ionicons name="refresh" size={18} color={ARColors.cyan} />
            <Text style={styles.replayBtnText}>REPLAY</Text>
          </Pressable>

          <Pressable style={styles.playAgainBtn} onPress={onPlayAgain}>
            <Ionicons name="play-forward" size={20} color="#07090C" />
            <Text style={styles.playAgainBtnText}>PLAY AGAIN</Text>
          </Pressable>

          <Pressable style={styles.exitBtn} onPress={onHome}>
            <Ionicons name="home" size={18} color={ARColors.cyan} />
            <Text style={styles.exitBtnText}>EXIT TO HUB</Text>
          </Pressable>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // 1. Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTag: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.white,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  brandSub: {
    fontSize: 8,
    fontWeight: '800',
    color: ARColors.lime,
    letterSpacing: 1.5,
  },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.cyan,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1,
  },

  // 2. Plaque Banner
  plaqueBanner: {
    alignSelf: 'center',
    backgroundColor: 'rgba(8, 14, 22, 0.95)',
    borderWidth: 2,
    borderColor: ARColors.cyan,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 6,
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  plaqueText: {
    fontSize: 22,
    fontWeight: '900',
    color: ARColors.cyan,
    fontStyle: 'italic',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  // 3. Stars
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  sideStar: {
    opacity: 0.9,
  },
  centerStar: {
    transform: [{ translateY: -4 }],
  },
  recordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderWidth: 1.2,
    borderColor: ARColors.gold,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 8,
  },
  recordPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.gold,
    letterSpacing: 1,
  },

  // 4. Stats Frame
  statsFrame: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.8,
    borderColor: ARColors.cyan,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  scoreChainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 231, 255, 0.2)',
    paddingBottom: 10,
  },
  scoreBlock: {
    alignItems: 'center',
  },
  chainBlock: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
  },
  chainValue: {
    fontSize: 34,
    fontWeight: '900',
    color: ARColors.gold,
    letterSpacing: 1.5,
  },

  // Quad Grid
  quadGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quadCell: {
    flex: 1,
    backgroundColor: 'rgba(8, 14, 22, 0.85)',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 2,
  },
  quadLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 0.8,
  },
  quadValue: {
    fontSize: 16,
    fontWeight: '900',
  },

  // Time & Accuracy
  timeAccuracyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 14, 22, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(53, 231, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  accuracyCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 14, 22, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(53, 231, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  subMetricLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: ARColors.textMuted,
  },
  subMetricValue: {
    fontSize: 13,
    fontWeight: '900',
    color: ARColors.white,
  },

  // 5. Bottom Actions Row
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replayBtn: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  replayBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
  playAgainBtn: {
    flex: 1.4,
    height: 48,
    backgroundColor: ARColors.gold,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: ARColors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  playAgainBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.2,
    fontStyle: 'italic',
  },
  exitBtn: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  exitBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
});
