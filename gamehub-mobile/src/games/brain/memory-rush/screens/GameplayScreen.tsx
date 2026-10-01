// ============================================================
// MEMORY RUSH — 07 Gameplay Screen (State Machine & Fast Action)
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { NumberGrid } from '../components/NumberGrid';
import { TimerBar } from '../components/TimerBar';
import { ComboBadge } from '../components/ComboBadge';
import { RoundFeedback } from '../components/RoundFeedback';
import { PowerUpButton } from '../components/PowerUpButton';
import { PrimaryButton } from '../components/PrimaryButton';
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
    advanceToHide,
    advanceToQuestion,
    handleTileSelect,
    handleAnswerChoice,
    usePowerUp,
  } = useMemoryRushStore();

  const [remainingTimeMs, setRemainingTimeMs] = useState<number>(30000);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(30000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // 3. Question / Answering Timer
  useEffect(() => {
    if (phase === 'question' && roundConfig) {
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
          handleAnswerChoice(-1); // Time out miss
        }
      }, 50);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, roundConfig]);

  const onTilePress = (tile: NumberTileData) => {
    if (phase !== 'question') return;
    const res = handleTileSelect(tile);

    if (res.isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        if (round >= totalRounds) {
          onFinalResult();
        } else {
          onRoundComplete();
        }
      }, 700);
    }
  };

  const onOptionPress = (val: number) => {
    if (phase !== 'question') return;
    const res = handleAnswerChoice(val);

    if (res.isCorrect) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        if (round >= totalRounds) {
          onFinalResult();
        } else {
          onRoundComplete();
        }
      }, 700);
    }
  };

  return (
    <GameBackground theme="gameplay">
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
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
          <Text style={styles.taskLabel}>
            {phase === 'preview'
              ? 'MEMORIZE THE NUMBERS'
              : phase === 'hide'
              ? 'HIDING GRID...'
              : roundConfig?.questionPrompt || 'TAP THE NUMBER'}
          </Text>

          {/* Feedback Toast */}
          <RoundFeedback
            type={lastFeedback.type}
            message={lastFeedback.message}
            points={lastFeedback.points}
          />
        </View>

        {/* MAIN GAME BOARD */}
        {roundConfig && (
          <View style={styles.boardArea}>
            <NumberGrid
              tiles={tiles}
              rows={roundConfig.gridRows}
              cols={roundConfig.gridCols}
              onTilePress={onTilePress}
              disabled={phase !== 'question'}
            />

            {/* Answer Options for Missing Number Mode */}
            {roundConfig.actualType === 'missingNumber' && phase === 'question' && (
              <View style={styles.missingOptionsRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9]
                  .filter((n) => !tiles.some((t) => t.value === n))
                  .map((val) => (
                    <Pressable
                      key={`missing_${val}`}
                      onPress={() => onOptionPress(val)}
                      style={styles.missingBtn}
                    >
                      <Text style={styles.missingBtnText}>{val}</Text>
                    </Pressable>
                  ))}
              </View>
            )}
          </View>
        )}

        {/* BOTTOM HUD STATUS */}
        <View style={styles.bottomHud}>
          <View style={styles.scoreRow}>
            <View>
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
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(23, 29, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: MRColors.textPrimary,
    fontWeight: 'bold',
  },
  roundBadge: {
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roundText: {
    fontSize: 10,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  timerCol: {
    flex: 1,
    maxWidth: 140,
  },
  taskContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  taskLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: MRColors.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  boardArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  missingOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  missingBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(23, 29, 36, 0.95)',
    borderWidth: 1.5,
    borderColor: MRColors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: MRColors.cyanBright,
  },
  bottomHud: {
    paddingHorizontal: 20,
    gap: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  scoreVal: {
    fontSize: 24,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  powerUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
