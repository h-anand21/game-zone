// ============================================================
// GameHub — Memory Rush Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateDeck } from './logic';
import type { MemoryCard } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface MemoryRushProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const MemoryRushGame: React.FC<MemoryRushProps> = ({ onFinish, isPaused }) => {
  const [deck, setDeck] = useState<MemoryCard[]>(() => generateDeck(6));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(matches * 20, matches >= 4, { moves, matches });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, matches, moves, onFinish]);

  const handleCardPress = (cardId: number) => {
    if (isPaused || flippedCards.length >= 2) return;

    const targetCard = deck.find((c) => c.id === cardId);
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return;

    // Flip card
    const updatedDeck = deck.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setDeck(updatedDeck);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = deck.find((c) => c.id === firstId)!;
      const secondCard = deck.find((c) => c.id === secondId)!;

      if (firstCard.symbol === secondCard.symbol) {
        // Match!
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          if (nextMatches === 6) {
            // Cleared all pairs!
            const bonus = timeLeft * 5;
            const finalScore = 120 + bonus;
            onFinish(finalScore, true, { moves: moves + 1, timeRemaining: timeLeft });
          }
        }, 300);
      } else {
        // No match — flip back
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MATCHES</Text>
          <Text style={styles.statValue}>{matches} / 6</Text>
        </View>

        <View style={[styles.statBox, timeLeft <= 5 && styles.timeLow]}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, timeLeft <= 5 && styles.timeLowText]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Grid of 12 cards */}
      <View style={styles.grid}>
        {deck.map((card) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [
              styles.card,
              (card.isFlipped || card.isMatched) && styles.cardFlipped,
              card.isMatched && styles.cardMatched,
              pressed && styles.pressed,
            ]}
            onPress={() => handleCardPress(card.id)}
          >
            <Text style={styles.cardText}>
              {card.isFlipped || card.isMatched ? card.symbol : '❓'}
            </Text>
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
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeLow: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  timeLowText: {
    color: Colors.error,
  },
  statLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontWeight: Typography.semibold,
  },
  statValue: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  grid: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: 62,
    height: 78,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardFlipped: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.primary,
  },
  cardMatched: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  cardText: {
    fontSize: 28,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
