// ============================================================
// Number Rush — Screen 13: PAUSE (Jungle Adventure Pause Menu Reference)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { GameButton, WoodPanel, MascotIllustration } from '../components';

export const PauseModal: React.FC = () => {
  const {
    isPaused,
    resumeGame,
    restartGame,
    exitToHome,
    setScreen,
    settings,
    updateSettings,
  } = useNumberRushStore();

  if (!isPaused) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isPaused}
      onRequestClose={resumeGame}
    >
      <View style={styles.overlay}>
        <WoodPanel style={styles.panel} variant="wood">
          {/* Baby Tiger Mascot Overlapping Header */}
          <View style={styles.mascotHolder}>
            <MascotIllustration size={80} character="tiger" mood="thinking" showAura={false} />
          </View>

          <Text style={styles.title}>GAME PAUSED</Text>
          <Text style={styles.subtitle}>Take a breath, your rush is waiting!</Text>

          {/* Quick Sound Toggles */}
          <View style={styles.soundRow}>
            <Pressable
              onPress={() => updateSettings({ soundEffects: !settings.soundEffects })}
              style={[
                styles.soundBtn,
                settings.soundEffects && styles.soundBtnActive,
              ]}
            >
              <Text style={styles.soundIcon}>
                {settings.soundEffects ? '🔊' : '🔇'}
              </Text>
              <Text style={styles.soundLabel}>SFX</Text>
            </Pressable>

            <Pressable
              onPress={() => updateSettings({ backgroundMusic: !settings.backgroundMusic })}
              style={[
                styles.soundBtn,
                settings.backgroundMusic && styles.soundBtnActive,
              ]}
            >
              <Text style={styles.soundIcon}>
                {settings.backgroundMusic ? '🎵' : '🔇'}
              </Text>
              <Text style={styles.soundLabel}>MUSIC</Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <GameButton
              title="RESUME"
              icon="▶"
              variant="green"
              size="lg"
              fullWidth
              onPress={resumeGame}
            />

            <GameButton
              title="RESTART"
              icon="🔄"
              variant="gold"
              size="md"
              fullWidth
              onPress={restartGame}
            />

            <GameButton
              title="SETTINGS"
              icon="⚙️"
              variant="blue"
              size="md"
              fullWidth
              onPress={() => {
                resumeGame();
                setScreen('settings');
              }}
            />

            <GameButton
              title="QUIT TO HOME"
              icon="🚪"
              variant="wood"
              size="md"
              fullWidth
              onPress={exitToHome}
            />
          </View>
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
  },
  panel: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 18,
    position: 'relative',
  },
  mascotHolder: {
    marginTop: -40,
    marginBottom: 4,
  },
  title: {
    color: '#FFE082',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#D8E2DD',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
    textAlign: 'center',
  },
  soundRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  soundBtnActive: {
    borderColor: '#2ED573',
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
  },
  soundIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  soundLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
});
