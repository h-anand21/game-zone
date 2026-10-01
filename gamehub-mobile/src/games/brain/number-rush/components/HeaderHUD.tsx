// ============================================================
// Number Rush — Header HUD (Currencies, Level, Profile, Actions)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';

interface HeaderHUDProps {
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
  isGameplay?: boolean;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  showBack = false,
  onBackPress,
  title,
  isGameplay = false,
}) => {
  const insets = useSafeAreaInsets();
  const { stats, togglePause, setScreen } = useNumberRushStore();

  const handleProfilePress = () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    setScreen('profile');
  };

  const handleSettingsPress = () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    setScreen('settings');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Left Item: Avatar / Level or Back Button */}
      {showBack ? (
        <Pressable
          onPress={() => {
            NRAudio.playButton();
            NRHaptics.buttonTap();
            onBackPress?.();
          }}
          style={styles.circleBtn}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      ) : (
        <Pressable onPress={handleProfilePress} style={styles.profileBadge}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🏃</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{stats.level}</Text>
          </View>
        </Pressable>
      )}

      {/* Middle: Title or Currency Pills */}
      {title ? (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.currencyRow}>
          {/* Coins Pill */}
          <View style={styles.currencyPill}>
            <Text style={styles.currencyIcon}>🪙</Text>
            <Text style={styles.currencyAmount}>{stats.coins}</Text>
          </View>

          {/* Gems Pill */}
          <View style={[styles.currencyPill, styles.gemPill]}>
            <Text style={styles.currencyIcon}>💎</Text>
            <Text style={styles.currencyAmount}>{stats.gems}</Text>
          </View>
        </View>
      )}

      {/* Right Item: Pause (in game) or Settings */}
      {isGameplay ? (
        <Pressable onPress={togglePause} style={[styles.circleBtn, styles.pauseBtn]}>
          <Text style={styles.pauseIcon}>⏸</Text>
        </Pressable>
      ) : (
        <Pressable onPress={handleSettingsPress} style={styles.circleBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#351A0D',
    borderWidth: 2.5,
    borderColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    ...NRTheme.shadows.card,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: '#FF6D00',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  headerTitle: {
    color: '#FFE082',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(43, 20, 8, 0.92)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  gemPill: {
    borderColor: '#00E5FF',
  },
  currencyIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  currencyAmount: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(53, 26, 13, 0.92)',
    borderWidth: 1.5,
    borderColor: '#7A3F1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtn: {
    backgroundColor: '#FF793F',
    borderColor: '#FFE082',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  settingsIcon: {
    fontSize: 18,
  },
  pauseIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
