// ============================================================
// MEMORY RUSH — 08 Jungle Temple Pause Modal
// Physical Carved Wood & Stone Board with Tactile 3D Buttons
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { JungleButton } from './JungleButton';
import { MRColors } from '../constants/colors';

interface PauseModalProps {
  visible: boolean;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  score,
  onResume,
  onRestart,
  onExit,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onResume}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.outerContainer}>
          {/* 3D Extrusion Foundation */}
          <View style={styles.bottomExtrusion} />

          {/* Main Carved Wood & Stone Panel */}
          <LinearGradient
            colors={['#5A2E12', '#3D1C08', '#261003']}
            style={styles.panel}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={styles.topBevel} />

            <Text style={styles.title}>GAME PAUSED</Text>

            <View style={styles.scoreTablet}>
              <Text style={styles.scoreLabel}>CURRENT SCORE</Text>
              <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
            </View>

            <View style={styles.btnStack}>
              <JungleButton
                title="RESUME ▶"
                variant="gold"
                size="md"
                onPress={onResume}
              />
              <JungleButton
                title="RESTART ⟲"
                variant="wood"
                size="md"
                onPress={onRestart}
              />
              <JungleButton
                title="QUIT TO HOME 🏛️"
                variant="coral"
                size="md"
                onPress={onExit}
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
    backgroundColor: 'rgba(8, 14, 10, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 999,
  },
  outerContainer: {
    width: '100%',
    maxWidth: 320,
    position: 'relative',
  },
  bottomExtrusion: {
    position: 'absolute',
    bottom: -6,
    left: 4,
    right: 4,
    height: 12,
    backgroundColor: '#1E0C02',
    borderRadius: 24,
  },
  panel: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#C68A4C',
    padding: 22,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 225, 170, 0.45)',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  scoreTablet: {
    backgroundColor: 'rgba(20, 32, 24, 0.85)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#546A58',
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    marginVertical: 14,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#CAD8E6',
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFD700',
    marginTop: 2,
  },
  btnStack: {
    width: '100%',
    gap: 8,
  },
});
