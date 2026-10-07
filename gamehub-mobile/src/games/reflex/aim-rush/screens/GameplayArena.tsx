// ============================================================
// AIM RUSH — Screen 08: GameplayArena
// Pure touch-driven arcade arena: THE SCREEN IS THE CONTROLLER
// Concentric sweet-spot detection, combo multipliers, and kinetic targets
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { GameSurface } from '../components/GameSurface';
import { GameHUD } from '../components/GameHUD';
import { TargetRenderer } from '../components/TargetRenderer';
import { ScorePopup } from '../components/ScorePopup';
import { HitParticleBurst } from '../components/HitParticleBurst';
import { testTouchCollision } from '../engine/collision';
import { spawnTarget, updateMovingTargets, ArenaBounds } from '../engine/targetManager';
import { AIM_RUSH_BALANCE } from '../config';
import { TargetItem, HitEffectItem, GameModeConfig, AimRushRunResult } from '../types';
import { AimRushHaptics } from '../haptics/hapticManager';

interface GameplayArenaProps {
  mode: GameModeConfig;
  onFinishRun: (result: AimRushRunResult) => void;
  onPause: () => void;
  isPaused: boolean;
}

export const GameplayArena: React.FC<GameplayArenaProps> = ({
  mode,
  onFinishRun,
  onPause,
  isPaused,
}) => {
  const { width, height } = useWindowDimensions();

  // Arena safe limits
  const bounds: ArenaBounds = {
    width,
    height,
    safeTop: 110,     // Clear below GameHUD
    safeBottom: 60,   // Clear above gesture navigation
    safeLeft: 14,
    safeRight: 14,
  };

  // Telemetry & Game State
  const [score, setScore] = useState(0);
  const [chain, setChain] = useState(0);
  const [maxChain, setMaxChain] = useState(0);
  const [lives, setLives] = useState(mode.initialLives);
  const [timeLeft, setTimeLeft] = useState(mode.durationSeconds);
  const [isRushActive, setIsRushActive] = useState(false);

  // Targets & Visual FX
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [effects, setEffects] = useState<HitEffectItem[]>([]);
  const [bursts, setBursts] = useState<{ id: string; x: number; y: number; tier: any }[]>([]);

  // Telemetry Counters
  const totalHitsRef = useRef(0);
  const perfectHitsRef = useRef(0);
  const greatHitsRef = useRef(0);
  const goodHitsRef = useRef(0);
  const missesRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);

  // Helper to spawn initial target
  useEffect(() => {
    startTimeRef.current = Date.now();
    hasFinishedRef.current = false;
    const first = spawnTarget(bounds, mode, 0, 0);
    setTargets([first]);
  }, []);

  // 1. High-Precision Monotonic Timer Loop
  useEffect(() => {
    if (isPaused || hasFinishedRef.current) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // 2. High-Frequency Frame Loop for Moving Target Kinematics & Expiration
  useEffect(() => {
    if (isPaused || hasFinishedRef.current) return;

    let animFrame: number;
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      setTargets((prev) => {
        if (prev.length === 0) return prev;

        // Check expiration
        const valid: TargetItem[] = [];
        let expired = false;

        for (const t of prev) {
          if (now >= t.expiresAt) {
            expired = true;
          } else {
            valid.push(t);
          }
        }

        if (expired) {
          // Target expired before hit -> breaks chain & loses 1 life in precision
          handleTargetExpiration();
          const next = spawnTarget(bounds, mode, score, 0);
          return [next];
        }

        // Update positions of moving targets
        return updateMovingTargets(valid, bounds, dt);
      });

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused, score, chain, lives]);

  const handleTargetExpiration = () => {
    missesRef.current += 1;
    setChain(0);
    setIsRushActive(false);
    AimRushHaptics.missOrDanger();

    if (mode.id === 'precision') {
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) finishGame();
        return next;
      });
    }
  };

  // 3. Finish Game Sequence
  const finishGame = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    const totalAttempts = totalHitsRef.current + missesRef.current;
    const accuracy =
      totalAttempts > 0
        ? Math.round((totalHitsRef.current / totalAttempts) * 100)
        : 0;

    const durationMs = Date.now() - startTimeRef.current;

    onFinishRun({
      score,
      mode: mode.id,
      totalHits: totalHitsRef.current,
      perfectHits: perfectHitsRef.current,
      greatHits: greatHitsRef.current,
      goodHits: goodHitsRef.current,
      misses: missesRef.current,
      maxChain,
      accuracy,
      durationMs,
      isNewPersonalBest: false, // Calculated by storage
      dateIso: new Date().toISOString(),
    });
  };

  // 4. Touch Handler: THE SCREEN IS THE CONTROLLER
  const handleTouch = (touchX: number, touchY: number) => {
    if (isPaused || hasFinishedRef.current) return;

    const collision = testTouchCollision(touchX, touchY, targets);

    if (collision.hit && collision.target) {
      const hitTarget = collision.target;

      if (hitTarget.type === 'danger') {
        // Punish player for hitting danger target
        missesRef.current += 1;
        const penalty = collision.pointsAwarded || -20;
        setScore((prev) => Math.max(0, prev + penalty));
        setChain(0);
        setIsRushActive(false);
        AimRushHaptics.missOrDanger();

        // Spawn effect popup
        spawnEffectPopup(touchX, touchY, 'miss', penalty);

        // Deduct life
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) finishGame();
          return nextLives;
        });

        // Respawn next target
        const next = spawnTarget(bounds, mode, score, 0);
        setTargets([next]);
        return;
      }

      // Valid hit on target!
      totalHitsRef.current += 1;
      const tier = collision.tier || 'good';

      if (tier === 'perfect') {
        perfectHitsRef.current += 1;
        AimRushHaptics.hitPerfect();
      } else if (tier === 'great') {
        greatHitsRef.current += 1;
        AimRushHaptics.hitGreat();
      } else {
        goodHitsRef.current += 1;
        AimRushHaptics.hitNormal();
      }

      // Chain & Multiplier
      const nextChain = chain + 1;
      setChain(nextChain);
      if (nextChain > maxChain) setMaxChain(nextChain);

      // Check Rush threshold
      if (nextChain >= AIM_RUSH_BALANCE.rushThresholdChain) {
        setIsRushActive(true);
      }

      // Calculate score with combo multiplier
      const multiplier = Math.min(5, 1 + Math.floor(nextChain / 4));
      const basePoints = collision.pointsAwarded || 10;
      const totalPoints = basePoints * multiplier;
      setScore((prev) => prev + totalPoints);

      // Check combo milestone vibration
      if (AIM_RUSH_BALANCE.comboMilestones.includes(nextChain)) {
        AimRushHaptics.comboMilestone();
      }

      // Spawn visual feedbacks
      spawnEffectPopup(touchX, touchY, tier, totalPoints);
      setBursts((prev) => [
        ...prev,
        { id: `b_${Date.now()}_${Math.random()}`, x: touchX, y: touchY, tier },
      ]);

      // Spawn next target immediately
      const next = spawnTarget(bounds, mode, score + totalPoints, nextChain, hitTarget);
      setTargets([next]);
    } else {
      // Touched empty space = Miss
      missesRef.current += 1;
      setChain(0);
      setIsRushActive(false);
      AimRushHaptics.missOrDanger();
      spawnEffectPopup(touchX, touchY, 'miss', 0);
    }
  };

  const spawnEffectPopup = (x: number, y: number, tier: any, points: number) => {
    const effId = `eff_${Date.now()}_${Math.random()}`;
    setEffects((prev) => [
      ...prev,
      { id: effId, x, y, tier, points, createdAt: Date.now() },
    ]);
  };

  return (
    <BackgroundLayer screen="gameplay" overlayDarkness={0.28}>
      <GameSurface onTouch={handleTouch}>
        {/* Futuristic Top HUD */}
        <GameHUD
          score={score}
          chain={chain}
          timeLeftSeconds={timeLeft}
          lives={lives}
          maxLives={mode.initialLives}
          mode={mode}
          isRushActive={isRushActive}
          onPause={onPause}
        />

        {/* Active Targets on Arena */}
        {targets.map((t) => (
          <TargetRenderer key={t.id} target={t} />
        ))}

        {/* Shockwave Bursts on Impact */}
        {bursts.map((b) => (
          <HitParticleBurst
            key={b.id}
            x={b.x}
            y={b.y}
            tier={b.tier}
            onComplete={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))}
          />
        ))}

        {/* Floating Score Popups */}
        {effects.map((e) => (
          <ScorePopup
            key={e.id}
            effect={e}
            onComplete={(id) => setEffects((prev) => prev.filter((item) => item.id !== id))}
          />
        ))}
      </GameSurface>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({});
