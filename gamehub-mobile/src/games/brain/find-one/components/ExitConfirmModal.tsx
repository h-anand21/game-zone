// ============================================================
// Find One — Exit Confirmation Modal
// ============================================================

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FORadius, FOSpacing } from '../theme';
import { GameButton } from './GameButton';
import { PandaIllustration } from './CharacterIllustration';

interface ExitConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.modalCardWrapper}>
          <LinearGradient
            colors={['#142E4C', '#0B1C30', '#061322']}
            style={styles.modalCard}
          >
            {/* Mascot header */}
            <View style={styles.mascotHolder}>
              <PandaIllustration mood="home" size={100} />
            </View>

            <Text style={styles.modalTitle}>EXIT GAME?</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to leave Find One and return to the GameHub main menu?
            </Text>

            <View style={styles.statsNotice}>
              <Text style={styles.noticeIcon}>💾</Text>
              <Text style={styles.noticeText}>
                Your best score, coins, and match history are saved safely.
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <GameButton
                title="KEEP PLAYING"
                variant="green"
                size="md"
                onPress={onCancel}
              />

              <GameButton
                title="EXIT TO GAMEHUB"
                variant="red"
                size="sm"
                onPress={onConfirm}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    padding: FOSpacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
  },
  mascotHolder: {
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13,
    color: '#A8C5DE',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  statsNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1E33',
    borderRadius: FORadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#174066',
    gap: 8,
    marginBottom: 18,
    width: '100%',
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    fontSize: 11,
    color: '#7EA2C4',
    flex: 1,
    lineHeight: 15,
  },
  btnRow: {
    width: '100%',
    gap: 10,
  },
});
