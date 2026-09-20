// ============================================================
// GameHub — Ludo Component (AI Bot Support + Glowing Token Guides)
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

  const getNextPlayer = (curr: LudoColor): LudoColor => {
    const order: LudoColor[] = ['red', 'green', 'yellow', 'blue'];
    const idx = order.indexOf(curr);
    return order[(idx + 1) % 4];
  };

  const handleRollDice = () => {
    if (state.isRolling || state.diceValue !== null || isPaused) return;

    setState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const val = rollDice();
      setState((prev) => {
        const moveableTokens = prev.tokens[prev.currentPlayer].filter((t) => canMoveToken(t, val));
        const moveable = moveableTokens.length > 0;

        let nextPlayer = prev.currentPlayer;
        let status = `${prev.currentPlayer.toUpperCase()} rolled a ${val}! Tap a token to move.`;

        if (!moveable) {
          status = `${prev.currentPlayer.toUpperCase()} rolled a ${val} (No valid moves). Next turn!`;
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

  // AI Bot Turns for Green, Yellow, Blue
  useEffect(() => {
    if (isPaused) return;
    const isBotTurn = state.currentPlayer !== 'red';

    if (isBotTurn) {
      if (state.diceValue === null && !state.isRolling) {
        const timer = setTimeout(() => {
          handleRollDice();
        }, 800);
        return () => clearTimeout(timer);
      } else if (state.diceValue !== null) {
        const timer = setTimeout(() => {
          const moveableTokens = state.tokens[state.currentPlayer].filter((t) =>
            canMoveToken(t, state.diceValue!)
          );

          if (moveableTokens.length > 0) {
            // AI chooses first valid token
            handleTokenPress(moveableTokens[0]);
          }
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [state.currentPlayer, state.diceValue, state.isRolling, isPaused]);

  const isRedTurn = state.currentPlayer === 'red';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Turn Banner */}
      <View style={[styles.banner, { borderColor: getPlayerHex(state.currentPlayer) }]}>
        <View style={styles.bannerHeader}>
          <Text style={[styles.playerTag, { color: getPlayerHex(state.currentPlayer) }]}>
            {isRedTurn ? '🎮 YOUR TURN (RED)' : `🤖 BOT TURN (${state.currentPlayer.toUpperCase()})`}
          </Text>
        </View>
        <Text style={styles.statusText}>{state.statusText}</Text>
      </View>

      {/* Board Visual Representation */}
      <View style={styles.board}>
        <View style={styles.grid4}>
          {(['red', 'green', 'yellow', 'blue'] as LudoColor[]).map((color) => {
            const isCurrentBase = state.currentPlayer === color;
            return (
              <View
                key={color}
                style={[
                  styles.colorBase,
                  { backgroundColor: getBaseColor(color) },
                  isCurrentBase && styles.activeBase,
                ]}
              >
                <Text style={[styles.baseLabel, { color: getPlayerHex(color) }]}>
                  {color.toUpperCase()} {color === 'red' ? '(YOU)' : '(BOT)'}
                </Text>

                <View style={styles.tokenContainer}>
                  {state.tokens[color].map((tok) => {
                    const isMoveable =
                      isCurrentBase &&
                      state.diceValue !== null &&
                      canMoveToken(tok, state.diceValue);

                    return (
                      <Pressable
                        key={tok.id}
                        disabled={!isMoveable || !isRedTurn}
                        style={[
                          styles.token,
                          { borderColor: getPlayerHex(color) },
                          tok.position === 57 && styles.tokenFinished,
                          isMoveable && isRedTurn && styles.tokenMoveable,
                        ]}
                        onPress={() => handleTokenPress(tok)}
                      >
                        <Text style={styles.tokenText}>
                          {tok.position === -1 ? '🏠' : tok.position}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Dice Roller */}
      <View style={styles.diceSection}>
        <Pressable
          disabled={!isRedTurn || state.isRolling || state.diceValue !== null}
          style={({ pressed }) => [
            styles.diceBtn,
            (!isRedTurn || state.diceValue !== null) && styles.diceBtnDisabled,
            pressed && styles.pressed,
          ]}
          onPress={handleRollDice}
        >
          <Text style={styles.diceIcon}>{state.isRolling ? '🌀' : '🎲'}</Text>
          <Text style={styles.diceValText}>
            {!isRedTurn
              ? 'BOT THINKING...'
              : state.diceValue !== null
              ? `DICE: ${state.diceValue}`
              : 'ROLL DICE 🎲'}
          </Text>
        </Pressable>

        <Text style={styles.instructionText}>
          {!isRedTurn
            ? '🤖 Wait for AI bot players to finish their turn'
            : state.diceValue === null
            ? '👉 Step 1: Tap "ROLL DICE 🎲" button above'
            : '👉 Step 2: Tap glowing RED token on the board to move!'}
        </Text>
      </View>
    </ScrollView>
  );
};

function getPlayerHex(color: LudoColor): string {
  switch (color) {
    case 'red': return '#EF4444';
    case 'green': return '#10B981';
    case 'yellow': return '#F59E0B';
    case 'blue': return '#3B82F6';
  }
}

function getBaseColor(color: LudoColor): string {
  return getPlayerHex(color) + '25';
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
    borderWidth: 2,
    borderColor: Colors.border,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playerTag: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
  },
  statusText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  board: {
    width: 330,
    height: 330,
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
    width: 151,
    height: 151,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeBase: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  baseLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
  },
  tokenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  token: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  tokenMoveable: {
    backgroundColor: '#FEF08A',
    borderColor: '#EF4444',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  tokenFinished: {
    backgroundColor: Colors.success,
  },
  tokenText: {
    fontSize: 13,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  diceSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.xs,
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
  diceBtnDisabled: {
    backgroundColor: Colors.surfaceLight,
    opacity: 0.7,
  },
  diceIcon: {
    fontSize: 32,
  },
  diceValText: {
    fontSize: Typography.h3,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  instructionText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
