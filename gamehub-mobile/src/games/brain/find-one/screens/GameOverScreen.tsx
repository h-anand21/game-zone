// ============================================================
// Find One — Screen 5: Game Over Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Text as SvgText } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOColors, FORadius, FOSpacing } from '../theme';
import {
  GameButton,
  WoodenSign,
  FoxIllustration,
  StatCard,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';
import { calculateAccuracy } from '../logic';

export const GameOverScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20,
    16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const {
    score,
    stats,
    correctCount,
    wrongCount,
    currentStreak,
    startGame,
    setScreen,
  } = useFindOneStore();

  const accuracy = calculateAccuracy(correctCount, wrongCount);
  const diffScore = score - stats.bestScore;

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topInset + 12,
            paddingBottom: bottomInset + 32,
          },
        ]}
      >
        {/* ── Sad Fox Mascot & GAME OVER Header ── */}
        <View style={styles.topSection}>
          <FoxIllustration mood="sad" size={135} />

          {/* 3D GAME OVER Title */}
          <Svg width={280} height={46} viewBox="0 0 280 46">
            <SvgText
              x="140"
              y="38"
              fontSize="38"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="#520B0B"
              stroke="#520B0B"
              strokeWidth="10"
              strokeLinejoin="round"
            >
              GAME OVER
            </SvgText>
            <SvgText
              x="140"
              y="36"
              fontSize="38"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="#A61C1C"
              stroke="#A61C1C"
              strokeWidth="5"
              strokeLinejoin="round"
            >
              GAME OVER
            </SvgText>
            <SvgText
              x="140"
              y="34"
              fontSize="38"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="#FF4B4B"
            >
              GAME OVER
            </SvgText>
          </Svg>

          <WoodenSign text="TIME'S UP!" size="sm" variant="wood" />
        </View>

        {/* ── Main Score Card ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.scoreCard}
        >
          <Text style={styles.scoreLabel}>YOUR SCORE</Text>

          {/* Big Golden Score */}
          <View style={styles.scoreNumberRow}>
            <Text style={styles.sparkLeft}>⚡</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.sparkRight}>⚡</Text>
          </View>

          {/* Best Score Comparison Pill */}
          <View style={styles.bestPill}>
            <Text style={{ fontSize: 16 }}>👑</Text>
            <Text style={styles.bestLabel}>BEST SCORE</Text>
            <Text style={styles.bestValue}>{stats.bestScore}</Text>
            {diffScore > 0 && (
              <Text style={styles.deltaGreen}>⬆ +{diffScore}</Text>
            )}
          </View>

          {/* 4 Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Correct */}
            <StatCard
              label="Correct"
              value={correctCount}
              icon="✅"
              style={styles.statGridItem}
            />

            {/* Wrong */}
            <StatCard
              label="Wrong"
              value={wrongCount}
              icon="❌"
              style={styles.statGridItem}
            />

            {/* Accuracy */}
            <StatCard
              label="Accuracy"
              value={`${accuracy}%`}
              icon="⏱️"
              style={styles.statGridItem}
            />

            {/* Best Streak */}
            <StatCard
              label="Best Streak"
              value={stats.bestStreak}
              icon="🔥"
              style={styles.statGridItem}
            />
          </View>
        </LinearGradient>

        {/* ── Big PLAY AGAIN Button ── */}
        <View style={styles.ctaWrapper}>
          <GameButton
            title="PLAY AGAIN"
            size="lg"
            variant="gold"
            icon={<Text style={{ fontSize: 24 }}>🔄</Text>}
            onPress={startGame}
          />
        </View>

        {/* ── Secondary Buttons Row ── */}
        <View style={styles.secondaryRow}>
          <GameButton
            title="HOME"
            variant="blue"
            size="sm"
            icon={<Text style={{ fontSize: 16 }}>🏠</Text>}
            onPress={() => setScreen('home')}
            style={styles.subBtn}
          />

          <GameButton
            title="LEADERBOARD"
            variant="purple"
            size="sm"
            icon={<Text style={{ fontSize: 16 }}>📊</Text>}
            onPress={() => {}}
            style={styles.subBtn}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: FOSpacing.md,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  scoreCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 2,
    borderColor: '#1C426B',
    borderTopColor: '#2C629E',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
    alignItems: 'center',
    marginBottom: FOSpacing.md,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8EDBFF',
    letterSpacing: 1,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  sparkLeft: {
    fontSize: 22,
    color: FOColors.primary,
  },
  sparkRight: {
    fontSize: 22,
    color: FOColors.primary,
  },
  scoreNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: FOColors.primary,
    textShadowColor: 'rgba(255, 201, 40, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E243E',
    borderRadius: FORadius.round,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#1F4770',
    gap: 6,
    marginBottom: 14,
  },
  bestLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: FOColors.textMuted,
  },
  bestValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  deltaGreen: {
    fontSize: 13,
    fontWeight: '900',
    color: '#3BE35A',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  statGridItem: {
    width: '48%',
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 340,
    marginTop: 6,
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  subBtn: {
    flex: 1,
  },
});
