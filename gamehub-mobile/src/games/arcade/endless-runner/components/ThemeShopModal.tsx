// ============================================================
// Color Bloom Sort — Theme Customization Shop Modal
// Select and unlock glass tube and background visual themes
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES } from '../colors';
import { CheckIcon, CloseIcon, CoinIcon, PaletteIcon } from './GameIcons';
import type { ThemeId, ThemeConfig } from '../types';

interface ThemeShopModalProps {
  visible: boolean;
  selectedTheme: ThemeId;
  unlockedThemes: ThemeId[];
  coins: number;
  onSelectTheme: (id: ThemeId) => void;
  onBuyTheme: (id: ThemeId, cost: number) => void;
  onClose: () => void;
}

export const ThemeShopModal: React.FC<ThemeShopModalProps> = ({
  visible,
  selectedTheme,
  unlockedThemes,
  coins,
  onSelectTheme,
  onBuyTheme,
  onClose,
}) => {
  const themeList = Object.values(THEMES);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <PaletteIcon size={18} color="#00CFFF" />
                <Text style={styles.title}>THEME GALLERY</Text>
              </View>
              <View style={styles.balanceRow}>
                <CoinIcon size={14} />
                <Text style={styles.balanceText}>Balance: {coins}</Text>
              </View>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <CloseIcon size={15} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Theme List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {themeList.map((t: ThemeConfig) => {
              const isSelected = t.id === selectedTheme;
              const isUnlocked = unlockedThemes.includes(t.id) || t.price === 0;
              const canAfford = coins >= t.price;

              return (
                <View
                  key={t.id}
                  style={[
                    styles.themeCard,
                    isSelected && styles.selectedCard,
                  ]}
                >
                  <LinearGradient
                    colors={t.bgGradient}
                    style={styles.cardGradient}
                  >
                    {/* Left Info */}
                    <View style={styles.infoCol}>
                      <Text style={styles.themeName}>{t.name}</Text>
                      <View style={styles.colorPillRow}>
                        <View style={[styles.colorDot, { backgroundColor: t.accent }]} />
                        <View style={[styles.colorDot, { backgroundColor: t.tubeOutline }]} />
                        <View style={[styles.colorDot, { backgroundColor: t.tubeGlass }]} />
                      </View>
                    </View>

                    {/* Action Button */}
                    {isSelected ? (
                      <View style={styles.activeBadge}>
                        <CheckIcon size={12} color="#00CFFF" />
                        <Text style={styles.activeText}>EQUIPPED</Text>
                      </View>
                    ) : isUnlocked ? (
                      <Pressable
                        onPress={() => onSelectTheme(t.id)}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>EQUIP</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => canAfford && onBuyTheme(t.id, t.price)}
                        disabled={!canAfford}
                        style={[styles.buyBtn, !canAfford && styles.disabledBuyBtn]}
                      >
                        <CoinIcon size={13} />
                        <Text style={styles.buyBtnText}>{t.price}</Text>
                      </Pressable>
                    )}
                  </LinearGradient>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 5, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#0C1222',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#00CFFF',
    padding: 18,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
    paddingBottom: 8,
  },
  themeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  selectedCard: {
    borderColor: '#00CFFF',
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  infoCol: {
    gap: 6,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  colorPillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 207, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00CFFF',
  },
  activeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00CFFF',
    letterSpacing: 0.8,
  },
  applyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  disabledBuyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  buyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
});
