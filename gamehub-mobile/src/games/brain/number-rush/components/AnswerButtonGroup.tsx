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

const BUTTON_THEMES: ButtonVariant[] = ['green', 'gold', 'blue', 'purple'];

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

        if (showFeedback) {
          if (isCorrect) {
            variant = 'green';
          } else if (isSelected && !isCorrect) {
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
            ]}
          >
            {/* 3D Bottom Bevel */}
            <View
              style={[
                styles.bevelBottom,
                { backgroundColor: theme.shadow },
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
                    { scale: isSelected ? 1.02 : 1 },
                  ],
                },
                showFeedback && isCorrect && styles.correctGlow,
              ]}
            >
              {/* Top Specular Highlight */}
              <View
                style={[
                  styles.specularGloss,
                  { backgroundColor: theme.highlight },
                ]}
              />

              <Text
                style={[
                  styles.optionText,
                  { color: theme.text },
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
    height: 72,
    position: 'relative',
  },
  eliminatedWrapper: {
    opacity: 0.25,
  },
  bevelBottom: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: '100%',
    height: 66,
    borderRadius: NRTheme.radius.lg,
  },
  face: {
    width: '100%',
    height: 66,
    borderRadius: NRTheme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 3,
    ...NRTheme.shadows.card,
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
  optionText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  correctGlow: {
    ...NRTheme.shadows.glowGreen,
  },
});
