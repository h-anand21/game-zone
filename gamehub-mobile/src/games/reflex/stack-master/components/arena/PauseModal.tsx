// ============================================================
// STACK MASTER — Screen 08: Pause Menu Overlay
// ============================================================

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

interface PauseModalProps {
  visible: boolean;
  score: number;
  height: number;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onExitHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  score,
  height,
  onResume,
  onRestart,
  onSettings,
  onExitHome,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <LinearGradient
        colors={['#102E56', '#091C38']}
        style={styles.panel}
      >
        <Text style={styles.title}>GAME PAUSED</Text>
        <Text style={styles.subtitle}>ASCENT SUSPENDED</Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CURRENT HEIGHT</Text>
            <Text style={styles.statVal}>{height}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={[styles.statVal, { color: COLORS.gold }]}>{score}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="RESUME ASCENT"
            variant="cyan"
            size="large"
            onPress={onResume}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="RESTART RUN"
            icon="↻"
            onPress={onRestart}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="SETTINGS"
            icon="⚙️"
            variant="panel"
            onPress={onSettings}
            style={styles.actionBtn}
          />

          <SecondaryButton
            title="EXIT TO MENU"
            icon="🏠"
            variant="danger"
            onPress={onExitHome}
            style={styles.actionBtn}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#244B82',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginBottom: 20,
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 19, 41, 0.65)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1D3B6A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#1D3B6A',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});
