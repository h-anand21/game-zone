// ============================================================
// STACK MASTER — Secondary Glass / Metallic Button
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { StackHaptics } from '../../utils/haptics';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: 'blue' | 'panel' | 'danger';
  style?: ViewStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'blue',
  style,
}) => {
  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'danger':
        return ['#6B1C28', '#380E15'];
      case 'panel':
        return ['#1C375E', '#0E223D'];
      case 'blue':
      default:
        return ['#1E4378', '#11294C'];
    }
  };

  const getBorderColor = (): string => {
    switch (variant) {
      case 'danger':
        return COLORS.error;
      case 'panel':
        return COLORS.border;
      case 'blue':
      default:
        return COLORS.cyan;
    }
  };

  return (
    <Pressable
      onPress={() => {
        StackHaptics.buttonPress();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: getBorderColor(),
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
      >
        <Text style={styles.text}>
          {icon ? `${icon} ` : ''}
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    height: 48,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F6F9FF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
