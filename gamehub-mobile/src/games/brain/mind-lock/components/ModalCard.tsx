// ============================================================
// Mind Lock — Modal Card Component (Popup / Dialog Container)
// ============================================================

import React from 'react';
import { View, StyleSheet, Modal, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLRadius, MLShadows, MLSpacing } from '../theme';

interface ModalCardProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ModalCard: React.FC<ModalCardProps> = ({
  visible,
  onClose,
  children,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <LinearGradient
          colors={['#182B42', '#0D1927']}
          style={[styles.modalCard, style]}
        >
          {/* Top highlight */}
          <View style={styles.topBevel} />
          {children}
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 12, 20, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MLSpacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: MLRadius.xxl,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 244, 222, 0.15)',
    padding: MLSpacing.xl,
    alignItems: 'center',
    ...MLShadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});
