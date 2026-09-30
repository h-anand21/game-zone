// ============================================================
// Find One — Screen 6: New Best (Record Breaking) Screen
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
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOColors, FORadius, FOSpacing } from '../theme';
import {
  GameButton,
  WoodenSign,
  PandaIllustration,
  StatCard,
  Confetti,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';
import { calculateAccuracy } from '../logic';

export const NewBestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20,
    16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const {
    score,
    previousBest,
    correctCount,
    wrongCount,
    currentStreak,
    startGame,
    setScreen,
  } = useFindOneStore();

  const accuracy = calculateAccuracy(correctCount, wrongCount);
  const diffScore = Math.max(1, score - previousBest);

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={styles.container}
    >
      {/* 50+ Programmatic Celebration Confetti Particles */}
      <Confetti count={48} />

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
        {/* ── King Panda Mascot with Crown ── */}
        <View style={styles.topSection}>
          <PandaIllustration mood="winner" size={145} />

          {/* 3D NEW BEST! Title */}
          <Svg width={290} height={50} viewBox="0 0 290 50">
            <Defs>
              <SvgLinearGradient id="newBestGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="40%" stopColor="#FFF2A3" />
                <Stop offset="100%" stopColor="#FFC928" />
              </SvgLinearGradient>
            </Defs>

            <SvgText
              x="145"
              y="40"
              fontSize="40"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="#523200"
              stroke="#523200"
              strokeWidth="12"
              strokeLinejoin="round"
            >
              NEW BEST!
            </SvgText>
            <SvgText
              x="145"
              y="38"
              fontSize="40"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="#A66800"
              stroke="#A66800"
              strokeWidth="6"
              strokeLinejoin="round"
            >
              NEW BEST!
            </SvgText>
            <SvgText
              x="145"
              y="36"
              fontSize="40"
              fontWeight="900"
              fontFamily="System"
              textAnchor="middle"
              fill="url(#newBestGrad)"
            >
              NEW BEST!
            </SvgText>
          </Svg>

          <WoodenSign text="You beat your record!" size="sm" variant="wood" />
        </View>

        {/* ── Main Score Card ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.scoreCard}
        >
          <Text style={styles.scoreLabel}>YOUR SCORE</Text>

          {/* Big Golden Score */}
          <View style={styles.scoreNumberRow}>
            <Text style={{ fontSize: 28 }}>👑</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.sparkRight}>✨</Text>
          </View>

          {/* Improvement Delta Badge */}
          <View style={styles.improvementBadge}>
            <Text style={styles.deltaGreen}>⬆ +{diffScore}</Text>
            <Text style={styles.prevText}>Previous Best: {previousBest}</Text>
          </View>

          {/* 5 Stats Badges Grid */}
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
              icon="🎯"
              style={styles.statGridItem}
            />

            {/* Time Taken */}
            <StatCard
              label="Time Taken"
              value={`${Math.round(correctCount * 1.4)}s`}
              icon="⏱️"
              style={styles.statGridItem}
            />

            {/* Best Streak */}
            <StatCard
              label="Best Streak"
              value={currentStreak}
              icon="🔥"
              variant="highlight"
              style={styles.statGridItemWide}
            />
          </View>
        </LinearGradient>

        {/* ── Big PLAY AGAIN Button ── */}
        <View style={styles.ctaWrapper}>
          <GameButton
            title="PLAY AGAIN"
            size="lg"
            variant="gold"
            icon={<Text style={{ fontSize: 24 }}>▶</Text>}
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
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
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
    gap: 10,
    marginVertical: 4,
  },
  sparkRight: {
    fontSize: 22,
    color: FOColors.primary,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: FOColors.primary,
    textShadowColor: 'rgba(255, 201, 40, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  improvementBadge: {
    alignItems: 'center',
    backgroundColor: '#0E243E',
    borderRadius: FORadius.round,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#1F4770',
    marginBottom: 14,
    gap: 2,
  },
  deltaGreen: {
    fontSize: 16,
    fontWeight: '900',
    color: '#3BE35A',
  },
  prevText: {
    fontSize: 11,
    fontWeight: '700',
    color: FOColors.textMuted,
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
  statGridItemWide: {
    width: '100%',
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
