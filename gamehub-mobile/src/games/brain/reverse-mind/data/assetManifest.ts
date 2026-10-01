// ============================================================
// REVERSE MIND — Production Visual Asset Manifest & Specs
// ============================================================

export interface CharacterAssetSpec {
  id: string;
  name: string;
  role: string;
  defaultAsset: any;
  states: string[];
}

export interface EnvironmentAssetSpec {
  id: string;
  name: string;
  themeKey: string;
  description: string;
  asset: any;
}

export const ASSET_MANIFEST = {
  characters: {
    boy: {
      id: 'boy_mascot',
      name: 'Agent Mind',
      role: 'Main Boy Scholar Mascot',
      defaultAsset: require('../../../../../assets/images/rm_char_boy_study.jpg'),
      states: [
        'idle',
        'thinking',
        'curious',
        'happy',
        'excited',
        'celebrating',
        'surprised',
        'confused',
        'wrong',
        'proud',
        'focused',
        'ready',
      ],
    },
    corgi: {
      id: 'corgi_companion',
      name: 'Caped Corgi',
      role: 'Hero Canine Companion',
      defaultAsset: require('../../../../../assets/images/rm_char_corgi_hero.jpg'),
      states: [
        'idle',
        'happy',
        'thinking',
        'excited',
        'celebrating',
        'confused',
        'wrong',
        'surprised',
        'proud',
        'sleepy',
      ],
    },
  },

  backgrounds: {
    cozyStudy: {
      id: 'bg_cozy_study',
      name: 'Cozy Night Study Workshop',
      themeKey: 'home',
      description: 'Wooden desk, glowing lantern lamp, bookshelves, starry arched window, floating cyan memory dust',
      asset: require('../../../../../assets/images/rm_bg_cozy_study.jpg'),
    },
    adventureWorld: {
      id: 'bg_adventure_world',
      name: 'Enchanted Memory Realm',
      themeKey: 'modes',
      description: 'Magical forest path, glowing cyan/purple crystals, soft moonlight, hanging lanterns',
      asset: require('../../../../../assets/images/rm_bg_adventure_world.jpg'),
    },
    mindShiftVortex: {
      id: 'bg_mind_shift_vortex',
      name: 'Surreal Memory Flipping Vortex',
      themeKey: 'mindShift',
      description: 'Surreal brain energy dimension, bending space vortex, purple & cyan energy trails',
      asset: require('../../../../../assets/images/rm_bg_mind_shift_vortex.jpg'),
    },
    treasureRewards: {
      id: 'bg_treasure_rewards',
      name: 'Magical Treasure Chamber',
      themeKey: 'rewards',
      description: 'Golden light beam, floating gold coins, gems, magical particle aura',
      asset: require('../../../../../assets/images/rm_bg_treasure_rewards.jpg'),
    },
  },

  objectsCount: 24,
  badgesCount: 10,
  rewardsCount: 6,
};
