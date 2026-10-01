// ============================================================
// Number Rush — Curved Jungle Arcade Bottom Navigation Bar
// Exact match to reference art (media_1790837111481.jpg):
// [Home] [Modes] [Floating Center PLAY NOW Button] [Rewards] [Profile]
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenId } from '../types';
import { useNumberRushStore } from '../store/numberRushStore';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';

const HomeSvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
      fill={active ? color + '35' : 'none'}
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ModesSvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? color + '35' : 'none'}
    />
  </Svg>
);

const RewardsSvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 12V21H4V12M2 7H22V12H2V7ZM12 21V7M12 7H7.5C6.11929 7 5 5.88071 5 4.5C5 3.11929 6.11929 2 7.5 2C9.5 2 12 5 12 7ZM12 7H16.5C17.8807 7 19 5.88071 19 4.5C19 3.11929 17.8807 2 16.5 2C14.5 2 12 5 12 7Z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? color + '35' : 'none'}
    />
  </Svg>
);

const ProfileSvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? color + '35' : 'none'}
    />
  </Svg>
);

export const BottomNavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentScreen, setScreen } = useNumberRushStore();

  const handleTabPress = (id: ScreenId) => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    setScreen(id);
  };

  const handleCenterPlayPress = () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    // Center Play opens Mode Selection screen
    setScreen('mode-hub');
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navBar}>
        {/* Brass Corner Rivets */}
        <View style={[styles.rivet, styles.rivetL]} />
        <View style={[styles.rivet, styles.rivetR]} />

        {/* 1. Home Tab */}
        <Pressable
          onPress={() => handleTabPress('home')}
          style={[styles.navTab, currentScreen === 'home' && styles.activeTab]}
        >
          <View style={styles.iconContainer}>
            <HomeSvg
              color={currentScreen === 'home' ? '#FFD700' : '#8CA0BA'}
              active={currentScreen === 'home'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'home' && styles.activeLabel,
            ]}
          >
            Home
          </Text>
          {currentScreen === 'home' && <View style={styles.activeDot} />}
        </Pressable>

        {/* 2. Modes Tab */}
        <Pressable
          onPress={() => handleTabPress('mode-hub')}
          style={[styles.navTab, currentScreen === 'mode-hub' && styles.activeTab]}
        >
          <View style={styles.iconContainer}>
            <ModesSvg
              color={currentScreen === 'mode-hub' ? '#FFD700' : '#8CA0BA'}
              active={currentScreen === 'mode-hub'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'mode-hub' && styles.activeLabel,
            ]}
          >
            Modes
          </Text>
          {currentScreen === 'mode-hub' && <View style={styles.activeDot} />}
        </Pressable>

        {/* 3. Center Elevated Floating Golden PLAY Button */}
        <View style={styles.centerButtonPlaceholder}>
          <Pressable
            onPress={handleCenterPlayPress}
            style={({ pressed }) => [
              styles.centerPlayCircle,
              pressed && styles.centerPlayPressed,
            ]}
          >
            <View style={styles.centerPlayInner}>
              <Text style={styles.centerPlayTriangle}>▶</Text>
            </View>
          </Pressable>
        </View>

        {/* 4. Rewards Tab (with notification badge '1') */}
        <Pressable
          onPress={() => handleTabPress('daily-rush')}
          style={[styles.navTab, currentScreen === 'daily-rush' && styles.activeTab]}
        >
          <View style={styles.iconContainer}>
            <RewardsSvg
              color={currentScreen === 'daily-rush' ? '#FFD700' : '#8CA0BA'}
              active={currentScreen === 'daily-rush'}
            />
            {/* Notification Badge */}
            <View style={styles.badgeNotif}>
              <Text style={styles.badgeNotifText}>1</Text>
            </View>
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'daily-rush' && styles.activeLabel,
            ]}
          >
            Rewards
          </Text>
          {currentScreen === 'daily-rush' && <View style={styles.activeDot} />}
        </Pressable>

        {/* 5. Profile Tab */}
        <Pressable
          onPress={() => handleTabPress('profile')}
          style={[styles.navTab, currentScreen === 'profile' && styles.activeTab]}
        >
          <View style={styles.iconContainer}>
            <ProfileSvg
              color={currentScreen === 'profile' ? '#FFD700' : '#8CA0BA'}
              active={currentScreen === 'profile'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'profile' && styles.activeLabel,
            ]}
          >
            Profile
          </Text>
          {currentScreen === 'profile' && <View style={styles.activeDot} />}
        </Pressable>
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
    paddingHorizontal: 12,
    zIndex: 99,
  },
  navBar: {
    flexDirection: 'row',
    height: 66,
    backgroundColor: '#07162C',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1D3B6A',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  rivetL: {
    left: 12,
    top: 6,
  },
  rivetR: {
    right: 12,
    top: 6,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 22,
  },
  iconContainer: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  badgeNotif: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#07162C',
  },
  badgeNotifText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  tabLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: '900',
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },

  // Floating Center Play Button
  centerButtonPlaceholder: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 3,
    borderColor: '#07162C',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  centerPlayPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: '#B45309',
  },
  centerPlayInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FEF08A',
  },
  centerPlayTriangle: {
    color: '#78350F',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 3,
  },
});
