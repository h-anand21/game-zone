// ============================================================
// REACTION FIRE — Pause Modal Overlay
// Suspends clock and prevents accidental touches during pause
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { ArcadeButton } from './ArcadeButton';
import { RfColors } from '../theme';

interface PauseOverlayProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  visible,
  onResume,
  onRestart,
  onExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>GAME PAUSED</Text>
          <Text style={styles.subtitle}>ARENA STANDBY</Text>

          <View style={styles.buttonList}>
            <ArcadeButton
              title="RESUME"
              variant="lime"
              size="large"
              onPress={onResume}
              style={styles.btn}
            />

            <ArcadeButton
              title="RESTART ROUND"
              variant="cyan"
              onPress={onRestart}
              style={styles.btn}
            />

            <ArcadeButton
              title="EXIT TO MENU"
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
    backgroundColor: 'rgba(5, 9, 20, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(10, 23, 41, 0.96)',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(83, 225, 255, 0.35)',
    shadowColor: RfColors.secondaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: RfColors.textPrimary,
    letterSpacing: 2.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.secondaryCyan,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 24,
  },
  buttonList: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});

export default PauseOverlay;
