// ============================================================
// MEMORY RUSH — 3D Jungle Temple Exit Confirmation Modal
// Ancient Wood & Stone Board with Explorer Mascot & Tactile Buttons
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemoryRushStore } from '../store/memoryRushStore';
import { ExplorerCompanion } from './ExplorerCompanion';
import { JungleImageButton } from './JungleImageButton';
import { MRColors } from '../constants/colors';

interface ExitConfirmationModalProps {
  onConfirmExit?: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onConfirmExit,
}) => {
  const {
    showExitModal,
    setShowExitModal,
    playerStats,
    currentScreen,
    setScreen,
  } = useMemoryRushStore();

  const handleCancel = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (currentScreen === 'gameplay' || currentScreen === 'countdown') {
      setScreen('home');
    } else {
      onConfirmExit?.();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showExitModal}
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.panelContainer}>
          {/* 3D Explorer Companion Floating Mascot */}
          <View style={styles.emblemHolder}>
            <View style={styles.emblemHalo}>
              <ExplorerCompanion pose="waving" size={88} />
            </View>
          </View>

          {/* Physical Wood & Stone Altar Board */}
          <View style={styles.woodBorder}>
            <LinearGradient
              colors={['#5A2E12', '#3D1C08', '#261003']}
              style={styles.panel}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Top Sunlit Bevel Rim */}
              <View style={styles.topBevel} />

              <View style={styles.contentBody}>
                {/* Header Title */}
                <Text style={styles.title}>LEAVE TEMPLE?</Text>
                <Text style={styles.subtitle}>
                  Your explorer badges and brain stats are safely engraved in the temple archives.
                </Text>

                {/* Carved Stone Stats Snapshot Tablet */}
                <View style={styles.statsCard}>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🏆</Text>
                    <Text style={styles.statVal}>{(playerStats.bestScore || 0).toLocaleString()}</Text>
                    <Text style={styles.statLabel}>BEST SCORE</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🎯</Text>
                    <Text style={styles.statVal}>{playerStats.accuracy || 92}%</Text>
                    <Text style={styles.statLabel}>ACCURACY</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>⚡</Text>
                    <Text style={styles.statVal}>{playerStats.bestStreak || 0}×</Text>
                    <Text style={styles.statLabel}>MAX STREAK</Text>
                  </View>
                </View>

                {/* Action Buttons Stack */}
                <View style={styles.buttonStack}>
                  <JungleImageButton
                    type="cancel"
                    height={62}
                    zoom={1.05}
                    onPress={handleCancel}
                  />

                  <JungleImageButton
                    type="quit_to_home"
                    height={62}
                    zoom={1.05}
                    onPress={handleConfirmExit}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 14, 10, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  panelContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    position: 'relative',
    marginTop: 36,
  },
  emblemHolder: {
    position: 'absolute',
    top: -48,
    zIndex: 50,
    alignItems: 'center',
  },
  emblemHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#261405',
    borderWidth: 3.5,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
  },
  emblemImg: {
    width: '90%',
    height: '90%',
  },
  woodBorder: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#1E0C02',
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  panel: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#8A4A1C',
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 218, 170, 0.4)',
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#E2CA92',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 6,
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(20, 32, 24, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#546A58',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 18,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#A0B4A2',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: 8,
  },
});
