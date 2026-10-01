// ============================================================
// MEMORY RUSH — Primary CTA Button (Adapts to JungleButton)
// ============================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { JungleButton, JungleButtonVariant } from './JungleButton';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'gold' | 'emerald' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  size = 'lg',
  variant = 'gold',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const jungleVariant: JungleButtonVariant =
    variant === 'danger'
      ? 'coral'
      : variant === 'emerald'
      ? 'emerald'
      : variant === 'cyan'
      ? 'blue'
      : 'gold';

  return (
    <JungleButton
      title={title}
      onPress={onPress}
      size={size}
      variant={jungleVariant}
      icon={icon}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
    />
  );
};
