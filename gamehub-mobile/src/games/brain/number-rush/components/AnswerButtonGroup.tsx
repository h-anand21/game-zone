// ============================================================
// Number Rush — 4 Chunky 2.5D Answer Buttons
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NRTheme } from '../theme';
import type { ButtonVariant } from './GameButton';

interface AnswerButtonGroupProps {
  options: (number | string)[];
  correctAnswer: number | string;
  selectedAnswer: number | string | null;
  isSubmitted: boolean;
  eliminatedOptions?: (number | string)[];
  onSelectOption: (option: number | string) => void;
  disabled?: boolean;
}

const BUTTON_THEMES: ButtonVariant[] = ['blue', 'gold', 'purple', 'wood'];

export const AnswerButtonGroup: React.FC<AnswerButtonGroupProps> = ({
  options,
  correctAnswer,
  selectedAnswer,
  isSubmitted,
  eliminatedOptions = [],
  onSelectOption,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {options.map((opt, index) => {
        const isSelected = selectedAnswer !== null && String(selectedAnswer) === String(opt);
        const isCorrect = String(opt) === String(correctAnswer);
        const isEliminated = eliminatedOptions.some((el) => String(el) === String(opt));

        let variant: ButtonVariant = BUTTON_THEMES[index % BUTTON_THEMES.length];
        let showFeedback = isSubmitted;
        const isWrongSelection = showFeedback && isSelected && !isCorrect;
        const isCorrectAnswer = showFeedback && isCorrect;
        const isDimmed = showFeedback && !isSelected && !isCorrect;

        if (showFeedback) {
          if (isCorrectAnswer) {
            variant = 'green';
          } else if (isWrongSelection) {
            variant = 'red';
          }
        }

        const theme = NRTheme.buttonThemes[variant];
        const isButtonDisabled = disabled || isSubmitted || isEliminated;

        return (
          <View
            key={index}
            style={[
              styles.btnWrapper,
              isEliminated && styles.eliminatedWrapper,
              isDimmed && styles.dimmedWrapper,
            ]}
          >
            {/* 3D Bottom Bevel */}
            <View
              style={[
                styles.bevelBottom,
                { backgroundColor: theme.shadow },
                isWrongSelection && styles.bevelWrong,
                isCorrectAnswer && styles.bevelCorrect,
              ]}
            />

            {/* Button Face */}
            <Pressable
              onPress={() => onSelectOption(opt)}
              disabled={isButtonDisabled}
              style={({ pressed }) => [
                styles.face,
                {
                  backgroundColor: theme.face,
                  borderColor: theme.bevel,
                  transform: [
                    { translateY: pressed ? 5 : 0 },
                    { scale: isSelected ? 1.03 : 1 },
                  ],
                },
                isCorrectAnswer && styles.faceCorrect,
                isWrongSelection && styles.faceWrong,
              ]}
            >
              {/* Top Specular Highlight */}
              <View
                style={[
                  styles.specularGloss,
                  { backgroundColor: theme.highlight },
                  isWrongSelection && { backgroundColor: '#FF8A80', opacity: 0.8 },
                  isCorrectAnswer && { backgroundColor: '#B9F6CA', opacity: 0.8 },
                ]}
              />

              {/* Status Tag for Immediate Clarity */}
              {isWrongSelection && (
                <View style={styles.feedbackBadgeWrong}>
                  <Text style={styles.feedbackBadgeWrongText}>✕ WRONG</Text>
                </View>
              )}
              {isCorrectAnswer && (
                <View style={styles.feedbackBadgeCorrect}>
                  <Text style={styles.feedbackBadgeCorrectText}>✓ CORRECT</Text>
                </View>
              )}

              <Text
                style={[
                  styles.optionText,
                  { color: theme.text },
                  isWrongSelection && styles.optionTextWrong,
                  isCorrectAnswer && styles.optionTextCorrect,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 10,
  },
  btnWrapper: {
    width: '47.5%',
    height: 74,
    position: 'relative',
  },
  eliminatedWrapper: {
    opacity: 0.2,
  },
  dimmedWrapper: {
    opacity: 0.35,
  },
  bevelBottom: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: '100%',
    height: 68,
    borderRadius: NRTheme.radius.lg,
  },
  bevelWrong: {
    backgroundColor: '#7A0000',
  },
  bevelCorrect: {
    backgroundColor: '#00600F',
  },
  face: {
    width: '100%',
    height: 68,
    borderRadius: NRTheme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomWidth: 3,
    ...NRTheme.shadows.card,
  },
  faceWrong: {
    backgroundColor: '#D50000',
    borderColor: '#FF1744',
    borderWidth: 3,
    borderTopColor: '#FF8A80',
    ...NRTheme.shadows.glowRed,
  },
  faceCorrect: {
    backgroundColor: '#00C853',
    borderColor: '#00E676',
    borderWidth: 3,
    borderTopColor: '#B9F6CA',
    ...NRTheme.shadows.glowGreen,
  },
  specularGloss: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 8,
    borderRadius: 4,
    opacity: 0.65,
  },
  feedbackBadgeWrong: {
    position: 'absolute',
    top: 4,
    backgroundColor: '#7A0000',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF5252',
    zIndex: 10,
  },
  feedbackBadgeWrongText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  feedbackBadgeCorrect: {
    position: 'absolute',
    top: 4,
    backgroundColor: '#004D1A',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#69F0AE',
    zIndex: 10,
  },
  feedbackBadgeCorrectText: {
    color: '#69F0AE',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  optionText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  optionTextWrong: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  optionTextCorrect: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
});
