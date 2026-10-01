// ============================================================
// MEMORY RUSH — Floating PERFECT / MISS Feedback Toast
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MRColors } from '../constants/colors';

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

  return (
    <View
      style={[
        styles.toast,
        isPerfect
          ? styles.toastPerfect
          : isStreak
          ? styles.toastStreak
          : styles.toastMiss,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPerfect
            ? styles.textPerfect
            : isStreak
            ? styles.textStreak
            : styles.textMiss,
        ]}
      >
        {message} {points ? `+${points}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    marginVertical: 4,
    alignSelf: 'center',
  },
  toastPerfect: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderColor: MRColors.successGreen,
  },
  toastStreak: {
    backgroundColor: 'rgba(255, 216, 61, 0.18)',
    borderColor: MRColors.yellowStatus,
  },
  toastMiss: {
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
    borderColor: MRColors.dangerRose,
  },
  text: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  textPerfect: {
    color: MRColors.successGreen,
  },
  textStreak: {
    color: MRColors.yellowStatus,
  },
  textMiss: {
    color: MRColors.dangerRose,
  },
});
