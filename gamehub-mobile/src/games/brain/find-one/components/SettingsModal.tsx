// ============================================================
// Find One — Settings Modal Component
// ============================================================

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FORadius, FOSpacing } from '../theme';
import { useFindOneStore } from '../store/findOneStore';
import { GameButton } from './GameButton';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const { settings, updateSettings, resetStats } = useFindOneStore();

  const handleReset = () => {
    Alert.alert(
      'Reset All Stats?',
      'This will reset your high score, streak, and match history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetStats();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCardWrapper}>
          <LinearGradient
            colors={['#142E4C', '#0B1C30', '#061322']}
            style={styles.modalCard}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.titleBadge}>
                <Text style={styles.titleIcon}>⚙️</Text>
                <Text style={styles.modalTitle}>SETTINGS</Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Sound Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingSub}>Tap tones & audio cues</Text>
              </View>
              <Switch
                value={settings.soundEffects}
                onValueChange={(val) => updateSettings({ soundEffects: val })}
                thumbColor={settings.soundEffects ? '#FFC928' : '#7D9AB7'}
                trackColor={{ false: '#0A1C2E', true: '#1A4D7A' }}
              />
            </View>

            {/* Haptics Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Vibration & Haptics</Text>
                <Text style={styles.settingSub}>Touch responses & alerts</Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(val) => updateSettings({ hapticFeedback: val })}
                thumbColor={settings.hapticFeedback ? '#FFC928' : '#7D9AB7'}
                trackColor={{ false: '#0A1C2E', true: '#1A4D7A' }}
              />
            </View>

            {/* Game Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>GAME INFORMATION</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Game</Text>
                <Text style={styles.infoValue}>Find One (Visual Perception)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>v1.0.0 (Production)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Platform</Text>
                <Text style={styles.infoValue}>GameHub Mobile</Text>
              </View>
            </View>

            {/* Reset Button */}
            <View style={styles.resetHolder}>
              <GameButton
                title="RESET GAME STATS"
                variant="red"
                size="sm"
                onPress={handleReset}
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
    backgroundColor: 'rgba(3, 8, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    padding: FOSpacing.lg,
    borderWidth: 2,
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0E243C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4973',
  },
  closeIcon: {
    fontSize: 16,
    color: '#A8C5DE',
    fontWeight: '900',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1E33',
    borderRadius: FORadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#173E63',
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingSub: {
    fontSize: 11,
    color: '#7698B5',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: '#071728',
    borderRadius: FORadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#12304F',
    marginTop: 6,
    marginBottom: 16,
    gap: 6,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 11,
    color: '#6E8EA9',
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A9C7E2',
  },
  resetHolder: {
    marginTop: 4,
  },
});
