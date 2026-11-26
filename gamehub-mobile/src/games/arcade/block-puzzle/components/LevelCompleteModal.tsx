// ============================================================
// Block Puzzle — Carved Wooden Level Complete Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_PALETTE } from './woodTheme';
import {
  StarGoldIcon,
  TrophyWoodIcon,
  ComboSparkleIcon,
  ReplayWoodIcon,
  LevelsGridIcon,
} from './WoodBlockIcons';

interface LevelCompleteModalProps {
  visible: boolean;
  level: number;
  levelName: string;
  score: number;
  bestCombo: number;
  linesCleared: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
  onExit?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  level,
  levelName,
  score,
  bestCombo,
  linesCleared,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
  onExit,
}) => {
  const stars = bestCombo >= 4 ? 3 : bestCombo >= 2 ? 2 : 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={WOOD_PALETTE.modalCardGradient}
          style={styles.modalCard}
        >
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <TrophyWoodIcon size={15} />
            <Text style={styles.badgeText}>LEVEL {level} CLEARED</Text>
          </View>

          <Text style={styles.levelTitle}>{levelName}</Text>

          {/* 3-Star Carved Trophy Row */}
          <View style={styles.starsRow}>
            <StarGoldIcon size={32} filled={stars >= 1} />
            <View style={styles.centerStarOffset}>
              <StarGoldIcon size={40} filled={stars >= 2} />
            </View>
            <StarGoldIcon size={32} filled={stars >= 3} />
          </View>

          {/* Score Box */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>LEVEL SCORE</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>LINES CLEARED</Text>
              <Text style={styles.statNumber}>{linesCleared}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MAX COMBO</Text>
              <View style={styles.comboValueRow}>
                <ComboSparkleIcon size={14} />
                <Text style={styles.statNumber}>x{bestCombo}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonCol}>
            {hasNextLevel ? (
              <Pressable
                onPress={onNextLevel}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={WOOD_PALETTE.goldCtaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>NEXT LEVEL</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <View style={styles.allCompleteBadge}>
                <TrophyWoodIcon size={16} />
                <Text style={styles.allCompleteText}>ALL 15 LEVELS CONQUERED</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <Pressable
                onPress={onReplay}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <ReplayWoodIcon size={15} color={WOOD_PALETTE.textLight} />
                <Text style={styles.secondaryBtnText}>REPLAY</Text>
              </Pressable>

              <Pressable
                onPress={onLevelSelect}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <LevelsGridIcon size={15} color={WOOD_PALETTE.textCream} />
                <Text style={styles.secondaryBtnText}>LEVELS</Text>
              </Pressable>
            </View>

            {onExit && (
              <Pressable
                onPress={onExit}
                style={({ pressed }) => [
                  styles.exitButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.exitBtnText}>EXIT TO MENU</Text>
              </Pressable>
            )}
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
  modalCard: {
    width: '100%',
    maxWidth: 356,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: WOOD_PALETTE.modalBorder,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.comboBorderGlow,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 1.3,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  centerStarOffset: {
    marginBottom: 6,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: WOOD_PALETTE.textMuted,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    width: '100%',
    paddingVertical: 10,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 224, 163, 0.18)',
    alignSelf: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: WOOD_PALETTE.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  comboValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: WOOD_PALETTE.textLight,
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_PALETTE.goldCtaBorder,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_PALETTE.goldCtaText,
    letterSpacing: 1,
  },
  allCompleteBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.comboBorderGlow,
  },
  allCompleteText: {
    fontSize: 12,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 0.9,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 0.8,
  },
  exitButton: {
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: WOOD_PALETTE.textMuted,
    letterSpacing: 0.5,
  },
});
