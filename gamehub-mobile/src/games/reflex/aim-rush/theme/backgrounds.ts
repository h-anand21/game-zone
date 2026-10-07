// ============================================================
// AIM RUSH — Background Asset Mappings
// Uses the 3 official neon arena backgrounds provided by the project
// ============================================================

import { ImageSourcePropType } from 'react-native';

export const ARBackgrounds = {
  // 1. Home Screen Background
  home: require('../../../../../assets/game/backgrounds/Neon Cosmic Target Arena.png') as ImageSourcePropType,

  // 2. Gameplay & Start Arena Background
  gameplay: require('../../../../../assets/game/backgrounds/Neon Space Arena Under Alien Skies.png') as ImageSourcePropType,

  // 3. Other Screens (Mode Select, Tutorial, Practice, Results, Stats, Missions, Settings)
  other: require('../../../../../assets/game/backgrounds/Neon Asteroid Arena.png') as ImageSourcePropType,
};
