// ============================================================
// PATTERN QUEST — ScreenPlaque Component
// Official Character & Title Plaques from Adventure UI Kit
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { pqAssets } from '../../theme';
import { PQScreen } from '../../types';

interface ScreenPlaqueProps {
  screen?: PQScreen | 'magic_lens' | 'pause' | 'exit' | 'how_to_play' | 'ready' | string;
  customPlaque?: ImageSourcePropType;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const ScreenPlaque: React.FC<ScreenPlaqueProps> = ({
  screen,
  customPlaque,
  width = 240,
  height = 135,
  style,
}) => {
  const getPlaqueImage = (): ImageSourcePropType => {
    if (customPlaque) return customPlaque;
    switch (screen) {
      case 'home':
        return pqAssets.plaques.home;
      case 'world_map':
        return pqAssets.plaques.worldMap;
      case 'mode_select':
        return pqAssets.plaques.modeSelection;
      case 'difficulty':
        return pqAssets.plaques.difficulty;
      case 'how_to_play':
        return pqAssets.plaques.howToPlay;
      case 'ready':
        return pqAssets.plaques.ready;
      case 'gameplay':
        return pqAssets.plaques.gameplay;
      case 'memory_shift':
        return pqAssets.plaques.memoryShift;
      case 'rush_mode':
        return pqAssets.plaques.rushMode;
      case 'level_complete':
        return pqAssets.plaques.levelComplete;
      case 'final_results':
        return pqAssets.plaques.finalResults;
      case 'achievements':
        return pqAssets.plaques.achievements;
      case 'profile':
        return pqAssets.plaques.profile;
      case 'settings':
        return pqAssets.plaques.settings;
      default:
        return pqAssets.plaques.home;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={getPlaqueImage()}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
