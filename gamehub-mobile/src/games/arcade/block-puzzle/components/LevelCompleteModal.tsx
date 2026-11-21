// ============================================================
// Block Blast — Level Complete Celebratory Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  // Star calculation based on performance
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
          colors={['#102A4C', '#071324']}
          style={styles.modalCard}
        >
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>⭐ LEVEL {level} CLEARED! ⭐</Text>
          </View>

          <Text style={styles.levelTitle}>{levelName}</Text>

          {/* Stars Display */}
          <View style={styles.starsRow}>
            <Text style={[styles.star, stars >= 1 ? styles.starFilled : styles.starDim]}>⭐</Text>
            <Text style={[styles.star, styles.starCenter, stars >= 2 ? styles.starFilled : styles.starDim]}>⭐</Text>
            <Text style={[styles.star, stars >= 3 ? styles.starFilled : styles.starDim]}>⭐</Text>
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
              <Text style={styles.statNumber}>🔥 x{bestCombo}</Text>
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
                  colors={['#00E5FF', '#0091EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>NEXT LEVEL ➔</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <View style={styles.allCompleteBadge}>
                <Text style={styles.allCompleteText}>🏆 ALL 15 LEVELS CONQUERED! 🏆</Text>
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
                <Text style={styles.secondaryBtnText}>🔄 REPLAY</Text>
              </Pressable>

              <Pressable
                onPress={onLevelSelect}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.secondaryBtnText}>📋 LEVELS</Text>
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
    backgroundColor: 'rgba(2, 6, 14, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00E5FF',
    padding: 22,
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  badgeRow: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1.5,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  star: {
    fontSize: 28,
  },
  starCenter: {
    fontSize: 36,
    marginBottom: 4,
  },
  starFilled: {
    opacity: 1,
  },
  starDim: {
    opacity: 0.25,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    paddingVertical: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#030D1A',
    letterSpacing: 1,
  },
  allCompleteBadge: {
    backgroundColor: 'rgba(255, 214, 0, 0.15)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD600',
  },
  allCompleteText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFD600',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.8,
  },
  exitButton: {
    width: '100%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
});
