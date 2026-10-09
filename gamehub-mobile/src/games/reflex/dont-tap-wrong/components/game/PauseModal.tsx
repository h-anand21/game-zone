// ============================================================
// DON'T TAP WRONG — Pause Modal Overlay
// Freezes time and provides resume, restart, and exit options
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { ArcadeButton } from '../common/ArcadeButton';
import { DtwColors } from '../../theme/colors';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
  onExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>PAUSED</Text>
          <Text style={styles.subtitle}>MISSION ON HOLD</Text>

          <View style={styles.buttonList}>
            <ArcadeButton
              title="RESUME GAME"
              variant="green"
              size="large"
              onPress={onResume}
              style={styles.btn}
            />

            <ArcadeButton
              title="RESTART RUN"
              variant="cyan"
              onPress={onRestart}
              style={styles.btn}
            />

            <ArcadeButton
              title="EXIT TO HOME"
              variant="glass"
              onPress={onExit}
              style={styles.btn}
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
    backgroundColor: 'rgba(5, 7, 10, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(21, 28, 37, 0.95)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(66, 217, 255, 0.4)',
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: DtwColors.cyanAccent,
    letterSpacing: 2,
    marginBottom: 24,
    marginTop: 4,
  },
  buttonList: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});

export default PauseModal;
