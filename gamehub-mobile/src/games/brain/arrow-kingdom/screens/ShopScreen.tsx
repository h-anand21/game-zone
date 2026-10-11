// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 12: Kingdom Shop Screen
// Runic Emporium: Hint packs, treasure chests, coin pouches & daily gifts
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { SHOP_ITEMS, type ShopItem } from '../data/shop';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const coins = useGameStore((state) => state.coins);
  const gems = useGameStore((state) => state.gems);
  const spendCoins = useGameStore((state) => state.spendCoins);
  const spendGems = useGameStore((state) => state.spendGems);
  const addCoins = useGameStore((state) => state.addCoins);
  const addHints = useGameStore((state) => state.addHints);

  const [claimedDaily, setClaimedDaily] = useState(false);

  const handlePurchase = (item: ShopItem) => {
    if (item.priceCurrency === 'free') {
      if (claimedDaily) {
        Alert.alert('ALREADY CLAIMED', 'Come back tomorrow for your next royal tribute!');
        return;
      }
      ArrowHaptics.victory();
      addCoins(item.rewardAmount);
      setClaimedDaily(true);
      Alert.alert('ROYAL TRIBUTE CLAIMED!', `+${item.rewardAmount} Gold Coins added to your treasury.`);
      return;
    }

    if (item.priceCurrency === 'coins') {
      if (coins < item.priceAmount) {
        ArrowHaptics.blocked();
        Alert.alert('NOT ENOUGH COINS', 'Complete more puzzle levels to earn sparkling gold coins!');
        return;
      }
      spendCoins(item.priceAmount);
      ArrowHaptics.victory();
      if (item.rewardType === 'hints') {
        addHints(item.rewardAmount);
        Alert.alert('HINTS ACQUIRED', `+${item.rewardAmount} Magic Hints added to your stockpile.`);
      }
      return;
    }

    if (item.priceCurrency === 'gems') {
      if (gems < item.priceAmount) {
        ArrowHaptics.blocked();
        Alert.alert('NOT ENOUGH GEMS', 'Earn gems by conquering multi-level milestones and achievements!');
        return;
      }
      spendGems(item.priceAmount);
      ArrowHaptics.victory();
      addCoins(item.rewardAmount);
      Alert.alert('TREASURY REPLENISHED', `+${item.rewardAmount} Gold Coins poured into your vault.`);
      return;
    }
  };

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="RUNIC SHOP"
          subtitle="TREASURES & HINTS"
          onBack={onBack}
          rightAction={<CurrencyBar />}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {SHOP_ITEMS.map((item) => {
            const isDailyDisabled = item.priceCurrency === 'free' && claimedDaily;

            return (
              <View key={item.id} style={styles.shopCard}>
                <LinearGradient
                  colors={['#10395C', '#071F36']}
                  style={styles.cardGrad}
                >
                  <View style={styles.row}>
                    <View style={styles.iconBox}>
                      <Text style={styles.itemEmoji}>{item.icon}</Text>
                    </View>

                    <View style={styles.detailsCol}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                    </View>

                    <Pressable
                      onPress={() => handlePurchase(item)}
                      disabled={isDailyDisabled}
                      style={({ pressed }) => [
                        styles.buyBtn,
                        isDailyDisabled && styles.btnDisabled,
                        pressed && styles.btnPressed,
                      ]}
                    >
                      <LinearGradient
                        colors={
                          isDailyDisabled
                            ? ['#1C2633', '#111822']
                            : item.priceCurrency === 'free'
                            ? ['#78F329', '#22C51D']
                            : item.priceCurrency === 'gems'
                            ? ['#FF6BFB', '#C21AB8']
                            : ['#FFE259', '#E5A016']
                        }
                        style={styles.buyBtnGrad}
                      >
                        <Text style={styles.priceText}>
                          {isDailyDisabled
                            ? 'CLAIMED'
                            : item.priceCurrency === 'free'
                            ? 'FREE 🎁'
                            : item.priceCurrency === 'gems'
                            ? `${item.priceAmount} 💎`
                            : `${item.priceAmount} 🪙`}
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  shopCard: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  cardGrad: {
    padding: 14,
    borderRadius: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 24,
  },
  detailsCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  itemDesc: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
    lineHeight: 14,
  },
  buyBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3D1C08',
    overflow: 'hidden',
    minWidth: 90,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
  },
  buyBtnGrad: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0A1C2E',
    letterSpacing: 0.5,
  },
});

export default ShopScreen;
