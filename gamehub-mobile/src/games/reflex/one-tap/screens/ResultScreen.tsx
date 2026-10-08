// ============================================================
// ONE TAP: PRECISION GAME — ResultScreen
// Performance Summary, Rank Badge, Hit Telemetry & Quick Replay Loop
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import {
  SvgRefresh,
  SvgHome,
  SvgCrown,
  SvgShare,
} from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { OneTapRunResult } from '../types';

interface ResultScreenProps {
  result: OneTapRunResult;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  isNewBest,
  onPlayAgain,
  onHome,
}) => {
  const getRankColor = () => {
    switch (result.rank) {
      case 'S':
        return OTColors.gold;
      case 'A':
        return OTColors.cyan;
      case 'B':
        return OTColors.green;
      default:
        return OTColors.red;
    }
  };

  const rankColor = getRankColor();

  return (
    <BackgroundLayer screen="result" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <OneTapLogo size="compact" showSubtitle={true} />
          </View>

          {/* New Best Badge Banner if Applicable */}
          {isNewBest && (
            <View style={styles.newBestBanner}>
              <SvgCrown size={16} color="#07090C" />
              <Text style={styles.newBestText}>✦ NEW PERSONAL BEST! ✦</Text>
            </View>
          )}

          {/* Rank Badge Crest */}
          <View style={styles.rankCrest}>
            <Svg width={140} height={140} viewBox="0 0 140 140">
              <Defs>
                <LinearGradient id="rankGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={rankColor} />
                  <Stop offset="100%" stopColor="#07090C" stopOpacity={0.8} />
                </LinearGradient>
              </Defs>
              <Circle
                cx={70}
                cy={70}
                r={62}
                stroke={rankColor}
                strokeWidth={2}
                strokeDasharray="12 6"
                fill="none"
              />
              <Circle
                cx={70}
                cy={70}
                r={48}
                fill="rgba(16, 21, 28, 0.9)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={1}
              />
            </Svg>

            <View style={styles.rankLetterWrap}>
              <Text style={[styles.rankLetter, { color: rankColor }]}>
                {result.rank}
              </Text>
              <Text style={styles.rankSub}>RANK</Text>
            </View>
          </View>

          {/* Final Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreCardNum}>{result.finalScore}</Text>
          </View>

          {/* Telemetry Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={styles.statValue}>{result.accuracyPercentage}%</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MAX COMBO</Text>
              <Text style={styles.statValue}>×{result.maxCombo}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AVG REACTION</Text>
              <Text style={styles.statValue}>{result.averageReactionTimeMs}ms</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TIME</Text>
              <Text style={styles.statValue}>{result.timeElapsedSeconds}s</Text>
            </View>
          </View>

          {/* Hit Breakdown Row */}
          <View style={styles.breakdownRow}>
            <View style={[styles.pill, { borderColor: OTColors.gold }]}>
              <Text style={[styles.pillTitle, { color: OTColors.gold }]}>PERFECT</Text>
              <Text style={styles.pillNum}>{result.perfectCount}</Text>
            </View>

            <View style={[styles.pill, { borderColor: OTColors.cyan }]}>
              <Text style={[styles.pillTitle, { color: OTColors.cyan }]}>GREAT</Text>
              <Text style={styles.pillNum}>{result.greatCount}</Text>
            </View>

            <View style={[styles.pill, { borderColor: OTColors.green }]}>
              <Text style={[styles.pillTitle, { color: OTColors.green }]}>GOOD</Text>
              <Text style={styles.pillNum}>{result.goodCount}</Text>
            </View>

            <View style={[styles.pill, { borderColor: OTColors.red }]}>
              <Text style={[styles.pillTitle, { color: OTColors.red }]}>MISS</Text>
              <Text style={styles.pillNum}>{result.missCount}</Text>
            </View>
          </View>

          {/* Rewards Capsule */}
          <View style={styles.rewardsCard}>
            <Text style={styles.rewardsHeader}>✦ EXPEDITION REWARDS ✦</Text>
            <View style={styles.rewardsRow}>
              <Text style={styles.rewardText}>🪙 +{result.earnedCoins} COINS</Text>
              <Text style={styles.rewardText}>⚡ +{result.earnedXp} XP</Text>
              <Text style={styles.rewardText}>⭐ +{result.earnedStars} STARS</Text>
            </View>
          </View>

          {/* Primary Action Buttons */}
          <View style={styles.actionsRow}>
            {/* Play Again (Hero Gold) */}
            <Pressable
              style={({ pressed }) => [styles.playAgainBtn, pressed && styles.btnPressed]}
              onPress={onPlayAgain}
            >
              <SvgRefresh size={20} color="#07090C" />
              <Text style={styles.playAgainText}>PLAY AGAIN</Text>
            </Pressable>

            {/* Return to Home */}
            <Pressable
              style={({ pressed }) => [styles.homeBtn, pressed && styles.btnPressed]}
              onPress={onHome}
            >
              <SvgHome size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerRow: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  newBestBanner: {
    backgroundColor: OTColors.gold,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  newBestText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.5,
  },
  rankCrest: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  rankLetterWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  rankLetter: {
    fontSize: 44,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  rankSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 2,
    marginTop: -4,
  },
  scoreCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.9)',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginTop: 4,
  },
  scoreCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: OTColors.textSecondary,
    letterSpacing: 2,
  },
  scoreCardNum: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginTop: 14,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(16, 21, 28, 0.75)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 12,
  },
  pill: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 12, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pillTitle: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pillNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  rewardsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 21, 28, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  rewardsHeader: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2,
    marginBottom: 6,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 18,
  },
  playAgainBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: OTColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  homeBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 21, 28, 0.9)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
