// ============================================================
// AIM RUSH — Authentic Exit Confirmation Modal
// Recreated from "Neon Cyberpunk Exit Confirmation.png" reference
// Warning emblem, dual-color title, and chamfered action pills
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
        <View style={styles.cardFrame}>
          {/* Top Notch Ornament */}
          <View style={styles.topNotch}>
            <View style={styles.notchCircle} />
          </View>

          {/* Glowing Red Warning Triangle */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={44} color={ARColors.red} />
          </View>

          {/* Dual-Color Title: EXIT in cyan, GAME? in red */}
          <View style={styles.titleRow}>
            <Text style={styles.titleExit}>EXIT </Text>
            <Text style={styles.titleGame}>GAME?</Text>
          </View>

          <Text style={styles.subtitle}>
            ARE YOU SURE YOU WANT TO LEAVE THIS GAME?
          </Text>

          {/* Action Buttons Row */}
          <View style={styles.actionsRow}>
            {/* Cancel Button */}
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
              <Ionicons name="close" size={18} color={ARColors.cyan} />
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>

            {/* Exit Button */}
            <Pressable style={[styles.btn, styles.exitBtn]} onPress={onConfirm}>
              <Ionicons name="exit-outline" size={18} color={ARColors.red} />
              <Text style={styles.exitText}>EXIT</Text>
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
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
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
  warningBox: {
    marginVertical: 10,
    shadowColor: ARColors.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleExit: {
    fontSize: 26,
    fontWeight: '900',
    color: ARColors.cyan,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  titleGame: {
    fontSize: 26,
    fontWeight: '900',
    color: ARColors.red,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtn: {
    borderColor: ARColors.cyan,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1.2,
  },
  exitBtn: {
    borderColor: ARColors.red,
    backgroundColor: ARColors.redSoft,
  },
  exitText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.red,
    letterSpacing: 1.2,
  },
});
