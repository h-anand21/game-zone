// ============================================================
// Number Rush — Special Round (Rare Lion Rush) Banner
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NRTheme } from '../theme';

interface SpecialRoundBannerProps {
  multiplier?: number;
}

export const SpecialRoundBanner: React.FC<SpecialRoundBannerProps> = ({
  multiplier = 2,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.glowBorder}>
        <Text style={styles.lionIcon}>🦁</Text>
        <View style={styles.textColumn}>
          <Text style={styles.titleText}>SPECIAL ROUND!</Text>
          <Text style={styles.subText}>RARE MASCOT RUSH • {multiplier}x POINTS</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{multiplier}x</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  glowBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#382504',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: NRTheme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...NRTheme.shadows.glowGold,
  },
  lionIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  textColumn: {
    flex: 1,
  },
  titleText: {
    color: '#FFE082',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subText: {
    color: '#FFB300',
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
