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
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { NumberTileData } from '../types';

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
  }, [phase, roundConfig, isAnswerLocked, isPaused, handleTimeoutMiss, triggerNextRoundOrFinish]);

  const onTilePress = (tile: NumberTileData) => {
    if (phase !== 'question' || isAnswerLocked || isPaused) return;
    const res = handleTileSelect(tile);

    if (res.isComplete) {
      triggerNextRoundOrFinish(!res.isCorrect);
    }
  };

  const onOptionPress = (val: number) => {
    if (phase !== 'question' || isAnswerLocked || isPaused) return;
    const res = handleAnswerChoice(val);

    if (res.isComplete) {
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
        {/* 1. TOP BAR (Carved Stone HUD) */}
        {/* ==================================================== */}
        <View style={styles.topBar}>
          {/* Back to Home / Exit */}
          <Pressable
            onPress={onBack}
            style={styles.hudStoneBtn}
            accessibilityLabel="Exit game"
          >
            <MRIcon name="arrow-left" size={18} color="#FFD700" />
          </Pressable>

          {/* Round Indicator Tablet */}
          <View style={styles.roundTablet}>
            <Text style={styles.roundLabel}>ROUND</Text>
            <Text style={styles.roundNumbers}>
              {String(round).padStart(2, '0')} / {String(totalRounds).padStart(2, '0')}
            </Text>
          </View>

          {/* Timer & Pause Button */}
          <View style={styles.topRightControls}>
            <View style={styles.timerBox}>
              <TimerBar
                progress={remainingTimeMs / totalTimeMs}
                remainingSeconds={remainingTimeMs / 1000}
              />
            </View>

            <Pressable
              onPress={handlePause}
              style={styles.pauseStoneBtn}
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

        {/* ==================================================== */}
        {/* 3. MAIN STONE ALTAR BOARD (Grid Area) */}
        {/* ==================================================== */}
        {roundConfig && (
          <View style={styles.boardArea}>
            <View style={styles.altarFloorFrame}>
              <NumberGrid
                tiles={tiles}
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
            {/* Score Tablet */}
            <View style={styles.scoreTablet}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreVal}>{score.toLocaleString()}</Text>
            </View>

            {/* Combo Multiplier Badge */}
            <ComboBadge combo={combo} />
          </View>

          {/* 3 POWER-UP PEDESTALS */}
          <View style={styles.powerUpRow}>
            <PowerUpButton
              type="freeze"
              count={powerUps.freeze}
              onPress={() => usePowerUp('freeze')}
            />
            <PowerUpButton
              type="reveal"
              count={powerUps.reveal}
              onPress={() => usePowerUp('reveal')}
            />
            <PowerUpButton
              type="secondChance"
              count={powerUps.secondChance}
              onPress={() => usePowerUp('secondChance')}
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
  targetSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.92)',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#C68A4C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  targetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  targetWhereWasText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  targetTokenWrapper: {
    borderRadius: 12,
    backgroundColor: '#5C3400',
    paddingBottom: 4,
  },
  targetTokenFace: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFF9C4',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  targetTokenNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#261204',
  },
  targetQuestionMark: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
  },
  targetInstructionSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2CA92',
    marginTop: 3,
  },
  sequenceSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.92)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C68A4C',
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 6,
  },
  sequenceOrderPrompt: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.2,
  },
  sequenceSlotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  seqSlot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#607284',
    backgroundColor: 'rgba(10, 16, 22, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqSlotFilled: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
  },
  seqSlotCurrent: {
    borderColor: '#FFF9C4',
    borderWidth: 2.5,
  },
  seqSlotText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#8A9BAA',
  },
  seqSlotFilledText: {
    color: '#FFD700',
  },
  shiftSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.92)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 2,
  },
  shiftSignMain: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1.2,
  },
  shiftSignSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2CA92',
  },
  missingSignBoard: {
    backgroundColor: 'rgba(38, 20, 6, 0.92)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 2,
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
    backgroundColor: 'rgba(26, 40, 30, 0.92)',
    borderWidth: 1.5,
    borderColor: '#546A58',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  scoreLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 1.5,
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  powerUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
});
