// ============================================================
// MEMORY RUSH — 3D Carved Feedback Toast (PERFECT / OOPS)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RoundFeedbackProps {
  type: 'perfect' | 'miss' | 'streak' | null;
  message: string;
  points?: number;
}

export const RoundFeedback: React.FC<RoundFeedbackProps> = ({
  type,
  message,
  points,
}) => {
  if (!type) return null;

  const isPerfect = type === 'perfect';
  const isStreak = type === 'streak';

  const gradientColors = isPerfect
    ? (['#059669', '#047857', '#064E3B'] as const)
    : isStreak
    ? (['#D97706', '#B45309', '#78350F'] as const)
    : (['#DC2626', '#B91C1C', '#7F1D1D'] as const);

  const borderColor = isPerfect ? '#6EE7B7' : isStreak ? '#FDE047' : '#FCA5A5';

  return (
    <View style={styles.toastOuter}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.toastGradient, { borderColor }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={styles.text}>
          {message} {points ? `+${points}` : ''}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  toastOuter: {
    marginVertical: 4,
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: '#0A120E',
    paddingBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  toastGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
});
