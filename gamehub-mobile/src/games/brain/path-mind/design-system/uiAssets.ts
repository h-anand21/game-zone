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
    // Primary CTAs (Illustrated 3D Text Included in Artwork)
    playNow: require('../../../../../assets/game/path-mind/buttons/btn_play_now.png') as ImageSourcePropType,
    playDaily: require('../../../../../assets/game/path-mind/buttons/btn_play_daily.png') as ImageSourcePropType,
    startGame: require('../../../../../assets/game/path-mind/buttons/btn_start_game.png') as ImageSourcePropType,
    play: require('../../../../../assets/game/path-mind/buttons/btn_play.png') as ImageSourcePropType,

    // Modes & Editing
    customMode: require('../../../../../assets/game/path-mind/buttons/btn_custom_mode.png') as ImageSourcePropType,
    editPath: require('../../../../../assets/game/path-mind/buttons/btn_edit_path.png') as ImageSourcePropType,
    lockPath: require('../../../../../assets/game/path-mind/buttons/btn_lock_path.png') as ImageSourcePropType,
    dailyPath: require('../../../../../assets/game/path-mind/buttons/btn_daily_path.png') as ImageSourcePropType,
    challenge: require('../../../../../assets/game/path-mind/buttons/btn_challenge.png') as ImageSourcePropType,

    // Navigation & Core Sections
    collection: require('../../../../../assets/game/path-mind/buttons/btn_collection.png') as ImageSourcePropType,
    profile: require('../../../../../assets/game/path-mind/buttons/btn_profile.png') as ImageSourcePropType,
    settings: require('../../../../../assets/game/path-mind/buttons/btn_settings.png') as ImageSourcePropType,
    maps: require('../../../../../assets/game/path-mind/buttons/btn_maps.png') as ImageSourcePropType,
    relics: require('../../../../../assets/game/path-mind/buttons/btn_relics.png') as ImageSourcePropType,
    keys: require('../../../../../assets/game/path-mind/buttons/btn_keys.png') as ImageSourcePropType,
    leaderboard: require('../../../../../assets/game/path-mind/buttons/btn_leaderboard.png') as ImageSourcePropType,
    achievements: require('../../../../../assets/game/path-mind/buttons/btn_achievements.png') as ImageSourcePropType,
    statistics: require('../../../../../assets/game/path-mind/buttons/btn_statistics.png') as ImageSourcePropType,
    quests: require('../../../../../assets/game/path-mind/buttons/btn_quests.png') as ImageSourcePropType,
    guide: require('../../../../../assets/game/path-mind/buttons/btn_guide.png') as ImageSourcePropType,

    // Gameplay Controls
    back: require('../../../../../assets/game/path-mind/buttons/btn_back.png') as ImageSourcePropType,
    home: require('../../../../../assets/game/path-mind/buttons/btn_home.png') as ImageSourcePropType,
    continueBtn: require('../../../../../assets/game/path-mind/buttons/btn_continue.png') as ImageSourcePropType,
    restart: require('../../../../../assets/game/path-mind/buttons/btn_restart.png') as ImageSourcePropType,
    pause: require('../../../../../assets/game/path-mind/buttons/btn_pause.png') as ImageSourcePropType,
    undo: require('../../../../../assets/game/path-mind/buttons/btn_undo.png') as ImageSourcePropType,
    clear: require('../../../../../assets/game/path-mind/buttons/btn_clear.png') as ImageSourcePropType,
    exit: require('../../../../../assets/game/path-mind/buttons/btn_exit.png') as ImageSourcePropType,
    next: require('../../../../../assets/game/path-mind/buttons/btn_next.png') as ImageSourcePropType,
    share: require('../../../../../assets/game/path-mind/buttons/btn_share.png') as ImageSourcePropType,
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
