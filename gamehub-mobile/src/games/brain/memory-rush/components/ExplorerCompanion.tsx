// ============================================================
// MEMORY RUSH — 3D Cartoon Explorer Companion Component
// Renders the isolated 3D explorer boy character poses
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';

export type ExplorerPose =
  | 'victory_stand'
  | 'cheer_rock'
  | 'map'
  | 'thinking'
  | 'thumbs_up'
  | 'run_splash'
  | 'lantern'
  | 'magnifier'
  | 'jump_stars'
  | 'reading_book'
  | 'idea_bulb'
  | 'running'
  | 'pointing'
  | 'back_view'
  | 'treasure_chest'
  | 'waving';

interface ExplorerCompanionProps {
  pose: ExplorerPose;
  size?: number;
  style?: ViewStyle;
}

const POSE_SOURCES: Record<ExplorerPose, ImageSourcePropType> = {
  victory_stand: require('../../../../../assets/game/characters/boy_victory.png'),
  cheer_rock: require('../../../../../assets/game/characters/boy_sitting.png'),
  map: require('../../../../../assets/game/characters/boy_map.png'),
  thinking: require('../../../../../assets/game/characters/boy_thinking.png'),
  thumbs_up: require('../../../../../assets/game/characters/boy_thumbsup.png'),
  run_splash: require('../../../../../assets/game/characters/boy_running_splash.png'),
  lantern: require('../../../../../assets/game/characters/boy_lantern.png'),
  magnifier: require('../../../../../assets/game/characters/boy_magnifier.png'),
  jump_stars: require('../../../../../assets/game/characters/boy_celebration.png'),
  reading_book: require('../../../../../assets/game/characters/boy_reading.png'),
  idea_bulb: require('../../../../../assets/game/characters/boy_idea.png'),
  running: require('../../../../../assets/game/characters/boy_running.png'),
  pointing: require('../../../../../assets/game/characters/boy_pointing.png'),
  back_view: require('../../../../../assets/game/characters/boy_back.png'),
  treasure_chest: require('../../../../../assets/game/characters/boy_treasure.png'),
  waving: require('../../../../../assets/game/characters/boy_welcome.png'),
};

export const ExplorerCompanion: React.FC<ExplorerCompanionProps> = ({
  pose,
  size = 140,
  style,
}) => {
  return (
    <View style={[styles.container, { height: size, width: size }, style]} pointerEvents="none">
      <Image
        source={POSE_SOURCES[pose]}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
