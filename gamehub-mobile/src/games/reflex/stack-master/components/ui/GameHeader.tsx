// ============================================================
// STACK MASTER — Game Header with Currency & Back Control
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { StackHaptics } from '../../utils/haptics';
import { useStackStore } from '../../store/stackStore';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showCurrency?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showCurrency = true,
}) => {
  const insets = useSafeAreaInsets();
  const coins = useStackStore((state) => state.coins);
  const crystals = useStackStore((state) => state.crystals);

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 16) }]}>
      <LinearGradient
        colors={['#0F254B', '#091A36']}
        style={styles.container}
      >
        {/* Left: Back Button or Spacer */}
        <View style={styles.leftSlot}>
          {onBack ? (
            <Pressable
              onPress={() => {
                StackHaptics.buttonPress();
                onBack();
              }}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
              hitSlop={12}
            >
              <Text style={styles.backText}>◀</Text>
            </Pressable>
          ) : (
            <View style={styles.emptySlot} />
          )}
        </View>

        {/* Center: Title & Subtitle */}
        <View style={styles.centerSlot}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right: Currency Badges */}
        <View style={styles.rightSlot}>
          {showCurrency ? (
            <View style={styles.currencyRow}>
              <View style={styles.currencyPill}>
                <Text style={styles.currencyIcon}>🪙</Text>
                <Text style={styles.currencyVal}>{coins}</Text>
              </View>
              <View style={[styles.currencyPill, styles.crystalPill]}>
                <Text style={styles.currencyIcon}>💎</Text>
                <Text style={styles.currencyVal}>{crystals}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptySlot} />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 20,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  container: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#244577',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  leftSlot: {
    width: 44,
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#173663',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  backText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '900',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rightSlot: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  crystalPill: {
    borderColor: COLORS.magenta,
  },
  currencyIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  currencyVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  emptySlot: {
    width: 38,
  },
});
