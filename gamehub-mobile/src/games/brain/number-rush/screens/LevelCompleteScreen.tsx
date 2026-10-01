// ============================================================
// Number Rush — Screen 14: RESULT SCREEN (Vibrant Level Complete Reference)
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import {
  GameButton,
  MascotIllustration,
  WoodPanel,
} from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

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

  const [displayScore, setDisplayScore] = useState(0);

  // Animated star scale values
  const starScale1 = useSharedValue(0);
  const starScale2 = useSharedValue(0);
  const starScale3 = useSharedValue(0);

  useEffect(() => {
    // Star animations with stagger
    starScale1.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
    setTimeout(() => {
      starScale2.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
    }, 200);
    setTimeout(() => {
      starScale3.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
    }, 400);

    // Number count-up animation
    const duration = 1200;
    const steps = 24;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.round((step / steps) * score);
      setDisplayScore(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const starStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: starScale1.value }],
  }));

  const starStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: starScale2.value }],
  }));

  const starStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: starScale3.value }],
  }));

  const total = correctAnswers + wrongAnswers || 1;
  const accuracy = Math.round((correctAnswers / total) * 100);

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Carved Wooden Header: LEVEL COMPLETE */}
        <View style={styles.victoryBillboard}>
          <Text style={styles.congratsSub}>JUNGLE RUSH CLEARED</Text>
          <Text style={styles.congratsTitle}>LEVEL COMPLETE!</Text>

          {/* 3 Animated 3D Golden Stars */}
          <View style={styles.starsRow}>
            <Animated.View style={[styles.starBox, starStyle1]}>
              <Text style={[styles.star, sessionStars >= 1 && styles.starActive]}>
                ⭐
              </Text>
            </Animated.View>
            <Animated.View style={[styles.starBox, styles.starCenterBox, starStyle2]}>
              <Text
                style={[
                  styles.star,
                  styles.starCenter,
                  sessionStars >= 2 && styles.starActive,
                ]}
              >
                ⭐
              </Text>
            </Animated.View>
            <Animated.View style={[styles.starBox, starStyle3]}>
              <Text style={[styles.star, sessionStars >= 3 && styles.starActive]}>
                ⭐
              </Text>
            </Animated.View>
          </View>

          {isNewBestScore && (
            <View style={styles.newBestPill}>
              <Text style={styles.newBestText}>🏆 NEW PERSONAL BEST!</Text>
            </View>
          )}
        </View>

        {/* 3. Celebration Mascot Centerpiece */}
        <View style={styles.mascotBox}>
          <MascotIllustration size={160} character="runner_boy" mood="celebrate" />
        </View>

        {/* 4. Score & Rewards Wooden Panel */}
        <WoodPanel style={styles.resultPanel} variant="card">
          <Text style={styles.finalScoreLabel}>FINAL RUSH SCORE</Text>
          <Text style={styles.finalScoreVal}>{displayScore.toLocaleString()} PTS</Text>

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
              <Text style={styles.rewardVal}>+{sessionCoinsEarned || 250}</Text>
              <Text style={styles.rewardLabel}>COINS</Text>
            </View>

            <View style={[styles.rewardCard, styles.gemCard]}>
              <Text style={styles.rewardIcon}>💎</Text>
              <Text style={styles.rewardVal}>+15</Text>
              <Text style={styles.rewardLabel}>GEMS</Text>
            </View>

            <View style={[styles.rewardCard, styles.xpCard]}>
              <Text style={styles.rewardIcon}>⚡</Text>
              <Text style={styles.rewardVal}>+{sessionXpEarned || 400}</Text>
              <Text style={styles.rewardLabel}>XP</Text>
            </View>
          </View>
        </WoodPanel>

        {/* 5. Action Buttons Group */}
        <View style={styles.actionsContainer}>
          <GameButton
            title="NEXT LEVEL"
            icon="▶"
            variant="green"
            size="lg"
            fullWidth
            onPress={restartGame}
            style={styles.actionBtn}
          />

          <View style={styles.subActionRow}>
            <GameButton
              title="REPLAY"
              icon="🔄"
              variant="gold"
              size="md"
              style={styles.halfBtn}
              onPress={restartGame}
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
    paddingTop: 36,
  },
  victoryBillboard: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  congratsSub: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  congratsTitle: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  starBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  starCenterBox: {
    marginTop: -10,
  },
  star: {
    fontSize: 40,
    opacity: 0.3,
  },
  starCenter: {
    fontSize: 54,
  },
  starActive: {
    opacity: 1,
  },
  newBestPill: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginTop: 4,
  },
  newBestText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  mascotBox: {
    marginVertical: 4,
  },
  resultPanel: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  finalScoreLabel: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  finalScoreVal: {
    color: '#FFD700',
    fontSize: 40,
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
    paddingVertical: 10,
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
    fontSize: 16,
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
    gap: 10,
    marginTop: 6,
    width: '100%',
  },
  rewardCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    padding: 8,
    alignItems: 'center',
  },
  gemCard: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
  },
  xpCard: {
    backgroundColor: 'rgba(30, 144, 255, 0.15)',
    borderColor: '#1E90FF',
  },
  rewardIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  rewardVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  rewardLabel: {
    color: '#8CA0BA',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
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
