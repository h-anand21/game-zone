// ============================================================
// GameHub — Memory Cards Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { generateClassicDeck } from './logic';
import type { ClassicCardItem } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface MemoryCardsProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const MemoryCardsGame: React.FC<MemoryCardsProps> = ({ onFinish, isPaused }) => {
  const [deck, setDeck] = useState<ClassicCardItem[]>(() => generateClassicDeck(8));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [flips, setFlips] = useState(0);
  const [matches, setMatches] = useState(0);

  const handleCardPress = (id: number) => {
    if (isPaused || flippedIds.length >= 2) return;

    const card = deck.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newDeck = deck.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setDeck(newDeck);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setFlips((f) => f + 1);
      const [firstId, secondId] = newFlipped;
      const c1 = deck.find((c) => c.id === firstId)!;
      const c2 = deck.find((c) => c.id === secondId)!;

      if (c1.symbol === c2.symbol) {
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setFlippedIds([]);
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          if (nextMatches === 8) {
            const score = Math.max(50, 300 - flips * 10);
            onFinish(score, true, { flips: flips + 1 });
          }
        }, 300);
      } else {
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoCard}>
        <Text style={styles.flipsText}>Flips: {flips}</Text>
        <Text style={styles.matchesText}>Matched: {matches} / 8 Pairs</Text>
      </View>

      {/* 4x4 Cards Grid */}
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
            <Text style={styles.cardEmoji}>
              {card.isFlipped || card.isMatched ? card.symbol : '⚜️'}
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
  flipsText: {
    fontSize: Typography.h3,
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  matchesText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  card: {
    width: 62,
    height: 62,
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
    backgroundColor: Colors.success + '25',
    borderColor: Colors.success,
  },
  cardEmoji: {
    fontSize: 26,
  },
  pressed: {
    opacity: 0.8,
  },
});
