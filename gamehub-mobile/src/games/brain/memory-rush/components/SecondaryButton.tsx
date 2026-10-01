// ============================================================
// MEMORY RUSH — Dark Charcoal Glass Secondary Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { MRColors } from '../constants/colors';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  size = 'md',
  style,
  textStyle,
}) => {
  const height = size === 'sm' ? 40 : size === 'md' ? 48 : 54;
  const fontSize = size === 'sm' ? 13 : size === 'md' ? 15 : 17;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { height },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.title, { fontSize }, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(23, 29, 36, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: '800',
    color: MRColors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pressed: {
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    borderColor: MRColors.primaryCyan,
    transform: [{ scale: 0.97 }],
  },
});
