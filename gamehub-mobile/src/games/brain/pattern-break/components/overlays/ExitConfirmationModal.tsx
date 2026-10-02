// ============================================================
// PATTERN BREAKER — Exit Confirmation Modal
// Sci-Fi Hologram Plaque with Scout Mascot & Confirmation Buttons
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePatternBreakStore } from '../../store/patternBreakStore';
import { RobotCompanion } from '../mascot/RobotCompanion';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { PBColors, PBRadius, PBShadows } from '../../theme';

interface ExitConfirmationModalProps {
  onConfirmExit?: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onConfirmExit,
}) => {
  const {
    showExitModal,
    setShowExitModal,
    bestScore,
    bestStreak,
    playerLevel,
    currentScreen,
    setScreen,
  } = usePatternBreakStore();

  const handleCancel = () => {
    setShowExitModal(false);
  };

  const handleConfirm = () => {
    setShowExitModal(false);
    if (currentScreen === 'gameplay' || currentScreen === 'countdown' || currentScreen === 'rule_shift') {
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
          {/* Floating Robot Companion */}
          <View style={styles.robotHolder}>
            <View style={styles.robotHalo}>
              <RobotCompanion size={54} mood="scanning" />
            </View>
          </View>

          {/* Obsidian Tech Card */}
          <LinearGradient
            colors={['rgba(24, 47, 57, 0.98)', 'rgba(10, 23, 30, 0.99)']}
            style={styles.card}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {/* Top Cyan Rim */}
            <View style={styles.topRim} />

            <View style={styles.contentBody}>
              <Text style={styles.title}>EXIT RUINS?</Text>
              <Text style={styles.subtitle}>
                Your pattern recognition progress and cognitive ratings are safely archived.
              </Text>

              {/* Stats Snapshot */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Ionicons name="trophy" size={16} color={PBColors.accent} />
                  <Text style={styles.statVal}>{bestScore}</Text>
                  <Text style={styles.statLabel}>BEST SCORE</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Ionicons name="flame" size={16} color="#FF6EA7" />
                  <Text style={[styles.statVal, { color: '#FF6EA7' }]}>{bestStreak}×</Text>
                  <Text style={styles.statLabel}>STREAK</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Ionicons name="shield-checkmark" size={16} color={PBColors.primary} />
                  <Text style={[styles.statVal, { color: PBColors.primary }]}>LVL {playerLevel}</Text>
                  <Text style={styles.statLabel}>RANK</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonStack}>
                <PrimaryButton
                  title="CONTINUE EXPEDITION"
                  variant="cyan"
                  size="md"
                  onPress={handleCancel}
                />

                <SecondaryButton
                  title="EXIT TO GAMEHUB"
                  onPress={handleConfirm}
                  style={styles.exitBtn}
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
    backgroundColor: 'rgba(6, 16, 24, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  panelContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    position: 'relative',
    marginTop: 28,
  },
  robotHolder: {
    position: 'absolute',
    top: -38,
    zIndex: 50,
    alignItems: 'center',
  },
  robotHalo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0F2633',
    borderWidth: 2,
    borderColor: PBColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    width: '100%',
    borderRadius: PBRadius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.35)',
    paddingTop: 46,
    paddingBottom: 20,
    paddingHorizontal: 18,
    overflow: 'hidden',
    position: 'relative',
    ...PBShadows.cardElevation,
  },
  topRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: PBColors.primary,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: PBColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 17,
    paddingHorizontal: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: PBRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: PBColors.accent,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 0.8,
  },
  buttonStack: {
    width: '100%',
    gap: 8,
  },
  exitBtn: {
    borderColor: 'rgba(255, 92, 97, 0.45)',
  },
});
