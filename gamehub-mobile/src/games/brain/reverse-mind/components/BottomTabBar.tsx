// ============================================================
// REVERSE MIND — Curved Glass Bottom Tab Bar (SVG Vector Icons)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { AppNavScreen } from '../types';
import {
  HomeNavIconSvg,
  ModesNavIconSvg,
  DailyNavIconSvg,
  StatsNavIconSvg,
  ProfileNavIconSvg,
} from './SvgIcons';
import { RMTheme } from '../theme';

interface BottomTabBarProps {
  currentScreen: AppNavScreen;
  onNavigate: (screen: AppNavScreen) => void;
}

interface TabItem {
  id: AppNavScreen;
  label: string;
  renderIcon: (color: string) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    renderIcon: (color) => <HomeNavIconSvg size={20} color={color} />,
  },
  {
    id: 'modes',
    label: 'Modes',
    renderIcon: (color) => <ModesNavIconSvg size={20} color={color} />,
  },
  {
    id: 'daily',
    label: 'Daily',
    renderIcon: (color) => <DailyNavIconSvg size={20} color={color} />,
  },
  {
    id: 'stats',
    label: 'Stats',
    renderIcon: (color) => <StatsNavIconSvg size={20} color={color} />,
  },
  {
    id: 'profile',
    label: 'Profile',
    renderIcon: (color) => <ProfileNavIconSvg size={20} color={color} />,
  },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(22, 36, 58, 0.95)', 'rgba(16, 27, 43, 0.98)']}
        style={styles.barGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {TABS.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'stats' && currentScreen === 'achievements') ||
            (tab.id === 'profile' && (currentScreen === 'collection' || currentScreen === 'settings'));

          const iconColor = isActive ? RMTheme.colors.cyanNeon : RMTheme.colors.textMuted;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onNavigate(tab.id)}
              style={({ pressed }) => [
                styles.tabBtn,
                pressed && styles.pressed,
              ]}
            >
              {/* Active Tab Glow Pill */}
              {isActive && <View style={styles.activePill} />}

              <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                {tab.renderIcon(iconColor)}
              </View>

              <Text style={[styles.labelText, isActive && styles.labelActive]}>
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
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  barGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    borderRadius: RMTheme.radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.25)',
    shadowColor: '#000000',
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
  },
  activePill: {
    position: 'absolute',
    top: 4,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: RMTheme.colors.cyanNeon,
    shadowColor: RMTheme.colors.cyanNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  iconBox: {
    marginTop: 4,
  },
  iconBoxActive: {
    transform: [{ scale: 1.1 }],
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: RMTheme.colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: RMTheme.colors.cyanNeon,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
