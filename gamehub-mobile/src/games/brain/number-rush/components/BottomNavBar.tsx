// ============================================================
// Number Rush — Curved Jungle Arcade Bottom Navigation Bar
// Professional SVG Icons + Warm Wood Finish
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenId } from '../types';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';

interface NavItem {
  id: ScreenId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'mode-hub', label: 'Modes' },
  { id: 'daily-rush', label: 'Daily' },
  { id: 'leaderboard', label: 'Ranks' },
  { id: 'profile', label: 'Profile' },
];

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
      d="M6 12H10M8 10V14M15 11H15.01M17 13H17.01M6.5 6H17.5C19.433 6 21 7.567 21 9.5V14.5C21 17.5 18 19 15.5 17.5L13.5 16.5H10.5L8.5 17.5C6 19 3 17.5 3 14.5V9.5C3 7.567 4.567 6 6.5 6Z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? color + '35' : 'none'}
    />
  </Svg>
);

const DailySvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
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

const RanksSvg: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 21H16M12 17V21M6 4H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9V4ZM6 6H3C2.44772 6 2 6.44772 2 7V8C2 10.2091 3.79086 12 6 12H6.5M18 6H21C21.5523 6 22 6.44772 22 7V8C22 10.2091 20.2091 12 18 12H17.5"
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

  const renderNavIcon = (id: ScreenId, color: string, active: boolean) => {
    switch (id) {
      case 'home':
        return <HomeSvg color={color} active={active} />;
      case 'mode-hub':
        return <ModesSvg color={color} active={active} />;
      case 'daily-rush':
        return <DailySvg color={color} active={active} />;
      case 'leaderboard':
        return <RanksSvg color={color} active={active} />;
      case 'profile':
        return <ProfileSvg color={color} active={active} />;
      default:
        return <HomeSvg color={color} active={active} />;
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navBar}>
        {/* Brass Corner Rivets */}
        <View style={[styles.rivet, styles.rivetL]} />
        <View style={[styles.rivet, styles.rivetR]} />

        {NAV_ITEMS.map((item) => {
          const isActive = currentScreen === item.id;
          const activeColor = '#FFD700';
          const inactiveColor = '#8CA0BA';

          return (
            <Pressable
              key={item.id}
              onPress={() => handleTabPress(item.id)}
              style={[styles.navTab, isActive && styles.activeTab]}
            >
              <View style={styles.iconContainer}>
                {renderNavIcon(
                  item.id,
                  isActive ? activeColor : inactiveColor,
                  isActive
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>

              {/* Glowing Active Indicator Dot */}
              {isActive && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
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
    paddingHorizontal: 16,
    zIndex: 100,
  },
  navBar: {
    width: '100%',
    maxWidth: 420,
    height: 66,
    backgroundColor: '#26140A', // Warm jungle wood base
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#7A3F1D', // Carved wood border
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: '#C67C00',
  },
  rivetL: { left: 8, top: '50%', marginTop: -3 },
  rivetR: { right: 8, top: '50%', marginTop: -3 },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 18,
    position: 'relative',
    minWidth: 54,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  iconContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8CA0BA',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: '900',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    position: 'absolute',
    bottom: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
