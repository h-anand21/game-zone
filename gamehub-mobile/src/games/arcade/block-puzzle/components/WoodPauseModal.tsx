// ============================================================
// Block Puzzle — Carved Wooden Pause & Settings Dialog
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_PALETTE } from './woodTheme';
import {
  GearSettingsIcon,
  PlayTriangleIcon,
  ReplayWoodIcon,
  LevelsGridIcon,
  BackArrowIcon,
} from './WoodBlockIcons';

interface WoodPauseModalProps {
  visible: boolean;
  level: number;
  levelName: string;
  onResume: () => void;
  onRestart: () => void;
  onLevels: () => void;
  onQuit: () => void;
}

export const WoodPauseModal: React.FC<WoodPauseModalProps> = ({
  visible,
  level,
  levelName,
  onResume,
  onRestart,
  onLevels,
  onQuit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={WOOD_PALETTE.modalCardGradient} style={styles.card}>
          <View style={styles.headerBadge}>
            <GearSettingsIcon size={20} color="#FCD34D" />
            <Text style={styles.headerTitle}>PAUSED</Text>
          </View>

          <Text style={styles.levelSub}>
            Level {level} • {levelName}
          </Text>

          <View style={styles.buttonCol}>
            <Pressable
              onPress={onResume}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={WOOD_PALETTE.goldCtaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.primaryBtnInner}
              >
                <PlayTriangleIcon size={16} color={WOOD_PALETTE.goldCtaText} />
                <Text style={styles.primaryBtnText}>RESUME</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <ReplayWoodIcon size={16} color={WOOD_PALETTE.textLight} />
              <Text style={styles.secondaryBtnText}>RESTART LEVEL</Text>
            </Pressable>

            <Pressable
              onPress={onLevels}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <LevelsGridIcon size={16} color={WOOD_PALETTE.textCream} />
              <Text style={styles.secondaryBtnText}>CHOOSE LEVEL</Text>
            </Pressable>

            <Pressable
              onPress={onQuit}
              style={({ pressed }) => [styles.quitBtn, pressed && styles.pressed]}
            >
              <BackArrowIcon size={15} color={WOOD_PALETTE.textMuted} />
              <Text style={styles.quitBtnText}>Exit to Menu</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: WOOD_PALETTE.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 330,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: WOOD_PALETTE.modalBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 1.4,
  },
  levelSub: {
    fontSize: 13,
    fontWeight: '700',
    color: WOOD_PALETTE.textCream,
    marginBottom: 20,
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_PALETTE.goldCtaBorder,
  },
  primaryBtnInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_PALETTE.goldCtaText,
    letterSpacing: 1,
  },
  secondaryBtn: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 0.8,
  },
  quitBtn: {
    marginTop: 4,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: WOOD_PALETTE.textMuted,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
});
