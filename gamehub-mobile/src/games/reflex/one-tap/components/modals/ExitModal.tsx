// ============================================================
// ONE TAP: PRECISION GAME — ExitModal Component
// Custom confirmation modal when exiting active run
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { OTColors } from '../../theme/colors';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  visible,
  onCancel,
  onConfirmExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>LEAVE RUN?</Text>
          <Text style={styles.message}>
            Your active run progress and combo streak will be abandoned.
          </Text>

          <View style={styles.btnRow}>
            {/* Cancel (Safe) */}
            <Pressable
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
              onPress={onCancel}
            >
              <Text style={styles.cancelBtnText}>STAY</Text>
            </Pressable>

            {/* Exit (Danger) */}
            <Pressable
              style={({ pressed }) => [styles.exitBtn, pressed && styles.btnPressed]}
              onPress={onConfirmExit}
            >
              <Text style={styles.exitBtnText}>LEAVE</Text>
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
    backgroundColor: 'rgba(5, 7, 10, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(16, 21, 28, 0.95)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 97, 0.5)',
    padding: 22,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  message: {
    fontSize: 12,
    color: OTColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: OTColors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  exitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnPressed: {
    opacity: 0.8,
  },
});
