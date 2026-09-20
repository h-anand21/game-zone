// ============================================================
// GameHub — Reaction Fire Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getRandomDelayMs, calculateReactionScore } from './logic';
import type { ReactionState } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface ReactionFireProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const ReactionFireGame: React.FC<ReactionFireProps> = ({ onFinish, isPaused }) => {
  const [state, setState] = useState<ReactionState>('WAITING');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startTest();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTest = () => {
    setState('WAITING');
    setReactionTime(null);
    const delay = getRandomDelayMs();

    timerRef.current = setTimeout(() => {
      setState('READY_SIGNAL');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handlePress = () => {
    if (isPaused) return;

    if (state === 'WAITING') {
      // Too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('TOO_EARLY');
    } else if (state === 'READY_SIGNAL') {
      // Tapped on green!
      const timeMs = Date.now() - startTimeRef.current;
      setReactionTime(timeMs);
      setState('RESULT');

      const score = calculateReactionScore(timeMs);
      onFinish(score, timeMs < 350, { reactionTimeMs: timeMs });
    } else if (state === 'TOO_EARLY') {
      // Restart
      startTest();
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        state === 'WAITING' && styles.bgWaiting,
        state === 'READY_SIGNAL' && styles.bgReady,
        state === 'TOO_EARLY' && styles.bgTooEarly,
        state === 'RESULT' && styles.bgResult,
      ]}
      onPress={handlePress}
    >
      <View style={styles.card}>
        {state === 'WAITING' && (
          <>
            <Text style={styles.icon}>⏳</Text>
            <Text style={styles.title}>Wait for GREEN...</Text>
            <Text style={styles.subtitle}>Do not tap yet!</Text>
          </>
        )}

        {state === 'READY_SIGNAL' && (
          <>
            <Text style={styles.icon}>🔥</Text>
            <Text style={styles.title}>TAP NOW!</Text>
            <Text style={styles.subtitle}>Fast!</Text>
          </>
        )}

        {state === 'TOO_EARLY' && (
          <>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Too Early!</Text>
            <Text style={styles.subtitle}>Tap anywhere to try again</Text>
          </>
        )}

        {state === 'RESULT' && (
          <>
            <Text style={styles.icon}>⚡</Text>
            <Text style={styles.resultTime}>{reactionTime} ms</Text>
            <Text style={styles.subtitle}>
              {reactionTime! < 250
                ? 'Lightning Fast!'
                : reactionTime! < 350
                ? 'Great Reaction!'
                : 'Good attempt!'}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  bgWaiting: {
    backgroundColor: '#3B82F6',
  },
  bgReady: {
    backgroundColor: Colors.success,
  },
  bgTooEarly: {
    backgroundColor: Colors.error,
  },
  bgResult: {
    backgroundColor: Colors.surface,
  },
  card: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 72,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h1,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  resultTime: {
    fontSize: 54,
    color: Colors.primary,
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    fontSize: Typography.body,
    color: '#FFFFFF',
    marginTop: Spacing.sm,
    opacity: 0.9,
  },
});
