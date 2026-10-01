// ============================================================
// Number Rush — Vibrant Level Complete & Result Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import {
  GameButton,
  MascotIllustration,
  WoodPanel,
} from '../components';

export const LevelCompleteScreen: React.FC = () => {
  const {
    score,
    maxSessionCombo,
    correctAnswers,
    wrongAnswers,
    sessionStars,
    sessionCoinsEarned,
    sessionXpEarned,
    isNewBestScore,
    restartGame,
    exitToHome,
    setScreen,
  } = useNumberRushStore();

  const total = correctAnswers + wrongAnswers || 1;
  const accuracy = Math.round((correctAnswers / total) * 100);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Victory Header & 3-Star Rating */}
        <View style={styles.victoryHeader}>
          <Text style={styles.congratsText}>RUSH COMPLETE!</Text>

          {/* 3 Stars Container */}
          <View style={styles.starsRow}>
            <Text style={[styles.star, sessionStars >= 1 && styles.starActive]}>
              ⭐
            </Text>
            <Text style={[styles.star, styles.starCenter, sessionStars >= 2 && styles.starActive]}>
              ⭐
            </Text>
            <Text style={[styles.star, sessionStars >= 3 && styles.starActive]}>
              ⭐
            </Text>
          </View>

          {isNewBestScore && (
            <View style={styles.newBestPill}>
              <Text style={styles.newBestText}>🏆 NEW BEST SCORE!</Text>
            </View>
          )}
        </View>

        {/* Mascot in celebration mood */}
        <View style={styles.mascotBox}>
          <MascotIllustration size={150} mood="celebrate" />
        </View>

        {/* Score & Rewards Panel */}
        <WoodPanel style={styles.resultPanel} variant="card">
          <Text style={styles.finalScoreLabel}>FINAL SCORE</Text>
          <Text style={styles.finalScoreVal}>{score}</Text>

          {/* Breakdown Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>x{maxSessionCombo}</Text>
              <Text style={styles.statLabel}>MAX STREAK</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{correctAnswers}/{total}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
          </View>

          {/* Rewards Row */}
          <View style={styles.rewardsBox}>
            <View style={styles.rewardCard}>
              <Text style={styles.rewardIcon}>🪙</Text>
              <Text style={styles.rewardVal}>+{sessionCoinsEarned}</Text>
              <Text style={styles.rewardLabel}>COINS</Text>
            </View>

            <View style={[styles.rewardCard, styles.xpCard]}>
              <Text style={styles.rewardIcon}>⚡</Text>
              <Text style={styles.rewardVal}>+{sessionXpEarned}</Text>
              <Text style={styles.rewardLabel}>XP</Text>
            </View>
          </View>
        </WoodPanel>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <GameButton
            title="PLAY AGAIN"
            icon="🔄"
            variant="green"
            size="lg"
            fullWidth
            onPress={restartGame}
            style={styles.actionBtn}
          />

          <View style={styles.subActionRow}>
            <GameButton
              title="MODES"
              icon="🎮"
              variant="blue"
              size="md"
              style={styles.halfBtn}
              onPress={() => setScreen('mode-hub')}
            />
            <GameButton
              title="HOME"
              icon="🏠"
              variant="wood"
              size="md"
              style={styles.halfBtn}
              onPress={exitToHome}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  victoryHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  congratsText: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  star: {
    fontSize: 40,
    opacity: 0.25,
  },
  starCenter: {
    fontSize: 54,
    marginTop: -8,
  },
  starActive: {
    opacity: 1,
  },
  newBestPill: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginTop: 4,
  },
  newBestText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  mascotBox: {
    marginVertical: 4,
  },
  resultPanel: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  finalScoreLabel: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  finalScoreVal: {
    color: '#FFD700',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  statLabel: {
    color: '#5C7491',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  rewardsBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    width: '100%',
  },
  rewardCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    padding: 10,
    alignItems: 'center',
  },
  xpCard: {
    backgroundColor: 'rgba(30, 144, 255, 0.15)',
    borderColor: '#1E90FF',
  },
  rewardIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  rewardVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  rewardLabel: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    marginTop: 10,
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
  subActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  halfBtn: {
    flex: 1,
  },
});
