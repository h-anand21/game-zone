// ============================================================
// PATTERN BREAKER — PowerUpRadialMenu Component
// Radial tech gadget menu emerging from CLUE button with live charges
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PowerUpType } from '../../types';
import { PBColors, PBRadius, PBShadows } from '../../theme';

interface PowerUpRadialMenuProps {
  isOpen: boolean;
  charges: { reveal: number; freeze: number; scan: number };
  onSelect: (type: PowerUpType) => void;
  onClose: () => void;
}

export const PowerUpRadialMenu: React.FC<PowerUpRadialMenuProps> = ({
  isOpen,
  charges,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleAction = (type: PowerUpType) => {
    if (charges[type] <= 0) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    onSelect(type);
    onClose();
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
        <LinearGradient
          colors={['rgba(24, 47, 57, 0.98)', 'rgba(10, 23, 30, 0.98)']}
          style={styles.menuBody}
        >
          <Text style={styles.menuTitle}>OBSERVATORY GADGETS</Text>

          <View style={styles.powerUpsRow}>
            {/* REVEAL */}
            <Pressable
              disabled={charges.reveal <= 0}
              onPress={() => handleAction('reveal')}
              style={[styles.itemBox, charges.reveal <= 0 && styles.disabledBox]}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.emoji}>👁️</Text>
              </View>
              <Text style={styles.itemTitle}>REVEAL</Text>
              <Text style={styles.desc}>Eliminates 2 safe tiles</Text>
              <View style={styles.chargeBadge}>
                <Text style={styles.chargeText}>×{charges.reveal}</Text>
              </View>
            </Pressable>

            {/* FREEZE */}
            <Pressable
              disabled={charges.freeze <= 0}
              onPress={() => handleAction('freeze')}
              style={[styles.itemBox, charges.freeze <= 0 && styles.disabledBox]}
            >
              <View style={[styles.iconCircle, { borderColor: PBColors.primary }]}>
                <Text style={styles.emoji}>❄️</Text>
              </View>
              <Text style={styles.itemTitle}>FREEZE</Text>
              <Text style={styles.desc}>Halts timer for 4s</Text>
              <View style={[styles.chargeBadge, { backgroundColor: 'rgba(25, 211, 255, 0.25)' }]}>
                <Text style={[styles.chargeText, { color: PBColors.primary }]}>×{charges.freeze}</Text>
              </View>
            </Pressable>

            {/* SCAN */}
            <Pressable
              disabled={charges.scan <= 0}
              onPress={() => handleAction('scan')}
              style={[styles.itemBox, charges.scan <= 0 && styles.disabledBox]}
            >
              <View style={[styles.iconCircle, { borderColor: PBColors.positive }]}>
                <Text style={styles.emoji}>📡</Text>
              </View>
              <Text style={styles.itemTitle}>SCAN</Text>
              <Text style={styles.desc}>Decodes active rule</Text>
              <View style={[styles.chargeBadge, { backgroundColor: 'rgba(56, 229, 140, 0.25)' }]}>
                <Text style={[styles.chargeText, { color: PBColors.positive }]}>×{charges.scan}</Text>
              </View>
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 16, 24, 0.75)',
    justifyContent: 'flex-end',
    paddingBottom: 90,
    paddingHorizontal: 16,
    zIndex: 900,
  },
  menuContainer: {
    width: '100%',
  },
  menuBody: {
    borderRadius: PBRadius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.35)',
    alignItems: 'center',
    ...PBShadows.cardElevation,
  },
  menuTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  powerUpsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  itemBox: {
    flex: 1,
    backgroundColor: 'rgba(16, 35, 44, 0.85)',
    borderRadius: PBRadius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledBox: {
    opacity: 0.35,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: PBColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.textPrimary,
    letterSpacing: 0.8,
  },
  desc: {
    fontSize: 8.5,
    color: PBColors.textMuted,
    textAlign: 'center',
    marginVertical: 4,
    minHeight: 22,
  },
  chargeBadge: {
    backgroundColor: 'rgba(255, 213, 74, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chargeText: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
  },
});
