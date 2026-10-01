// ============================================================
// MEMORY RUSH — Compact Dark Translucent Pause Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MRColors } from '../constants/colors';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface PauseModalProps {
  visible: boolean;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  score,
  onResume,
  onRestart,
  onExit,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onResume}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>GAME PAUSED</Text>
          <Text style={styles.scoreText}>CURRENT SCORE: {score.toLocaleString()}</Text>

          <View style={styles.btnStack}>
            <PrimaryButton title="RESUME ▶" onPress={onResume} size="md" />
            <SecondaryButton title="RESTART ⟲" onPress={onRestart} size="md" />
            <SecondaryButton title="EXIT TO HUB 🚪" onPress={onExit} size="md" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 10, 13, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 999,
  },
  panel: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(17, 22, 28, 0.95)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: MRColors.borderGlass,
    padding: 24,
    alignItems: 'center',
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: MRColors.cyanBright,
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  btnStack: {
    width: '100%',
    gap: 10,
  },
});
