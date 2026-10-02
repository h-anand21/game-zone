// ============================================================
// PATTERN BREAKER — 3D Sculpted Screen Title Plaque
// Renders the official hand-carved stone & neon header artwork with Scout & Robot
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp, ImageSourcePropType } from 'react-native';

export type PBScreenPlaqueType =
  | 'home'
  | 'onboarding'
  | 'play_mode'
  | 'difficulty'
  | 'pattern_type'
  | 'how_to_play'
  | 'countdown'
  | 'gameplay'
  | 'breaker_feedback'
  | 'rule_shift'
  | 'clue'
  | 'pause'
  | 'result'
  | 'progress'
  | 'daily_challenge'
  | 'achievements'
  | 'profile_stats'
  | 'settings';

interface ScreenPlaqueProps {
  type: PBScreenPlaqueType;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const PLAQUE_SOURCES: Record<PBScreenPlaqueType, ImageSourcePropType> = {
  home: require('../../../../../../assets/game/titles/pattern-break/title_home.png'),
  onboarding: require('../../../../../../assets/game/titles/pattern-break/title_onboarding.png'),
  play_mode: require('../../../../../../assets/game/titles/pattern-break/title_play_mode.png'),
  difficulty: require('../../../../../../assets/game/titles/pattern-break/title_difficulty.png'),
  pattern_type: require('../../../../../../assets/game/titles/pattern-break/title_pattern_type.png'),
  how_to_play: require('../../../../../../assets/game/titles/pattern-break/title_how_to_play.png'),
  countdown: require('../../../../../../assets/game/titles/pattern-break/title_countdown.png'),
  gameplay: require('../../../../../../assets/game/titles/pattern-break/title_gameplay.png'),
  breaker_feedback: require('../../../../../../assets/game/titles/pattern-break/title_breaker_feedback.png'),
  rule_shift: require('../../../../../../assets/game/titles/pattern-break/title_rule_shift.png'),
  clue: require('../../../../../../assets/game/titles/pattern-break/title_clue.png'),
  pause: require('../../../../../../assets/game/titles/pattern-break/title_pause.png'),
  result: require('../../../../../../assets/game/titles/pattern-break/title_result.png'),
  progress: require('../../../../../../assets/game/titles/pattern-break/title_progress.png'),
  daily_challenge: require('../../../../../../assets/game/titles/pattern-break/title_daily_challenge.png'),
  achievements: require('../../../../../../assets/game/titles/pattern-break/title_achievements.png'),
  profile_stats: require('../../../../../../assets/game/titles/pattern-break/title_profile_stats.png'),
  settings: require('../../../../../../assets/game/titles/pattern-break/title_settings.png'),
};

export const ScreenPlaque: React.FC<ScreenPlaqueProps> = ({
  type,
  height = 140,
  style,
}) => {
  return (
    <View style={[styles.container, { height }, style]}>
      <Image
        source={PLAQUE_SOURCES[type]}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
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
});
