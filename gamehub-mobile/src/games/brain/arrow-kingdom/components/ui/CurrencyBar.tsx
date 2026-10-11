// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Currency Bar Component
// Displays player gold coins & gems with fantasy wooden pills
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { useGameStore } from '../../store/gameStore';
import { ArrowHaptics } from '../../utils/haptics';

interface CurrencyBarProps {
  onOpenShop?: () => void;
}

export const CurrencyBar: React.FC<CurrencyBarProps> = ({ onOpenShop }) => {
  const coins = useGameStore((state) => state.coins);
  const gems = useGameStore((state) => state.gems);

  const handlePress = () => {
    if (onOpenShop) {
      ArrowHaptics.buttonPress();
      onOpenShop();
    }
  };

  return (
    <View style={styles.container}>
      {/* Coin Counter Pill */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pillWrapper, pressed && styles.pillPressed]}
      >
        <LinearGradient
          colors={['#10395C', '#071F36']}
          style={styles.pillContent}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🪙</Text>
          </View>
          <Text style={styles.valueText} numberOfLines={1}>
            {coins.toLocaleString()}
          </Text>
          {onOpenShop ? <Text style={styles.plusSign}>+</Text> : null}
        </LinearGradient>
      </Pressable>

      {/* Gem Counter Pill */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pillWrapper, pressed && styles.pillPressed]}
      >
        <LinearGradient
          colors={['#1B1238', '#0E0824']}
          style={[styles.pillContent, styles.gemPill]}
        >
          <View style={[styles.iconCircle, styles.gemCircle]}>
            <Text style={styles.iconEmoji}>💎</Text>
          </View>
          <Text style={[styles.valueText, styles.gemText]} numberOfLines={1}>
            {gems.toLocaleString()}
          </Text>
          {onOpenShop ? <Text style={[styles.plusSign, styles.gemPlus]}>+</Text> : null}
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillWrapper: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A2108',
    backgroundColor: '#351503',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  pillPressed: {
    transform: [{ scale: 0.96 }],
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#20BFFF44',
  },
  gemPill: {
    borderColor: '#E944FF44',
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE25933',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  gemCircle: {
    backgroundColor: '#E944FF33',
  },
  iconEmoji: {
    fontSize: 13,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  gemText: {
    color: '#F596FF',
  },
  plusSign: {
    fontSize: 14,
    fontWeight: '900',
    color: '#78F329',
    marginLeft: 6,
  },
  gemPlus: {
    color: '#FF6BFB',
  },
});

export default CurrencyBar;
