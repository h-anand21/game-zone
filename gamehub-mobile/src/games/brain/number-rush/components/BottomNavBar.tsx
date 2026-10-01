// ============================================================
// Number Rush — Curved Arcade Bottom Navigation Bar
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenId } from '../types';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'mode-hub', label: 'Modes', icon: '🎮' },
  { id: 'daily-rush', label: 'Daily', icon: '🎁' },
  { id: 'leaderboard', label: 'Ranks', icon: '🏆' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export const BottomNavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentScreen, setScreen } = useNumberRushStore();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.navBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentScreen === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => setScreen(item.id)}
              style={[styles.navTab, isActive && styles.activeTab]}
            >
              <Text style={[styles.tabIcon, isActive && styles.activeIcon]}>
                {item.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
                {item.label}
              </Text>

              {/* Active Pill Indicator */}
              {isActive && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  navBar: {
    width: '100%',
    maxWidth: 420,
    height: 64,
    backgroundColor: '#091A2E',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1E4575',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    ...NRTheme.shadows.card,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(30, 144, 255, 0.15)',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8CA0BA',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  activeLabel: {
    color: '#FFC107',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFC107',
    position: 'absolute',
    bottom: 2,
  },
});
