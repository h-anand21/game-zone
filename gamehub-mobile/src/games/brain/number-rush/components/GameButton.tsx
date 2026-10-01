// ============================================================
// Number Rush — 2.5D Dimensional Arcade Game Button
// ============================================================

import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { NRTheme } from '../theme';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';

export type ButtonVariant =
  | 'green'
  | 'gold'
  | 'blue'
  | 'purple'
  | 'red'
  | 'wood'
  | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface GameButtonProps {
  title: string;
  icon?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  icon,
  variant = 'green',
  size = 'md',
  onPress,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const [pressed, setPressed] = useState(false);
  const theme = NRTheme.buttonThemes[variant] || NRTheme.buttonThemes.green;

  const handlePress = () => {
    if (disabled) return;
    NRAudio.playButton();
    NRHaptics.buttonTap();
    onPress();
  };

  const sizeStyles = {
    sm: { height: 42, paddingHorizontal: 16, fontSize: 15, bevelHeight: 4 },
    md: { height: 52, paddingHorizontal: 22, fontSize: 18, bevelHeight: 6 },
    lg: { height: 62, paddingHorizontal: 28, fontSize: 21, bevelHeight: 7 },
    xl: { height: 72, paddingHorizontal: 32, fontSize: 24, bevelHeight: 8 },
  }[size];

  const bevelOffset = pressed ? 1 : sizeStyles.bevelHeight;

  return (
    <View
      style={[
        styles.wrapper,
        fullWidth && styles.fullWidth,
        style,
        disabled && styles.disabled,
      ]}
    >
      {/* 3D Bottom Bevel / Shadow */}
      <View
        style={[
          styles.bevelBottom,
          {
            backgroundColor: theme.shadow,
            height: sizeStyles.height,
            borderRadius: NRTheme.radius.md,
            marginTop: sizeStyles.bevelHeight,
          },
        ]}
      />

      {/* Button Face */}
      <Pressable
        onPressIn={() => !disabled && setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.face,
          {
            backgroundColor: theme.face,
            height: sizeStyles.height,
            borderRadius: NRTheme.radius.md,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            transform: [{ translateY: pressed ? bevelOffset : 0 }],
            borderBottomColor: theme.bevel,
            borderBottomWidth: pressed ? 1 : 3,
          },
        ]}
      >
        {/* Specular Highlight along top */}
        <View
          style={[
            styles.specularHighlight,
            {
              backgroundColor: theme.highlight,
              borderRadius: NRTheme.radius.sm,
            },
          ]}
        />

        <View style={styles.contentRow}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text
            style={[
              styles.text,
              {
                color: theme.text,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  bevelBottom: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  face: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 1.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
    borderRightWidth: 1,
  },
  specularHighlight: {
    position: 'absolute',
    top: 3,
    left: 8,
    right: 8,
    height: 8,
    opacity: 0.65,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
