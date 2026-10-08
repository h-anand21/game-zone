// ============================================================
// ONE TAP: PRECISION GAME — GameplayScreen
// Full-Screen Tap Arena with Oscillating Needle, Dynamic Target Zone,
// Combo Chains, 5-Perfect Fever Mode, Screen Shake & In-Run Pause
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { GameHUD } from '../components/GameHUD';
import { TimingTrack } from '../components/TimingTrack';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { PauseModal } from '../components/modals/PauseModal';
import { ExitModal } from '../components/modals/ExitModal';
import { OTColors } from '../theme/colors';
import {
  GameModeId,
  TargetZoneData,
  HitEvaluation,
  OneTapRunResult,
  OneTapSettings,
} from '../types';
import { ONE_TAP_CONFIG, GAME_MODES } from '../config';
import { TimingEngine } from '../engine/timingEngine';
import { ScoringEngine } from '../engine/scoringEngine';
import { OneTapHaptics } from '../haptics/hapticManager';
import { OneTapAudio } from '../audio/audioManager';

interface GameplayScreenProps {
  modeId: GameModeId;
  settings: OneTapSettings;
  onUpdateSettings: (newSettings: OneTapSettings) => void;
  onGameOver: (result: OneTapRunResult) => void;
  onExitToHome: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  modeId,
  settings,
  onUpdateSettings,
  onGameOver,
  onExitToHome,
}) => {
  const modeConfig = GAME_MODES[modeId] || GAME_MODES.classic;
  const isEndless = modeId === 'endless';
  const totalRounds = modeConfig.totalRounds;

  // Run State
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Stats Counters
  const [perfectCount, setPerfectCount] = useState(0);
  const [greatCount, setGreatCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Fever Mode (Chain 5 consecutive perfects)
  const [consecutivePerfects, setConsecutivePerfects] = useState(0);
  const [isFeverActive, setIsFeverActive] = useState(false);
  const [feverTimeRemaining, setFeverTimeRemaining] = useState(0);
  const feverTimerRef = useRef<any>(null);

  // Target Zone & Needle Position
  const [target, setTarget] = useState<TargetZoneData>(() =>
    TimingEngine.generateTargetZone(0, modeId)
  );
  const [evaluation, setEvaluation] = useState<HitEvaluation | null>(null);

  // Reanimated needle & screen shake
  const needlePos = useSharedValue(0);
  const shakeOffset = useSharedValue(0);

  // References
  const runStartTimeRef = useRef(Date.now());
  const roundStartTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);

  // Speed calculation based on round & mode
  const getTravelDuration = () => {
    const baseDuration =
      modeId === 'rush'
        ? ONE_TAP_CONFIG.rushTravelDurationMs
        : ONE_TAP_CONFIG.baseTravelDurationMs;
    const speedFactor = 1.0 + (currentRound - 1) * ONE_TAP_CONFIG.speedProgressionFactor;
    return Math.max(500, baseDuration / (modeConfig.baseSpeed * speedFactor));
  };

  // Main 60fps Animation Loop
  useEffect(() => {
    let lastTime = Date.now();

    const loop = () => {
      if (!isPaused) {
        const now = Date.now();
        const elapsed = now - roundStartTimeRef.current;
        const travelMs = getTravelDuration();
        const { position } = TimingEngine.calculateNeedlePosition(elapsed, travelMs);
        needlePos.value = position;

        // In-run time increment
        if (now - lastTime >= 100) {
          setElapsedSeconds((prev) => prev + 0.1);
          lastTime = now;
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, currentRound]);

  // Fever Countdown
  useEffect(() => {
    if (isFeverActive) {
      const interval = setInterval(() => {
        setFeverTimeRemaining((prev) => {
          if (prev <= 0.1) {
            clearInterval(interval);
            setIsFeverActive(false);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isFeverActive]);

  // Screen shake animation on miss
  const triggerScreenShake = () => {
    if (settings.reducedMotion) return;
    shakeOffset.value = withSequence(
      withTiming(-12, { duration: 40 }),
      withTiming(12, { duration: 40 }),
      withTiming(-8, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // Complete Run Handler
  const handleFinishRun = (finalScore: number) => {
    const totalHits = perfectCount + greatCount + goodCount + missCount;
    const successfulHits = perfectCount + greatCount + goodCount;
    const accuracy = totalHits > 0 ? (successfulHits / totalHits) * 100 : 0;
    const avgReaction =
      reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 220;

    const rank = ScoringEngine.calculateRank(accuracy);
    const rewards = ScoringEngine.calculateRewards(finalScore, accuracy, maxCombo);

    const result: OneTapRunResult = {
      mode: modeId,
      finalScore,
      accuracyPercentage: Math.round(accuracy * 10) / 10,
      maxCombo,
      totalRoundsPlayed: currentRound,
      timeElapsedSeconds: Math.round(elapsedSeconds * 10) / 10,
      averageReactionTimeMs: avgReaction,
      perfectCount,
      greatCount,
      goodCount,
      missCount,
      rank,
      ...rewards,
    };

    onGameOver(result);
  };

  // FULL-SCREEN TAP HANDLER (Tap Anywhere)
  const handleTapAnywhere = () => {
    if (isPaused) return;

    const currentNeedle = needlePos.value;
    const reactionTime = Math.min(600, Date.now() - roundStartTimeRef.current);
    setReactionTimes((prev) => [...prev, reactionTime]);

    // Evaluate Hit
    const evalResult = ScoringEngine.evaluateHit(
      currentNeedle,
      target,
      combo,
      isFeverActive,
      reactionTime
    );

    setEvaluation(evalResult);

    // Update Scores & Telemetry
    if (evalResult.tier === 'perfect') {
      OneTapHaptics.perfect();
      OneTapAudio.playPerfect();
      setPerfectCount((prev) => prev + 1);
      const newConsecutive = consecutivePerfects + 1;
      setConsecutivePerfects(newConsecutive);

      // Trigger Fever Mode on 5 consecutive perfects
      if (newConsecutive >= ONE_TAP_CONFIG.perfectChainRequired && !isFeverActive) {
        setIsFeverActive(true);
        setFeverTimeRemaining(ONE_TAP_CONFIG.feverDurationMs / 1000);
        OneTapHaptics.fever();
        OneTapAudio.playFever();
        setConsecutivePerfects(0);
      }
    } else if (evalResult.tier === 'great') {
      OneTapHaptics.great();
      OneTapAudio.playGreat();
      setGreatCount((prev) => prev + 1);
      setConsecutivePerfects(0);
    } else if (evalResult.tier === 'good') {
      OneTapHaptics.good();
      OneTapAudio.playGood();
      setGoodCount((prev) => prev + 1);
      setConsecutivePerfects(0);
    } else {
      // Miss
      OneTapHaptics.miss();
      OneTapAudio.playMiss();
      setMissCount((prev) => prev + 1);
      setConsecutivePerfects(0);
      triggerScreenShake();
    }

    // Update Combo
    if (evalResult.tier !== 'miss') {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
    } else {
      setCombo(0);
    }

    const nextScore = score + evalResult.totalPointsAwarded;
    setScore(nextScore);

    // Advance Round or Finish
    if (!isEndless && totalRounds && currentRound >= totalRounds) {
      setTimeout(() => {
        handleFinishRun(nextScore);
      }, 500);
    } else {
      // Next Round setup
      setTimeout(() => {
        setCurrentRound((prev) => prev + 1);
        setTarget(TimingEngine.generateTargetZone(currentRound, modeId));
        roundStartTimeRef.current = Date.now();
      }, 350);
    }
  };

  // Restart In-Run
  const handleRestart = () => {
    setIsPaused(false);
    setCurrentRound(1);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setElapsedSeconds(0);
    setPerfectCount(0);
    setGreatCount(0);
    setGoodCount(0);
    setMissCount(0);
    setReactionTimes([]);
    setIsFeverActive(false);
    setConsecutivePerfects(0);
    setEvaluation(null);
    setTarget(TimingEngine.generateTargetZone(0, modeId));
    roundStartTimeRef.current = Date.now();
  };

  return (
    <BackgroundLayer screen="gameplay" blurRadius={3.5} overlayDarkness={0.45}>
      <Animated.View style={[styles.screenContainer, shakeStyle]}>
        <SafeAreaView style={styles.safeArea}>
          {/* Full Screen Pressable Touch Canvas */}
          <Pressable
            style={styles.touchArea}
            onPress={handleTapAnywhere}
            accessibilityRole="button"
            accessibilityLabel="Tap Screen to Hit Zone"
          >
            {/* Top HUD */}
            <GameHUD
              score={score}
              combo={combo}
              currentRound={currentRound}
              totalRounds={totalRounds}
              elapsedSeconds={elapsedSeconds}
              isFeverActive={isFeverActive}
              feverTimeRemaining={feverTimeRemaining}
              onPause={() => setIsPaused(true)}
            />

            {/* Center Gameplay Arena */}
            <View style={styles.centerArena}>
              {/* Timing Track with oscillating needle */}
              <TimingTrack
                needlePos={needlePos}
                target={target}
                isFeverActive={isFeverActive}
              />

              {/* Dynamic Feedback Popups (GOOD, GREAT, PERFECT, MISS) */}
              <FeedbackBanner evaluation={evaluation} />
            </View>

            {/* Bottom Subtle Guide Text (NOT A BUTTON) */}
            <View style={styles.bottomGuide}>
              <Text style={styles.bottomGuideText}>
                ✦ TOUCH ANYWHERE ON SCREEN TO HIT ✦
              </Text>
            </View>
          </Pressable>
        </SafeAreaView>

        {/* In-Run Pause Modal */}
        <PauseModal
          visible={isPaused}
          soundEnabled={settings.soundEnabled}
          musicEnabled={settings.musicEnabled}
          hapticsEnabled={settings.hapticsEnabled}
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onExitToHome={() => {
            setIsPaused(false);
            setShowExitConfirm(true);
          }}
          onToggleSound={() => {
            const nextVal = !settings.soundEnabled;
            onUpdateSettings({ ...settings, soundEnabled: nextVal });
            OneTapAudio.setSoundEnabled(nextVal);
          }}
          onToggleMusic={() => {
            const nextVal = !settings.musicEnabled;
            onUpdateSettings({ ...settings, musicEnabled: nextVal });
            OneTapAudio.setMusicEnabled(nextVal);
          }}
          onToggleHaptics={() => {
            const nextVal = !settings.hapticsEnabled;
            onUpdateSettings({ ...settings, hapticsEnabled: nextVal });
            OneTapHaptics.setEnabled(nextVal);
          }}
        />

        {/* Exit Confirmation Dialog */}
        <ExitModal
          visible={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onConfirmExit={() => {
            setShowExitConfirm(false);
            onExitToHome();
          }}
        />
      </Animated.View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  centerArena: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  bottomGuide: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  bottomGuideText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 2,
  },
});
