// ============================================================
// GameHub — Carrom Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialCarromPucks } from './logic';
import type { CarromPuck } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface CarromProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const CarromGame: React.FC<CarromProps> = ({ onFinish, isPaused }) => {
  const [pucks, setPucks] = useState<CarromPuck[]>(() => getInitialCarromPucks());
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setPucks((prev) =>
        prev.map((p) => {
          if (p.isPocketed || (p.vx === 0 && p.vy === 0)) return p;

          let nextX = p.x + p.vx;
          let nextY = p.y + p.vy;
          let nextVx = p.vx * 0.96; // friction
          let nextVy = p.vy * 0.96;

          if (Math.abs(nextVx) < 0.05) nextVx = 0;
          if (Math.abs(nextVy) < 0.05) nextVy = 0;

          // Wall bounce
          if (nextX <= 5 || nextX >= 95) nextVx = -nextVx;
          if (nextY <= 5 || nextY >= 95) nextVy = -nextVy;

          // Check corner pockets
          let isPocketed = false;
          if (
            (nextX <= 10 && nextY <= 10) ||
            (nextX >= 90 && nextY <= 10) ||
            (nextX <= 10 && nextY >= 90) ||
            (nextX >= 90 && nextY >= 90)
          ) {
            if (p.type !== 'striker') {
              isPocketed = true;
              setScore((s) => s + (p.type === 'white' ? 10 : p.type === 'red' ? 50 : 20));
            }
          }

          return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy, isPocketed };
        })
      );
    }, 16);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleFlick = () => {
    if (isPaused) return;
    setPucks((prev) =>
      prev.map((p) =>
        p.type === 'striker' ? { ...p, vx: (Math.random() - 0.5) * 6, vy: -4 - Math.random() * 2 } : p
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Score Header */}
      <View style={styles.infoCard}>
        <Text style={styles.scoreText}>Carrom Score: {score}</Text>
      </View>

      {/* Board */}
      <View style={styles.board}>
        {/* Corner Pockets */}
        <View style={[styles.pocket, { top: 8, left: 8 }]} />
        <View style={[styles.pocket, { top: 8, right: 8 }]} />
        <View style={[styles.pocket, { bottom: 8, left: 8 }]} />
        <View style={[styles.pocket, { bottom: 8, right: 8 }]} />

        {/* Center Circle */}
        <View style={styles.centerCircle} />

        {/* Pucks */}
        {pucks
          .filter((p) => !p.isPocketed)
          .map((p) => (
            <View
              key={p.id}
              style={[
                styles.puck,
                {
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  backgroundColor:
                    p.type === 'white'
                      ? '#FFFFFF'
                      : p.type === 'black'
                      ? '#1A1A2E'
                      : p.type === 'red'
                      ? Colors.accent
                      : Colors.primary,
                },
              ]}
            />
          ))}
      </View>

      {/* Flick Button */}
      <Pressable style={styles.flickBtn} onPress={handleFlick}>
        <Text style={styles.flickText}>🎯 FLICK STRIKER</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-around',
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  board: {
    width: 300,
    height: 300,
    backgroundColor: '#D97706' + '30', // Wooden frame tint
    borderRadius: BorderRadius.xxl,
    position: 'relative',
    borderWidth: 8,
    borderColor: '#78350F',
    ...Shadows.md,
  },
  pocket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
  },
  centerCircle: {
    position: 'absolute',
    left: '35%',
    top: '35%',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#78350F',
  },
  puck: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    marginTop: -10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  flickBtn: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  flickText: {
    fontSize: Typography.h4,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
});
