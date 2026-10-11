// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Pause Modal Overlay
// Suspends puzzle and provides resume, restart & navigation
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { GameButton } from './GameButton';

interface PauseModalProps {
  visible: boolean;
  levelNumber: number;
  onResume: () => void;
  onRestart: () => void;
  onLevelsMap: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  levelNumber,
  onResume,
  onRestart,
  onLevelsMap,
  onHome,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.woodFrame}>
          <LinearGradient
            colors={['#10395C', '#071F36']}
            style={styles.cardContent}
          >
            {/* Title Ribbon */}
            <View style={styles.titleRibbon}>
              <LinearGradient
                colors={[COLORS.woodLight, COLORS.woodDark]}
                style={styles.ribbonGrad}
              >
                <Text style={styles.titleText}>PAUSED</Text>
                <Text style={styles.subtitleText}>LEVEL {levelNumber}</Text>
              </LinearGradient>
            </View>

            <Text style={styles.messageText}>
              Take a breath, strategist! The kingdom waits for your next move.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonList}>
              <GameButton
                title="RESUME ▶"
                variant="green"
                size="large"
                onPress={onResume}
                style={styles.actionBtn}
              />
              <GameButton
                title="RESTART RUN ↻"
                variant="blue"
                size="medium"
                onPress={onRestart}
                style={styles.actionBtn}
              />
              <GameButton
                title="LEVEL SELECT 👑"
                variant="wood"
                size="medium"
                onPress={onLevelsMap}
                style={styles.actionBtn}
              />
              <GameButton
                title="MAIN MENU 🏠"
                variant="red"
                size="medium"
                onPress={onHome}
                style={styles.actionBtn}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 19, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  woodFrame: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#4A2108',
    backgroundColor: '#351503',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  cardContent: {
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(32, 191, 255, 0.3)',
  },
  titleRibbon: {
    marginTop: -34,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#3D1C08',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  ribbonGrad: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.woodHighlight,
    borderRadius: 11,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  messageText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 10,
  },
  actionBtn: {
    width: '100%',
  },
});

export default PauseModal;
