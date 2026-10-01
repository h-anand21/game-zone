// ============================================================
// Number Rush — Manage Account Interactive Modal
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { NRTheme } from '../theme';
import { NRHaptics } from '../services/haptics';
import { WoodPanel, GameButton } from './';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  visible,
  onClose,
}) => {
  const [playerName, setPlayerName] = useState('Rush Explorer');
  const [isLinked, setIsLinked] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!visible) return null;

  const handleSave = () => {
    NRHaptics.buttonTap();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleToggleLink = () => {
    NRHaptics.buttonTap();
    setIsLinked(!isLinked);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <WoodPanel style={styles.panel} variant="wood">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.title}>MANAGE ACCOUNT</Text>
          </View>

          {/* Player Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.label}>PLAYER ID</Text>
            <Text style={styles.playerIdText}>#NR-9842103</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>DISPLAY NAME</Text>
            <TextInput
              value={playerName}
              onChangeText={setPlayerName}
              style={styles.nameInput}
              maxLength={18}
              placeholderTextColor="#8CA0BA"
            />

            {savedNotice && (
              <Text style={styles.savedNotice}>✓ Name updated successfully!</Text>
            )}
          </View>

          {/* Cloud Sync & Linked Account */}
          <View style={styles.linkCard}>
            <View style={styles.linkRow}>
              <View>
                <Text style={styles.linkTitle}>Google Play / Game Center</Text>
                <Text style={styles.linkSub}>
                  {isLinked ? 'Account Linked • Cloud Synced' : 'Guest Account • Not Linked'}
                </Text>
              </View>
              <Pressable
                onPress={handleToggleLink}
                style={[styles.linkBtn, isLinked && styles.linkedBtn]}
              >
                <Text style={styles.linkBtnText}>
                  {isLinked ? 'LINKED' : 'LINK'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.btnRow}>
            <GameButton
              title="SAVE"
              icon="💾"
              variant="green"
              size="md"
              style={{ flex: 1 }}
              onPress={handleSave}
            />
            <GameButton
              title="CLOSE"
              variant="wood"
              size="md"
              style={{ flex: 1 }}
              onPress={onClose}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  shieldIcon: {
    fontSize: 34,
    marginBottom: 4,
  },
  title: {
    color: '#FFD42A',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#26140A',
    borderRadius: NRTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  label: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  playerIdText: {
    color: '#FFE082',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  nameInput: {
    backgroundColor: '#170B05',
    color: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7A3F1D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  savedNotice: {
    color: '#2ED573',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },
  linkCard: {
    width: '100%',
    backgroundColor: '#26140A',
    borderRadius: NRTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  linkSub: {
    color: '#8CA0BA',
    fontSize: 10,
    marginTop: 2,
  },
  linkBtn: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  linkedBtn: {
    backgroundColor: '#20C83A',
  },
  linkBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
