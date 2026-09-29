// ============================================================
// Mind Lock — Danger Button
// ============================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MindButton } from './MindButton';

interface DangerButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const DangerButton: React.FC<DangerButtonProps> = ({
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
      variant="danger"
      size={size}
      icon={icon}
      glow={true}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
    />
  );
};
