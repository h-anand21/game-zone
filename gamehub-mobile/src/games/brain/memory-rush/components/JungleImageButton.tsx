// ============================================================
// MEMORY RUSH — Jungle Image Button Component
// Renders cropped commercial 3D jungle game buttons with press physics
// ============================================================

import React from 'react';
import { Pressable, Image, StyleSheet, ViewStyle, ImageSourcePropType, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export type JungleBtnType =
  | 'play_now'
  | 'start_game'
  | 'play_again'
  | 'next_round'
  | 'resume'
  | 'restart'
  | 'quit_to_home'
  | 'back'
  | 'claim_reward'
  | 'confirm'
  | 'cancel'
  | 'settings'
  | 'stats'
  | 'daily_challenge'
  | 'skip';

interface JungleImageButtonProps {
  type: JungleBtnType;
  onPress: () => void;
  style?: ViewStyle;
  height?: number;
  zoom?: number;
  disabled?: boolean;
}

const BUTTON_SOURCES: Record<JungleBtnType, ImageSourcePropType> = {
  play_now: require('../../../../../assets/game/buttons/play_now.png'),
  start_game: require('../../../../../assets/game/buttons/start_game.png'),
  play_again: require('../../../../../assets/game/buttons/play_again.png'),
  next_round: require('../../../../../assets/game/buttons/next_round.png'),
  resume: require('../../../../../assets/game/buttons/resume.png'),
  restart: require('../../../../../assets/game/buttons/restart.png'),
  quit_to_home: require('../../../../../assets/game/buttons/quit_to_home.png'),
  back: require('../../../../../assets/game/buttons/back.png'),
  claim_reward: require('../../../../../assets/game/buttons/claim_reward.png'),
  confirm: require('../../../../../assets/game/buttons/confirm.png'),
  cancel: require('../../../../../assets/game/buttons/cancel.png'),
  settings: require('../../../../../assets/game/buttons/settings.png'),
  stats: require('../../../../../assets/game/buttons/stats.png'),
  daily_challenge: require('../../../../../assets/game/buttons/daily_challenge.png'),
  skip: require('../../../../../assets/game/buttons/skip.png'),
};

export const JungleImageButton: React.FC<JungleImageButtonProps> = ({
  type,
  onPress,
  style,
  height = 68,
  zoom = 1.05,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    onPress();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        { height },
        disabled && styles.disabled,
        {
          transform: [
            { scale: (pressed ? 0.94 : 1.0) * zoom },
            ...(pressed ? [{ translateY: 3 }] : []),
          ],
        },
        style,
      ]}
      accessibilityRole="button"
    >
      <Image
        source={BUTTON_SOURCES[type]}
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
});
