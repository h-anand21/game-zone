// ============================================================
// PATTERN QUEST — BottomNavigation Component
// Authentic Stone/Jungle Navigation Bar with 5 Active Tabs
// ============================================================

import React from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pqAssets, pqColors, pqSpacing } from '../../theme';
import { PQScreen } from '../../types';

interface BottomNavigationProps {
  currentScreen: PQScreen;
  onNavigate: (screen: PQScreen) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();

  const tabs: { screen: PQScreen; asset: any; active: boolean }[] = [
    {
      screen: 'home',
      asset: pqAssets.navigation.home,
      active: currentScreen === 'home',
    },
    {
      screen: 'world_map',
      asset: pqAssets.navigation.adventure,
      active: currentScreen === 'world_map',
    },
    {
      screen: 'mode_select',
      asset: pqAssets.navigation.modes,
      active: currentScreen === 'mode_select',
    },
    {
      screen: 'achievements',
      asset: pqAssets.navigation.achievements,
      active: currentScreen === 'achievements',
    },
    {
      screen: 'profile',
      asset: pqAssets.navigation.profile,
      active: currentScreen === 'profile',
    },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12) + 4,
        },
      ]}
    >
      <View style={styles.container}>
        {tabs.map((tab, idx) => (
          <Pressable
            key={idx}
            onPress={() => onNavigate(tab.screen)}
            style={[styles.tabButton, tab.active && styles.activeTab]}
          >
            <Image
              source={tab.asset}
              style={[styles.tabImage, tab.active && styles.activeImage]}
              resizeMode="contain"
            />
          </Pressable>
        ))}
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
    zIndex: 20,
  },
  container: {
    width: Math.min(SCREEN_WIDTH - 24, 400),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 30, 0.95)',
    borderWidth: 2,
    borderColor: '#C5832B',
    borderRadius: pqSpacing.radiusLg,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: pqSpacing.radiusSm,
  },
  activeTab: {
    transform: [{ scale: 1.1 }, { translateY: -4 }],
  },
  tabImage: {
    width: 60,
    height: 52,
    opacity: 0.75,
  },
  activeImage: {
    opacity: 1,
  },
});
