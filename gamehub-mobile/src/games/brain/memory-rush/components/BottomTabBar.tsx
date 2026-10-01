// ============================================================
// MEMORY RUSH — Carved 3D Jungle Navigation Bar
// Uses authentic carved button pack: HOME, CHALLENGE, STATS, SETTINGS
// Instant 0ms touch feedback & active illumination aura
// ============================================================

import React from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { AppNavScreen } from '../types';

export type TabType = 'home' | 'daily' | 'stats' | 'settings' | 'challenge';

export interface BottomTabBarProps {
  currentScreen: AppNavScreen | string;
  onNavigate: (screen: AppNavScreen) => void;
}

interface TabItem {
  id: AppNavScreen;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'HOME' },
  { id: 'daily', label: 'CHALLENGE' },
  { id: 'stats', label: 'STATS' },
  { id: 'settings', label: 'SETTINGS' },
];

const NAV_IMAGES: Record<string, any> = {
  home: require('../../../../../assets/game/navigation/nav_home.png'),
  daily: require('../../../../../assets/game/navigation/nav_challenge.png'),
  challenge: require('../../../../../assets/game/navigation/nav_challenge.png'),
  stats: require('../../../../../assets/game/navigation/nav_stats.png'),
  settings: require('../../../../../assets/game/navigation/nav_settings.png'),
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const handleTabPress = (tabId: AppNavScreen) => {
    onNavigate(tabId);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      {/* Main Carved Stone Altar Bar */}
      <LinearGradient
        colors={['#2A3844', '#1A242E', '#10171E']}
        style={styles.barGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Top Sunlit Edge Rim */}
        <View style={styles.topBevel} />

        {TABS.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'daily' && (currentScreen as string) === 'challenge');

          return (
            <Pressable
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={({ pressed }) => [
                styles.tabBtn,
                pressed && styles.pressed,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              accessibilityLabel={`Navigate to ${tab.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              {/* Active Golden Aura Glow */}
              {isActive && (
                <View style={styles.activeGlowContainer}>
                  <LinearGradient
                    colors={['rgba(255, 215, 0, 0.40)', 'rgba(255, 215, 0, 0.05)', 'transparent']}
                    style={styles.activeGlowGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                  />
                  <View style={styles.activePill} />
                </View>
              )}

              {/* 3D Hand-Carved Button Graphic from image copy.png */}
              <View style={[styles.imageWrapper, isActive && styles.activeImageWrapper]}>
                <Image
                  source={NAV_IMAGES[tab.id]}
                  style={[styles.navImage, !isActive && styles.inactiveImage]}
                  resizeMode="contain"
                />
              </View>
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
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 36 : 28,
    position: 'relative',
    zIndex: 100,
  },
  barGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 74,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4A5D70',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeGlowContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
  },
  activeGlowGradient: {
    ...StyleSheet.absoluteFill,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 38,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.95,
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 58,
  },
  activeImageWrapper: {
    transform: [{ scale: 1.08 }, { translateY: -1 }],
  },
  navImage: {
    width: '100%',
    height: '100%',
  },
  inactiveImage: {
    opacity: 0.72,
  },
  pressed: {
    transform: [{ scale: 0.92 }],
  },
});
