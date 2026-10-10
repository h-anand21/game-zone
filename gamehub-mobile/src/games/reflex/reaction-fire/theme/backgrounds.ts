// ============================================================
// REACTION FIRE — Authentic Sci-Fi Arena Background Assets
// ============================================================

import { ImageSourcePropType } from 'react-native';

export const RfBackgrounds = {
  home: require('../../../../../assets/game/backgrounds/Neon Cosmic Floating Arena.png') as ImageSourcePropType,
  gameplay: require('../../../../../assets/game/backgrounds/Neon Cosmic Target Arena.png') as ImageSourcePropType,
  practice: require('../../../../../assets/game/backgrounds/Neon Space Arena Under Alien Skies.png') as ImageSourcePropType,
  other: require('../../../../../assets/game/backgrounds/Neon Asteroid Arena.png') as ImageSourcePropType,
};

export type RfBgVariant = 'home' | 'gameplay' | 'practice' | 'other';
