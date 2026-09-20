// ============================================================
// GameHub — Code Breaker Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateSecretCode, evaluateGuess } from './logic';
import type { GuessAttempt } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface CodeBreakerProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const CodeBreakerGame: React.FC<CodeBreakerProps> = ({ onFinish, isPaused }) => {
  const [secret] = useState(() => generateSecretCode(4));
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempts, setAttempts] = useState<GuessAttempt[]>([]);
  const [maxAttempts] = useState(8);

  const handleDigitPress = (digit: string) => {
    if (isPaused || currentGuess.length >= 4) return;
    if (currentGuess.includes(digit)) return; // unique digits only
    setCurrentGuess((prev) => prev + digit);
  };

  const handleDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (currentGuess.length !== 4) return;

    const result = evaluateGuess(secret, currentGuess);
    const newAttempts = [result, ...attempts];
    setAttempts(newAttempts);
    setCurrentGuess('');

    if (result.bulls === 4) {
      // Crack successful!
      const attemptsCount = newAttempts.length;
      const score = Math.max(10, 100 - (attemptsCount - 1) * 12);
      onFinish(score, true, { secret, attempts: attemptsCount });
    } else if (newAttempts.length >= maxAttempts) {
      // Out of attempts!
      onFinish(0, false, { secret, failed: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Target Status */}
      <View style={styles.statusBox}>
        <Text style={styles.statusTitle}>🔐 Secret 4-Digit Code</Text>
        <Text style={styles.statusSub}>Attempts: {attempts.length} / {maxAttempts}</Text>
      </View>

      {/* Current Guess Slot Display */}
      <View style={styles.slotsRow}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <View key={idx} style={styles.slot}>
            <Text style={styles.slotText}>{currentGuess[idx] || '?'}</Text>
          </View>
        ))}
      </View>

      {/* Attempts History */}
      <ScrollView style={styles.historyList} contentContainerStyle={styles.historyContent}>
        {attempts.map((item, idx) => (
          <View key={idx} style={styles.historyRow}>
            <Text style={styles.historyGuess}>{item.guess}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, styles.bullBadge]}>
                <Text style={styles.badgeText}>🎯 {item.bulls} Exact</Text>
              </View>
              <View style={[styles.badge, styles.cowBadge]}>
                <Text style={styles.badgeText}>💡 {item.cows} Misplaced</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Keypad 0-9 */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => {
          const isUsedInCurrent = currentGuess.includes(digit);
          return (
            <Pressable
              key={digit}
              disabled={isUsedInCurrent || currentGuess.length >= 4}
              style={({ pressed }) => [
                styles.keyBtn,
                isUsedInCurrent && styles.keyBtnDisabled,
                pressed && styles.pressed,
              ]}
              onPress={() => handleDigitPress(digit)}
            >
              <Text style={styles.keyText}>{digit}</Text>
            </Pressable>
          );
        })}

        <Pressable style={[styles.keyBtn, styles.actionKey]} onPress={handleDelete}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>

        <Pressable
          disabled={currentGuess.length !== 4}
          style={[
            styles.keyBtn,
            styles.actionKey,
            styles.submitKey,
            currentGuess.length !== 4 && styles.keyBtnDisabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={[styles.keyText, { color: '#FFFFFF' }]}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  statusBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusTitle: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  statusSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  slot: {
    width: 54,
    height: 54,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  slotText: {
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  historyList: {
    flex: 1,
    width: '100%',
    maxHeight: 160,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyContent: {
    gap: Spacing.xs,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  historyGuess: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    letterSpacing: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  bullBadge: {
    backgroundColor: Colors.success + '25',
  },
  cowBadge: {
    backgroundColor: Colors.warning + '25',
  },
  badgeText: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: 300,
    justifyContent: 'center',
  },
  keyBtn: {
    width: 68,
    height: 48,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionKey: {
    backgroundColor: Colors.surfaceElevated,
  },
  submitKey: {
    backgroundColor: Colors.primary,
  },
  keyBtnDisabled: {
    opacity: 0.3,
  },
  keyText: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
