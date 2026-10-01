// ============================================================
// MEMORY RUSH — 2.5D Cyber Arcade Exit Confirmation Modal
// (Matching Number Rush & Reverse Mind Master Aesthetics)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemoryRushStore } from '../store/memoryRushStore';
import { PrimaryButton } from './PrimaryButton';
import { MRIcon } from './MRIcon';
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
          {/* Cyber Centerpiece Floating Emblem Above Card */}
          <View style={styles.emblemHolder}>
            <View style={styles.emblemHalo}>
              <Image
                source={require('../../../../../assets/images/mr_arcade_loading_bg.jpg')}
                style={styles.emblemBgImg}
                resizeMode="cover"
              />
              <View style={styles.emblemOverlay}>
                <MRIcon name="power" size={32} color={MRColors.primaryGold} />
              </View>
            </View>
          </View>

          {/* Main Glowing Cyber Card Container */}
          <LinearGradient
            colors={['#102238', '#0A1728', '#040B15']}
            style={styles.panel}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={styles.contentBody}>
              {/* Header Title */}
              <Text style={styles.title}>EXIT MEMORY RUSH?</Text>
              <Text style={styles.subtitle}>
                Are you sure you want to leave? Your career high score and brain stats are safely stored.
              </Text>

              {/* Career Stats Snapshot Card */}
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
                <PrimaryButton
                  title="CONTINUE PLAYING ▶"
                  variant="gold"
                  size="md"
                  onPress={handleCancel}
                />

                <PrimaryButton
                  title="EXIT TO GAMEHUB 🚪"
                  variant="danger"
                  size="md"
                  onPress={handleConfirmExit}
                />
              </View>
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
    backgroundColor: 'rgba(4, 11, 22, 0.88)',
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
    marginTop: 40,
  },
  emblemHolder: {
    position: 'absolute',
    top: -46,
    zIndex: 50,
    alignItems: 'center',
  },
  emblemHalo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#07111F',
    borderWidth: 3,
    borderColor: MRColors.primaryGold,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: MRColors.primaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 12,
  },
  emblemBgImg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  emblemOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 17, 31, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 216, 61, 0.45)',
    paddingTop: 52,
    paddingBottom: 22,
    paddingHorizontal: 18,
    shadowColor: MRColors.primaryGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: MRColors.primaryGold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: MRColors.textSecondary,
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
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 216, 61, 0.25)',
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
    fontSize: 14,
    fontWeight: '900',
    color: MRColors.primaryGold,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: MRColors.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
});
