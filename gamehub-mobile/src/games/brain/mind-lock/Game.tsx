// ============================================================
// GameHub — Mind Lock Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { PADS, generateNextSequence } from './logic';
import type { PadColor } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface MindLockProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const MindLockGame: React.FC<MindLockProps> = ({ onFinish, isPaused }) => {
  const [sequence, setSequence] = useState<PadColor[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activePad, setActivePad] = useState<PadColor | null>(null);
  const [isPlayback, setIsPlayback] = useState(false);
  const [round, setRound] = useState(1);
  const [statusMsg, setStatusMsg] = useState('Watch the pattern');

  // Start round 1 on mount
  useEffect(() => {
    startNewRound([]);
  }, []);

  const startNewRound = (currentSeq: PadColor[]) => {
    const nextSeq = generateNextSequence(currentSeq);
    setSequence(nextSeq);
    setPlayerIndex(0);
    setRound(nextSeq.length);
    playSequence(nextSeq);
  };

  const playSequence = async (seq: PadColor[]) => {
    setIsPlayback(true);
    setStatusMsg('Watch the pattern...');

    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActivePad(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActivePad(null);
    }

    setIsPlayback(false);
    setStatusMsg('Your turn! Repeat the pattern');
  };

  const handlePadPress = (color: PadColor) => {
    if (isPlayback || isPaused) return;

    setActivePad(color);
    setTimeout(() => setActivePad(null), 250);

    const expected = sequence[playerIndex];
    if (color === expected) {
      const nextIdx = playerIndex + 1;
      if (nextIdx === sequence.length) {
        // Round passed!
        setStatusMsg('Great memory! Next level...');
        setTimeout(() => {
          startNewRound(sequence);
        }, 800);
      } else {
        setPlayerIndex(nextIdx);
      }
    } else {
      // Wrong pad! Game Over
      const finalScore = sequence.length - 1;
      setStatusMsg('Wrong sequence! Lock failed.');
      onFinish(finalScore, finalScore >= 5, { maxRoundReached: finalScore });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.roundText}>Round {round}</Text>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* 2x2 Pad Matrix */}
      <View style={styles.matrix}>
        {PADS.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <Pressable
              key={pad.id}
              disabled={isPlayback}
              style={({ pressed }) => [
                styles.pad,
                { backgroundColor: isActive ? pad.activeColor : pad.color },
                isActive && styles.activePadShadow,
                pressed && !isPlayback && styles.pressed,
              ]}
              onPress={() => handlePadPress(pad.id)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roundText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  matrix: {
    width: 280,
    height: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pad: {
    width: 125,
    height: 125,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  activePadShadow: {
    ...Shadows.lg,
    transform: [{ scale: 1.05 }],
  },
  pressed: {
    opacity: 0.8,
  },
});
