// ============================================================
// REVERSE MIND — Core Interactive Gameplay Screen (Internal State Machine)
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GameHeader } from '../components/GameHeader';
import { HangingSignboard } from '../components/HangingSignboard';
import { SequenceRow } from '../components/SequenceRow';
import { ReverseAnswerSlots } from '../components/ReverseAnswerSlots';
import { ObjectTileGrid } from '../components/ObjectTileGrid';
import { MascotCompanion } from '../components/MascotCompanion';
import { MindShiftModal } from '../components/MindShiftModal';
import { GlowButton } from '../components/GlowButton';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { GameObject } from '../types';
import { RMTheme } from '../theme';

interface GameplayScreenProps {
  onBack: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({ onBack }) => {
  const {
    mode,
    difficulty,
    phase,
    round,
    totalRounds,
    score,
    combo,
    sequence,
    expectedTarget,
    playerInput,
    gridOptions,
    mindShiftRule,
    roundConfig,
    remainingTimeMs,
    totalTimeMs,
    lastFeedback,
    mistakes,
    maxMistakes,
    advanceToMemory,
    advanceToFlipping,
    advanceToInput,
    dismissMindShift,
    handleTileTap,
    nextRoundOrComplete,
    claimRewardsAndExit,
  } = useReverseMindStore();

  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [timerProgress, setTimerProgress] = useState<number>(1);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── 1. Countdown Phase Handler ─────────────────────────────
  useEffect(() => {
    if (phase === 'countdown') {
      setCountdownNum(3);
      const timer = setInterval(() => {
        setCountdownNum((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            advanceToMemory();
            return 0;
          }
          return prev - 1;
        });
      }, 700);

      return () => clearInterval(timer);
    }
  }, [phase, advanceToMemory]);

  // ── 2. Memory Phase Countdown Timer ────────────────────────
  useEffect(() => {
    if (phase === 'memory') {
      const duration = roundConfig.displayDurationMs;
      const startTime = Date.now();

      timerIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setTimerProgress(remaining / duration);

        if (remaining <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          advanceToFlipping();
        }
      }, 50);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [phase, roundConfig.displayDurationMs, advanceToFlipping]);

  // ── 3. Flipping Transition Phase Handler ───────────────────
  useEffect(() => {
    if (phase === 'flipping') {
      const timer = setTimeout(() => {
        advanceToInput();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [phase, advanceToInput]);

  // Handle tile tap with feedback
  const onTilePress = (object: GameObject) => {
    handleTileTap(object);
  };

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Game HUD Header */}
        <GameHeader
          modeName={mode}
          round={round}
          totalRounds={totalRounds}
          score={score}
          combo={combo}
          onBack={onBack}
        />

        {/* ── PHASE: COUNTDOWN ─────────────────────────────── */}
        {phase === 'countdown' && (
          <View style={styles.countdownCenter}>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdownNum || 'GO!'}</Text>
            </View>
            <Text style={styles.countdownSub}>PREPARE YOUR MIND</Text>
          </View>
        )}

        {/* ── PHASE: MEMORY (REMEMBER SEQUENCE) ───────────── */}
        {phase === 'memory' && (
          <View style={styles.gameplayBody}>
            {/* Hanging Signboard */}
            <HangingSignboard
              title="REMEMBER THE SEQUENCE!"
              subtitle="Look closely at the items from First to Last"
              tag={`STEP 1: MEMORIZE (${Math.ceil(timerProgress * (roundConfig.displayDurationMs / 1000))}s)`}
            />

            {/* Visual Timer Bar */}
            <View style={styles.timerTrack}>
              <View style={[styles.timerFill, { width: `${timerProgress * 100}%` }]} />
            </View>

            {/* Sequence Row Display */}
            <View style={styles.sequenceWrapper}>
              <SequenceRow sequence={sequence} />
            </View>

            {/* Boy Mascot Thinking */}
            <MascotCompanion
              state="thinking"
              size="md"
              showSpeechBubble={true}
              speechText="Lock each item in your memory!"
            />
          </View>
        )}

        {/* ── PHASE: FLIPPING (MOTION INVERSION) ────────────── */}
        {phase === 'flipping' && (
          <View style={styles.gameplayBody}>
            <HangingSignboard
              title="FLIPPING..."
              subtitle="Reverse your brain's sequence now!"
              tag="INVERTING"
            />

            <View style={styles.sequenceWrapper}>
              <SequenceRow sequence={sequence} isFlipping={true} />
            </View>

            <View style={styles.flippingAlert}>
              <Text style={styles.flippingText}>⟲ INVERTING ORDER ⟲</Text>
            </View>

            <MascotCompanion
              state="surprised"
              size="md"
              showSpeechBubble={true}
              speechText="Now play it backwards!"
            />
          </View>
        )}

        {/* ── PHASE: INPUT (REVERSE SELECTION) ──────────────── */}
        {phase === 'input' && (
          <View style={styles.gameplayBody}>
            <HangingSignboard
              title="REVERSE IT!"
              subtitle={
                mindShiftRule.id !== 'none'
                  ? mindShiftRule.ruleTag
                  : 'Tap each item in reverse order (Last to First)'
              }
              tag={`MISTAKES ALLOWED: ${maxMistakes - mistakes}`}
            />

            {/* Feedback Toast if just tapped */}
            {lastFeedback.type && (
              <View
                style={[
                  styles.feedbackToast,
                  lastFeedback.type === 'correct' ? styles.toastCorrect : styles.toastWrong,
                ]}
              >
                <Text style={styles.toastTitle}>{lastFeedback.message}</Text>
                {lastFeedback.type === 'wrong' && lastFeedback.expectedName && (
                  <Text style={styles.toastDetail}>
                    Expected: {lastFeedback.expectedName} | You tapped: {lastFeedback.tappedName}
                  </Text>
                )}
              </View>
            )}

            {/* Target Reverse Slots */}
            <ReverseAnswerSlots
              totalSlots={expectedTarget.length}
              playerInput={playerInput}
              isWrong={lastFeedback.type === 'wrong'}
            />

            {/* Keypad Object Grid */}
            <ObjectTileGrid
              options={gridOptions}
              playerInput={playerInput}
              onSelect={onTilePress}
              disabled={lastFeedback.type === 'wrong' && maxMistakes - mistakes < 0}
            />

            {/* Mascot reaction */}
            <MascotCompanion
              state={lastFeedback.type === 'correct' ? 'happy' : lastFeedback.type === 'wrong' ? 'wrong' : 'idle'}
              size="sm"
            />
          </View>
        )}

        {/* ── PHASE: LEVEL COMPLETE ────────────────────────── */}
        {phase === 'levelComplete' && (
          <View style={styles.resultContainer}>
            <HangingSignboard
              title="LEVEL CLEARED!"
              subtitle="Outstanding cognitive inversion!"
              tag="VICTORY"
            />

            <View style={styles.starsRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIconCenter}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Final Score</Text>
                <Text style={styles.statValGold}>{score}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max Combo Streak</Text>
                <Text style={styles.statValCyan}>{combo}x</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Coins Rewarded</Text>
                <Text style={styles.statValGold}>+120 🪙</Text>
              </View>
            </View>

            <MascotCompanion
              state="celebrating"
              size="lg"
              showSpeechBubble={true}
              speechText="Genius level memory!"
            />

            <View style={styles.resultActions}>
              <GlowButton
                title="CLAIM REWARDS & EXIT"
                variant="gold"
                size="lg"
                onPress={claimRewardsAndExit}
              />
            </View>
          </View>
        )}

        {/* ── PHASE: GAME RESULT (GAME OVER) ───────────────── */}
        {phase === 'gameResult' && (
          <View style={styles.resultContainer}>
            <HangingSignboard
              title="ROUND OVER"
              subtitle="Mistakes limit reached!"
              tag="TRY AGAIN"
            />

            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Rounds Reached</Text>
                <Text style={styles.statValCyan}>{round} / {totalRounds}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Points Earned</Text>
                <Text style={styles.statValGold}>{score}</Text>
              </View>
            </View>

            <MascotCompanion
              state="confused"
              size="md"
              showSpeechBubble={true}
              speechText="Keep training, your brain is growing!"
            />

            <View style={styles.resultActions}>
              <GlowButton
                title="TRY AGAIN"
                variant="gold"
                size="lg"
                onPress={() => useReverseMindStore.getState().startNewGame(mode, difficulty)}
              />
              <View style={{ height: 10 }} />
              <GlowButton
                title="RETURN TO HUB"
                variant="glass"
                size="md"
                onPress={claimRewardsAndExit}
              />
            </View>
          </View>
        )}

        {/* ── DYNAMIC MIND SHIFT MODAL OVERLAY ──────────────── */}
        <MindShiftModal
          visible={phase === 'mindShift'}
          rule={mindShiftRule}
          onDismiss={dismissMindShift}
        />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  countdownCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(77, 231, 255, 0.15)',
    borderWidth: 3,
    borderColor: RMTheme.colors.cyanNeon,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: RMTheme.colors.cyanNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  countdownSub: {
    fontSize: 12,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 2,
    marginTop: 18,
  },
  gameplayBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  timerTrack: {
    width: '85%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginTop: 6,
  },
  timerFill: {
    height: '100%',
    backgroundColor: RMTheme.colors.cyanNeon,
    borderRadius: 3,
  },
  sequenceWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  flippingAlert: {
    backgroundColor: 'rgba(77, 163, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: RMTheme.colors.blueNeon,
    marginVertical: 10,
  },
  flippingText: {
    fontSize: 14,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 2,
  },
  feedbackToast: {
    width: '90%',
    borderRadius: RMTheme.radii.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 4,
  },
  toastCorrect: {
    backgroundColor: 'rgba(87, 227, 137, 0.25)',
    borderWidth: 1,
    borderColor: RMTheme.colors.emeraldGreen,
  },
  toastWrong: {
    backgroundColor: 'rgba(255, 94, 108, 0.25)',
    borderWidth: 1,
    borderColor: RMTheme.colors.coralRed,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  toastDetail: {
    fontSize: 11,
    color: '#FFE082',
    fontWeight: '600',
    marginTop: 2,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  starIcon: {
    fontSize: 36,
  },
  starIconCenter: {
    fontSize: 48,
    marginTop: -8,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: RMTheme.colors.textSecondary,
    fontWeight: '600',
  },
  statValGold: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  statValCyan: {
    fontSize: 16,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  resultActions: {
    width: '100%',
  },
});
