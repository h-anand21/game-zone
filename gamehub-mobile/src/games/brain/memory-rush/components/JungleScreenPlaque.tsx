// ============================================================
// MEMORY RUSH — 3D Sculpted Screen Title Plaque
// Renders the hand-carved stone & wood header artwork with explorer companion
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';

export type ScreenPlaqueType =
  | 'memory_rush'
  | 'home'
  | 'choose_challenge'
  | 'select_difficulty'
  | 'how_to_play'
  | 'get_ready'
  | 'gameplay'
  | 'pause'
  | 'round_feedback'
  | 'run_complete'
  | 'stats'
  | 'daily_challenge'
  | 'settings';

interface JungleScreenPlaqueProps {
  type: ScreenPlaqueType;
  height?: number;
  style?: ViewStyle;
}

const PLAQUE_SOURCES: Record<ScreenPlaqueType, ImageSourcePropType> = {
  memory_rush: require('../../../../../assets/game/titles/title_memory_rush.png'),
  home: require('../../../../../assets/game/titles/title_home.png'),
  choose_challenge: require('../../../../../assets/game/titles/title_choose_your_challenge.png'),
  select_difficulty: require('../../../../../assets/game/titles/title_select_difficulty.png'),
  how_to_play: require('../../../../../assets/game/titles/title_how_to_play.png'),
  get_ready: require('../../../../../assets/game/titles/title_get_ready.png'),
  gameplay: require('../../../../../assets/game/titles/title_gameplay.png'),
  pause: require('../../../../../assets/game/titles/title_pause.png'),
  round_feedback: require('../../../../../assets/game/titles/title_round_feedback.png'),
  run_complete: require('../../../../../assets/game/titles/title_run_complete.png'),
  stats: require('../../../../../assets/game/titles/title_stats.png'),
  daily_challenge: require('../../../../../assets/game/titles/title_daily_challenge.png'),
  settings: require('../../../../../assets/game/titles/title_settings.png'),
};

export const JungleScreenPlaque: React.FC<JungleScreenPlaqueProps> = ({
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
