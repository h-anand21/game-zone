// ============================================================
// AIM RUSH — Screen 06: PracticeScreen
// Zero-pressure sandbox arena: 3 physical target hits to calibrate
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { GameSurface } from '../components/GameSurface';
import { TargetRenderer } from '../components/TargetRenderer';
import { ScorePopup } from '../components/ScorePopup';
import { HitParticleBurst } from '../components/HitParticleBurst';
import { testTouchCollision } from '../engine/collision';
import { spawnTarget } from '../engine/targetManager';
import { GAME_MODES } from '../config';
import { ARColors } from '../theme/colors';
import { TargetItem, HitEffectItem } from '../types';
import { AimRushHaptics } from '../haptics/hapticManager';

interface PracticeScreenProps {
  onComplete: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onComplete }) => {
  const { width, height } = useWindowDimensions();
  const [hits, setHits] = useState(0);
  const [target, setTarget] = useState<TargetItem | null>(null);
  const [effects, setEffects] = useState<HitEffectItem[]>([]);
  const [bursts, setBursts] = useState<{ id: string; x: number; y: number; tier: any }[]>([]);
  const [isReadyBanner, setIsReadyBanner] = useState(false);

  const arenaBounds = {
    width,
    height,
    safeTop: 110,
    safeBottom: 80,
    safeLeft: 16,
    safeRight: 16,
  };

  useEffect(() => {
    // Spawn initial practice target
    const firstTarget = spawnTarget(arenaBounds, GAME_MODES.classic, 0, 0);
    setTarget(firstTarget);
  }, [width, height]);

  const handleTouch = (touchX: number, touchY: number) => {
    if (!target || isReadyBanner) return;

    const collision = testTouchCollision(touchX, touchY, [target]);
    if (collision.hit && collision.tier !== 'miss') {
      const nextHits = hits + 1;
      setHits(nextHits);

      // Trigger effects
      AimRushHaptics.hitNormal();
      const effId = `eff_${Date.now()}`;
      setEffects((prev) => [
        ...prev,
        {
          id: effId,
          x: touchX,
          y: touchY,
          tier: collision.tier || 'good',
          points: collision.pointsAwarded || 10,
          createdAt: Date.now(),
        },
      ]);
      setBursts((prev) => [
        ...prev,
        { id: `b_${Date.now()}`, x: touchX, y: touchY, tier: collision.tier },
      ]);

      if (nextHits >= 3) {
        setIsReadyBanner(true);
        setTimeout(onComplete, 1100);
      } else {
        // Spawn next target
        const next = spawnTarget(arenaBounds, GAME_MODES.classic, nextHits * 20, nextHits, target);
        setTarget(next);
      }
    }
  };

  return (
    <BackgroundLayer screen="gameplay" overlayDarkness={0.4}>
      <GameSurface onTouch={handleTouch}>
        {/* Top Practice Telemetry */}
        <View style={styles.header}>
          <Text style={styles.title}>PRACTICE ARENA</Text>
          <Text style={styles.subtext}>TOUCH 3 TARGETS DIRECTLY TO CALIBRATE</Text>
          <View style={styles.counterCapsule}>
            <Text style={styles.counterText}>CALIBRATED: {hits} / 3</Text>
          </View>
        </View>

        {/* Active Practice Target */}
        {target && !isReadyBanner && <TargetRenderer target={target} />}

        {/* Visual FX */}
        {bursts.map((b) => (
          <HitParticleBurst
            key={b.id}
            x={b.x}
            y={b.y}
            tier={b.tier}
            onComplete={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))}
          />
        ))}

        {effects.map((e) => (
          <ScorePopup
            key={e.id}
            effect={e}
            onComplete={(id) => setEffects((prev) => prev.filter((item) => item.id !== id))}
          />
        ))}

        {/* Ready Banner Transition */}
        {isReadyBanner && (
          <View style={styles.readyOverlay} pointerEvents="none">
            <Text style={styles.readyText}>✦ CALIBRATION COMPLETE ✦</Text>
            <Text style={styles.readySubtext}>STAND BY FOR COUNTDOWN...</Text>
          </View>
        )}
      </GameSurface>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  subtext: {
    fontSize: 10,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.2,
  },
  counterCapsule: {
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 1,
  },
  readyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 9, 12, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  readyText: {
    fontSize: 24,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 3,
  },
  readySubtext: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 2,
  },
});
