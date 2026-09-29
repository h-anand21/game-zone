// ============================================================
// Mind Lock — Screen Header Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { IconButton } from './IconButton';
import { useMindLockStore } from '../store/mindLockStore';

interface ScreenHeaderProps {
  variant?: 'home' | 'subscreen' | 'gameplay';
  title?: string;
  round?: number;
  score?: number;
  onBack?: () => void;
  onPause?: () => void;
  onSettings?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  variant = 'subscreen',
  title,
  round,
  score,
  onBack,
  onPause,
  onSettings,
}) => {
  const { profile, goBack, setScreen } = useMindLockStore();

  const handleBack = onBack || goBack;
  const handleSettings = onSettings || (() => setScreen('settings'));

  // 1. Home Header
  if (variant === 'home') {
    return (
      <View style={styles.container}>
        {/* Left: Avatar + Name + Level */}
        <Pressable
          style={styles.profileSection}
          onPress={() => setScreen('profile')}
        >
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.playerName}>{profile.name}</Text>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level {profile.level}</Text>
              <View style={styles.levelMiniBar}>
                <View
                  style={[
                    styles.levelMiniFill,
                    { width: `${(profile.xp / profile.xpNextLevel) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </Pressable>

        {/* Right: Coins + Settings */}
        <View style={styles.rightSection}>
          <View style={styles.coinPill}>
            <Text style={styles.coinIcon}>⭐</Text>
            <Text style={styles.coinText}>{profile.coins.toLocaleString()}</Text>
            <View style={styles.plusBtn}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </View>

          <IconButton
            size={38}
            onPress={handleSettings}
            icon={
              <Svg width="18" height="18" viewBox="0 0 24 24" fill={MLColors.white}>
                <Path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </Svg>
            }
          />
        </View>
      </View>
    );
  }

  // 2. Gameplay Header (Back, Round Pill, Score Pill, Pause)
  if (variant === 'gameplay') {
    return (
      <View style={styles.container}>
        <IconButton
          size={38}
          onPress={handleBack}
          icon={
            <Svg width="18" height="18" viewBox="0 0 24 24" fill={MLColors.white}>
              <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </Svg>
          }
        />

        <View style={styles.gameplayCenter}>
          <View style={styles.gamePill}>
            <Text style={styles.gamePillLabel}>ROUND</Text>
            <Text style={styles.gamePillValue}>
              {round !== undefined ? String(round).padStart(2, '0') : '01'}
            </Text>
          </View>

          <View style={styles.gamePill}>
            <Text style={styles.gamePillLabel}>SCORE</Text>
            <Text style={styles.gamePillValue}>{score ?? 0}</Text>
          </View>
        </View>

        <IconButton
          size={38}
          onPress={onPause || (() => {})}
          icon={
            <Svg width="18" height="18" viewBox="0 0 24 24" fill={MLColors.white}>
              <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </Svg>
          }
        />
      </View>
    );
  }

  // 3. Subscreen Header (Back, Title, Coins)
  return (
    <View style={styles.container}>
      <IconButton
        size={38}
        onPress={handleBack}
        icon={
          <Svg width="18" height="18" viewBox="0 0 24 24" fill={MLColors.white}>
            <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </Svg>
        }
      />

      {title ? (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : null}

      <View style={styles.coinPill}>
        <Text style={styles.coinIcon}>⭐</Text>
        <Text style={styles.coinText}>{profile.coins.toLocaleString()}</Text>
        <View style={styles.plusBtn}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MLSpacing.base,
    paddingTop: 48,
    paddingBottom: MLSpacing.sm,
    width: '100%',
    zIndex: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  avatarBorder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: MLColors.primary,
    overflow: 'hidden',
    ...MLShadows.glowGold,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  playerName: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  levelText: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  levelMiniBar: {
    width: 44,
    height: 4,
    backgroundColor: '#091524',
    borderRadius: 2,
    overflow: 'hidden',
  },
  levelMiniFill: {
    height: '100%',
    backgroundColor: MLColors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122338',
    borderRadius: MLRadius.pill,
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.3)',
    gap: 6,
    ...MLShadows.sm,
  },
  coinIcon: {
    fontSize: 13,
  },
  coinText: {
    color: MLColors.white,
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.black,
  },
  plusBtn: {
    backgroundColor: '#1C3352',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  plusText: {
    color: MLColors.primary,
    fontSize: 13,
    fontWeight: MLTypography.bold,
    lineHeight: 14,
  },
  headerTitle: {
    color: MLColors.white,
    fontSize: MLTypography.h4,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  gameplayCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  gamePill: {
    backgroundColor: '#0E1D2F',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    alignItems: 'center',
  },
  gamePillLabel: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.bold,
    letterSpacing: 0.5,
  },
  gamePillValue: {
    color: MLColors.primary,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
  },
});
