// ============================================================
// Number Rush — Exit Confirmation Modal (Carved Jungle Wood Style)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { NRTheme } from '../theme';
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
        <WoodPanel style={styles.panel} variant="wood">
          {/* Mascot Centerpiece Overlapping Top */}
          <View style={styles.mascotHolder}>
            <MascotIllustration
              size={85}
              character="runner_boy"
              mood="thinking"
              showAura={false}
            />
          </View>

          {/* Modal Header */}
          <Text style={styles.title}>EXIT NUMBER RUSH?</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to return to GameHub? All your coins, scores, and streak are safely saved.
          </Text>

          {/* Mini Session/Career Snapshot */}
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
              <Text style={styles.statLabel}>RANK</Text>
            </View>
          </View>

          {/* Primary Action: Keep Playing */}
          <GameButton
            title="CONTINUE PLAYING ▶"
            variant="green"
            size="md"
            fullWidth
            onPress={handleCancel}
            style={styles.actionBtn}
          />

          {/* Secondary Action: Exit to GameHub */}
          <Pressable
            onPress={handleConfirmExit}
            style={({ pressed }) => [
              styles.exitBtn,
              pressed && styles.exitBtnPressed,
            ]}
          >
            <Text style={styles.exitBtnIcon}>🚪</Text>
            <Text style={styles.exitBtnText}>LEAVE TO GAMEHUB</Text>
          </Pressable>
        </WoodPanel>
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
  panel: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    position: 'relative',
  },
  mascotHolder: {
    marginTop: -48,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#D4C3A3',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(28, 12, 5, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#7A3F1D',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(122, 63, 29, 0.6)',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  actionBtn: {
    marginBottom: 10,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(180, 40, 30, 0.22)',
    borderWidth: 1.5,
    borderColor: '#E74C3C',
    gap: 8,
  },
  exitBtnPressed: {
    backgroundColor: 'rgba(180, 40, 30, 0.45)',
    transform: [{ scale: 0.98 }],
  },
  exitBtnIcon: {
    fontSize: 16,
  },
  exitBtnText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
