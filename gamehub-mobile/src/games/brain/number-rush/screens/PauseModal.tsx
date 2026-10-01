// ============================================================
// Number Rush — Screen 13: PAUSE (Jungle Adventure Pause Menu)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
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
    setShowExitModal,
  } = useNumberRushStore();

  if (!isPaused) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isPaused}
      onRequestClose={resumeGame}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.panelContainer}>
          {/* Baby Tiger Mascot Positioned Above Card */}
          <View style={styles.mascotHolder}>
            <View style={styles.avatarHalo}>
              <MascotIllustration size={76} character="tiger" mood="thinking" showAura={false} />
            </View>
          </View>

          <WoodPanel style={styles.panel} variant="wood" hasRivets={true}>
            <View style={styles.contentBody}>
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
                  title="RESUME ▶"
                  variant="green"
                  size="md"
                  fullWidth
                  onPress={resumeGame}
                />

                <GameButton
                  title="RESTART 🔄"
                  variant="gold"
                  size="md"
                  fullWidth
                  onPress={restartGame}
                />

                <GameButton
                  title="SETTINGS ⚙️"
                  variant="blue"
                  size="md"
                  fullWidth
                  onPress={() => {
                    resumeGame();
                    setScreen('settings');
                  }}
                />

                <GameButton
                  title="QUIT TO HOME 🏠"
                  variant="wood"
                  size="md"
                  fullWidth
                  onPress={exitToHome}
                />

                <GameButton
                  title="EXIT TO GAMEHUB 🚪"
                  variant="red"
                  size="md"
                  fullWidth
                  onPress={() => {
                    resumeGame();
                    setShowExitModal(true);
                  }}
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
    top: -46,
    zIndex: 50,
    alignItems: 'center',
  },
  avatarHalo: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 18,
  },
  contentBody: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#FFE082',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#E0D2BC',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  soundRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
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
    fontWeight: '900',
    fontSize: 12,
  },
  actions: {
    width: '100%',
    gap: 8,
  },
});
