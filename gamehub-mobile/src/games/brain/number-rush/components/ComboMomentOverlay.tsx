// ============================================================
// Number Rush — Combo Milestone Celebration Moment Overlay
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NRTheme } from '../theme';

interface ComboMomentOverlayProps {
  comboValue: number;
}

export const ComboMomentOverlay: React.FC<ComboMomentOverlayProps> = ({
  comboValue,
}) => {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.glowBox}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.comboNumber}>x{comboValue}</Text>
        <Text style={styles.titleText}>UNSTOPPABLE RUSH!</Text>
        <Text style={styles.subText}>Streak Bonus Activated!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  glowBox: {
    alignItems: 'center',
    backgroundColor: '#1E1205',
    borderWidth: 3.5,
    borderColor: '#FFC107',
    borderRadius: NRTheme.radius.xl,
    paddingHorizontal: 36,
    paddingVertical: 24,
    ...NRTheme.shadows.glowGold,
  },
  flame: {
    fontSize: 48,
    marginBottom: 4,
  },
  comboNumber: {
    color: '#FFD700',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  subText: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});
