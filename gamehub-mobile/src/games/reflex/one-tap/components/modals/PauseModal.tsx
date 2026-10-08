// ============================================================
// ONE TAP: PRECISION GAME — PauseModal Component
// In-Run Pause Menu with Chamfered Card, Resume, Restart & Audio Toggles
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Switch } from 'react-native';
import {
  SvgPlay,
  SvgRefresh,
  SvgHome,
  SvgVolumeHigh,
  SvgMusic,
  SvgPhone,
  SvgExitDoor,
} from '../icons/OneTapIcons';
import { OTColors } from '../../theme/colors';

interface PauseModalProps {
  visible: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExitToHome: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleHaptics: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  soundEnabled,
  musicEnabled,
  hapticsEnabled,
  onResume,
  onRestart,
  onExitToHome,
  onToggleSound,
  onToggleMusic,
  onToggleHaptics,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        {/* Futuristic Chamfered Pause Panel */}
        <View style={styles.card}>
          <Text style={styles.title}>PAUSED</Text>
          <Text style={styles.subtitle}>— TAKE A SMALL BREAK —</Text>

          {/* Primary Action Buttons */}
          <View style={styles.actionsList}>
            {/* 1. Resume (Cyan Glow) */}
            <Pressable
              style={({ pressed }) => [styles.resumeBtn, pressed && styles.btnPressed]}
              onPress={onResume}
            >
              <SvgPlay size={18} color="#07090C" />
              <View style={styles.btnTextCol}>
                <Text style={styles.resumeBtnText}>RESUME</Text>
                <Text style={styles.btnSubTextDark}>CONTINUE YOUR RUN</Text>
              </View>
            </Pressable>

            {/* 2. Restart (Gold Accent) */}
            <Pressable
              style={({ pressed }) => [styles.restartBtn, pressed && styles.btnPressed]}
              onPress={onRestart}
            >
              <SvgRefresh size={18} color={OTColors.gold} />
              <View style={styles.btnTextCol}>
                <Text style={styles.restartBtnText}>RESTART</Text>
                <Text style={styles.btnSubText}>START FROM ROUND 1</Text>
              </View>
            </Pressable>

            {/* 3. Exit to Home */}
            <Pressable
              style={({ pressed }) => [styles.exitHomeBtn, pressed && styles.btnPressed]}
              onPress={onExitToHome}
            >
              <SvgHome size={18} color="#FFFFFF" />
              <View style={styles.btnTextCol}>
                <Text style={styles.exitHomeBtnText}>EXIT TO HOME</Text>
                <Text style={styles.btnSubText}>RETURN TO MENU</Text>
              </View>
            </Pressable>
          </View>

          {/* In-Run Audio & Haptics Toggles */}
          <View style={styles.togglesSection}>
            <Text style={styles.togglesHeader}>GAME SETTINGS (IN-RUN)</Text>
            <View style={styles.togglesRow}>
              {/* Sound Toggle */}
              <Pressable style={styles.togglePill} onPress={onToggleSound}>
                <SvgVolumeHigh size={16} color={soundEnabled ? OTColors.cyan : OTColors.textMuted} />
                <Text style={styles.toggleLabel}>SOUND</Text>
                <Text style={[styles.toggleState, { color: soundEnabled ? OTColors.cyan : OTColors.textMuted }]}>
                  {soundEnabled ? 'ON' : 'OFF'}
                </Text>
              </Pressable>

              {/* Music Toggle */}
              <Pressable style={styles.togglePill} onPress={onToggleMusic}>
                <SvgMusic size={16} color={musicEnabled ? OTColors.cyan : OTColors.textMuted} />
                <Text style={styles.toggleLabel}>MUSIC</Text>
                <Text style={[styles.toggleState, { color: musicEnabled ? OTColors.cyan : OTColors.textMuted }]}>
                  {musicEnabled ? 'ON' : 'OFF'}
                </Text>
              </Pressable>

              {/* Haptics Toggle */}
              <Pressable style={styles.togglePill} onPress={onToggleHaptics}>
                <SvgPhone size={16} color={hapticsEnabled ? OTColors.lime : OTColors.textMuted} />
                <Text style={styles.toggleLabel}>HAPTICS</Text>
                <Text style={[styles.toggleState, { color: hapticsEnabled ? OTColors.lime : OTColors.textMuted }]}>
                  {hapticsEnabled ? 'ON' : 'OFF'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(16, 21, 28, 0.95)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: OTColors.cyan,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 20,
  },
  actionsList: {
    width: '100%',
    gap: 12,
  },
  resumeBtn: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: OTColors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  restartBtn: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1.2,
    borderColor: OTColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  exitHomeBtn: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  btnTextCol: {
    flex: 1,
  },
  resumeBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 1.5,
  },
  btnSubTextDark: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1A2332',
    letterSpacing: 1,
  },
  restartBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: OTColors.gold,
    letterSpacing: 1.5,
  },
  exitHomeBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  btnSubText: {
    fontSize: 8,
    fontWeight: '700',
    color: OTColors.textSecondary,
    letterSpacing: 1,
  },
  togglesSection: {
    width: '100%',
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  togglesHeader: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  togglePill: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 12, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    alignItems: 'center',
    gap: 3,
  },
  toggleLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1,
  },
  toggleState: {
    fontSize: 10,
    fontWeight: '900',
  },
});
