// ============================================================
// DON'T TAP WRONG — Screen 07: Active Gameplay Screen
// Master gameplay engine with high-frequency touch feedback,
// accurate deadline timing, streak milestones, pause & exit modals
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Animated, AppState, AppStateStatus } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { GameHud } from '../components/game/GameHud';
import { TileGrid } from '../components/game/TileGrid';
import { PauseModal } from '../components/game/PauseModal';
import { ExitConfirmModal } from '../components/game/ExitConfirmModal';
import { generateBoard, getDailySeed } from '../engine/boardGenerator';
import { evaluateRunTelemetry, getStreakMilestone } from '../engine/gameEngine';
import { DtwHaptics } from '../haptics/hapticManager';
import { DtwAudio } from '../audio/audioManager';
import { DtwColors } from '../theme/colors';
import { DTW_MODES } from '../config';
import type { GameModeId, TileItem, RunTelemetry, RunEndReason } from '../types';

interface GameplayScreenProps {
  modeId: GameModeId;
  previousHighScore: number;
  onGameOver: (telemetry: RunTelemetry) => void;
  onExitToHome: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  modeId,
  previousHighScore,
  onGameOver,
  onExitToHome,
}) => {
  const modeConfig = DTW_MODES[modeId];
  const isTimed = modeConfig.durationSeconds > 0;
  const initialDuration = modeConfig.durationSeconds;

  // Authoritative Gameplay State
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [safeTaps, setSafeTaps] = useState(0);
  const [dangerTaps, setDangerTaps] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  // Daily challenge seed
  const dailySeed = modeId === 'daily' ? getDailySeed() : undefined;
  const roundCounterRef = useRef(0);

  // Board state with revision protection against double taps
  const [board, setBoard] = useState<{ tiles: TileItem[]; revision: number }>(() =>
    generateBoard(modeConfig, 0, dailySeed, 0)
  );

  // Feedback animations
  const [scorePopup, setScorePopup] = useState<string | null>(null);
  const [streakBanner, setStreakBanner] = useState<string | null>(null);
  const popupAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;
  const dangerFlashAnim = useRef(new Animated.Value(0)).current;

  // Accurate deadline timing refs
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isTerminatedRef = useRef(isTerminated);
  isTerminatedRef.current = isTerminated;
  const remainingTimeRef = useRef(initialDuration);
  remainingTimeRef.current = timeRemaining;
  const deadlineRef = useRef<number>(Date.now() + initialDuration * 1000);
  const startTimeRef = useRef<number>(Date.now());

  // Refs for final telemetry calculation
  const statsRef = useRef({
    score: 0,
    currentStreak: 0,
    bestStreak: 0,
    safeTaps: 0,
    dangerTaps: 0,
  });
  statsRef.current = { score, currentStreak, bestStreak, safeTaps, dangerTaps };

  // Finalize run exactly once
  const finalizeRun = useCallback(
    (reason: RunEndReason) => {
      if (isTerminatedRef.current) return;
      isTerminatedRef.current = true;
      setIsTerminated(true);

      const elapsed = isTimed
        ? Math.max(0, initialDuration - remainingTimeRef.current)
        : (Date.now() - startTimeRef.current) / 1000;

      const telemetry = evaluateRunTelemetry({
        mode: modeId,
        modeConfig,
        score: statsRef.current.score,
        bestStreak: statsRef.current.bestStreak,
        currentStreak: statsRef.current.currentStreak,
        safeTaps: statsRef.current.safeTaps,
        dangerTaps: statsRef.current.dangerTaps,
        durationElapsedSeconds: Math.round(elapsed * 10) / 10,
        reason,
        previousHighScore,
      });

      onGameOver(telemetry);
    },
    [modeId, modeConfig, initialDuration, isTimed, previousHighScore, onGameOver]
  );

  // High-frequency clock based on actual wall-clock deadline
  useEffect(() => {
    if (!isTimed || isPaused || isTerminated) return;

    deadlineRef.current = Date.now() + remainingTimeRef.current * 1000;

    const interval = setInterval(() => {
      if (isPausedRef.current || isTerminatedRef.current) return;

      const leftMs = deadlineRef.current - Date.now();
      if (leftMs <= 0) {
        setTimeRemaining(0);
        remainingTimeRef.current = 0;
        clearInterval(interval);
        finalizeRun('time_up');
      } else {
        const leftSec = leftMs / 1000;
        setTimeRemaining(leftSec);
        remainingTimeRef.current = leftSec;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimed, isPaused, isTerminated, finalizeRun]);

  // AppState background/foreground pause protection
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/) && !isPausedRef.current && !isTerminatedRef.current) {
        setIsPaused(true);
      }
    });
    return () => subscription.remove();
  }, []);

  // Tile Selection Handler
  const handleTilePress = (tile: TileItem) => {
    // 1. Verify active state
    if (isTerminated || isPaused) return;

    // 2. Process Safe Hit
    if (tile.type === 'safe') {
      const nextScore = score + 1;
      const nextStreak = currentStreak + 1;
      const nextBestStreak = Math.max(bestStreak, nextStreak);
      const nextSafeTaps = safeTaps + 1;

      setScore(nextScore);
      setCurrentStreak(nextStreak);
      setBestStreak(nextBestStreak);
      setSafeTaps(nextSafeTaps);

      // Streak time extension in Rush mode
      if (modeConfig.bonusTimePerStreak > 0 && nextStreak % 5 === 0) {
        const bonus = modeConfig.bonusTimePerStreak;
        remainingTimeRef.current += bonus;
        deadlineRef.current += bonus * 1000;
        setTimeRemaining(remainingTimeRef.current);
      }

      // Haptics & Sound
      DtwHaptics.safeTap();
      DtwAudio.playSafeTap();

      // Trigger +1 Score Popup
      setScorePopup('+1');
      popupAnim.setValue(0);
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setScorePopup(null));

      // Check Streak Milestone
      const milestone = getStreakMilestone(nextStreak);
      if (milestone) {
        setStreakBanner(milestone);
        DtwHaptics.streakMilestone();
        DtwAudio.playMilestone();
        streakAnim.setValue(0);
        Animated.sequence([
          Animated.spring(streakAnim, {
            toValue: 1,
            speed: 50,
            bounciness: 12,
            useNativeDriver: true,
          }),
          Animated.timing(streakAnim, {
            toValue: 0,
            duration: 350,
            delay: 450,
            useNativeDriver: true,
          }),
        ]).start(() => setStreakBanner(null));
      }

      // 3. Generate New Board Revision
      roundCounterRef.current += 1;
      const nextBoard = generateBoard(modeConfig, nextScore, dailySeed, roundCounterRef.current);
      setBoard(nextBoard);
    }

    // 4. Process Danger Hit
    else if (tile.type === 'danger') {
      setDangerTaps((prev) => prev + 1);
      statsRef.current.dangerTaps += 1;

      DtwHaptics.dangerTap();
      DtwAudio.playDangerTap();

      // Danger Shake / Red Flash
      dangerFlashAnim.setValue(1);
      Animated.timing(dangerFlashAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();

      // In Classic, Survival, and Daily: instant loss on red tap
      finalizeRun('danger_tap');
    }
  };

  // Pause Controls
  const handlePause = () => {
    if (isTerminated) return;
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPaused(false);
    setShowExitConfirm(false);
    setIsTerminated(false);
    isTerminatedRef.current = false;
    setScore(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setSafeTaps(0);
    setDangerTaps(0);
    setTimeRemaining(initialDuration);
    remainingTimeRef.current = initialDuration;
    startTimeRef.current = Date.now();
    roundCounterRef.current = 0;
    setBoard(generateBoard(modeConfig, 0, dailySeed, 0));
  };

  const handleExitRequest = () => {
    setIsPaused(true);
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    setIsPaused(false);
    finalizeRun('quit');
    onExitToHome();
  };

  return (
    <BackgroundLayer variant="game">
      {/* Danger Screen Flash Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.dangerScreenFlash,
          {
            opacity: dangerFlashAnim,
          },
        ]}
      />

      <View style={styles.container}>
        {/* Heads Up Display */}
        <GameHud
          score={score}
          streak={currentStreak}
          timeLeftSeconds={timeRemaining}
          totalTimeSeconds={initialDuration}
          targetScore={modeConfig.targetScore}
          mode={modeId}
          onPause={handlePause}
          onExit={handleExitRequest}
        />

        {/* Floating Streak Banner Popup */}
        {streakBanner && (
          <Animated.View
            style={[
              styles.streakBannerContainer,
              {
                transform: [{ scale: streakAnim }],
                opacity: streakAnim,
              },
            ]}
          >
            <Text style={styles.streakBannerText}>{streakBanner}</Text>
          </Animated.View>
        )}

        {/* Floating +1 Score Popup */}
        {scorePopup && (
          <Animated.View
            style={[
              styles.scorePopupContainer,
              {
                opacity: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                transform: [
                  {
                    translateY: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -36] }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.scorePopupText}>{scorePopup}</Text>
          </Animated.View>
        )}

        {/* Dominant 3x3 Tile Grid */}
        <View style={styles.gridContainer}>
          <TileGrid
            tiles={board.tiles}
            onTilePress={handleTilePress}
            disabled={isPaused || isTerminated}
          />
        </View>

        {/* Bottom Status strip */}
        <View style={styles.bottomStatusStrip}>
          <Text style={styles.streakHelper}>
            {currentStreak > 0
              ? `CURRENT STREAK: ${currentStreak} • BEST: ${bestStreak}`
              : `TARGET: ${modeConfig.targetScore} HITS • AVOID RED`}
          </Text>
        </View>
      </View>

      {/* Pause Modal Overlay */}
      <PauseModal
        visible={isPaused && !showExitConfirm}
        onResume={handleResume}
        onRestart={handleRestart}
        onExit={handleExitRequest}
      />

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        visible={showExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
        onConfirmExit={handleConfirmExit}
      />
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  dangerScreenFlash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 82, 93, 0.45)',
    zIndex: 99,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePopupContainer: {
    position: 'absolute',
    top: 130,
    alignSelf: 'center',
    zIndex: 20,
  },
  scorePopupText: {
    fontSize: 28,
    fontWeight: '900',
    color: DtwColors.safeGreen,
    textShadowColor: DtwColors.safeGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  streakBannerContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 214, 90, 0.2)',
    borderWidth: 1.5,
    borderColor: DtwColors.streakGold,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 25,
    shadowColor: DtwColors.streakGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  streakBannerText: {
    fontSize: 16,
    fontWeight: '900',
    color: DtwColors.streakGold,
    letterSpacing: 1.5,
  },
  bottomStatusStrip: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  streakHelper: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default GameplayScreen;
