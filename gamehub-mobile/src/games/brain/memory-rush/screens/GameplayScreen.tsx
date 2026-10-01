// ============================================================
// MEMORY RUSH — 07 Gameplay Screen (State Machine & Fast Action)
// ============================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { NumberGrid } from '../components/NumberGrid';
import { TimerBar } from '../components/TimerBar';
import { ComboBadge } from '../components/ComboBadge';
import { RoundFeedback } from '../components/RoundFeedback';
import { PowerUpButton } from '../components/PowerUpButton';
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
  } = useMemoryRushStore();

  const [remainingTimeMs, setRemainingTimeMs] = useState<number>(10000);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(10000);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [mistakeSecondsLeft, setMistakeSecondsLeft] = useState<number | null>(null);

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
    if (phase === 'preview' && roundConfig) {
      const previewMs = roundConfig.previewDurationMs;
      const timer = setTimeout(() => {
        advanceToHide();
      }, previewMs);

      return () => clearTimeout(timer);
    }
  }, [phase, roundConfig, advanceToHide]);

  // 2. Hide Phase Transition
  useEffect(() => {
    if (phase === 'hide') {
      const timer = setTimeout(() => {
        advanceToQuestion();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [phase, advanceToQuestion]);

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
    if (phase === 'question' && roundConfig && !isAnswerLocked) {
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
  }, [phase, roundConfig, isAnswerLocked, handleTimeoutMiss, triggerNextRoundOrFinish]);

  const onTilePress = (tile: NumberTileData) => {
    if (phase !== 'question' || isAnswerLocked) return;
    const res = handleTileSelect(tile);

    if (res.isComplete) {
      triggerNextRoundOrFinish(!res.isCorrect);
    }
  };

  const onOptionPress = (val: number) => {
    if (phase !== 'question' || isAnswerLocked) return;
    const res = handleAnswerChoice(val);

    if (res.isComplete) {
      triggerNextRoundOrFinish(!res.isCorrect);
    }
  };

  return (
    <GameBackground theme="gameplay">
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <MRIcon name="arrow-left" size={18} color={MRColors.textPrimary} />
          </Pressable>

          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>
              ROUND {String(round).padStart(2, '0')} / {String(totalRounds).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.timerCol}>
            <TimerBar
              progress={remainingTimeMs / totalTimeMs}
              remainingSeconds={remainingTimeMs / 1000}
            />
          </View>
        </View>

        {/* TASK / PROMPT AREA */}
        <View style={styles.taskContainer}>
          {phase === 'preview' && (
            <View style={styles.phaseHeaderBox}>
              <Text style={styles.phaseSubTitle}>
                {roundConfig?.actualType === 'sequenceRush'
                  ? 'MEMORIZE THE SEQUENCE ORDER'
                  : roundConfig?.actualType === 'numberShift'
                  ? 'MEMORIZE ALL NUMBERS'
                  : roundConfig?.actualType === 'missingNumber'
                  ? 'MEMORIZE BEFORE ONE VANISHES'
                  : 'MEMORIZE NUMBER POSITIONS'}
              </Text>
              <Text style={styles.taskLabel}>GET READY...</Text>
            </View>
          )}

          {phase === 'hide' && (
            <View style={styles.phaseHeaderBox}>
              <Text style={styles.taskLabel}>
                {roundConfig?.actualType === 'numberShift'
                  ? 'MUTATING ONE NUMBER...'
                  : roundConfig?.actualType === 'missingNumber'
                  ? 'ONE NUMBER VANISHED!'
                  : 'HIDING TILES...'}
              </Text>
            </View>
          )}

          {phase === 'question' && (
            <View style={styles.questionContainer}>
              {/* 1. MEMORY GRID TARGET DISPLAY */}
              {roundConfig?.actualType === 'memoryGrid' && (
                <View style={styles.targetBanner}>
                  <Text style={styles.targetPromptText}>WHERE WAS NUMBER</Text>
                  <View style={styles.targetBadge}>
                    <Text style={styles.targetBadgeNumber}>{roundConfig.targetValue}</Text>
                  </View>
                </View>
              )}

              {/* 2. SEQUENCE RUSH TRACKER */}
              {roundConfig?.actualType === 'sequenceRush' && (
                <View style={styles.sequenceTracker}>
                  <Text style={styles.sequenceTrackerPrompt}>
                    TAP IN ORDER: {playerInputSequence.length + 1} OF {roundConfig.sequenceOrder?.length || 0}
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

              {/* 3. NUMBER SHIFT PROMPT */}
              {roundConfig?.actualType === 'numberShift' && (
                <View style={styles.shiftPromptBanner}>
                  <View style={styles.modePillShift}>
                    <MRIcon name="refresh-cw" size={14} color={MRColors.yellowStatus} />
                    <Text style={styles.modePillText}>NUMBER SHIFT</Text>
                  </View>
                  <Text style={styles.shiftPromptMain}>SPOT THE MUTATED NUMBER!</Text>
                  <Text style={styles.shiftPromptSub}>Tap the tile that changed from preview</Text>
                </View>
              )}

              {/* 4. MISSING NUMBER PROMPT */}
              {roundConfig?.actualType === 'missingNumber' && (
                <View style={styles.missingPromptBanner}>
                  <View style={styles.modePillShift}>
                    <MRIcon name="help-circle" size={14} color={MRColors.yellowStatus} />
                    <Text style={styles.modePillText}>MISSING NUMBER</Text>
                  </View>
                  <Text style={styles.shiftPromptMain}>WHICH NUMBER VANISHED?</Text>
                  <Text style={styles.shiftPromptSub}>Select from the options below</Text>
                </View>
              )}
            </View>
          )}

          {/* Feedback Toast */}
          <RoundFeedback
            type={lastFeedback.type}
            message={lastFeedback.message}
            points={lastFeedback.points}
          />

          {/* Mistake Auto-Advance Seconds Indicator */}
          {mistakeSecondsLeft !== null && (
            <View style={styles.mistakeCountdownBanner}>
              <MRIcon name="alert-triangle" size={15} color={MRColors.dangerRose} />
              <Text style={styles.mistakeCountdownText}>
                CORRECT ANSWER REVEALED • NEXT IN {mistakeSecondsLeft}s
              </Text>
            </View>
          )}
        </View>

        {/* MAIN GAME BOARD */}
        {roundConfig && (
          <View style={styles.boardArea}>
            <NumberGrid
              tiles={tiles}
              rows={roundConfig.gridRows}
              cols={roundConfig.gridCols}
              onTilePress={onTilePress}
              disabled={phase !== 'question' || isAnswerLocked}
            />

            {/* Answer Options for Missing Number Mode */}
            {roundConfig.actualType === 'missingNumber' && phase === 'question' && (
              <View style={styles.missingOptionsContainer}>
                <Text style={styles.missingOptionsHeader}>CHOOSE VANISHED NUMBER:</Text>
                <View style={styles.missingOptionsRow}>
                  {(roundConfig.missingOptions || []).map((val) => (
                    <Pressable
                      key={`missing_${val}`}
                      onPress={() => onOptionPress(val)}
                      disabled={isAnswerLocked}
                      style={({ pressed }) => [
                        styles.missingBtn,
                        pressed && !isAnswerLocked && styles.missingBtnPressed,
                        isAnswerLocked && { opacity: 0.4 },
                      ]}
                    >
                      <Text style={styles.missingBtnText}>{val}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* BOTTOM HUD STATUS */}
        <View style={styles.bottomHud}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreVal}>{score.toLocaleString()}</Text>
            </View>

            <ComboBadge combo={combo} />
          </View>

          {/* POWER-UPS ROW */}
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
      </View>
    </GameBackground>
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
    paddingHorizontal: 20,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MRColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.35)',
  },
  roundBadge: {
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.4)',
  },
  roundText: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1.5,
  },
  timerCol: {
    width: 100,
  },
  taskContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  taskLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: MRColors.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  missingOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  missingBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: MRColors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: MRColors.yellowStatus,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MRColors.yellowStatus,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  missingBtnPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: MRColors.goldMuted,
  },
  missingBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  bottomHud: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreCard: {
    backgroundColor: MRColors.surfaceGlass,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1.5,
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  powerUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  phaseHeaderBox: {
    alignItems: 'center',
    gap: 2,
  },
  phaseSubTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: MRColors.yellowStatus,
    letterSpacing: 1.5,
  },
  questionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  targetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  targetPromptText: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  targetBadge: {
    backgroundColor: 'rgba(255, 216, 61, 0.18)',
    borderWidth: 1.5,
    borderColor: MRColors.yellowStatus,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: MRColors.yellowStatus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  targetBadgeNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: MRColors.yellowStatus,
  },
  sequenceTracker: {
    alignItems: 'center',
    gap: 8,
  },
  sequenceTrackerPrompt: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1.5,
  },
  sequenceSlotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  seqSlot: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqSlotFilled: {
    borderColor: MRColors.yellowStatus,
    backgroundColor: 'rgba(255, 216, 61, 0.2)',
  },
  seqSlotCurrent: {
    borderColor: '#FFF59D',
    borderWidth: 2,
  },
  seqSlotText: {
    fontSize: 14,
    fontWeight: '900',
    color: MRColors.textMuted,
  },
  seqSlotFilledText: {
    color: MRColors.yellowStatus,
  },
  shiftPromptBanner: {
    alignItems: 'center',
    gap: 3,
  },
  modePillShift: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.35)',
  },
  modePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  shiftPromptMain: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1.5,
    textShadowColor: MRColors.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  shiftPromptSub: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.textSecondary,
    letterSpacing: 1,
  },
  missingPromptBanner: {
    alignItems: 'center',
    gap: 3,
  },
  missingOptionsContainer: {
    marginTop: 14,
    alignItems: 'center',
    width: '100%',
  },
  missingOptionsHeader: {
    fontSize: 9.5,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mistakeCountdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.16)',
    borderColor: 'rgba(255, 68, 68, 0.5)',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
    gap: 6,
    alignSelf: 'center',
  },
  mistakeCountdownText: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: MRColors.dangerRose,
    fontWeight: '800',
  },
});
