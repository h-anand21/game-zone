// ============================================================
// Block Blast — Game Over Modal Dialog
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
          colors={['#16233B', '#0A1220']}
          style={styles.modalCard}
        >
          {/* Header */}
          <Text style={styles.titleText}>
            {isLevelMode ? `LEVEL ${level} FAILED` : 'NO MORE MOVES!'}
          </Text>
          <Text style={styles.subText}>
            {isLevelMode
              ? `Cleared ${linesCleared} of ${levelTarget || 0} target lines`
              : 'The board is out of space'}
          </Text>

          {/* New Record Badge */}
          {isNewRecord && (
            <View style={styles.recordBadge}>
              <Text style={styles.recordBadgeText}>👑 NEW HIGH SCORE! 👑</Text>
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
                colors={['#FFE57F', '#FFD600', '#FF9100']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnGradient}
              >
                <Text style={styles.restartBtnText}>
                  {isLevelMode ? 'RETRY LEVEL' : 'PLAY AGAIN'}
                </Text>
              </LinearGradient>
            </Pressable>

            {isLevelMode && onLevelSelect && (
              <Pressable
                onPress={onLevelSelect}
                style={({ pressed }) => [
                  styles.exitButton,
                  { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.exitBtnText, { color: '#00E5FF' }]}>📋 CHOOSE LEVEL</Text>
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
    backgroundColor: 'rgba(3, 7, 14, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#243C60',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5252',
    letterSpacing: 1.5,
  },
  subText: {
    fontSize: 12,
    color: '#8CA0B8',
    marginTop: 4,
  },
  recordBadge: {
    backgroundColor: 'rgba(255, 214, 0, 0.15)',
    borderColor: '#FFD600',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 12,
  },
  recordBadgeText: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scoreContainer: {
    marginVertical: 18,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8CA0B8',
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(8, 15, 26, 0.6)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#182B46',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E3554',
  },
  statLabel: {
    fontSize: 9,
    color: '#8CA0B8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4DE7FF',
    marginTop: 3,
  },
  buttonCol: {
    width: '100%',
    gap: 10,
  },
  restartButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#07111F',
    letterSpacing: 1,
  },
  exitButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  exitBtnText: {
    color: '#8CA0B8',
    fontSize: 13,
    fontWeight: '700',
  },
});
