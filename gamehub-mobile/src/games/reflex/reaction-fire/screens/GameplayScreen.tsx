// ============================================================
// REACTION FIRE — Screen 07: Active Gameplay Arena
// Full-screen touch engine with monotonic clock, false start protection & mode rules
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, AppState, AppStateStatus } from 'react-native';
import { GameHUD } from '../components/GameHUD';
import { ReactionArena } from '../components/ReactionArena';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { PauseOverlay } from '../components/PauseOverlay';
import { getMonotonicNow, getRandomDelayMs } from '../logic/timing';
import { getClassification, evaluateRunResult } from '../logic/reactionEngine';
import { RfAudio } from '../audio/audioManager';
import { RfHaptics } from '../haptics/hapticManager';
import { RfColors } from '../theme';
import { RF_MODES } from '../config';
import type {
  GameModeId,
  GameplayState,
  PerformanceClassification,
  RunResult,
} from '../types';

interface GameplayScreenProps {
  mode: GameModeId;
  previousBestMs: number | null;
  onGameOver: (result: RunResult) => void;
  onExitToHome: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  mode,
  previousBestMs,
  onGameOver,
  onExitToHome,
}) => {
  const modeConfig = RF_MODES[mode];
  const isEndurance = mode === 'endurance';

  // Gameplay State Machine
  const [gameState, setGameState] = useState<GameplayState>('countdown');
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimes, setRoundTimes] = useState<number[]>([]);
  const [falseStartsCount, setFalseStartsCount] = useState(0);
  const [totalValidHits, setTotalValidHits] = useState(0);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [lastClassification, setLastClassification] = useState<PerformanceClassification>('Normal');
  const [isPaused, setIsPaused] = useState(false);

  // Endurance Clock
  const [enduranceTimeRemaining, setEnduranceTimeRemaining] = useState<number>(30);

  // Monotonic Timing Refs
  const goTimestampRef = useRef<number>(0);
  const stateRef = useRef<GameplayState>(gameState);
  stateRef.current = gameState;
  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;
  const isTerminatedRef = useRef<boolean>(false);

  const signalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundTimesRef = useRef<number[]>([]);
  roundTimesRef.current = roundTimes;
  const falseStartsRef = useRef<number>(0);
  falseStartsRef.current = falseStartsCount;
  const validHitsRef = useRef<number>(0);
  validHitsRef.current = totalValidHits;

  // Clear pending timers safely
  const clearPendingTimers = () => {
    if (signalTimerRef.current) {
      clearTimeout(signalTimerRef.current);
      signalTimerRef.current = null;
    }
  };

  // Finalize Run Callback (executes exactly once)
  const finalizeRun = useCallback(() => {
    if (isTerminatedRef.current) return;
    isTerminatedRef.current = true;
    clearPendingTimers();
    setGameState('finished');

    const result = evaluateRunResult({
      mode,
      roundTimes: roundTimesRef.current,
      falseStartsCount: falseStartsRef.current,
      previousBestMs,
      totalValidHits: validHitsRef.current,
      timeSurvivedSeconds: isEndurance ? 30 - enduranceTimeRemaining : undefined,
    });

    onGameOver(result);
  }, [mode, previousBestMs, isEndurance, enduranceTimeRemaining, onGameOver]);

  // Starts an active round's random delay
  const startWaitingRound = useCallback(() => {
    if (isTerminatedRef.current || isPausedRef.current) return;

    clearPendingTimers();
    setGameState('waiting');
    setLastMs(null);

    const delay = getRandomDelayMs(1000, 3800);

    // In Fakeout mode: 40% chance of a decoy trigger first
    if (mode === 'fakeout' && Math.random() < 0.45) {
      const decoyDelay = Math.floor(delay * 0.6);
      signalTimerRef.current = setTimeout(() => {
        if (isPausedRef.current || isTerminatedRef.current) return;
        setGameState('decoy');

        // Reset back to waiting after 600ms decoy flash
        signalTimerRef.current = setTimeout(() => {
          if (isPausedRef.current || isTerminatedRef.current) return;
          setGameState('waiting');
          // Proceed to real GO signal
          signalTimerRef.current = setTimeout(() => {
            triggerGoSignal();
          }, 1200);
        }, 600);
      }, decoyDelay);
      return;
    }

    signalTimerRef.current = setTimeout(() => {
      triggerGoSignal();
    }, delay);
  }, [mode]);

  const triggerGoSignal = () => {
    if (isPausedRef.current || isTerminatedRef.current) return;
    setGameState('go');
    goTimestampRef.current = getMonotonicNow();
    RfHaptics.signalGo();
    RfAudio.playSignalGo();
  };

  // Endurance 30s Countdown Clock
  useEffect(() => {
    if (!isEndurance || isPaused || isTerminatedRef.current || gameState === 'countdown') return;

    const interval = setInterval(() => {
      if (isPausedRef.current || isTerminatedRef.current) return;

      setEnduranceTimeRemaining((prev) => {
        if (prev <= 0.2) {
          clearInterval(interval);
          finalizeRun();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isEndurance, isPaused, gameState, finalizeRun]);

  // AppState background pause protection
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState.match(/inactive|background/) && !isPausedRef.current && !isTerminatedRef.current) {
        setIsPaused(true);
      }
    });
    return () => subscription.remove();
  }, []);

  // Main Touch Interaction Handler
  const handleTouchArena = () => {
    if (isPaused || isTerminatedRef.current) return;

    const current = stateRef.current;

    // 1. TOUCHED DURING WAITING OR DECOY (FALSE START)
    if (current === 'waiting' || current === 'decoy') {
      clearPendingTimers();
      setFalseStartsCount((prev) => prev + 1);
      falseStartsRef.current += 1;

      setGameState('tooEarly');
      RfHaptics.falseStart();
      RfAudio.playFalseStart();

      if (mode === 'classic') {
        // In Classic: One mistake ends the run immediately
        setTimeout(() => {
          finalizeRun();
        }, 1100);
      } else if (isEndurance) {
        // In Endurance: Short 800ms penalty then restart waiting
        setTimeout(() => {
          if (!isTerminatedRef.current && !isPausedRef.current) {
            startWaitingRound();
          }
        }, 800);
      } else {
        // Multi-round: Mark this round as failed (or restart round)
        setTimeout(() => {
          if (currentRound < modeConfig.totalRounds) {
            setCurrentRound((prev) => prev + 1);
            startWaitingRound();
          } else {
            finalizeRun();
          }
        }, 1200);
      }
    }

    // 2. TOUCHED DURING GO SIGNAL (VALID HIT)
    else if (current === 'go') {
      const tapTimestamp = getMonotonicNow();
      const reactionTimeMs = Math.max(1, Math.round(tapTimestamp - goTimestampRef.current));
      const classification = getClassification(reactionTimeMs);

      setLastMs(reactionTimeMs);
      setLastClassification(classification);
      setGameState('success');
      RfHaptics.successTap();
      RfAudio.playSuccess();

      // Record Telemetry
      const updatedTimes = [...roundTimesRef.current, reactionTimeMs];
      setRoundTimes(updatedTimes);
      roundTimesRef.current = updatedTimes;

      const nextHits = validHitsRef.current + 1;
      setTotalValidHits(nextHits);
      validHitsRef.current = nextHits;

      // Handle Progression
      if (mode === 'classic') {
        setTimeout(() => {
          finalizeRun();
        }, 900);
      } else if (isEndurance) {
        // Fast instant cycle in endurance
        setTimeout(() => {
          if (!isTerminatedRef.current && !isPausedRef.current) {
            startWaitingRound();
          }
        }, 450);
      } else {
        // Multi-round modes (5-Round or Fakeout)
        setTimeout(() => {
          if (currentRound < modeConfig.totalRounds) {
            setCurrentRound((prev) => prev + 1);
            startWaitingRound();
          } else {
            finalizeRun();
          }
        }, 1000);
      }
    }
  };

  // Pause Controls
  const handlePause = () => {
    if (isTerminatedRef.current || gameState === 'countdown') return;
    clearPendingTimers();
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    if (gameState === 'waiting' || gameState === 'decoy') {
      startWaitingRound();
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    clearPendingTimers();
    setGameState('countdown');
    setCurrentRound(1);
    setRoundTimes([]);
    setFalseStartsCount(0);
    setTotalValidHits(0);
    setLastMs(null);
    setEnduranceTimeRemaining(30);
  };

  const handleExit = () => {
    clearPendingTimers();
    setIsPaused(false);
    onExitToHome();
  };

  return (
    <View style={styles.container}>
      {/* Top Game HUD */}
      <GameHUD
        mode={mode}
        currentRound={currentRound}
        totalRounds={modeConfig.totalRounds}
        enduranceTimeRemainingSeconds={isEndurance ? enduranceTimeRemaining : undefined}
        personalBestMs={previousBestMs}
        onPause={handlePause}
      />

      {/* Main Touch Arena / Countdown */}
      <View style={styles.arenaContainer}>
        {gameState === 'countdown' ? (
          <CountdownOverlay onComplete={startWaitingRound} />
        ) : (
          <ReactionArena
            state={gameState}
            onTouchArena={handleTouchArena}
            lastReactionTimeMs={lastMs}
            lastClassification={lastClassification}
            disabled={isPaused || gameState === 'finished'}
          />
        )}
      </View>

      {/* Pause Modal Overlay */}
      <PauseOverlay
        visible={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  arenaContainer: {
    flex: 1,
  },
});

export default GameplayScreen;
