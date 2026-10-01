// ============================================================
// MEMORY RUSH — 3D Carved Stone Power-up Pedestal
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, View, Image } from 'react-native';
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

const POWERUP_ICONS: Record<PowerUpType, any> = {
  freeze: require('../../../../../assets/game/powerups/powerup_freeze.png'),
  reveal: require('../../../../../assets/game/powerups/powerup_reveal.png'),
  secondChance: require('../../../../../assets/game/powerups/powerup_second_chance.png'),
};

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({
  type,
  count,
  onPress,
  disabled = false,
}) => {
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
    onPress();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || count <= 0}
      style={({ pressed }) => [
        styles.outerContainer,
        count <= 0 && styles.disabled,
        {
          transform: [
            { scale: pressed ? 0.93 : 1.0 },
            ...(pressed ? [{ translateY: 2 }] : []),
          ],
        },
      ]}
      accessibilityLabel={`${getLabel()} power-up`}
      accessibilityRole="button"
    >
      <Image
        source={POWERUP_ICONS[type]}
        style={styles.buttonImage}
        resizeMode="contain"
      />
      {/* Live Count Badge on Top Right */}
      <View style={[styles.badgePill, count <= 0 && styles.badgePillEmpty]}>
        <Text style={[styles.badgeText, count <= 0 && styles.badgeTextEmpty]}>
          {count > 0 ? `×${count}` : '0'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    width: 104,
    height: 58,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  badgePill: {
    position: 'absolute',
    top: -3,
    right: 2,
    backgroundColor: '#B91C1C',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  badgePillEmpty: {
    backgroundColor: '#334155',
    borderColor: '#64748B',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFBEB',
    letterSpacing: 0.5,
  },
  badgeTextEmpty: {
    color: '#94A3B8',
  },
});
