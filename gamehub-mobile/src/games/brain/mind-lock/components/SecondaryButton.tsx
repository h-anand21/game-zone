// ============================================================
// Mind Lock — Secondary Button
// ============================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MindButton } from './MindButton';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <MindButton
      title={title}
      onPress={onPress}
      variant="secondary"
      size={size}
      icon={icon}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
    />
  );
};
