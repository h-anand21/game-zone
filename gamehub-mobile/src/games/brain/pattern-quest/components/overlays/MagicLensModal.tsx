// ============================================================
// PATTERN QUEST — MagicLensModal Component
// Magical scanner tool: Reveal Rule, Remove One, Freeze Time
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Pressable } from 'react-native';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../../theme';
import { GameButton } from '../buttons/GameButton';
import { ScreenPlaque } from '../common/ScreenPlaque';

interface MagicLensModalProps {
  visible: boolean;
  chargesRemaining: number;
  onRevealRule: () => void;
  onRemoveOne: () => void;
  onFreezeTime: () => void;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MagicLensModal: React.FC<MagicLensModalProps> = ({
  visible,
  chargesRemaining,
  onRevealRule,
  onRemoveOne,
  onFreezeTime,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <ScreenPlaque screen="magic_lens" width={200} height={100} style={styles.plaque} />

          <Text style={[pqTypography.body, styles.infoText]}>
            Charges available: <Text style={{ color: pqColors.crystalCyan, fontWeight: '800' }}>{chargesRemaining}</Text>
          </Text>

          <View style={styles.actionList}>
            <GameButton
              label="🔍 REVEAL SECRET RULE"
              variant="secondary"
              onPress={() => {
                onRevealRule();
                onClose();
              }}
              height={48}
            />

            <GameButton
              label="❌ ELIMINATE 1 WRONG OPTION"
              variant="gold"
              onPress={() => {
                onRemoveOne();
                onClose();
              }}
              height={48}
            />

            <GameButton
              label="⏳ FREEZE TIME (+10 SECONDS)"
              variant="primary"
              onPress={() => {
                onFreezeTime();
                onClose();
              }}
              height={48}
            />

            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={[pqTypography.caption, { color: pqColors.textMuted }]}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 16, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  panel: {
    width: Math.min(SCREEN_WIDTH - 40, 340),
    backgroundColor: 'rgba(16, 24, 34, 0.96)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: pqColors.crystalCyan,
    padding: pqSpacing.lg,
    alignItems: 'center',
    shadowColor: pqColors.crystalCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  plaque: {
    marginBottom: pqSpacing.sm,
  },
  infoText: {
    marginBottom: pqSpacing.md,
    textAlign: 'center',
  },
  actionList: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    marginTop: 6,
    padding: 6,
  },
});
