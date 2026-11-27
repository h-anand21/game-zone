// ============================================================
// Woodland Bubble Shooter — Interactive Hex Arena & Wall-Bounce Aiming
// Framed by carved oak pillars (ricochet walls), displays bubbles,
// dotted bounce trajectory, flying projectile & visual clear effects.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { BubbleSprite } from './BubbleSprite';
import { BubbleFXOverlay } from './BubbleFXOverlay';
import { WOOD_SHOOTER_PALETTE, BUBBLE_COLOR_THEMES } from './woodTheme';
import {
  DANGER_VISIBLE_ROWS,
  HEX_VERTICAL_FACTOR,
  getCellCenter,
} from '../logic';
import type {
  ActiveProjectile,
  AimRayResult,
  FallingBubble,
  FloatingPopup,
  HexGrid,
  PopParticle,
} from '../types';

interface BubbleBoardProps {
  grid: HexGrid;
  boardWidth: number;
  boardHeight: number;
  bubbleDiameter: number;
  cameraTopRow: number;
  aimRay: AimRayResult | null;
  activeProjectile: ActiveProjectile | null;
  projectilePos: { x: number; y: number } | null;
  particles: PopParticle[];
  fallingBubbles: FallingBubble[];
  popups: FloatingPopup[];
  lightningBeamY: number | null;
  fireballBurst: { x: number; y: number } | null;
  isBusy: boolean;
  onAimChange: (angleRad: number | null) => void;
  onShoot: (angleRad: number) => void;
  onEffectsDone: () => void;
}

export const PILLAR_WIDTH = 10;

export const BubbleBoard: React.FC<BubbleBoardProps> = ({
  grid,
  boardWidth,
  boardHeight,
  bubbleDiameter,
  cameraTopRow,
  aimRay,
  activeProjectile,
  projectilePos,
  particles,
  fallingBubbles,
  popups,
  lightningBeamY,
  fireballBurst,
  isBusy,
  onAimChange,
  onShoot,
  onEffectsDone,
}) => {
  const playWidth = Math.max(200, boardWidth - PILLAR_WIDTH * 2);
  const originX = playWidth / 2;
  const originY = boardHeight - bubbleDiameter * 0.45;
  const dangerLineY =
    bubbleDiameter * 0.5 + (DANGER_VISIBLE_ROWS - 0.35) * bubbleDiameter * HEX_VERTICAL_FACTOR;

  const boardWrapRef = useRef<View>(null);
  const playOffsetRef = useRef({ pageX: 0, pageY: 0 });
  const lastAngleRef = useRef<number | null>(null);

  const callbackRef = useRef({
    playWidth,
    originX,
    originY,
    isBusy,
    onAimChange,
    onShoot,
  });

  useEffect(() => {
    callbackRef.current = {
      playWidth,
      originX,
      originY,
      isBusy,
      onAimChange,
      onShoot,
    };
  }, [playWidth, originX, originY, isBusy, onAimChange, onShoot]);

  const [panHandlers, setPanHandlers] = useState<
    ReturnType<typeof PanResponder.create>['panHandlers']
  >({});

  useEffect(() => {
    const computeAngleFromTouch = (pageX: number, pageY: number): number | null => {
      const cfg = callbackRef.current;
      const localX = pageX - playOffsetRef.current.pageX - PILLAR_WIDTH;
      const localY = pageY - playOffsetRef.current.pageY;
      const dx = localX - cfg.originX;
      const dy = localY - cfg.originY;

      // Dragging below cannon cancels shot gracefully
      if (dy > -18) {
        return null;
      }
      const rawAngle = Math.atan2(dy, dx);
      return Math.max(-Math.PI + 0.16, Math.min(-0.16, rawAngle));
    };

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => !callbackRef.current.isBusy,
      onMoveShouldSetPanResponder: () => !callbackRef.current.isBusy,
      onPanResponderGrant: (e) => {
        if (callbackRef.current.isBusy) return;
        const angle = computeAngleFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
        lastAngleRef.current = angle;
        callbackRef.current.onAimChange(angle);
      },
      onPanResponderMove: (e) => {
        if (callbackRef.current.isBusy) return;
        const angle = computeAngleFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
        lastAngleRef.current = angle;
        callbackRef.current.onAimChange(angle);
      },
      onPanResponderRelease: () => {
        const finalAngle = lastAngleRef.current;
        lastAngleRef.current = null;
        callbackRef.current.onAimChange(null);
        if (!callbackRef.current.isBusy && finalAngle !== null) {
          callbackRef.current.onShoot(finalAngle);
        }
      },
      onPanResponderTerminate: () => {
        lastAngleRef.current = null;
        callbackRef.current.onAimChange(null);
      },
    });

    setPanHandlers(responder.panHandlers);
  }, []);

  const handleLayout = () => {
    boardWrapRef.current?.measureInWindow((x, y) => {
      playOffsetRef.current = { pageX: x, pageY: y };
    });
  };

  const radius = bubbleDiameter / 2;
  const polyPoints = aimRay?.points.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');

  return (
    <View
      ref={boardWrapRef}
      onLayout={handleLayout}
      {...panHandlers}
      style={[
        styles.boardFrame,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
    >
      {/* Left Carved Oak Bounce Pillar */}
      <LinearGradient
        colors={WOOD_SHOOTER_PALETTE.pillarGradient}
        style={[styles.sidePillar, { width: PILLAR_WIDTH }]}
      >
        <View style={styles.pillarHighlightStrip} />
      </LinearGradient>

      {/* Center Woodland Canopy Playfield */}
      <View style={[styles.playfield, { width: playWidth, height: boardHeight }]}>
        <LinearGradient
          colors={WOOD_SHOOTER_PALETTE.arenaCanopyGradient}
          style={StyleSheet.absoluteFill}
        />

        {/* Top Carved Anchor Timber Beam */}
        <LinearGradient
          colors={['#A86228', '#6B3812']}
          style={styles.topTimberBeam}
        />

        {/* Bank-Shot Laser Trail & Landing Snap Target */}
        <Svg
          style={StyleSheet.absoluteFill}
          width={playWidth}
          height={boardHeight}
          pointerEvents="none"
        >
          {/* Danger Threshold Line */}
          <Line
            x1={6}
            y1={dangerLineY}
            x2={playWidth - 6}
            y2={dangerLineY}
            stroke={WOOD_SHOOTER_PALETTE.dangerLineColor}
            strokeWidth={1.6}
            strokeDasharray="6,6"
            opacity={0.55}
          />

          {aimRay && polyPoints && (
            <>
              <Polyline
                points={polyPoints}
                fill="none"
                stroke="rgba(254, 240, 138, 0.28)"
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Polyline
                points={polyPoints}
                fill="none"
                stroke={WOOD_SHOOTER_PALETTE.aimLaserColor}
                strokeWidth={2.5}
                strokeDasharray="6,7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {aimRay.hitCenter && (
                <Circle
                  cx={aimRay.hitCenter.x}
                  cy={aimRay.hitCenter.y}
                  r={radius * 0.92}
                  fill="rgba(254, 240, 138, 0.14)"
                  stroke={WOOD_SHOOTER_PALETTE.aimLaserColor}
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
              )}
            </>
          )}
        </Svg>

        {/* Active Staggered Hex Grid Bubbles */}
        {grid.map((rowArr, r) => {
          if (r < cameraTopRow) return null;
          return rowArr.map((cell, c) => {
            if (!cell) return null;
            const center = getCellCenter(r, c, bubbleDiameter, cameraTopRow);
            if (center.y < -bubbleDiameter || center.y > boardHeight + bubbleDiameter) {
              return null;
            }
            const isTarget =
              aimRay?.hitCoord?.row === r && aimRay?.hitCoord?.col === c;

            return (
              <View
                key={cell.id}
                pointerEvents="none"
                style={[
                  styles.bubbleWrap,
                  {
                    left: center.x - radius,
                    top: center.y - radius,
                  },
                ]}
              >
                <BubbleSprite
                  size={bubbleDiameter}
                  color={cell.color}
                  kind={cell.kind}
                  hasFirefly={cell.hasFirefly}
                  isHighlighted={isTarget}
                />
              </View>
            );
          });
        })}

        {/* Active Launched Projectile in Flight */}
        {activeProjectile && projectilePos && (
          <View
            pointerEvents="none"
            style={[
              styles.bubbleWrap,
              {
                left: projectilePos.x - radius,
                top: projectilePos.y - radius,
                shadowColor:
                  BUBBLE_COLOR_THEMES[activeProjectile.color]?.glow || '#FACC15',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.75,
                shadowRadius: 8,
              },
            ]}
          >
            <BubbleSprite
              size={bubbleDiameter}
              color={activeProjectile.color}
              kind={activeProjectile.kind}
            />
          </View>
        )}

        {/* Pop Particles, Falling Drops, Lightning Beams & "POP!" Popups */}
        <BubbleFXOverlay
          particles={particles}
          fallingBubbles={fallingBubbles}
          popups={popups}
          lightningBeamY={lightningBeamY}
          fireballBurst={fireballBurst}
          bubbleDiameter={bubbleDiameter}
          onEffectsDone={onEffectsDone}
        />
      </View>

      {/* Right Carved Oak Bounce Pillar */}
      <LinearGradient
        colors={WOOD_SHOOTER_PALETTE.pillarGradient}
        style={[styles.sidePillar, { width: PILLAR_WIDTH }]}
      >
        <View style={styles.pillarHighlightStrip} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  boardFrame: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.pillarBorder,
    backgroundColor: '#2B411E',
    shadowColor: '#1E0C02',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  sidePillar: {
    height: '100%',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: WOOD_SHOOTER_PALETTE.pillarBorder,
    alignItems: 'center',
  },
  pillarHighlightStrip: {
    width: 2,
    height: '100%',
    backgroundColor: WOOD_SHOOTER_PALETTE.pillarHighlight,
    opacity: 0.35,
  },
  playfield: {
    position: 'relative',
    overflow: 'hidden',
  },
  topTimberBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#3D1B05',
    zIndex: 4,
  },
  bubbleWrap: {
    position: 'absolute',
  },
});
