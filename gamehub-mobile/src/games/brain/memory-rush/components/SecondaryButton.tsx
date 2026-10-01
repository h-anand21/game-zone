// ============================================================
// MEMORY RUSH — Physical Wood/Stone Secondary Button
// ============================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { JungleButton, JungleButtonVariant } from './JungleButton';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: JungleButtonVariant;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  size = 'md',
  variant = 'wood',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <JungleButton
      title={title}
      onPress={onPress}
      size={size}
      variant={variant}
      icon={icon}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
    />
  );
};
