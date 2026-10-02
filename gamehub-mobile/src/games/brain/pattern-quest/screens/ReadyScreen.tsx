// ============================================================
// PATTERN QUEST — Screen 07: ReadyScreen
// Temple Gate Countdown (3 -> 2 -> 1 -> GO!) with dynamic pulse
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqColors, pqSpacing, pqTypography } from '../theme';

export const ReadyScreen: React.FC = () => {
  const { startNewGame, mapRegions, currentRegionIndex } = usePatternQuestStore();
  const currentRegion = mapRegions[currentRegionIndex] || mapRegions[0];

  const [count, setCount] = useState<number | string>(3);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const triggerAnimation = () => {
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    triggerAnimation();

    const t1 = setTimeout(() => {
      setCount(2);
      triggerAnimation();
    }, 900);

    const t2 = setTimeout(() => {
      setCount(1);
      triggerAnimation();
    }, 1800);

    const t3 = setTimeout(() => {
      setCount('GO!');
      triggerAnimation();
    }, 2700);

    const t4 = setTimeout(() => {
      startNewGame();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <GameBackground screen="ready" overlayDarkness={0.2}>
      <Pressable style={styles.container} onPress={() => startNewGame()}>
        {/* Character Ready Plaque */}
        <ScreenPlaque screen="ready" width={280} height={145} style={styles.plaque} />

        {/* Temple Region Details */}
        <View style={styles.templeBanner}>
          <Text style={styles.templeNum}>TEMPLE 0{currentRegion.templeNumber}</Text>
          <Text style={styles.regionTitle}>{currentRegion.name.toUpperCase()}</Text>
        </View>

        {/* Animated Countdown Visual Focus */}
        <View style={styles.countdownCenter}>
          <Animated.View
            style={[
              styles.countdownCircle,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text
              style={[
                styles.countdownText,
                count === 'GO!' && { color: pqColors.jungleGreenBright, fontSize: 56 },
              ]}
            >
              {count}
            </Text>
          </Animated.View>
        </View>

        <Text style={styles.skipPrompt}>TAP ANYWHERE TO SKIP</Text>
      </Pressable>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pqSpacing.xxl,
    paddingHorizontal: pqSpacing.base,
  },
  plaque: {
    marginTop: pqSpacing.base,
  },
  templeBanner: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 33, 0.85)',
    borderWidth: 1.5,
    borderColor: pqColors.gold,
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: pqSpacing.xl,
    paddingVertical: pqSpacing.xs,
  },
  templeNum: {
    fontSize: 12,
    fontWeight: '800',
    color: pqColors.turquoiseLight,
    letterSpacing: 1,
  },
  regionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.5,
  },
  countdownCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(20, 30, 44, 0.95)',
    borderWidth: 4,
    borderColor: pqColors.crystalCyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: pqColors.crystalCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: '900',
    color: pqColors.goldBright,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  skipPrompt: {
    ...pqTypography.caption,
    color: pqColors.textMuted,
    letterSpacing: 1.2,
    marginBottom: pqSpacing.base,
  },
});
