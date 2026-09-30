// ============================================================
// Find One — Coin Wallet & Reward Modal
// ============================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FORadius, FOSpacing } from '../theme';
import { useFindOneStore } from '../store/findOneStore';
import { GameButton } from './GameButton';

interface CoinRewardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CoinRewardModal: React.FC<CoinRewardModalProps> = ({
  visible,
  onClose,
}) => {
  const { profile, addCoins } = useFindOneStore();
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const handleClaimDaily = () => {
    if (dailyClaimed) return;
    addCoins(50);
    setDailyClaimed(true);
  };

  const handleClaimBonus = () => {
    addCoins(25);
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
                <Text style={styles.titleIcon}>⭐</Text>
                <Text style={styles.modalTitle}>COIN VAULT</Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Big Coin Balance Display */}
            <LinearGradient
              colors={['#1B4770', '#0E2742']}
              style={styles.balanceCard}
            >
              <Text style={styles.balanceIcon}>⭐</Text>
              <Text style={styles.balanceNumber}>{profile.coins}</Text>
              <Text style={styles.balanceLabel}>TOTAL GOLD COINS</Text>
            </LinearGradient>

            {/* Reward Action 1: Daily Login Bonus */}
            <View style={styles.rewardRow}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>Daily Bonus</Text>
                <Text style={styles.rewardSub}>Free reward every day</Text>
              </View>

              <GameButton
                title={dailyClaimed ? 'CLAIMED ✓' : '+50 ⭐'}
                variant={dailyClaimed ? 'blue' : 'gold'}
                size="sm"
                onPress={handleClaimDaily}
                disabled={dailyClaimed}
                style={{ minWidth: 105 }}
              />
            </View>

            {/* Reward Action 2: Practice Bonus */}
            <View style={styles.rewardRow}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>Perception Reward</Text>
                <Text style={styles.rewardSub}>Earn bonus training coins</Text>
              </View>

              <GameButton
                title="+25 ⭐"
                variant="green"
                size="sm"
                onPress={handleClaimBonus}
                style={{ minWidth: 105 }}
              />
            </View>

            {/* Note */}
            <Text style={styles.vaultNote}>
              💡 Use coins to buy hints & power-ups in future challenges!
            </Text>
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
    marginBottom: 14,
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
  balanceCard: {
    alignItems: 'center',
    borderRadius: FORadius.lg,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: '#FFC928',
    marginBottom: 16,
  },
  balanceIcon: {
    fontSize: 34,
    marginBottom: 4,
  },
  balanceNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
    marginTop: 2,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1E33',
    borderRadius: FORadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#183E63',
    marginBottom: 10,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardSub: {
    fontSize: 11,
    color: '#7B9CB9',
    marginTop: 2,
  },
  vaultNote: {
    fontSize: 11,
    color: '#6F91AE',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
});
