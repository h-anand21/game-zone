// ============================================================
// STACK MASTER — Arena HUD
// Non-obtrusive top HUD during active gameplay
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { StackHaptics } from '../../utils/haptics';

interface ArenaHUDProps {
  score: number;
  height: number;
  combo: number;
  bestHeight: number;
  onPause: () => void;
}

export const ArenaHUD: React.FC<ArenaHUDProps> = ({
  score,
  height,
  combo,
  bestHeight,
  onPause,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) }]}>
      <View style={styles.hudRow}>
        {/* Pause Button */}
        <Pressable
          onPress={() => {
            StackHaptics.buttonPress();
            onPause();
          }}
          style={({ pressed }) => [
            styles.pauseBtn,
            pressed && { transform: [{ scale: 0.92 }] },
          ]}
          hitSlop={14}
        >
          <Text style={styles.pauseIcon}>⏸</Text>
        </Pressable>

        {/* Center: Height & Score */}
        <LinearGradient
          colors={['#102E56', '#091C38']}
          style={styles.statsCard}
        >
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>HEIGHT</Text>
            <Text style={styles.statValue}>{height}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </LinearGradient>

        {/* Right: Best or Combo badge */}
        <View style={styles.rightSlot}>
          {combo > 1 ? (
            <LinearGradient
              colors={['#FF48C8', '#9165FF']}
              style={styles.comboPill}
            >
              <Text style={styles.comboText}>🔥 x{combo}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.bestPill}>
              <Text style={styles.bestLabel}>BEST</Text>
              <Text style={styles.bestVal}>{bestHeight}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    borderWidth: 2,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  pauseIcon: {
    fontSize: 18,
    color: '#FFF',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#244B82',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  statColumn: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.gold,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#244B82',
    marginHorizontal: 4,
  },
  rightSlot: {
    width: 60,
    alignItems: 'flex-end',
  },
  comboPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  comboText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.6,
  },
  bestPill: {
    backgroundColor: 'rgba(7, 19, 41, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  bestLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.muted,
  },
  bestVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
});
