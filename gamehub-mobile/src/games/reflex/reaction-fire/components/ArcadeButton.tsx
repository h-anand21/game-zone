// ============================================================
// REACTION FIRE — Arcade Button Component
// Tactile neon button with spring press animations and audio/haptics
// ============================================================

import React, { useRef } from 'react';
import { StyleSheet, Text, Animated, Pressable, ViewStyle, TextStyle } from 'react-native';
import { RfColors } from '../theme';
import { RfHaptics } from '../haptics/hapticManager';
import { RfAudio } from '../audio/audioManager';

type ButtonVariant = 'lime' | 'blue' | 'cyan' | 'red' | 'gold' | 'glass';

interface ArcadeButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
  size?: 'compact' | 'normal' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  title,
  onPress,
  variant = 'lime',
  icon,
  disabled = false,
  size = 'normal',
  style,
  textStyle,
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
    RfHaptics.successTap();
    RfAudio.playButtonClick();
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'lime':
        return {
          container: styles.btnLime,
          text: styles.textLime,
          shadow: RfColors.goLime,
        };
      case 'blue':
        return {
          container: styles.btnBlue,
          text: styles.textBlue,
          shadow: RfColors.primaryBlue,
        };
      case 'cyan':
        return {
          container: styles.btnCyan,
          text: styles.textCyan,
          shadow: RfColors.secondaryCyan,
        };
      case 'red':
        return {
          container: styles.btnRed,
          text: styles.textRed,
          shadow: RfColors.signalRed,
        };
      case 'gold':
        return {
          container: styles.btnGold,
          text: styles.textGold,
          shadow: RfColors.rewardGold,
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
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text
          style={[
            styles.baseText,
            config.text,
            size === 'large' ? styles.textLarge : undefined,
            size === 'compact' ? styles.textCompact : undefined,
            textStyle,
          ] as any}
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
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  sizeLarge: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  sizeCompact: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  baseText: {
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textLarge: {
    fontSize: 16,
    letterSpacing: 2,
  },
  textCompact: {
    fontSize: 11,
    letterSpacing: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  btnLime: {
    backgroundColor: 'rgba(183, 255, 60, 0.16)',
    borderColor: RfColors.goLime,
  },
  textLime: {
    color: RfColors.goLime,
  },
  btnBlue: {
    backgroundColor: 'rgba(39, 183, 255, 0.16)',
    borderColor: RfColors.primaryBlue,
  },
  textBlue: {
    color: RfColors.primaryBlue,
  },
  btnCyan: {
    backgroundColor: 'rgba(83, 225, 255, 0.16)',
    borderColor: RfColors.secondaryCyan,
  },
  textCyan: {
    color: RfColors.secondaryCyan,
  },
  btnRed: {
    backgroundColor: 'rgba(255, 77, 99, 0.16)',
    borderColor: RfColors.signalRed,
  },
  textRed: {
    color: RfColors.signalRed,
  },
  btnGold: {
    backgroundColor: 'rgba(255, 200, 87, 0.16)',
    borderColor: RfColors.rewardGold,
  },
  textGold: {
    color: RfColors.rewardGold,
  },
  btnGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  textGlass: {
    color: RfColors.textPrimary,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
