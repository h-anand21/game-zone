// ============================================================
// MEMORY RUSH — 3D Carved Stone Power-up Pedestal
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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
        return '❄️';
      case 'reveal':
        return '👁️';
      case 'secondChance':
        return '🛡️';
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

  const handlePress = () => {
    if (disabled || count <= 0) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || count <= 0}
      style={({ pressed }) => [
        styles.outerContainer,
        count <= 0 && styles.disabled,
        pressed && styles.pressed,
      ]}
      accessibilityLabel={`${getLabel()} power-up`}
    >
      <View style={styles.bottomExtrusion} />
      <LinearGradient
        colors={['#4E5E6E', '#2D3844', '#1F2730']}
        style={styles.pedestalFace}
      >
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.label}>{getLabel()}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    marginHorizontal: 2,
  },
  bottomExtrusion: {
    position: 'absolute',
    bottom: -3,
    left: 2,
    right: 2,
    height: 6,
    backgroundColor: '#12181F',
    borderRadius: 12,
  },
  pedestalFace: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#718496',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 0.8,
  },
  badge: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#3B1E00',
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
});
