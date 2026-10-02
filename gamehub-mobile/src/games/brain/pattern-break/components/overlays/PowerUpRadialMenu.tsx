import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { GameButton } from '../buttons/GameButton';
import { PowerUpType } from '../../types';
import { PBColors, PBRadius, PBShadows, uiAssets } from '../../theme';

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
          <View style={styles.titleHolder}>
            <Text style={styles.modalTitle}>TACTICAL GADGETS</Text>
            <Text style={styles.modalSubtitle}>DEPLOY ONE POWER-UP TO BREAK THE ANOMALY</Text>
          </View>

          <View style={styles.powerUpsRow}>
            {/* REVEAL */}
            <Pressable
              disabled={charges.reveal <= 0}
              onPress={() => handleAction('reveal')}
              style={[styles.itemBox, charges.reveal <= 0 && styles.disabledBox]}
            >
              <View style={styles.gadgetBtnHolder}>
                <Image
                  source={uiAssets.gameplay.reveal}
                  style={styles.gadgetBtnImg}
                  resizeMode="contain"
                />
              </View>
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
              <View style={styles.gadgetBtnHolder}>
                <Image
                  source={uiAssets.gameplay.freeze}
                  style={styles.gadgetBtnImg}
                  resizeMode="contain"
                />
              </View>
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
              <View style={styles.gadgetBtnHolder}>
                <Image
                  source={uiAssets.gameplay.scan}
                  style={styles.gadgetBtnImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.desc}>Decodes active rule</Text>
              <View style={[styles.chargeBadge, { backgroundColor: 'rgba(56, 229, 140, 0.25)' }]}>
                <Text style={[styles.chargeText, { color: PBColors.positive }]}>×{charges.scan}</Text>
              </View>
            </Pressable>
          </View>

          {/* Close Action */}
          <View style={styles.closeWrapper}>
            <GameButton
              asset={uiAssets.actions.cancel}
              height={48}
              width={160}
              onPress={onClose}
              accessibilityLabel="Close Gadget Menu"
            />
          </View>
        </LinearGradient>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 16, 24, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 20,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuBody: {
    width: '100%',
    padding: 20,
    borderRadius: PBRadius.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 213, 74, 0.4)',
    ...PBShadows.cardElevation,
    gap: 16,
  },
  titleHolder: {
    alignItems: 'center',
    gap: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  modalSubtitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: PBColors.textSecondary,
    letterSpacing: 0.8,
  },
  powerUpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  itemBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: PBRadius.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    minHeight: 110,
    justifyContent: 'space-between',
  },
  disabledBox: {
    opacity: 0.35,
  },
  gadgetBtnHolder: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gadgetBtnImg: {
    width: '100%',
    height: '100%',
  },
  desc: {
    fontSize: 9,
    fontWeight: '600',
    color: PBColors.textMuted,
    textAlign: 'center',
    marginVertical: 4,
  },
  chargeBadge: {
    backgroundColor: 'rgba(255, 213, 74, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: PBRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 74, 0.5)',
  },
  chargeText: {
    fontSize: 10,
    fontWeight: '900',
    color: PBColors.accent,
  },
  closeWrapper: {
    marginTop: 4,
    alignItems: 'center',
  },
});
