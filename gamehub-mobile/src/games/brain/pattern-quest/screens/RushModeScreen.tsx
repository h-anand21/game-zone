// ============================================================
// PATTERN QUEST — Screen 12: RushModeScreen
// Fast Speed Rush Mode: Rapid countdown, glowing streak aura
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { HUDCounter } from '../components/game/HUDCounter';
import { PatternTile } from '../components/game/PatternTile';
import { AnswerTile } from '../components/game/AnswerTile';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqColors, pqSpacing, pqTypography } from '../theme';

export const RushModeScreen: React.FC = () => {
  const {
    currentPuzzle,
    score,
    combo,
    timeLeft,
    lives,
    submitAnswer,
    nextPuzzle,
    tickTimer,
    setScreen,
  } = usePatternQuestStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentPuzzle) {
    return null;
  }

  return (
    <GameBackground screen="rush_mode" overlayDarkness={0.35}>
      <HUDCounter
        score={score}
        combo={combo}
        timeLeft={timeLeft}
        lives={lives}
        onPause={() => setScreen('home')}
        templeTitle="RUSH ARENA"
      />

      <View style={styles.container}>
        <Animated.View style={[styles.plaqueWrap, { transform: [{ scale: pulseAnim }] }]}>
          <ScreenPlaque screen="rush_mode" width={240} height={120} />
        </Animated.View>

        {/* Speed Board */}
        <View style={styles.speedBoard}>
          <Text style={styles.speedPrompt}>⚡ RAPID FIRE: WHAT COMES NEXT?</Text>
          <View style={styles.sequenceRow}>
            {currentPuzzle.sequence.map((tile) => (
              <PatternTile key={tile.id} tile={tile} size={50} />
            ))}
            <PatternTile isQuestionMark size={50} highlighted />
          </View>
        </View>

        {/* 4 Choices */}
        <View style={styles.answersGrid}>
          {currentPuzzle.options.map((opt, idx) => (
            <AnswerTile
              key={opt.id}
              tile={opt}
              index={idx}
              selected={false}
              onPress={() => {
                const correct = submitAnswer(idx);
                if (correct) {
                  setTimeout(() => nextPuzzle(), 400);
                }
              }}
            />
          ))}
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: pqSpacing.base,
    justifyContent: 'space-between',
    paddingBottom: pqSpacing.md,
  },
  plaqueWrap: {
    alignItems: 'center',
    marginVertical: 4,
  },
  speedBoard: {
    backgroundColor: 'rgba(20, 24, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2.5,
    borderColor: '#FFA502',
    padding: pqSpacing.md,
    alignItems: 'center',
    shadowColor: '#FFA502',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  speedPrompt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFA502',
    letterSpacing: 1,
    marginBottom: pqSpacing.sm,
  },
  sequenceRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
