// ============================================================
// PATTERN BREAKER — Bottom Navigation Component
// Exactly 4 tabs: HOME, PLAY, PROGRESS, PROFILE
// Powered by authentic Glowing Fantasy Game Menu Icons
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PBScreen } from '../../types';
import { PBColors, PBRadius, uiAssets } from '../../theme';

interface BottomNavigationProps {
  currentScreen: PBScreen;
  onNavigate: (screen: PBScreen) => void;
}

interface NavTab {
  id: PBScreen;
  label: string;
  asset: ImageSourcePropType;
}

const TABS: NavTab[] = [
  { id: 'home', label: 'HOME', asset: uiAssets.navigation.home },
  { id: 'difficulty', label: 'PLAY', asset: uiAssets.navigation.play },
  { id: 'progress', label: 'PROGRESS', asset: uiAssets.navigation.progress },
  { id: 'profile', label: 'PROFILE', asset: uiAssets.navigation.profile },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const bottomLift = Math.max(insets.bottom, 16) + 6;

  const handleTabPress = (tabId: PBScreen) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onNavigate(tabId);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomLift }]}>
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
            (tab.id === 'difficulty' &&
              (currentScreen === 'difficulty' ||
                currentScreen === 'play_mode' ||
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

              {/* Authentic Glowing Fantasy Icon */}
              <View style={[styles.iconWrapper, isActive && styles.iconActive]}>
                <Image
                  source={tab.asset}
                  style={styles.navIcon}
                  resizeMode="contain"
                />
              </View>

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
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 72,
    borderRadius: PBRadius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.32)',
    position: 'relative',
    overflow: 'hidden',
  },
  topRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(25, 211, 255, 0.55)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: 3,
    backgroundColor: PBColors.accent,
    borderRadius: 2,
    shadowColor: PBColors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.65,
  },
  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },
  navIcon: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: PBColors.textMuted,
  },
  activeLabel: {
    color: PBColors.accent,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
