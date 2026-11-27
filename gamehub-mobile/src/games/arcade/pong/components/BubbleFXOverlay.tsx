// ============================================================
// Woodland Bubble Shooter — Visual FX Overlay
// Renders crystal pop sparks, falling avalanche bubbles,
// floating "+15 / POP! / PERFECT!" callouts & lightning beams.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BubbleSprite } from './BubbleSprite';
import { WOOD_SHOOTER_PALETTE } from './woodTheme';
import type { FallingBubble, FloatingPopup, PopParticle } from '../types';

interface BubbleFXOverlayProps {
  particles: PopParticle[];
  fallingBubbles: FallingBubble[];
  popups: FloatingPopup[];
  lightningBeamY: number | null;
  fireballBurst: { x: number; y: number } | null;
  bubbleDiameter: number;
  onEffectsDone?: () => void;
}

export const BubbleFXOverlay: React.FC<BubbleFXOverlayProps> = ({
  particles,
  fallingBubbles,
  popups,
  lightningBeamY,
  fireballBurst,
  bubbleDiameter,
  onEffectsDone,
}) => {
  const [fxProgress] = useState(() => new Animated.Value(0));
  const onDoneRef = useRef(onEffectsDone);

  useEffect(() => {
    onDoneRef.current = onEffectsDone;
  }, [onEffectsDone]);

  const hasAnyEffect =
    particles.length > 0 ||
    fallingBubbles.length > 0 ||
    popups.length > 0 ||
    lightningBeamY !== null ||
    fireballBurst !== null;

  useEffect(() => {
    if (!hasAnyEffect) return;

    fxProgress.setValue(0);
    const anim = Animated.timing(fxProgress, {
      toValue: 1,
      duration: 680,
      useNativeDriver: true,
    });

    anim.start(({ finished }) => {
      if (finished) {
        onDoneRef.current?.();
      }
    });

    return () => anim.stop();
  }, [particles, fallingBubbles, popups, lightningBeamY, fireballBurst, hasAnyEffect, fxProgress]);

  if (!hasAnyEffect) return null;

  const halfOrb = bubbleDiameter / 2;
  const beamOpacity = fxProgress.interpolate({
    inputRange: [0, 0.15, 0.65, 1],
    outputRange: [0.2, 1, 0.5, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Horizontal Lightning Row Blast Flash */}
      {lightningBeamY !== null && (
        <Animated.View
          style={[
            styles.lightningBeamWrap,
            {
              top: lightningBeamY - bubbleDiameter * 0.42,
              height: bubbleDiameter * 0.84,
              opacity: beamOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(56, 189, 248, 0.1)', '#E0F2FE', '#38BDF8', '#FEF08A', 'rgba(56, 189, 248, 0.1)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* 2. Fireball Radial Shockwave */}
      {fireballBurst && (
        <Animated.View
          style={[
            styles.fireballRing,
            {
              left: fireballBurst.x - bubbleDiameter * 2.1,
              top: fireballBurst.y - bubbleDiameter * 2.1,
              width: bubbleDiameter * 4.2,
              height: bubbleDiameter * 4.2,
              borderRadius: bubbleDiameter * 2.1,
              opacity: beamOpacity,
              transform: [
                {
                  scale: fxProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* 3. Avalanche Falling Floating Bubbles */}
      {fallingBubbles.map((fb) => {
        const dropX = fxProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [fb.x - halfOrb, fb.x - halfOrb + fb.vx * 55],
        });
        const dropY = fxProgress.interpolate({
          inputRange: [0, 0.25, 1],
          outputRange: [fb.y - halfOrb, fb.y - halfOrb + fb.vy * 18, fb.y - halfOrb + 210],
        });
        const dropOpacity = fxProgress.interpolate({
          inputRange: [0, 0.75, 1],
          outputRange: [1, 0.9, 0],
        });
        const dropScale = fxProgress.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 0.95, 0.5],
        });

        return (
          <Animated.View
            key={fb.id}
            style={[
              styles.absItem,
              {
                opacity: dropOpacity,
                transform: [{ translateX: dropX }, { translateY: dropY }, { scale: dropScale }],
              },
            ]}
          >
            <BubbleSprite
              size={bubbleDiameter}
              color={fb.color}
              kind={fb.kind}
              hasFirefly={fb.hasFirefly}
            />
          </Animated.View>
        );
      })}

      {/* 4. Crystal Burst Particles */}
      {particles.map((p) => {
        const tx = fxProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [p.x, p.x + p.vx * 64],
        });
        const ty = fxProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [p.y, p.y + p.vy * 64 + 24],
        });
        const pScale = fxProgress.interpolate({
          inputRange: [0, 0.25, 1],
          outputRange: [1, 1.35, 0],
        });
        const pOpacity = fxProgress.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 0.85, 0],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.absItem,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                opacity: pOpacity,
                transform: [{ translateX: tx }, { translateY: ty }, { scale: pScale }],
              },
            ]}
          />
        );
      })}

      {/* 5. Floating Score & "POP! / PERFECT!" Callouts */}
      {popups.map((pop) => {
        const py = fxProgress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [pop.y, pop.y - 16, pop.y - 42],
        });
        const pScale = fxProgress.interpolate({
          inputRange: [0, 0.22, 0.8, 1],
          outputRange: [0.55, 1.15, 1, 0.85],
        });
        const pOpacity = fxProgress.interpolate({
          inputRange: [0, 0.72, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={pop.id}
            style={[
              styles.popupWrap,
              {
                left: pop.x - 56,
                top: 0,
                opacity: pOpacity,
                transform: [{ translateY: py }, { scale: pScale }],
              },
            ]}
          >
            <Text
              style={[
                pop.isCallout ? styles.calloutText : styles.scoreText,
                { color: pop.color },
              ]}
            >
              {pop.text}
            </Text>
            {pop.subText && <Text style={styles.subText}>{pop.subText}</Text>}
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  absItem: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  lightningBeamWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
  },
  fireballRing: {
    position: 'absolute',
    backgroundColor: 'rgba(249, 115, 22, 0.30)',
    borderWidth: 3,
    borderColor: '#FEF08A',
  },
  popupWrap: {
    position: 'absolute',
    width: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: WOOD_SHOOTER_PALETTE.textOutline,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '900',
    textShadowColor: WOOD_SHOOTER_PALETTE.textOutline,
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 11,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
    textShadowColor: WOOD_SHOOTER_PALETTE.textOutline,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
