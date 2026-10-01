// ============================================================
// MEMORY RUSH — Floating Glass Bottom Tab Navigation
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';
import type { AppNavScreen } from '../types';

interface BottomTabBarProps {
  currentScreen: AppNavScreen;
  onNavigate: (screen: AppNavScreen) => void;
}

interface TabItem {
  id: AppNavScreen;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'HOME', icon: '⌂' },
  { id: 'daily', label: 'CHALLENGE', icon: '✦' },
  { id: 'stats', label: 'STATS', icon: '◨' },
  { id: 'settings', label: 'SETTINGS', icon: '⚙' },
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
              <Text style={[styles.iconText, isActive && styles.activeIcon]}>
                {tab.icon}
              </Text>
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
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
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
  },
  activeTopPill: {
    position: 'absolute',
    top: 4,
    width: 22,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: MRColors.primaryCyan,
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  iconText: {
    fontSize: 16,
    color: MRColors.textMuted,
  },
  activeIcon: {
    color: MRColors.cyanBright,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: MRColors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  activeLabel: {
    color: MRColors.cyanBright,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
  },
});
