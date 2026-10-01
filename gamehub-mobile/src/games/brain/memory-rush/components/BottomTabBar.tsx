// ============================================================
// MEMORY RUSH — Carved Stone Bottom Altar Navigation Bar
// Physical stone slab with gold engraved rune tabs & active lighting
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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
  runeEmoji: string;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'HOME', iconName: 'play', runeEmoji: '🏛️' },
  { id: 'daily', label: 'CHALLENGE', iconName: 'star', runeEmoji: '⭐' },
  { id: 'stats', label: 'STATS', iconName: 'bar-chart-2', runeEmoji: '📜' },
  { id: 'settings', label: 'SETTINGS', iconName: 'cpu', runeEmoji: '⚙️' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const handleTabPress = (tabId: AppNavScreen) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onNavigate(tabId);
  };

  return (
    <View style={styles.container}>
      {/* 3D Bottom Extrusion Foundation */}
      <View style={styles.bottomExtrusion} />

      {/* Main Carved Stone Slab */}
      <LinearGradient
        colors={['#3B4957', '#25303B', '#182129']}
        style={styles.barGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Top Sunlit Stone Highlight Rim */}
        <View style={styles.topBevel} />

        {TABS.map((tab) => {
          const isActive = currentScreen === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={({ pressed }) => [
                styles.tabBtn,
                isActive && styles.activeTabBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel={`Navigate to ${tab.label}`}
            >
              {isActive && (
                <View style={styles.activeGlowContainer}>
                  <LinearGradient
                    colors={['rgba(255, 215, 0, 0.45)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.activeTopPill} />
                </View>
              )}

              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <MRIcon
                  name={tab.iconName}
                  size={19}
                  color={isActive ? '#FFD700' : '#8A9BAA'}
                />
              </View>

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
    paddingBottom: 16,
    position: 'relative',
  },
  bottomExtrusion: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    height: 10,
    backgroundColor: '#0E141B',
    borderRadius: 24,
    zIndex: 0,
  },
  barGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#54687C',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 3,
  },
  activeTabBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  activeGlowContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
  },
  activeTopPill: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  activeIconWrapper: {
    transform: [{ translateY: -1 }],
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A9BAA',
    letterSpacing: 1,
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
