// ============================================================
// GameHub — Reverse Mind Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { SYMBOLS, generateSequence, isReverseMatch } from './logic';
import type { SymbolItem } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface ReverseMindProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const ReverseMindGame: React.FC<ReverseMindProps> = ({ onFinish, isPaused }) => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<SymbolItem[]>([]);
  const [playerInput, setPlayerInput] = useState<SymbolItem[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Memorize sequence');

  useEffect(() => {
    startLevel(1);
  }, []);

  const startLevel = (lvl: number) => {
    const seq = generateSequence(lvl + 2);
    setSequence(seq);
    setPlayerInput([]);
    setIsShowingPattern(true);
    setStatusMsg(`Level ${lvl}: Memorize in ORDER!`);

    setTimeout(() => {
      setIsShowingPattern(false);
      setStatusMsg(`Level ${lvl}: Enter in REVERSE order!`);
    }, 1500 + lvl * 500);
  };

  const handleSymbolPress = (symbol: SymbolItem) => {
    if (isShowingPattern || isPaused) return;

    const newPlayerInput = [...playerInput, symbol];
    setPlayerInput(newPlayerInput);

    const targetReversed = [...sequence].reverse();
    const currentIndex = newPlayerInput.length - 1;

    // Check if latest symbol matches expected reversed symbol
    if (newPlayerInput[currentIndex] !== targetReversed[currentIndex]) {
      // Wrong! Game Over
      const finalScore = (level - 1) * 10;
      setStatusMsg('Wrong reverse symbol! Game Over.');
      onFinish(finalScore, finalScore >= 30, { maxLevel: level });
      return;
    }

    if (newPlayerInput.length === sequence.length) {
      // Level completed!
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setStatusMsg('Correct Reverse! Next Level...');
      setTimeout(() => {
        startLevel(nextLevel);
      }, 800);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* Pattern Display or Input Slot Area */}
      <View style={styles.displayArea}>
        {isShowingPattern ? (
          <View style={styles.symbolRow}>
            {sequence.map((sym, idx) => (
              <View key={idx} style={styles.symbolBadge}>
                <Text style={styles.symbolText}>{sym}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.symbolRow}>
            {Array.from({ length: sequence.length }).map((_, idx) => (
              <View key={idx} style={[styles.symbolBadge, styles.slotBadge]}>
                <Text style={styles.symbolText}>{playerInput[idx] || '❓'}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {SYMBOLS.map((sym, idx) => (
          <Pressable
            key={idx}
            disabled={isShowingPattern}
            style={({ pressed }) => [
              styles.keypadBtn,
              isShowingPattern && styles.btnDisabled,
              pressed && !isShowingPattern && styles.pressed,
            ]}
            onPress={() => handleSymbolPress(sym)}
          >
            <Text style={styles.keypadText}>{sym}</Text>
          </Pressable>
        ))}
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
  headerBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  displayArea: {
    width: '100%',
    minHeight: 120,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  symbolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  symbolBadge: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBadge: {
    borderWidth: 1,
    borderColor: Colors.primary + '60',
  },
  symbolText: {
    fontSize: 24,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    width: 280,
    justifyContent: 'center',
  },
  keypadBtn: {
    width: 76,
    height: 76,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  keypadText: {
    fontSize: 32,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
