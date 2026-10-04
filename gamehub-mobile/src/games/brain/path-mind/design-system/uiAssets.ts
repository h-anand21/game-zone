// ============================================================
// PATH MIND — Design System: UI Assets Manifest
// Strongly-typed access to backgrounds, buttons, and icons
// ============================================================

import { ImageSourcePropType } from 'react-native';

export const pmAssets = {
  backgrounds: {
    splash: require('../../../../../assets/game/path-mind/backgrounds/bg_splash.png') as ImageSourcePropType,
    home: require('../../../../../assets/game/path-mind/backgrounds/bg_home.png') as ImageSourcePropType,
    universal: require('../../../../../assets/game/path-mind/backgrounds/bg_universal.png') as ImageSourcePropType,
  },
  buttons: {
    // Primary Large Buttons
    green: require('../../../../../assets/game/path-mind/buttons/btn_01_250x115.png') as ImageSourcePropType,
    gold: require('../../../../../assets/game/path-mind/buttons/btn_02_241x111.png') as ImageSourcePropType,
    wood: require('../../../../../assets/game/path-mind/buttons/btn_03_232x108.png') as ImageSourcePropType,
    blue: require('../../../../../assets/game/path-mind/buttons/btn_05_206x111.png') as ImageSourcePropType,
    red: require('../../../../../assets/game/path-mind/buttons/btn_16_169x106.png') as ImageSourcePropType,
    purple: require('../../../../../assets/game/path-mind/buttons/btn_20_227x112.png') as ImageSourcePropType,
    cyan: require('../../../../../assets/game/path-mind/buttons/btn_10_209x110.png') as ImageSourcePropType,
  },
  icons: {
    heart: require('../../../../../assets/game/path-mind/icons/icon_18_165x146.png') as ImageSourcePropType,
    coin: require('../../../../../assets/game/path-mind/icons/icon_02_173x158.png') as ImageSourcePropType,
    gem: require('../../../../../assets/game/path-mind/icons/icon_05_175x161.png') as ImageSourcePropType,
    star: require('../../../../../assets/game/path-mind/icons/icon_04_176x162.png') as ImageSourcePropType,
    chest: require('../../../../../assets/game/path-mind/icons/icon_03_180x166.png') as ImageSourcePropType,
    key: require('../../../../../assets/game/path-mind/icons/icon_07_172x163.png') as ImageSourcePropType,
    map: require('../../../../../assets/game/path-mind/icons/icon_09_167x160.png') as ImageSourcePropType,
    compass: require('../../../../../assets/game/path-mind/icons/icon_10_175x154.png') as ImageSourcePropType,
    settings: require('../../../../../assets/game/path-mind/icons/icon_11_160x150.png') as ImageSourcePropType,
    trophy: require('../../../../../assets/game/path-mind/icons/icon_12_162x151.png') as ImageSourcePropType,
    backpack: require('../../../../../assets/game/path-mind/icons/icon_13_165x149.png') as ImageSourcePropType,
    scroll: require('../../../../../assets/game/path-mind/icons/icon_14_184x153.png') as ImageSourcePropType,
    crown: require('../../../../../assets/game/path-mind/icons/icon_20_179x156.png') as ImageSourcePropType,
  },
};
