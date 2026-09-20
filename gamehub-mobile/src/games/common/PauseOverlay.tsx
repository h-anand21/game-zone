// ============================================================
// GameHub — Common Pause Overlay Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  onResume,
  onRestart,
  onQuit,
}) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.card}>
        <Text style={styles.title}>⏸ Game Paused</Text>

        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
          onPress={onResume}
        >
          <Text style={styles.btnTextPrimary}>▶ Resume</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
          onPress={onRestart}
        >
          <Text style={styles.btnTextSecondary}>🔄 Restart</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnDanger, pressed && styles.pressed]}
          onPress={onQuit}
        >
          <Text style={styles.btnTextDanger}>🚪 Quit Game</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    width: '85%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  title: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xl,
  },
  btn: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceLight,
  },
  btnDanger: {
    backgroundColor: Colors.error + '20',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },
  btnTextSecondary: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  btnTextDanger: {
    color: Colors.error,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
