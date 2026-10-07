// ============================================================
// AIM RUSH — Pause Modal Component
// Sci-Fi Instrument Panel with Resume, Restart, Settings, and Exit
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ARColors } from '../../theme/colors';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
  onSettings,
  onExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Ionicons name="pause-circle" size={26} color={ARColors.cyan} />
            <Text style={styles.title}>SESSION PAUSED</Text>
          </View>
          <Text style={styles.subtitle}>TACTICAL HOLD • ENGINES IDLE</Text>

          {/* Action Buttons */}
          <View style={styles.buttonList}>
            {/* Resume Button */}
            <Pressable
              style={[styles.btn, styles.resumeBtn]}
              onPress={onResume}
              accessibilityRole="button"
              accessibilityLabel="Resume Game"
            >
              <Ionicons name="play" size={18} color="#07090C" />
              <Text style={styles.resumeBtnText}>RESUME</Text>
            </Pressable>

            {/* Restart Button */}
            <Pressable
              style={styles.btn}
              onPress={onRestart}
              accessibilityRole="button"
              accessibilityLabel="Restart Game"
            >
              <Ionicons name="refresh" size={18} color={ARColors.white} />
              <Text style={styles.btnText}>RESTART RUN</Text>
            </Pressable>

            {/* Settings Button */}
            <Pressable
              style={styles.btn}
              onPress={onSettings}
              accessibilityRole="button"
              accessibilityLabel="Game Settings"
            >
              <Ionicons name="settings-sharp" size={18} color={ARColors.white} />
              <Text style={styles.btnText}>SETTINGS</Text>
            </Pressable>

            {/* Exit to Hub Button */}
            <Pressable
              style={[styles.btn, styles.exitBtn]}
              onPress={onExit}
              accessibilityRole="button"
              accessibilityLabel="Exit to Hub"
            >
              <Ionicons name="exit-outline" size={18} color={ARColors.red} />
              <Text style={[styles.btnText, { color: ARColors.red }]}>EXIT TO HUB</Text>
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
    maxWidth: 340,
    backgroundColor: ARColors.surfacePanel,
    borderWidth: 2,
    borderColor: ARColors.cyan,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resumeBtn: {
    backgroundColor: ARColors.cyan,
    borderColor: ARColors.cyan,
  },
  resumeBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.5,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 1,
  },
  exitBtn: {
    borderColor: 'rgba(255, 77, 97, 0.4)',
    backgroundColor: ARColors.redSoft,
  },
});
