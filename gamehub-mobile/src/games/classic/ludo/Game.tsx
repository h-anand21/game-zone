// ============================================================
// GameHub — Ludo Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getInitialLudoState, rollDice, canMoveToken } from './logic';
import type { LudoColor, LudoToken, LudoState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface LudoProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const LudoGame: React.FC<LudoProps> = ({ onFinish, isPaused }) => {
  const [state, setState] = useState<LudoState>(() => getInitialLudoState());

  const handleRollDice = () => {
    if (state.isRolling || state.diceValue !== null || isPaused) return;

    setState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const val = rollDice();
      setState((prev) => {
        const moveable = prev.tokens[prev.currentPlayer].some((t) => canMoveToken(t, val));
        let nextPlayer = prev.currentPlayer;
        let status = `Rolled a ${val}! Tap a token to move.`;

        if (!moveable) {
          status = `Rolled a ${val}. No valid moves! Next player turn.`;
          nextPlayer = getNextPlayer(prev.currentPlayer);
        }

        return {
          ...prev,
          diceValue: moveable ? val : null,
          isRolling: false,
          currentPlayer: nextPlayer,
          statusText: status,
        };
      });
    }, 400);
  };

  const getNextPlayer = (curr: LudoColor): LudoColor => {
    const order: LudoColor[] = ['red', 'green', 'yellow', 'blue'];
    const idx = order.indexOf(curr);
    return order[(idx + 1) % 4];
  };

  const handleTokenPress = (token: LudoToken) => {
    if (!state.diceValue || isPaused) return;
    if (token.color !== state.currentPlayer) return;

    if (!canMoveToken(token, state.diceValue)) return;

    const newPos = token.position === -1 ? 0 : token.position + state.diceValue;

    setState((prev) => {
      const updatedTokens = prev.tokens[prev.currentPlayer].map((t) =>
        t.id === token.id ? { ...t, position: newPos } : t
      );

      // Check win condition
      const wonAll = updatedTokens.every((t) => t.position === 57);
      if (wonAll) {
        onFinish(500, prev.currentPlayer === 'red', { winner: prev.currentPlayer });
      }

      const nextPlayer = prev.diceValue === 6 ? prev.currentPlayer : getNextPlayer(prev.currentPlayer);

      return {
        ...prev,
        tokens: {
          ...prev.tokens,
          [prev.currentPlayer]: updatedTokens,
        },
        diceValue: null,
        currentPlayer: nextPlayer,
        statusText: `Token moved! Turn: ${nextPlayer.toUpperCase()}`,
      };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Turn Banner */}
      <View style={styles.banner}>
        <Text style={styles.playerTag}>Current: {state.currentPlayer.toUpperCase()}</Text>
        <Text style={styles.statusText}>{state.statusText}</Text>
      </View>

      {/* Board Visual Representation */}
      <View style={styles.board}>
        <View style={styles.grid4}>
          {(['red', 'green', 'yellow', 'blue'] as LudoColor[]).map((color) => (
            <View key={color} style={[styles.colorBase, { backgroundColor: getBaseColor(color) }]}>
              <Text style={styles.baseLabel}>{color.toUpperCase()}</Text>
              <View style={styles.tokenContainer}>
                {state.tokens[color].map((tok) => (
                  <Pressable
                    key={tok.id}
                    disabled={state.currentPlayer !== color || !state.diceValue}
                    style={[styles.token, tok.position === 57 && styles.tokenFinished]}
                    onPress={() => handleTokenPress(tok)}
                  >
                    <Text style={styles.tokenText}>{tok.position === -1 ? '🏠' : tok.position}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Dice Roller */}
      <View style={styles.diceSection}>
        <Pressable
          disabled={state.isRolling || state.diceValue !== null}
          style={({ pressed }) => [styles.diceBtn, pressed && styles.pressed]}
          onPress={handleRollDice}
        >
          <Text style={styles.diceIcon}>{state.isRolling ? '🌀' : '🎲'}</Text>
          <Text style={styles.diceValText}>
            {state.diceValue !== null ? `Dice: ${state.diceValue}` : 'ROLL DICE'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

function getBaseColor(color: LudoColor): string {
  switch (color) {
    case 'red': return '#EF4444' + '30';
    case 'green': return '#10B981' + '30';
    case 'yellow': return '#F59E0B' + '30';
    case 'blue': return '#3B82F6' + '30';
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-around',
  },
  banner: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerTag: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  board: {
    width: 320,
    height: 320,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  grid4: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorBase: {
    width: 148,
    height: 148,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  baseLabel: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  tokenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  token: {
    width: 38,
    height: 38,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenFinished: {
    backgroundColor: Colors.success,
  },
  tokenText: {
    fontSize: 12,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  diceSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  diceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
    ...Shadows.lg,
  },
  diceIcon: {
    fontSize: 32,
  },
  diceValText: {
    fontSize: Typography.h3,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
