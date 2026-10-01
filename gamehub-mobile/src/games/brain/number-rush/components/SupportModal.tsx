// ============================================================
// Number Rush — Support, Privacy & Terms Interactive Modal
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { NRTheme } from '../theme';
import { WoodPanel } from './WoodPanel';
import { GameButton } from './GameButton';

export type SupportDocType = 'help' | 'privacy' | 'terms';

interface SupportModalProps {
  visible: boolean;
  type: SupportDocType;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  visible,
  type,
  onClose,
}) => {
  if (!visible) return null;

  const contentMap = {
    help: {
      icon: '🎧',
      title: 'HELP & SUPPORT',
      body: `Welcome to Number Rush Support!

Frequently Asked Questions:
Q: How do combos work?
A: Quick consecutive correct answers give you streak multipliers up to x15!

Q: How do power-ups recharge?
A: You earn power-ups through Daily Rush claims and level completions.

Need direct assistance?
Email us: support@gamehub.io
Discord: discord.gg/gamehub`,
    },
    privacy: {
      icon: '🔒',
      title: 'PRIVACY POLICY',
      body: `Your privacy is our priority.

1. Data Collection:
We only store local game progression, high scores, and settings. No personal tracking data is sold to third parties.

2. Cloud Sync:
When you link Google Play or Apple Game Center, only your game achievements and coins are synced to secure cloud storage.

3. Analytics:
Anonymous crash logs help us maintain 60 FPS gameplay.`,
    },
    terms: {
      icon: '📄',
      title: 'TERMS OF SERVICE',
      body: `Number Rush Arcade Game License.

1. Gameplay Rules:
Fair play is encouraged. Automation or cheat scripts will disqualify scores from the leaderboard.

2. In-App Assets:
Coins and power-ups earned in-game are virtual items for entertainment purposes within the GameHub ecosystem.

Version: 1.2.0 • Build 2026.09.30`,
    },
  }[type];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <WoodPanel style={styles.panel} variant="wood">
          <Text style={styles.icon}>{contentMap.icon}</Text>
          <Text style={styles.title}>{contentMap.title}</Text>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.bodyText}>{contentMap.body}</Text>
          </ScrollView>

          <GameButton
            title="CLOSE"
            variant="green"
            size="md"
            fullWidth
            onPress={onClose}
            style={{ marginTop: 14 }}
          />
        </WoodPanel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 34,
    marginBottom: 4,
  },
  title: {
    color: '#FFD42A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  scrollView: {
    maxHeight: 260,
    width: '100%',
    backgroundColor: '#1E1007',
    borderRadius: NRTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#7A3F1D',
  },
  bodyText: {
    color: '#D8E2DD',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
});
