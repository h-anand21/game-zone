// ============================================================
// Number Rush — Exit Confirmation Modal (Carved Jungle Wood Style)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNumberRushStore } from '../store/numberRushStore';
import { WoodPanel } from './WoodPanel';
import { MascotIllustration } from './MascotIllustration';
import { GameButton } from './GameButton';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';

export const ExitConfirmationModal: React.FC = () => {
  const router = useRouter();
  const { showExitModal, setShowExitModal, onExitApp, stats, setIsExiting } = useNumberRushStore();

  const handleCancel = () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    NRAudio.playButton();
    NRHaptics.heavy();
    setIsExiting(true);
    setShowExitModal(false);

    if (onExitApp) {
      onExitApp();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/games');
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
          {/* Mascot Centerpiece - Positioned Gracefully Above Card to Prevent Clipping */}
          <View style={styles.mascotHolder}>
            <View style={styles.avatarHalo}>
              <MascotIllustration
                size={86}
                character="runner_boy"
                mood="thinking"
                showAura={false}
              />
            </View>
          </View>

          {/* Main Carved Jungle Panel */}
          <WoodPanel style={styles.panel} variant="wood" hasRivets={true}>
            <View style={styles.contentBody}>
              {/* Header Title */}
              <Text style={styles.title}>EXIT NUMBER RUSH?</Text>
              <Text style={styles.subtitle}>
                Are you sure you want to return to GameHub? All your progress, coins, and streak are safely saved.
              </Text>

              {/* Career Progress Snapshot */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={styles.statVal}>{stats.bestScore.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>BEST SCORE</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🪙</Text>
                  <Text style={styles.statVal}>{stats.coins.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>COINS</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.statVal}>LVL {stats.level}</Text>
                  <Text style={styles.statLabel}>LEVEL</Text>
                </View>
              </View>

              {/* Action Buttons: Both Full 2.5D Arcade Buttons */}
              <View style={styles.buttonStack}>
                <GameButton
                  title="CONTINUE PLAYING ▶"
                  variant="green"
                  size="md"
                  fullWidth
                  onPress={handleCancel}
                  style={styles.continueBtn}
                />

                <GameButton
                  title="EXIT TO GAMEHUB 🚪"
                  variant="red"
                  size="md"
                  fullWidth
                  onPress={handleConfirmExit}
                  style={styles.exitBtn}
                />
              </View>
            </View>
          </WoodPanel>
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
  mascotHolder: {
    position: 'absolute',
    top: -50,
    zIndex: 50,
    alignItems: 'center',
  },
  avatarHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(7, 27, 52, 0.95)',
    borderWidth: 3,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  panel: {
    width: '100%',
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 18,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#E0D2BC',
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
    backgroundColor: 'rgba(20, 10, 5, 0.88)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#7A3F1D',
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
    backgroundColor: 'rgba(122, 63, 29, 0.6)',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8CA0BA',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  continueBtn: {
    width: '100%',
  },
  exitBtn: {
    width: '100%',
  },
});
