// ============================================================
// STACK MASTER — Primary Chunky 3D Arcade Button
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { StackHaptics } from '../../utils/haptics';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'cyan' | 'green' | 'magenta';
  size?: 'normal' | 'large';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'gold',
  size = 'normal',
  icon,
  disabled = false,
  style,
}) => {
  const getGradientColors = (): [string, string] => {
    if (disabled) return ['#4A5A72', '#2A374A'];
    switch (variant) {
      case 'cyan':
        return [COLORS.cyanLight, COLORS.cyan];
      case 'green':
        return [COLORS.success, '#10B981'];
      case 'magenta':
        return [COLORS.magentaLight, COLORS.magenta];
      case 'gold':
      default:
        return [COLORS.goldLight, COLORS.gold];
    }
  };

  const getBorderColor = (): string => {
    if (disabled) return '#202D42';
    switch (variant) {
      case 'cyan':
        return COLORS.cyan;
      case 'green':
        return COLORS.success;
      case 'magenta':
        return COLORS.magenta;
      case 'gold':
      default:
        return COLORS.goldDark;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return '#8FA2BA';
    if (variant === 'gold') return '#4A2A00'; // High contrast dark amber
    return '#FFFFFF';
  };

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        StackHaptics.buttonPress();
        onPress();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerBezel,
        {
          borderColor: getBorderColor(),
          opacity: disabled ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        size === 'large' ? styles.largeOuter : styles.normalOuter,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.innerFace,
          size === 'large' ? styles.largeInner : styles.normalInner,
        ]}
      >
        <Text
          style={[
            styles.label,
            size === 'large' ? styles.largeText : styles.normalText,
            { color: getTextColor() },
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
  outerBezel: {
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#071329',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 6,
    elevation: 8,
  },
  normalOuter: {
    minHeight: 56,
  },
  largeOuter: {
    minHeight: 68,
  },
  innerFace: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.75)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 20,
  },
  normalInner: {
    height: 50,
  },
  largeInner: {
    height: 62,
  },
  label: {
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  normalText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 22,
  },
});
