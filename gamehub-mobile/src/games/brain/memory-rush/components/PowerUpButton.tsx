// ============================================================
// MEMORY RUSH — Visually Secondary Power-up Trigger Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { MRColors } from '../constants/colors';
import type { PowerUpType } from '../types';

interface PowerUpButtonProps {
  type: PowerUpType;
  count: number;
  onPress: () => void;
  disabled?: boolean;
}

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({
  type,
  count,
  onPress,
  disabled = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'freeze':
        return '❄';
      case 'reveal':
        return '👁';
      case 'secondChance':
        return '🛡';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'freeze':
        return 'FREEZE';
      case 'reveal':
        return 'REVEAL';
      case 'secondChance':
        return 'SHIELD';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || count <= 0}
      style={({ pressed }) => [
        styles.button,
        count <= 0 && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.label}>{getLabel()}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 29, 36, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  disabled: {
    opacity: 0.4,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  icon: {
    fontSize: 13,
    color: MRColors.cyanBright,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.textPrimary,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.cyanBright,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});
