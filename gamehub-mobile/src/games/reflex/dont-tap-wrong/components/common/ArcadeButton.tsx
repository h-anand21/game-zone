// ============================================================
// DON'T TAP WRONG — Arcade Button
// Tactile high-response neon button with micro-animations
// ============================================================

import React, { useRef } from 'react';
import { StyleSheet, Text, Animated, Pressable, ViewStyle, TextStyle } from 'react-native';
import { DtwColors } from '../../theme/colors';
import { DtwHaptics } from '../../haptics/hapticManager';
import { DtwAudio } from '../../audio/audioManager';

type ButtonVariant = 'green' | 'red' | 'cyan' | 'gold' | 'glass';

interface ArcadeButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'normal' | 'large' | 'compact';
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  title,
  onPress,
  variant = 'green',
  icon,
  disabled = false,
  style,
  textStyle,
  size = 'normal',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    DtwHaptics.safeTap();
    DtwAudio.playButtonClick();
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          container: styles.btnGreen,
          text: styles.textGreen,
          shadow: DtwColors.safeGreen,
        };
      case 'red':
        return {
          container: styles.btnRed,
          text: styles.textRed,
          shadow: DtwColors.dangerRed,
        };
      case 'cyan':
        return {
          container: styles.btnCyan,
          text: styles.textCyan,
          shadow: DtwColors.cyanAccent,
        };
      case 'gold':
        return {
          container: styles.btnGold,
          text: styles.textGold,
          shadow: DtwColors.streakGold,
        };
      case 'glass':
      default:
        return {
          container: styles.btnGlass,
          text: styles.textGlass,
          shadow: 'rgba(255, 255, 255, 0.1)',
        };
    }
  };

  const config = getVariantStyles();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.baseButton,
          config.container,
          size === 'large' && styles.sizeLarge,
          size === 'compact' && styles.sizeCompact,
          { shadowColor: config.shadow },
          disabled && styles.btnDisabled,
        ]}
      >
        {icon ? <Text style={styles.buttonIcon}>{icon}</Text> : null}
        <Text
          style={[
            styles.baseText,
            config.text,
            size === 'large' && styles.textLarge,
            size === 'compact' && styles.textCompact,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  sizeLarge: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  sizeCompact: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  baseText: {
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textLarge: {
    fontSize: 18,
    letterSpacing: 2,
  },
  textCompact: {
    fontSize: 12,
    letterSpacing: 1,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  // Variants
  btnGreen: {
    backgroundColor: 'rgba(0, 255, 102, 0.16)',
    borderColor: DtwColors.safeGreen,
  },
  textGreen: {
    color: DtwColors.safeGreen,
  },
  btnRed: {
    backgroundColor: 'rgba(255, 0, 51, 0.16)',
    borderColor: DtwColors.dangerRed,
  },
  textRed: {
    color: DtwColors.dangerRed,
  },
  btnCyan: {
    backgroundColor: 'rgba(0, 229, 255, 0.16)',
    borderColor: DtwColors.cyanAccent,
  },
  textCyan: {
    color: DtwColors.cyanAccent,
  },
  btnGold: {
    backgroundColor: 'rgba(255, 184, 0, 0.16)',
    borderColor: DtwColors.streakGold,
  },
  textGold: {
    color: DtwColors.streakGold,
  },
  btnGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  textGlass: {
    color: DtwColors.textPrimary,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
