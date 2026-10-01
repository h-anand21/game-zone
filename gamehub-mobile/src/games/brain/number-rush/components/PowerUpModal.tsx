// ============================================================
// Number Rush — Screen 12: POWER-UP PANEL (Glossy Power-Ups Store Reference)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { WoodPanel } from './WoodPanel';
import { MascotIllustration } from './MascotIllustration';
import type { PowerUpType } from '../types';

interface PowerUpItemConfig {
  type: PowerUpType;
  name: string;
  desc: string;
  icon: string;
  cost: number;
  color: string;
}

const POWER_UP_CONFIGS: PowerUpItemConfig[] = [
  {
    type: 'freeze',
    name: 'FREEZE TIME',
    desc: 'Freeze the ticking clock for 5 full seconds without penalty.',
    icon: '❄️',
    cost: 50,
    color: '#00E5FF',
  },
  {
    type: 'eliminate',
    name: '50:50 ELIMINATE',
    desc: 'Instantly strike out 2 incorrect answer choices.',
    icon: '⚡',
    cost: 60,
    color: '#FFB800',
  },
  {
    type: 'time',
    name: 'EXTRA TIME (+5s)',
    desc: 'Adds 5 emergency bonus seconds to the current round timer.',
    icon: '⏰',
    cost: 40,
    color: '#2ED573',
  },
  {
    type: 'hint',
    name: 'AUTO HINT',
    desc: 'Illuminates the exact target animal or correct answer button.',
    icon: '💡',
    cost: 75,
    color: '#A55EEA',
  },
];

export const PowerUpModal: React.FC = () => {
  const {
    powerUpModalVisible,
    setPowerUpModalVisible,
    powerUps,
    stats,
    buyPowerUp,
  } = useNumberRushStore();

  if (!powerUpModalVisible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={powerUpModalVisible}
      onRequestClose={() => setPowerUpModalVisible(false)}
    >
      <View style={styles.overlay}>
        <WoodPanel style={styles.modalPanel} variant="wood">
          {/* Header Billboard with Mascot */}
          <View style={styles.headerRow}>
            <View style={styles.mascotBox}>
              <MascotIllustration size={60} character="tiger" mood="happy" showAura={false} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.storeSub}>TACTICAL ADVANTAGE</Text>
              <Text style={styles.storeTitle}>POWER-UPS STORE</Text>
            </View>
            <Pressable
              onPress={() => setPowerUpModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* User Currency Pill */}
          <View style={styles.coinsBalancePill}>
            <Text style={styles.balanceLabel}>YOUR BALANCE:</Text>
            <Text style={styles.balanceVal}>{stats.coins.toLocaleString()} 🪙</Text>
          </View>

          {/* List of Power-Ups */}
          <ScrollView style={styles.powerUpsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.list}>
              {POWER_UP_CONFIGS.map((item) => {
                const count = powerUps[item.type] || 0;
                const canAfford = stats.coins >= item.cost;

                return (
                  <View
                    key={item.type}
                    style={[styles.itemCard, { borderColor: item.color }]}
                  >
                    <View
                      style={[
                        styles.itemIconCircle,
                        { backgroundColor: item.color + '25', borderColor: item.color },
                      ]}
                    >
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>

                    <View style={styles.itemInfo}>
                      <View style={styles.nameRow}>
                        <Text style={[styles.itemName, { color: item.color }]}>
                          {item.name}
                        </Text>
                        <View style={styles.ownedBadge}>
                          <Text style={styles.ownedText}>OWNED: {count}</Text>
                        </View>
                      </View>
                      <Text style={styles.itemDesc}>{item.desc}</Text>
                    </View>

                    {/* Buy Button */}
                    <Pressable
                      onPress={() => buyPowerUp(item.type, item.cost)}
                      disabled={!canAfford}
                      style={({ pressed }) => [
                        styles.buyBtn,
                        !canAfford && styles.buyBtnDisabled,
                        pressed && styles.btnPressed,
                      ]}
                    >
                      <Text style={styles.buyCost}>{item.cost} 🪙</Text>
                      <Text style={styles.buyText}>+1 BUY</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Done Button */}
          <Pressable
            onPress={() => setPowerUpModalVisible(false)}
            style={styles.doneBtn}
          >
            <Text style={styles.doneBtnText}>CLOSE STORE</Text>
          </Pressable>
        </WoodPanel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 11, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalPanel: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mascotBox: {
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  storeSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  storeTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  coinsBalancePill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  balanceLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
    marginRight: 6,
  },
  balanceVal: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
  },
  powerUpsScroll: {
    marginVertical: 6,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 10,
  },
  itemIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemIcon: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    paddingRight: 6,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '900',
  },
  ownedBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  ownedText: {
    color: '#FFE082',
    fontSize: 8,
    fontWeight: '900',
  },
  itemDesc: {
    color: '#8CA0BA',
    fontSize: 9,
    lineHeight: 12,
    paddingRight: 6,
  },
  buyBtn: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buyBtnDisabled: {
    backgroundColor: '#4A5568',
    borderColor: '#718096',
    opacity: 0.6,
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
  },
  buyCost: {
    color: '#04160D',
    fontSize: 10,
    fontWeight: '900',
  },
  buyText: {
    color: '#04160D',
    fontSize: 8,
    fontWeight: '900',
  },
  doneBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
