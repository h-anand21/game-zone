// ============================================================
// REVERSE MIND — Exit Confirmation Modal (Matching Number Rush Style)
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
import { useReverseMindStore } from '../store/reverseMindStore';
import { GlowButton } from './GlowButton';
import { RMTheme } from '../theme';

interface ExitConfirmationModalProps {
  onConfirmExit?: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onConfirmExit,
}) => {
  const { showExitModal, setShowExitModal, playerStats, currentScreen, setScreen } = useReverseMindStore();

  const handleCancel = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (currentScreen === 'gameplay') {
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
          {/* Mascot Centerpiece Badge Above Card */}
          <View style={styles.mascotHolder}>
            <View style={styles.avatarHalo}>
              <Image
                source={require('../../../../../assets/images/rm_char_corgi_hero.jpg')}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Main Glowing Card Container */}
          <LinearGradient
            colors={['#0D2036', '#081525', '#040B14']}
            style={styles.panel}
          >
            <View style={styles.contentBody}>
              {/* Header Title */}
              <Text style={styles.title}>EXIT REVERSE MIND?</Text>
              <Text style={styles.subtitle}>
                Are you sure you want to exit? Your high score, mind coins, and streak progress are safely saved.
              </Text>

              {/* Career Progress Snapshot */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={styles.statVal}>{playerStats.classicBest.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>BEST SCORE</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🧠</Text>
                  <Text style={styles.statVal}>{playerStats.coins.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>MIND COINS</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.statVal}>LVL {playerStats.level}</Text>
                  <Text style={styles.statLabel}>LEVEL</Text>
                </View>
              </View>

              {/* Action Buttons Stack */}
              <View style={styles.buttonStack}>
                <GlowButton
                  title="CONTINUE PLAYING ▶"
                  variant="gold"
                  size="md"
                  onPress={handleCancel}
                />

                <GlowButton
                  title="EXIT TO GAMEHUB 🚪"
                  variant="red"
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
    backgroundColor: '#0A1828',
    borderWidth: 3,
    borderColor: '#FFD83D',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#4DE7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  panel: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(77, 231, 255, 0.4)',
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 18,
    shadowColor: '#4DE7FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFD83D',
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
    color: '#E0EAEF',
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
    backgroundColor: 'rgba(10, 24, 40, 0.95)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.25)',
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
    backgroundColor: 'rgba(77, 231, 255, 0.2)',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD83D',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
});
