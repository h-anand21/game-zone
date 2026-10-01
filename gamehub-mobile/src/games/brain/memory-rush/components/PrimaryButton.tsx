// ============================================================
// MEMORY RUSH — Dominant Cyan-Glow Primary CTA Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  size = 'lg',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const height = size === 'sm' ? 42 : size === 'md' ? 50 : 58;
  const fontSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        { height, opacity: disabled ? 0.5 : 1 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={['#1F3A4B', '#112230', '#0B1722']}
        style={[styles.gradient, { height }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.topSpecular} />
        <View style={styles.contentRow}>
          <Text style={[styles.title, { fontSize }, textStyle]}>{title}</Text>
          {icon && <View style={styles.iconBox}>{icon}</View>}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: MRColors.primaryCyan,
    overflow: 'hidden',
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  topSpecular: {
    position: 'absolute',
    top: 2,
    left: '10%',
    right: '10%',
    height: 1.5,
    backgroundColor: 'rgba(103, 232, 249, 0.6)',
    borderRadius: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  iconBox: {
    marginLeft: 4,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});
