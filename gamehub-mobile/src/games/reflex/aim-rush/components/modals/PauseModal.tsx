// ============================================================
// AIM RUSH — Authentic Pause Modal Component
// Recreated from "AIMRUSH Neon Pause Menu.png" reference
// Chamfered hex-capsule buttons with cyan/red neon glow
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
        <View style={styles.cardFrame}>
          {/* Top Notch Ornament */}
          <View style={styles.topNotch}>
            <View style={styles.notchCircle} />
          </View>

          {/* Master Title */}
          <Text style={styles.title}>PAUSED</Text>
          <Text style={styles.subtitle}>TACTICAL HOLD • ENGINES IDLE</Text>

          {/* Action Buttons List */}
          <View style={styles.buttonsList}>
            {/* 1. Resume Button */}
            <Pressable style={[styles.btn, styles.resumeBtn]} onPress={onResume}>
              <Ionicons name="play" size={20} color="#07090C" />
              <Text style={styles.resumeBtnText}>RESUME</Text>
            </Pressable>

            {/* 2. Restart Button */}
            <Pressable style={styles.btn} onPress={onRestart}>
              <Ionicons name="refresh" size={20} color={ARColors.white} />
              <Text style={styles.btnText}>RESTART</Text>
            </Pressable>

            {/* 3. Settings Button */}
            <Pressable style={styles.btn} onPress={onSettings}>
              <Ionicons name="settings-sharp" size={19} color={ARColors.white} />
              <Text style={styles.btnText}>SETTINGS</Text>
            </Pressable>

            {/* 4. Exit to Hub Button */}
            <Pressable style={[styles.btn, styles.exitBtn]} onPress={onExit}>
              <Ionicons name="home" size={19} color={ARColors.red} />
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
    backgroundColor: 'rgba(5, 8, 12, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardFrame: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(10, 16, 26, 0.96)',
    borderWidth: 2,
    borderColor: ARColors.cyan,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
    position: 'relative',
  },
  topNotch: {
    width: 48,
    height: 8,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: ARColors.cyan,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  notchCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ARColors.cyan,
    marginTop: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: ARColors.cyan,
    fontStyle: 'italic',
    letterSpacing: 3,
    marginTop: 6,
    textShadowColor: ARColors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
    marginBottom: 20,
  },
  buttonsList: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  resumeBtn: {
    backgroundColor: ARColors.cyan,
    borderColor: ARColors.cyan,
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  resumeBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 1.5,
  },
  exitBtn: {
    borderColor: 'rgba(255, 77, 97, 0.5)',
    backgroundColor: ARColors.redSoft,
  },
});
