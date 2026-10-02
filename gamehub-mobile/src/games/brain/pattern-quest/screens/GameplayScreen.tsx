// ============================================================
// PATTERN QUEST — Screen 08: GameplayScreen
// Carved Stone Board, WHAT COMES NEXT?, 4 Large Answer Tiles,
// Floating Non-blocking Feedback, Temple Loading State & 60FPS Performance
// ============================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { HUDCounter } from '../components/game/HUDCounter';
import { PatternTile } from '../components/game/PatternTile';
import { AnswerTile } from '../components/game/AnswerTile';
import { PauseModal } from '../components/overlays/PauseModal';
import { MagicLensModal } from '../components/overlays/MagicLensModal';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameplayScreen: React.FC = () => {
  const {
    currentPuzzle,
    score,
    combo,
    timeLeft,
    lives,
    answerState,
    selectedOptionIndex,
    eliminatedOptionIndices,
    isMagicLensActive,
    magicLensCharges,
    hintsRemaining,
    submitAnswer,
    clearAnswerState,
    nextPuzzle,
    tickTimer,
    useHint,
    useMagicLens,
    pauseGame,
    resumeGame,
    setScreen,
    startNewGame,
  } = usePatternQuestStore();

  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isLensOpen, setIsLensOpen] = useState(false);

  // Floating feedback banner animation
  const feedbackScale = useRef(new Animated.Value(0.7)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  // Loading pulse animation
  const pulseAnim = useRef(new Animated.Value(0.9)).current;

  // Auto initialize if puzzle is missing
  useEffect(() => {
    if (!currentPuzzle) {
      startNewGame();
    }
  }, [currentPuzzle, startNewGame]);

  // Loading crystal pulse
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.9, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Timer Interval (1s tick)
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  // Trigger floating feedback animation
  const showFeedbackOverlay = useCallback(() => {
    feedbackScale.setValue(0.7);
    feedbackOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(feedbackScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedbackScale, feedbackOpacity]);

  // Handle auto-advance / auto-reset on answer state change
  useEffect(() => {
    if (answerState === 'correct') {
      showFeedbackOverlay();
      const t = setTimeout(() => {
        nextPuzzle();
      }, 750);
      return () => clearTimeout(t);
    } else if (answerState === 'wrong') {
      showFeedbackOverlay();
      const t = setTimeout(() => {
        if (lives <= 0) {
          setScreen('final_results');
        } else {
          clearAnswerState();
        }
      }, 750);
      return () => clearTimeout(t);
    }
  }, [answerState, lives, nextPuzzle, clearAnswerState, setScreen, showFeedbackOverlay]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (answerState !== 'idle') return;
      submitAnswer(index);
    },
    [answerState, submitAnswer]
  );

  const handleOpenPause = useCallback(() => {
    pauseGame();
    setIsPauseOpen(true);
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    setIsPauseOpen(false);
    resumeGame();
  }, [resumeGame]);

  const handleRestart = useCallback(() => {
    setIsPauseOpen(false);
    setScreen('ready');
  }, [setScreen]);

  const handleSettings = useCallback(() => {
    setIsPauseOpen(false);
    setScreen('settings');
  }, [setScreen]);

  const handleQuit = useCallback(() => {
    setIsPauseOpen(false);
    setScreen('home');
  }, [setScreen]);

  // Beautiful ancient chamber loading state
  if (!currentPuzzle) {
    return (
      <GameBackground screen="gameplay" overlayDarkness={0.4}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <Animated.Image
              source={pqAssets.hud.crystal}
              style={[styles.loadingCrystal, { transform: [{ scale: pulseAnim }] }]}
              resizeMode="contain"
            />
            <Text style={styles.loadingTitle}>DECODING ANCIENT RUNES</Text>
            <Text style={styles.loadingSubtitle}>Aligning the Temple Chamber Puzzles...</Text>
            <View style={styles.loadingBarTrack}>
              <View style={styles.loadingBarFill} />
            </View>
          </View>
        </View>
      </GameBackground>
    );
  }

  const sequenceTileSize = Math.min(
    (SCREEN_WIDTH - 84) / (currentPuzzle.sequence.length + 1),
    56
  );

  return (
    <GameBackground screen="gameplay" overlayDarkness={0.28}>
      {/* Top HUD */}
      <HUDCounter
        score={score}
        combo={combo}
        timeLeft={timeLeft}
        lives={lives}
        onPause={handleOpenPause}
      />

      <View style={styles.mainContainer}>
        {/* Main Carved Stone Board */}
        <View style={styles.stoneBoard}>
          <Text style={styles.questionPrompt}>
            {currentPuzzle.questionPrompt}
          </Text>

          {/* If Magic Lens active, show revealed rule */}
          {isMagicLensActive && (
            <View style={styles.lensRuleBox}>
              <Text style={styles.lensRuleText}>
                🔍 SECRET RULE: {currentPuzzle.ruleExplanation}
              </Text>
            </View>
          )}

          {/* Sequence of Runes with missing '?' target */}
          <View style={styles.sequenceContainer}>
            {currentPuzzle.sequence.map((tile) => (
              <PatternTile
                key={tile.id}
                tile={tile}
                size={sequenceTileSize}
              />
            ))}

            {/* When correct, reveal the winning tile inside the sequence */}
            {answerState === 'correct' ? (
              <PatternTile
                tile={currentPuzzle.options[currentPuzzle.correctOptionIndex]}
                size={sequenceTileSize}
                isCorrect
                highlighted
              />
            ) : (
              <PatternTile
                isQuestionMark
                size={sequenceTileSize}
                highlighted
              />
            )}
          </View>
        </View>

        {/* 4 Large Tactile Choice Tiles */}
        <View style={styles.answerGrid}>
          {currentPuzzle.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isEliminated = eliminatedOptionIndices.includes(idx);
            const isCorrect = isSelected && answerState === 'correct';
            const isWrong = isSelected && answerState === 'wrong';

            return (
              <AnswerTile
                key={`${currentPuzzle.id}-${opt.id}-${idx}`}
                tile={opt}
                index={idx}
                selected={isSelected}
                isCorrect={isCorrect}
                isWrong={isWrong}
                disabled={isEliminated || (answerState !== 'idle' && !isSelected)}
                onPress={() => handleAnswer(idx)}
              />
            );
          })}
        </View>

        {/* Bottom Expedition Tools Bar */}
        <View style={styles.bottomToolBar}>
          <Pressable
            style={[styles.toolBtn, magicLensCharges <= 0 && styles.toolDisabled]}
            onPress={() => setIsLensOpen(true)}
            disabled={magicLensCharges <= 0}
          >
            <Image source={pqAssets.buttons.magicLens} style={styles.toolIcon} resizeMode="contain" />
            <Text style={styles.toolBadge}>{magicLensCharges}</Text>
          </Pressable>

          <Pressable
            style={[styles.toolBtn, hintsRemaining <= 0 && styles.toolDisabled]}
            onPress={() => useHint()}
            disabled={hintsRemaining <= 0}
          >
            <Image source={pqAssets.buttons.hint} style={styles.toolIcon} resizeMode="contain" />
            <Text style={styles.toolBadge}>{hintsRemaining}</Text>
          </Pressable>

          <Pressable
            style={styles.toolBtn}
            onPress={() => nextPuzzle()}
          >
            <Image source={pqAssets.buttons.skip} style={styles.toolIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>

      {/* Floating Non-Blocking Feedback Overlay (No layout shifting!) */}
      {answerState !== 'idle' && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingFeedbackOverlay,
            {
              opacity: feedbackOpacity,
              transform: [{ scale: feedbackScale }],
            },
          ]}
        >
          <View
            style={[
              styles.feedbackCard,
              answerState === 'correct' ? styles.feedbackCardCorrect : styles.feedbackCardWrong,
            ]}
          >
            <Image
              source={
                answerState === 'correct'
                  ? pqAssets.plaques.correct
                  : pqAssets.plaques.wrong
              }
              style={styles.feedbackPlaqueImage}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.feedbackText,
                answerState === 'correct'
                  ? { color: pqColors.successGlow }
                  : { color: pqColors.dangerGlow },
              ]}
            >
              {answerState === 'correct'
                ? `+${100 + combo * 20} PTS • PERFECT!`
                : 'INCORRECT RUNE • -1 LIFE'}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Pause Modal */}
      <PauseModal
        visible={isPauseOpen}
        onResume={handleResume}
        onRestart={handleRestart}
        onSettings={handleSettings}
        onQuit={handleQuit}
      />

      {/* Magic Lens Modal */}
      <MagicLensModal
        visible={isLensOpen}
        chargesRemaining={magicLensCharges}
        onRevealRule={() => useMagicLens('reveal')}
        onRemoveOne={() => useMagicLens('remove')}
        onFreezeTime={() => useMagicLens('freeze')}
        onClose={() => setIsLensOpen(false)}
      />
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  loadingCard: {
    width: Math.min(SCREEN_WIDTH - 48, 320),
    backgroundColor: 'rgba(15, 23, 34, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: pqColors.gold,
    paddingVertical: pqSpacing.xl,
    paddingHorizontal: pqSpacing.lg,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingCrystal: {
    width: 64,
    height: 64,
    marginBottom: pqSpacing.md,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 12,
    color: pqColors.textSecondary,
    marginBottom: pqSpacing.lg,
    textAlign: 'center',
  },
  loadingBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: pqColors.crystalCyan,
    borderRadius: 4,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: pqSpacing.base,
    paddingTop: pqSpacing.xs,
    paddingBottom: pqSpacing.xs,
    justifyContent: 'space-between',
  },
  stoneBoard: {
    backgroundColor: 'rgba(16, 24, 34, 0.94)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    borderColor: '#4A5B6E',
    paddingVertical: pqSpacing.sm,
    paddingHorizontal: pqSpacing.base,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  questionPrompt: {
    fontSize: 14,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.5,
    marginBottom: pqSpacing.sm,
    textTransform: 'uppercase',
  },
  lensRuleBox: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: pqColors.crystalCyan,
    borderRadius: pqSpacing.radiusSm,
    paddingHorizontal: pqSpacing.sm,
    paddingVertical: 3,
    marginBottom: pqSpacing.xs,
  },
  lensRuleText: {
    fontSize: 11,
    fontWeight: '700',
    color: pqColors.turquoiseLight,
    textAlign: 'center',
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  bottomToolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: pqSpacing.lg,
    paddingBottom: pqSpacing.xs,
  },
  toolBtn: {
    position: 'relative',
  },
  toolIcon: {
    width: 90,
    height: 48,
  },
  toolBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: pqColors.gold,
    borderRadius: 8,
    paddingHorizontal: 5,
    fontSize: 10,
    fontWeight: '900',
    color: pqColors.goldBright,
  },
  toolDisabled: {
    opacity: 0.4,
  },
  floatingFeedbackOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  feedbackCard: {
    width: 250,
    backgroundColor: 'rgba(12, 19, 28, 0.96)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2,
    paddingVertical: pqSpacing.sm,
    paddingHorizontal: pqSpacing.base,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  feedbackCardCorrect: {
    borderColor: pqColors.successGlow,
  },
  feedbackCardWrong: {
    borderColor: pqColors.dangerGlow,
  },
  feedbackPlaqueImage: {
    width: 140,
    height: 60,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
  },
});
