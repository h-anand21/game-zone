// ============================================================
// Block Puzzle — Carved Wooden Game Over Modal Dialog
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_PALETTE } from './woodTheme';
import { CrownScoreIcon, LevelsGridIcon, ReplayWoodIcon } from './WoodBlockIcons';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  isNewRecord: boolean;
  bestCombo: number;
  linesCleared: number;
  level?: number;
  levelTarget?: number;
  onRestart: () => void;
  onLevelSelect?: () => void;
  onExit?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  highScore,
  isNewRecord,
  bestCombo,
  linesCleared,
  level,
  levelTarget,
  onRestart,
  onLevelSelect,
  onExit,
}) => {
  const isLevelMode = typeof level === 'number';

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
          {/* Header */}
          <Text style={styles.titleText}>
            {isLevelMode ? `LEVEL ${level} FAILED` : 'NO MORE MOVES'}
          </Text>
          <Text style={styles.subText}>
            {isLevelMode
              ? `Cleared ${linesCleared} of ${levelTarget || 0} target lines`
              : 'The wooden tray is out of space'}
          </Text>

          {/* New Record Badge */}
          {isNewRecord && (
            <View style={styles.recordBadge}>
              <CrownScoreIcon size={15} />
              <Text style={styles.recordBadgeText}>NEW HIGH SCORE</Text>
            </View>
          )}

          {/* Main Score Showcase */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={styles.statNumber}>{highScore.toLocaleString()}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MAX COMBO</Text>
              <Text style={styles.statNumber}>x{bestCombo}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>LINES</Text>
              <Text style={styles.statNumber}>{linesCleared}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.buttonCol}>
            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [
                styles.restartButton,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <LinearGradient
                colors={WOOD_PALETTE.goldCtaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.btnGradient}
              >
                <ReplayWoodIcon size={17} color={WOOD_PALETTE.goldCtaText} />
                <Text style={styles.restartBtnText}>
                  {isLevelMode ? 'RETRY LEVEL' : 'PLAY AGAIN'}
                </Text>
              </LinearGradient>
            </Pressable>

            {isLevelMode && onLevelSelect && (
              <Pressable
                onPress={onLevelSelect}
                style={({ pressed }) => [
                  styles.levelSelectBtn,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <LevelsGridIcon size={15} color={WOOD_PALETTE.textGold} />
                <Text style={styles.levelSelectBtnText}>CHOOSE LEVEL</Text>
              </Pressable>
            )}

            {onExit && (
              <Pressable
                onPress={onExit}
                style={({ pressed }) => [
                  styles.exitButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.exitBtnText}>Exit Game</Text>
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
    maxWidth: 344,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: WOOD_PALETTE.modalBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: WOOD_PALETTE.dangerText,
    letterSpacing: 1.4,
  },
  subText: {
    fontSize: 12,
    color: WOOD_PALETTE.textCream,
    marginTop: 4,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderColor: WOOD_PALETTE.comboBorderGlow,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 12,
  },
  recordBadgeText: {
    color: WOOD_PALETTE.textGold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scoreContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: WOOD_PALETTE.textMuted,
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: '900',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 1,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 224, 163, 0.18)',
  },
  statLabel: {
    fontSize: 9,
    color: WOOD_PALETTE.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
    marginTop: 3,
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  restartButton: {
    width: '100%',
    height: 52,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_PALETTE.goldCtaBorder,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: WOOD_PALETTE.goldCtaText,
    letterSpacing: 1,
  },
  levelSelectBtn: {
    paddingVertical: 11,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelSelectBtnText: {
    color: WOOD_PALETTE.textGold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  exitButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  exitBtnText: {
    color: WOOD_PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});
