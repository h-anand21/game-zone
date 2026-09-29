// ============================================================
// Mind Lock — Bottom Navigation Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';
import { useMindLockStore } from '../store/mindLockStore';
import type { MindLockScreen } from '../types';

interface BottomNavigationProps {
  currentTab: MindLockScreen;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab }) => {
  const { setScreen } = useMindLockStore();

  const tabs: {
    id: MindLockScreen;
    label: string;
    renderIcon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      renderIcon: (active) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? MLColors.primary : MLColors.textMuted}>
          <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </Svg>
      ),
    },
    {
      id: 'levels',
      label: 'Levels',
      renderIcon: (active) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? MLColors.primary : MLColors.textMuted}>
          <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
        </Svg>
      ),
    },
    {
      id: 'challenges',
      label: 'Challenges',
      renderIcon: (active) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? MLColors.primary : MLColors.textMuted}>
          <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </Svg>
      ),
    },
    {
      id: 'achievements',
      label: 'Badges',
      renderIcon: (active) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? MLColors.primary : MLColors.textMuted}>
          <Path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3L4.3 7.6l5.3-.8L12 2zm0 13.5l3.2 1.7-.6-3.5 2.6-2.5-3.5-.5L12 7.5 10.3 10.7l-3.5.5 2.6 2.5-.6 3.5 3.2-1.7z" />
        </Svg>
      ),
    },
    {
      id: 'statistics',
      label: 'Stats',
      renderIcon: (active) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? MLColors.primary : MLColors.textMuted}>
          <Path d="M4 9h4v11H4zm6-5h4v16h-4zm6 8h4v8h-4z" />
        </Svg>
      ),
    },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setScreen(tab.id)}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
          >
            {tab.renderIcon(isActive)}
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#091523',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 244, 222, 0.08)',
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: MLRadius.lg,
    gap: 3,
  },
  activeTabItem: {
    backgroundColor: '#16283F',
    borderWidth: 1.5,
    borderColor: MLColors.primary,
    ...MLShadows.glowGold,
  },
  tabLabel: {
    color: MLColors.textMuted,
    fontSize: 10,
    fontWeight: MLTypography.semibold,
  },
  activeTabLabel: {
    color: MLColors.primary,
    fontWeight: MLTypography.black,
  },
});
