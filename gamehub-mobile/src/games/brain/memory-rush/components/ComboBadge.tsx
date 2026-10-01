// ============================================================
// MEMORY RUSH — 3D Carved Flame Multiplier Combo Badge
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ComboBadgeProps {
  combo: number;
}

export const ComboBadge: React.FC<ComboBadgeProps> = ({ combo }) => {
  if (combo <= 1) return null;

  return (
    <View style={styles.badgeWrapper}>
      <LinearGradient
        colors={['#FFA000', '#FF6F00', '#D84315']}
        style={styles.badgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.comboText}>🔥 COMBO ×{combo}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeWrapper: {
    borderRadius: 14,
    backgroundColor: '#3E1800',
    paddingBottom: 3,
    shadowColor: '#FF8F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comboText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
