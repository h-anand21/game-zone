// ============================================================
// MEMORY RUSH — Floating Glass Bottom Tab Navigation
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRIcon, MRIconName } from './MRIcon';
import { MRColors } from '../constants/colors';
import type { AppNavScreen } from '../types';

export type TabType = 'home' | 'daily' | 'stats' | 'settings' | 'challenge';

export interface BottomTabBarProps {
  currentScreen: AppNavScreen | string;
  onNavigate: (screen: AppNavScreen) => void;
}

interface TabItem {
  id: AppNavScreen;
  label: string;
  iconName: MRIconName;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'HOME', iconName: 'play' },
  { id: 'daily', label: 'CHALLENGE', iconName: 'star' },
  { id: 'stats', label: 'STATS', iconName: 'bar-chart-2' },
  { id: 'settings', label: 'SETTINGS', iconName: 'cpu' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(23, 29, 36, 0.95)', 'rgba(17, 22, 28, 0.98)']}
        style={styles.barGradient}
      >
        {TABS.map((tab) => {
          const isActive = currentScreen === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onNavigate(tab.id)}
              style={({ pressed }) => [
                styles.tabBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel={`Navigate to ${tab.label}`}
            >
              {isActive && <View style={styles.activeTopPill} />}
              <MRIcon
                name={tab.iconName}
                size={18}
                color={isActive ? MRColors.yellowStatus : MRColors.textMuted}
              />
              <Text style={[styles.labelText, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  barGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 3,
  },
  activeTopPill: {
    position: 'absolute',
    top: 4,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: MRColors.yellowStatus,
    shadowColor: MRColors.yellowStatus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  labelText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: MRColors.textMuted,
    letterSpacing: 1,
  },
  activeLabel: {
    color: MRColors.yellowStatus,
    fontWeight: '900',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
