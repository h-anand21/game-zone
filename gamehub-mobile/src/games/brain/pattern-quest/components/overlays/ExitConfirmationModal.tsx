// ============================================================
// PATTERN QUEST — Exit Confirmation Modal
// Ancient Stone Temple Doorway with Explorer Confirmation
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { usePatternQuestStore } from '../../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../../theme';
import { GameButton } from '../buttons/GameButton';
import { ScreenPlaque } from '../common/ScreenPlaque';

interface ExitConfirmationModalProps {
  onConfirmExit?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onConfirmExit,
}) => {
  const {
    showExitModal,
    setShowExitModal,
    score,
    maxCombo,
    userStats,
    currentScreen,
    setScreen,
  } = usePatternQuestStore();

  const handleCancel = () => {
    setShowExitModal(false);
  };

  const handleConfirm = () => {
    setShowExitModal(false);
    if (
      currentScreen === 'gameplay' ||
      currentScreen === 'rush_mode' ||
      currentScreen === 'memory_shift' ||
      currentScreen === 'ready'
    ) {
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
          {/* Temple Stone Plaque */}
          <ScreenPlaque screen="exit" width={240} height={120} style={styles.plaque} />

          <View style={styles.card}>
            <Text style={styles.title}>LEAVE THE EXPEDITION?</Text>
            <Text style={styles.subtitle}>
              Your chamber stars, combo streaks, and ancient artifacts are safely recorded in your dossier.
            </Text>

            {/* Quick Stats Snapshot */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Image source={pqAssets.hud.star} style={styles.statIcon} resizeMode="contain" />
                <Text style={styles.statVal}>{score}</Text>
                <Text style={styles.statLabel}>EXPEDITION PTS</Text>
              </View>

              <View style={styles.statBox}>
                <Image source={pqAssets.hud.crystal} style={styles.statIcon} resizeMode="contain" />
                <Text style={[styles.statVal, { color: pqColors.crystalCyan }]}>x{maxCombo}</Text>
                <Text style={styles.statLabel}>MAX COMBO</Text>
              </View>

              <View style={styles.statBox}>
                <Image source={pqAssets.hud.gem} style={styles.statIcon} resizeMode="contain" />
                <Text style={[styles.statVal, { color: pqColors.jungleGreenBright }]}>
                  {userStats.patternsSolved}
                </Text>
                <Text style={styles.statLabel}>SOLVED</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonCol}>
              {/* STAY & CONTINUE */}
              <GameButton
                buttonAsset={pqAssets.buttons.resume}
                onPress={handleCancel}
                width={230}
                height={56}
              />

              {/* QUIT EXPEDITION */}
              <GameButton
                buttonAsset={pqAssets.buttons.quit}
                onPress={handleConfirm}
                width={230}
                height={56}
                style={{ marginTop: 4 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 12, 18, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  panelContainer: {
    width: Math.min(SCREEN_WIDTH - 36, 350),
    alignItems: 'center',
  },
  plaque: {
    marginBottom: -16,
    zIndex: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(16, 25, 36, 0.98)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2.5,
    borderColor: '#C5832B',
    paddingTop: pqSpacing.xl,
    paddingBottom: pqSpacing.base,
    paddingHorizontal: pqSpacing.base,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
  },
  title: {
    ...pqTypography.h2,
    fontSize: 18,
    color: pqColors.textGold,
    letterSpacing: 1.2,
    marginTop: pqSpacing.xs,
    marginBottom: pqSpacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...pqTypography.caption,
    color: pqColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: pqSpacing.sm,
    marginBottom: pqSpacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(10, 16, 24, 0.8)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: pqSpacing.sm,
    paddingHorizontal: pqSpacing.xs,
    marginBottom: pqSpacing.lg,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 20,
    height: 20,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.goldBright,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: pqColors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  buttonCol: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
});
