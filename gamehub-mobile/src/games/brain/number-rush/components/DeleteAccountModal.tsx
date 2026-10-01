// ============================================================
// Number Rush — Danger Delete Account Confirmation Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { NRTheme } from '../theme';
import { NRHaptics } from '../services/haptics';
import { WoodPanel, GameButton } from './';

interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmDelete: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onCancel,
  onConfirmDelete,
}) => {
  if (!visible) return null;

  const handleConfirm = () => {
    NRHaptics.heavy();
    onConfirmDelete();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <WoodPanel style={styles.panel} variant="wood">
          <View style={styles.warningCircle}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>

          <Text style={styles.title}>DELETE ACCOUNT?</Text>

          <Text style={styles.description}>
            Are you sure? This action is permanent and will completely erase all
            your game progress, high scores, coins, gems, and unlocked achievements.
          </Text>

          <View style={styles.btnRow}>
            <GameButton
              title="CANCEL"
              variant="wood"
              size="md"
              style={{ flex: 1 }}
              onPress={onCancel}
            />

            <GameButton
              title="DELETE"
              variant="red"
              size="md"
              style={{ flex: 1 }}
              onPress={handleConfirm}
            />
          </View>
        </WoodPanel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 340,
    padding: 22,
    alignItems: 'center',
  },
  warningCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 2,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 28,
  },
  title: {
    color: '#FF4757',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  description: {
    color: '#D8E2DD',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
