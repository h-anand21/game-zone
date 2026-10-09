// ============================================================
// DON'T TAP WRONG — Exit Confirmation Modal
// Confirmation dialog before abandoning an active run
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { ArcadeButton } from '../common/ArcadeButton';
import { DtwColors } from '../../theme/colors';

interface ExitConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirmExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>LEAVE RUN?</Text>
          <Text style={styles.message}>
            Your current run will end. Your progress for this run will not be saved.
          </Text>

          <View style={styles.actionRow}>
            <ArcadeButton
              title="CANCEL"
              variant="glass"
              onPress={onCancel}
              style={styles.halfBtn}
            />

            <ArcadeButton
              title="EXIT"
              variant="red"
              onPress={onConfirmExit}
              style={styles.halfBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(21, 28, 37, 0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 82, 93, 0.4)',
    shadowColor: DtwColors.dangerRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 2,
  },
  message: {
    fontSize: 13,
    color: DtwColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  },
});

export default ExitConfirmModal;
