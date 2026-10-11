// ============================================================
// STACK MASTER — Screen 07: Gameplay Arena
// Uses: 'Neon Celestial Floating Canyon.png' as main arena backdrop
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ArenaHUD } from '../components/arena/ArenaHUD';
import { StackArena } from '../components/arena/StackArena';
import { PauseModal } from '../components/arena/PauseModal';
import { useStackStore } from '../store/stackStore';
import { calculateAccuracy } from '../engine/scoring';
import type { GameMode, RunRecord } from '../types';

interface GameplayScreenProps {
  mode: GameMode;
  onFinishRun: (record: RunRecord, isNewBest: boolean) => void;
  onExitHome: () => void;
  onOpenSettings: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  mode,
  onFinishRun,
  onExitHome,
  onOpenSettings,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);
  const [sessionKey, setSessionKey] = useState<number>(1); // To restart run

  const startTimeRef = useRef<number>(Date.now());
  const bestHeight = useStackStore((state) => state.bestHeight);
  const assistMode = useStackStore((state) => state.settings.assistMode);
  const hapticsEnabled = useStackStore((state) => state.settings.haptics);
  const selectedThemeId = useStackStore((state) => state.selectedThemeId);
  const recordRun = useStackStore((state) => state.recordRun);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [sessionKey]);

  const handleScoreUpdate = (score: number, height: number, combo: number) => {
    setCurrentScore(score);
    setCurrentHeight(height);
    setCurrentCombo(combo);
  };

  const handleGameOver = (
    finalScore: number,
    finalHeight: number,
    perfects: number,
    partials: number,
    maxCombo: number
  ) => {
    const duration = Math.max(Math.round((Date.now() - startTimeRef.current) / 1000), 1);
    const total = perfects + partials;
    const accuracy = calculateAccuracy(perfects, partials, total);

    // Save run to store
    const { isNewBest, run } = recordRun({
      mode,
      score: finalScore,
      height: finalHeight,
      maxCombo,
      perfectPlacements: perfects,
      partialPlacements: partials,
      totalPlacements: total,
      accuracy,
      durationSeconds: duration,
      themeId: selectedThemeId,
    });

    onFinishRun(run, isNewBest);
  };

  const handleRestart = () => {
    setIsPaused(false);
    setCurrentScore(0);
    setCurrentHeight(0);
    setCurrentCombo(0);
    setSessionKey((prev) => prev + 1);
  };

  return (
    <ScreenBackground type="gameplay" dimAmount={0.35}>
      <View style={styles.container}>
        {/* Arena Top HUD */}
        <ArenaHUD
          score={currentScore}
          height={currentHeight}
          combo={currentCombo}
          bestHeight={bestHeight}
          onPause={() => setIsPaused(true)}
        />

        {/* Live Active Stacking Arena */}
        <StackArena
          key={sessionKey}
          mode={mode}
          isPaused={isPaused}
          assistMode={assistMode}
          hapticsEnabled={hapticsEnabled}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
        />

        {/* Pause Modal Overlay */}
        <PauseModal
          visible={isPaused}
          score={currentScore}
          height={currentHeight}
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onSettings={onOpenSettings}
          onExitHome={onExitHome}
        />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
