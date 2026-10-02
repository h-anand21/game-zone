// ============================================================
// PATTERN QUEST — PauseModal Component
// Carved Stone/Wood Pause Panel
// ============================================================

import React from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { pqAssets, pqColors, pqSpacing } from '../../theme';
import { GameButton } from '../buttons/GameButton';
import { ScreenPlaque } from '../common/ScreenPlaque';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
  onSettings,
  onQuit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.panel}>
          {/* Pause Plaque */}
          <ScreenPlaque screen="pause" width={220} height={120} style={styles.plaque} />

          <View style={styles.buttonStack}>
            <GameButton
              buttonAsset={pqAssets.buttons.resume}
              onPress={onResume}
              width={220}
              height={56}
            />

            <GameButton
              buttonAsset={pqAssets.buttons.restart}
              onPress={onRestart}
              width={220}
              height={56}
            />

            <GameButton
              buttonAsset={pqAssets.buttons.menu}
              onPress={onSettings}
              width={220}
              height={56}
            />

            <GameButton
              buttonAsset={pqAssets.buttons.quit}
              onPress={onQuit}
              width={220}
              height={56}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 16, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pqSpacing.base,
  },
  panel: {
    width: Math.min(SCREEN_WIDTH - 40, 340),
    backgroundColor: 'rgba(18, 26, 36, 0.96)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2.5,
    borderColor: '#C5832B',
    paddingVertical: pqSpacing.lg,
    paddingHorizontal: pqSpacing.base,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  buttonStack: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
});
