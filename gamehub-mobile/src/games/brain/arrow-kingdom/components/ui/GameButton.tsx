// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Chunky Fantasy Game Button
// Castle Defender-style dimensional button with wooden bezel
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { ArrowHaptics } from '../../utils/haptics';

type ButtonVariant = 'green' | 'blue' | 'gold' | 'wood' | 'red';
type ButtonSize = 'small' | 'medium' | 'large';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const VARIANT_CONFIG: Record<
  ButtonVariant,
  { colors: [string, string]; highlight: string; bevelDark: string }
> = {
  green: {
    colors: ['#78F329', '#22C51D'],
    highlight: '#A7FF6B',
    bevelDark: '#127A12',
  },
  blue: {
    colors: ['#42D2FF', '#118BC9'],
    highlight: '#A6EEFF',
    bevelDark: '#08537D',
  },
  gold: {
    colors: ['#FFE259', '#E5A016'],
    highlight: '#FFF2A8',
    bevelDark: '#996306',
  },
  wood: {
    colors: ['#D48835', '#7A3F17'],
    highlight: '#F3AA51',
    bevelDark: '#4A2108',
  },
  red: {
    colors: ['#FF6B7A', '#C91E2C'],
    highlight: '#FFA8B1',
    bevelDark: '#800F19',
  },
};

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'green',
  size = 'large',
  icon,
  disabled = false,
  style,
}) => {
  const config = VARIANT_CONFIG[variant];

  const handlePress = () => {
    if (disabled) return;
    ArrowHaptics.buttonPress();
    onPress();
  };

  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        isSmall && styles.wrapperSmall,
        isMedium && styles.wrapperMedium,
        isLarge && styles.wrapperLarge,
        pressed && styles.pressedWrapper,
        disabled && styles.disabledWrapper,
        style,
      ]}
    >
      {/* 3D Bottom Bevel Shadow */}
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.innerSurface,
          { borderColor: config.highlight },
          isSmall && styles.surfaceSmall,
          isMedium && styles.surfaceMedium,
          isLarge && styles.surfaceLarge,
        ]}
      >
        <Text
          style={[
            styles.text,
            isSmall && styles.textSmall,
            isMedium && styles.textMedium,
            isLarge && styles.textLarge,
          ]}
        >
          {icon ? `${icon} ` : ''}
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#4A2108',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 8,
  },
  wrapperLarge: {
    minHeight: 62,
  },
  wrapperMedium: {
    minHeight: 50,
  },
  wrapperSmall: {
    minHeight: 40,
    borderRadius: 14,
    borderWidth: 3,
  },
  pressedWrapper: {
    transform: [{ scale: 0.96 }, { translateY: 2 }],
    shadowOpacity: 0.2,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  innerSurface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  surfaceLarge: {
    paddingVertical: 12,
  },
  surfaceMedium: {
    paddingVertical: 9,
  },
  surfaceSmall: {
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  textLarge: {
    fontSize: 20,
  },
  textMedium: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 13,
    letterSpacing: 1,
  },
});

export default GameButton;
