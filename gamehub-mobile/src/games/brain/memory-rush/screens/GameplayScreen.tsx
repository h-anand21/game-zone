// ============================================================
// MEMORY RUSH — 07 Gameplay Screen (Jungle Temple Arena)
// Tactile Stone Altar Grid, Wood Task Signboard, Fluid Timer & Power-ups
// ============================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { NumberGrid } from '../components/NumberGrid';
import { TimerBar } from '../components/TimerBar';
import { ComboBadge } from '../components/ComboBadge';
import { RoundFeedback } from '../components/RoundFeedback';
import { PowerUpButton } from '../components/PowerUpButton';
import { PauseModal } from '../components/PauseModal';
import { StoneNumberTile } from '../components/StoneNumberTile';
import { MRIcon } from '../components/MRIcon';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { NumberTileData, PowerUpType } from '../types';

interface GameplayScreenProps {
  onBack: () => void;
  onRoundComplete: () => void;
  onFinalResult: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  onBack,
  onRoundComplete,
  onFinalResult,
}) => {
  const {
    mode,
    difficulty,
    phase,
    round,
    totalRounds,
    score,
    combo,
    tiles,
    roundConfig,
    lastFeedback,
    powerUps,
    playerInputSequence,
    startRound,
    advanceToHide,
    advanceToQuestion,
    advanceToNextRound,
    handleTileSelect,
    handleAnswerChoice,
    handleTimeoutMiss,
    usePowerUp,
    startNewGame,
  } = useMemoryRushStore();

  const [remainingTimeMs, setRemainingTimeMs] = useState<number>(10000);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(10000);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [mistakeSecondsLeft, setMistakeSecondsLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [revealedTileId, setRevealedTileId] = useState<string | null>(null);
  const [powerUpToast, setPowerUpToast] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
    };
  }, []);

  // Initialize round on mount
  useEffect(() => {
    startRound();
  }, [startRound]);

  // 1. Preview Phase Timer
  useEffect(() => {
    if (phase === 'preview' && roundConfig && !isPaused) {
      const previewMs = roundConfig.previewDurationMs;
      const timer = setTimeout(() => {
        advanceToHide();
      }, previewMs);

      return () => clearTimeout(timer);
    }
  }, [phase, roundConfig, advanceToHide, isPaused]);

  // 2. Hide Phase Transition
  useEffect(() => {
    if (phase === 'hide' && !isPaused) {
      const timer = setTimeout(() => {
        advanceToQuestion();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [phase, advanceToQuestion, isPaused]);

  // Handler to advance to next round or finish run
  const triggerNextRoundOrFinish = useCallback(
    (isMistake: boolean) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsAnswerLocked(true);

      if (isMistake) {
        setMistakeSecondsLeft(2);
        if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
        cdIntervalRef.current = setInterval(() => {
          setMistakeSecondsLeft((prev) => (prev && prev > 1 ? prev - 1 : null));
        }, 700);

        setTimeout(() => {
          if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
          setIsAnswerLocked(false);
          setMistakeSecondsLeft(null);

          if (round >= totalRounds) {
            onFinalResult();
          } else {
            advanceToNextRound();
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setIsAnswerLocked(false);
          if (round >= totalRounds) {
            onFinalResult();
          } else {
            advanceToNextRound();
          }
        }, 750);
      }
    },
    [round, totalRounds, advanceToNextRound, onFinalResult]
  );

  // 3. Question / Answering Timer
  useEffect(() => {
    if (phase === 'question' && roundConfig && !isAnswerLocked && !isPaused) {
      const timerMs = roundConfig.timerDurationMs;
      setRemainingTimeMs(timerMs);
      setTotalTimeMs(timerMs);
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        if (isFrozen) return; // Time freeze power-up halts timer countdown
        const elapsed = Date.now() - startTime;
        const rem = Math.max(0, timerMs - elapsed);
        setRemainingTimeMs(rem);

        if (rem <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeoutMiss();
          triggerNextRoundOrFinish(true);
        }
      }, 50);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, roundConfig, isAnswerLocked, isPaused, isFrozen, handleTimeoutMiss, triggerNextRoundOrFinish]);

  // POWER-UP ACTIONS WITH FULL STATE SYNCHRONIZATION
  const handleUsePowerUp = (type: PowerUpType) => {
    if (powerUps[type] <= 0 || isAnswerLocked || isPaused) return;

    if (type === 'freeze') {
      if (isFrozen) return;
      usePowerUp('freeze');
      setIsFrozen(true);
      setRemainingTimeMs((prev) => Math.min(totalTimeMs + 4000, prev + 3500));
      setPowerUpToast('❄️ TIME FROZEN FOR 4 SECONDS!');
      setTimeout(() => {
        setIsFrozen(false);
        setPowerUpToast(null);
      }, 4000);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
      return;
    }

    if (type === 'reveal') {
      if (phase !== 'question' || !roundConfig) return;
      usePowerUp('reveal');
      if (roundConfig.actualType === 'memoryGrid') {
        const targetTile = tiles.find((t) => t.value === roundConfig.targetValue);
        if (targetTile) {
          setRevealedTileId(targetTile.id);
          setPowerUpToast('👁️ TARGET STONE REVEALED IN GOLD!');
          setTimeout(() => {
            setRevealedTileId(null);
            setPowerUpToast(null);
          }, 2400);
        }
      } else if (roundConfig.actualType === 'numberShift') {
        if (roundConfig.changedTileId) {
          setRevealedTileId(roundConfig.changedTileId);
          setPowerUpToast('👁️ MUTATED STONE HIGHLIGHTED!');
          setTimeout(() => {
            setRevealedTileId(null);
            setPowerUpToast(null);
          }, 2400);
        }
      } else if (roundConfig.actualType === 'sequenceRush') {
        const nextIdx = playerInputSequence.length;
        const nextVal = roundConfig.sequenceOrder?.[nextIdx];
        const nextTile = tiles.find((t) => t.value === nextVal);
        if (nextTile) {
          setRevealedTileId(nextTile.id);
          setPowerUpToast('👁️ NEXT SEQUENCE STONE REVEALED!');
          setTimeout(() => {
            setRevealedTileId(null);
            setPowerUpToast(null);
          }, 2400);
        }
      }
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
      return;
    }

    if (type === 'secondChance') {
      if (hasShield) return;
      usePowerUp('secondChance');
      setHasShield(true);
      setPowerUpToast('🛡️ ANCIENT SHIELD ACTIVE! NEXT MISTAKE FORGIVEN');
      setTimeout(() => {
        setPowerUpToast(null);
      }, 3500);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
      return;
    }
  };

  const onTilePress = (tile: NumberTileData) => {
    if (phase !== 'question' || isAnswerLocked || isPaused) return;
    const res = handleTileSelect(tile);

    if (res.isComplete) {
      if (!res.isCorrect && hasShield) {
        setHasShield(false);
        setPowerUpToast('🛡️ SHIELD PROTECTED YOU! TRY AGAIN');
        setTimeout(() => setPowerUpToast(null), 2500);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (e) {}
        return; // Mistake absorbed by active shield
      }
      triggerNextRoundOrFinish(!res.isCorrect);
    }
  };

  const onOptionPress = (val: number) => {
    if (phase !== 'question' || isAnswerLocked || isPaused) return;
    const res = handleAnswerChoice(val);

    if (res.isComplete) {
      if (!res.isCorrect && hasShield) {
        setHasShield(false);
        setPowerUpToast('🛡️ SHIELD PROTECTED YOU! TRY AGAIN');
        setTimeout(() => setPowerUpToast(null), 2500);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (e) {}
        return;
      }
      triggerNextRoundOrFinish(!res.isCorrect);
    }
  };

  const handlePause = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPaused(false);
    startNewGame();
  };

  return (
    <JungleWorldBackground variant="arena" dimmed={isPaused}>
      <View style={styles.container}>
        {/* ==================================================== */}
        {/* 1. TOP BAR (Carved Stone HUD with Live Score & Timer) */}
        {/* ==================================================== */}
        <View style={styles.topBar}>
          {/* Back to Home / Exit */}
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.hudStoneBtn,
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
            accessibilityLabel="Exit game"
          >
            <MRIcon name="arrow-left" size={18} color="#FFD700" />
          </Pressable>

          {/* Round Indicator Tablet */}
          <View style={styles.roundTablet}>
            <Text style={styles.roundLabel}>ROUND</Text>
            <Text style={styles.roundNumbers}>
              {String(round).padStart(2, '0')}/{String(totalRounds).padStart(2, '0')}
            </Text>
          </View>

          {/* Eye-Level Live Score Tablet */}
          <View style={styles.hudScoreTablet}>
            <Text style={styles.hudScoreLabel}>SCORE</Text>
            <Text style={styles.hudScoreVal}>{score.toLocaleString()}</Text>
          </View>

          {/* Timer & Pause Button */}
          <View style={styles.topRightControls}>
            <View style={styles.timerBox}>
              <TimerBar
                progress={remainingTimeMs / totalTimeMs}
                remainingSeconds={remainingTimeMs / 1000}
                isFrozen={isFrozen}
              />
            </View>

            <Pressable
              onPress={handlePause}
              style={({ pressed }) => [
                styles.pauseStoneBtn,
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
              accessibilityLabel="Pause game"
            >
              <MRIcon name="pause" size={16} color="#FFD700" />
            </Pressable>
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. WOODEN INSTRUCTION SIGNBOARD (Layer 3 & 4) */}
        {/* ==================================================== */}
        <View style={styles.taskContainer}>
          {/* PREVIEW PHASE */}
          {phase === 'preview' && (
            <View style={styles.woodInstructionSign}>
              <Text style={styles.woodSignSub}>
                {roundConfig?.actualType === 'sequenceRush'
                  ? 'MEMORIZE THE SEQUENCE ORDER'
                  : roundConfig?.actualType === 'numberShift'
                  ? 'MEMORIZE ALL NUMBERS'
                  : roundConfig?.actualType === 'missingNumber'
                  ? 'MEMORIZE BEFORE ONE VANISHES'
                  : 'MEMORIZE STONE POSITIONS'}
              </Text>
              <Text style={styles.woodSignMain}>WATCH THE STONES...</Text>
            </View>
          )}

          {/* HIDE PHASE */}
          {phase === 'hide' && (
            <View style={styles.woodInstructionSign}>
              <Text style={styles.woodSignMain}>
                {roundConfig?.actualType === 'numberShift'
                  ? 'MUTATING A NUMBER...'
                  : roundConfig?.actualType === 'missingNumber'
                  ? 'ONE NUMBER VANISHED!'
                  : 'HIDING TILES...'}
              </Text>
            </View>
          )}

          {/* QUESTION PHASE */}
          {phase === 'question' && (
            <View style={styles.questionWrapper}>
              {/* MEMORY GRID TARGET DISPLAY */}
              {roundConfig?.actualType === 'memoryGrid' && (
                <View style={styles.targetSignBoard}>
                  <View style={styles.targetHeaderRow}>
                    <Text style={styles.targetWhereWasText}>WHERE WAS</Text>
                    {/* Glowing 3D Carved Number Token */}
                    <View style={styles.targetTokenWrapper}>
                      <LinearGradient
                        colors={['#FFE082', '#FFD700', '#B7791F']}
                        style={styles.targetTokenFace}
                      >
                        <Text style={styles.targetTokenNum}>{roundConfig.targetValue}</Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.targetQuestionMark}>?</Text>
                  </View>
                  <Text style={styles.targetInstructionSub}>
                    Tap the hidden stone tile in its original position
                  </Text>
                </View>
              )}

              {/* SEQUENCE RUSH TRACKER */}
              {roundConfig?.actualType === 'sequenceRush' && (
                <View style={styles.sequenceSignBoard}>
                  <Text style={styles.sequenceOrderPrompt}>
                    TAP RUNIC ORDER: {playerInputSequence.length + 1} OF{' '}
                    {roundConfig.sequenceOrder?.length || 0}
                  </Text>
                  <View style={styles.sequenceSlotsRow}>
                    {(roundConfig.sequenceOrder || []).map((expectedVal, idx) => {
                      const isFilled = idx < playerInputSequence.length;
                      const isCurrent = idx === playerInputSequence.length;
                      return (
                        <View
                          key={`seq_slot_${idx}`}
                          style={[
                            styles.seqSlot,
                            isFilled && styles.seqSlotFilled,
                            isCurrent && styles.seqSlotCurrent,
                          ]}
                        >
                          <Text style={[styles.seqSlotText, isFilled && styles.seqSlotFilledText]}>
                            {isFilled ? expectedVal : `${idx + 1}`}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* NUMBER SHIFT PROMPT */}
              {roundConfig?.actualType === 'numberShift' && (
                <View style={styles.shiftSignBoard}>
                  <Text style={styles.shiftSignMain}>SPOT THE MUTATED STONE!</Text>
                  <Text style={styles.shiftSignSub}>
                    Tap the tile that changed from preview
                  </Text>
                </View>
              )}

              {/* MISSING NUMBER PROMPT */}
              {roundConfig?.actualType === 'missingNumber' && (
                <View style={styles.missingSignBoard}>
                  <Text style={styles.shiftSignMain}>WHICH STONE VANISHED?</Text>
                  <Text style={styles.shiftSignSub}>
                    Choose the missing number from below
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Feedback Overlay Toast */}
          <RoundFeedback
            type={lastFeedback.type}
            message={lastFeedback.message}
            points={lastFeedback.points}
          />

          {/* Mistake Auto-Advance Reveal Banner */}
          {mistakeSecondsLeft !== null && (
            <View style={styles.mistakeCountdownBanner}>
              <MRIcon name="alert-triangle" size={15} color="#EF4444" />
              <Text style={styles.mistakeCountdownText}>
                ANSWER REVEALED • NEXT IN {mistakeSecondsLeft}s
              </Text>
            </View>
          )}
        </View>

        {/* Active Power-up or Shield Toast Banner */}
        {powerUpToast && (
          <View style={styles.powerUpToastBanner}>
            <Text style={styles.powerUpToastText}>{powerUpToast}</Text>
          </View>
        )}

        {/* ==================================================== */}
        {/* 3. MAIN STONE ALTAR BOARD (Grid Area) */}
        {/* ==================================================== */}
        {roundConfig && (
          <View style={styles.boardArea}>
            <View style={styles.altarFloorFrame}>
              <NumberGrid
                tiles={
                  revealedTileId
                    ? tiles.map((t) =>
                        t.id === revealedTileId ? { ...t, state: 'selected' as const, isChanged: true } : t
                      )
                    : tiles
                }
                rows={roundConfig.gridRows}
                cols={roundConfig.gridCols}
                onTilePress={onTilePress}
                disabled={phase !== 'question' || isAnswerLocked || isPaused}
              />
            </View>

            {/* Answer Options for Missing Number Mode */}
            {roundConfig.actualType === 'missingNumber' && phase === 'question' && (
              <View style={styles.missingOptionsContainer}>
                <Text style={styles.missingOptionsHeader}>SELECT VANISHED NUMBER:</Text>
                <View style={styles.missingOptionsRow}>
                  {(roundConfig.missingOptions || []).map((val) => (
                    <Pressable
                      key={`missing_${val}`}
                      onPress={() => onOptionPress(val)}
                      disabled={isAnswerLocked || isPaused}
                      style={({ pressed }) => [
                        styles.missingBtn,
                        pressed && !isAnswerLocked && styles.missingBtnPressed,
                        isAnswerLocked && { opacity: 0.4 },
                      ]}
                      accessibilityLabel={`Option ${val}`}
                    >
                      <Text style={styles.missingBtnText}>{val}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ==================================================== */}
        {/* 4. BOTTOM HUD (Score, Combo, Power-ups) */}
        {/* ==================================================== */}
        <View style={styles.bottomHud}>
          <View style={styles.scoreRow}>
            {/* Score Tablet with High Contrast Bevels */}
            <View style={styles.scoreTablet}>
              <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
              <Text style={styles.scoreVal}>🪙 {score.toLocaleString()} PTS</Text>
            </View>

            {/* Combo Multiplier Badge */}
            <ComboBadge combo={combo} />
          </View>

          {/* 3 POWER-UP PEDESTALS */}
          <View style={styles.powerUpRow}>
            <PowerUpButton
              type="freeze"
              count={powerUps.freeze}
              onPress={() => handleUsePowerUp('freeze')}
            />
            <PowerUpButton
              type="reveal"
              count={powerUps.reveal}
              onPress={() => handleUsePowerUp('reveal')}
            />
            <PowerUpButton
              type="secondChance"
              count={powerUps.secondChance}
              onPress={() => handleUsePowerUp('secondChance')}
            />
          </View>
        </View>

        {/* IN-GAME PAUSE MODAL */}
        <PauseModal
          visible={isPaused}
          score={score}
          onResume={handleResume}
          onRestart={handleRestart}
          onExit={onBack}
        />
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 8,
  },
  hudStoneBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#263442',
    borderWidth: 2,
    borderColor: '#607284',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  roundTablet: {
    backgroundColor: 'rgba(28, 14, 4, 0.9)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C68A4C',
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
  },
  roundLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  roundNumbers: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerBox: {
    width: 90,
  },
  pauseStoneBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#263442',
    borderWidth: 2,
    borderColor: '#607284',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
    minHeight: 56,
    justifyContent: 'center',
  },
  woodInstructionSign: {
    backgroundColor: 'rgba(38, 20, 6, 0.88)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C68A4C',
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  woodSignSub: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  woodSignMain: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  questionWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  hudScoreTablet: {
    backgroundColor: '#1E2B37',
    borderWidth: 1.5,
    borderColor: '#E6A15C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  hudScoreLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#E2CA92',
    letterSpacing: 1.2,
  },
  hudScoreVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  powerUpToastBanner: {
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
  },
  powerUpToastText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F0F9FF',
    letterSpacing: 0.8,
  },
  targetSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.95)',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#E6A15C',
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    width: '92%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  targetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  targetWhereWasText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  targetTokenWrapper: {
    borderRadius: 16,
    backgroundColor: '#4A2600',
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
  },
  targetTokenFace: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
  },
  targetTokenNum: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1C0D02',
  },
  targetQuestionMark: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  targetInstructionSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FDE68A',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  sequenceSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.95)',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#C68A4C',
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    width: '92%',
    maxWidth: 380,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  sequenceOrderPrompt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  sequenceSlotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  seqSlot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#607284',
    backgroundColor: 'rgba(10, 16, 22, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqSlotFilled: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  seqSlotCurrent: {
    borderColor: '#FFF9C4',
    borderWidth: 3,
  },
  seqSlotText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#8A9BAA',
  },
  seqSlotFilledText: {
    color: '#FFD700',
  },
  shiftSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.95)',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '92%',
    maxWidth: 380,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  shiftSignMain: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
  },
  shiftSignSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FDE68A',
  },
  missingSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.95)',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '92%',
    maxWidth: 380,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  altarFloorFrame: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 22, 18, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(110, 140, 120, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  missingOptionsContainer: {
    marginTop: 14,
    alignItems: 'center',
    width: '100%',
  },
  missingOptionsHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  missingOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  missingBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#324151',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  missingBtnPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: '#B7791F',
  },
  missingBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF8E7',
  },
  mistakeCountdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180, 20, 20, 0.35)',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
    gap: 6,
    alignSelf: 'center',
  },
  mistakeCountdownText: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: '#FCA5A5',
    fontWeight: '800',
  },
  bottomHud: {
    paddingHorizontal: 16,
    paddingBottom: 22,
    gap: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreTablet: {
    backgroundColor: '#26170B',
    borderWidth: 2,
    borderColor: '#E6A15C',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E2CA92',
    letterSpacing: 1.5,
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  powerUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
});
