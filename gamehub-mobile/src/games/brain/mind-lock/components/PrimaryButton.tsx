// ============================================================
// Mind Lock — Primary Button (Large Golden Yellow Glowing Bevel Button)
// ============================================================

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { MindButton } from './MindButton';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  showPlayIcon?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  size = 'lg',
  showPlayIcon = true,
  disabled = false,
  style,
  textStyle,
}) => {
  const icon = showPlayIcon ? (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="#0A121D">
      <Polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
  ) : undefined;

  return (
    <MindButton
      title={title}
      onPress={onPress}
      variant="primary"
      size={size}
      icon={icon}
      glow={true}
      disabled={disabled}
      style={style}
      textStyle={textStyle}
    />
  );
};
