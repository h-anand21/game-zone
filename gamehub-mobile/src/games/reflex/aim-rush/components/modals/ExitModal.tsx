// ============================================================
// AIM RUSH — Exit Confirmation Modal
// Clean vector confirmation modal before leaving the game
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ARColors } from '../../theme/colors';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Ionicons name="warning-outline" size={36} color={ARColors.red} style={{ marginBottom: 10 }} />
          <Text style={styles.title}>EXIT ARENA?</Text>
          <Text style={styles.message}>
            Current chain and run progress will be abandoned. Return to GameHub?
          </Text>

          <View style={styles.rowButtons}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.exitBtn]} onPress={onConfirm}>
              <Text style={styles.exitText}>CONFIRM EXIT</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: ARColors.overlayBackdrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: ARColors.surfacePanel,
    borderWidth: 2,
    borderColor: ARColors.red,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    shadowColor: ARColors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
    color: ARColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.5,
    borderColor: ARColors.border,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 1,
  },
  exitBtn: {
    backgroundColor: ARColors.red,
  },
  exitText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
