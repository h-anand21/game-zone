// ============================================================
// MEMORY RUSH — Energetic Countdown Overlay (3 -> 2 -> 1 -> RUSH!)
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MRColors } from '../constants/colors';
import type { GameMode, GameDifficulty } from '../types';

interface CountdownOverlayProps {
  mode: GameMode;
  difficulty: GameDifficulty;
  onFinish: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  mode,
  difficulty,
  onFinish,
}) => {
  const [count, setCount] = useState<number>(3);
  const [isRush, setIsRush] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRush(true);
          setTimeout(() => {
            onFinish();
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [onFinish]);

  const getModeTitle = () => {
    switch (mode) {
      case 'sequenceRush':
        return 'SEQUENCE RUSH';
      case 'numberShift':
        return 'NUMBER SHIFT';
      case 'missingNumber':
        return 'MISSING NUMBER';
      case 'fusionRush':
        return 'FUSION RUSH';
      case 'memoryGrid':
      default:
        return 'MEMORY GRID';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.topInfo}>
        <Text style={styles.modeTitle}>{getModeTitle()}</Text>
        <Text style={styles.diffSubtitle}>{difficulty.toUpperCase()}</Text>
      </View>

      <View style={styles.centerBox}>
        <View style={[styles.pulseCircle, isRush && styles.rushCircle]}>
          <Text style={[styles.countText, isRush && styles.rushText]}>
            {isRush ? 'RUSH!' : count}
          </Text>
        </View>
      </View>

      <Text style={styles.prepareText}>PREPARE YOUR MEMORY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 10, 13, 0.92)',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 70,
    zIndex: 99,
  },
  topInfo: {
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  diffSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: MRColors.primaryCyan,
    letterSpacing: 3,
    marginTop: 4,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(34, 211, 238, 0.10)',
    borderWidth: 2.5,
    borderColor: MRColors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  rushCircle: {
    backgroundColor: 'rgba(34, 211, 238, 0.25)',
    borderColor: MRColors.cyanBright,
    transform: [{ scale: 1.15 }],
  },
  countText: {
    fontSize: 56,
    fontWeight: '900',
    color: MRColors.textPrimary,
  },
  rushText: {
    fontSize: 28,
    color: MRColors.cyanBright,
    letterSpacing: 2,
  },
  prepareText: {
    fontSize: 12,
    fontWeight: '800',
    color: MRColors.textSecondary,
    letterSpacing: 2,
  },
});
