// ============================================================
// PATTERN BREAKER — Bottom Navigation Component
// Exactly 4 tabs: HOME, PLAY, PROGRESS, PROFILE
// Dark glass panel, rounded top rim, glowing cyan underline & haptics
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PBScreen } from '../../types';
import { PBColors, PBTypography, PBRadius } from '../../theme';

interface BottomNavigationProps {
  currentScreen: PBScreen;
  onNavigate: (screen: PBScreen) => void;
}

interface NavTab {
  id: PBScreen;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: NavTab[] = [
  { id: 'home', label: 'HOME', icon: 'home-outline', activeIcon: 'home' },
  { id: 'play_mode', label: 'PLAY', icon: 'game-controller-outline', activeIcon: 'game-controller' },
  { id: 'progress', label: 'PROGRESS', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { id: 'profile', label: 'PROFILE', icon: 'person-outline', activeIcon: 'person' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const handleTabPress = (tabId: PBScreen) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onNavigate(tabId);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(24, 47, 57, 0.98)', 'rgba(10, 23, 30, 0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.navBar}
      >
        {/* Top Glowing Cyan Rim */}
        <View style={styles.topRim} />

        {TABS.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'play_mode' &&
              (currentScreen === 'difficulty' ||
                currentScreen === 'pattern_type' ||
                currentScreen === 'how_to_play'));

          return (
            <Pressable
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={({ pressed }) => [styles.tabBtn, pressed && styles.pressed]}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Navigate to ${tab.label}`}
            >
              {/* Active Indicator Underline Bar */}
              {isActive && <View style={styles.activePill} />}

              {/* Icon */}
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? PBColors.primary : PBColors.textMuted}
              />

              {/* Label */}
              <Text style={[styles.label, isActive && styles.activeLabel]}>
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
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 66,
    borderRadius: PBRadius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.28)',
    position: 'relative',
    overflow: 'hidden',
  },
  topRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(25, 211, 255, 0.45)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 3,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: PBColors.primary,
    borderRadius: 2,
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: PBColors.textMuted,
  },
  activeLabel: {
    color: PBColors.primary,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
