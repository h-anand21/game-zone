// ============================================================
// PATTERN QUEST — Centralized UI Asset Manifest
// Clean transparent assets cropped from official UI kit & button atlas
// ============================================================

import { ImageSourcePropType } from 'react-native';

const BASE = '../../../../../assets/game/pattern-quest';

export const pqAssets = {
  // Backgrounds
  backgrounds: {
    home: require('../../../../../assets/game/pattern-quest/backgrounds/bg_home.png') as ImageSourcePropType,
    universal: require('../../../../../assets/game/pattern-quest/backgrounds/bg_universal.png') as ImageSourcePropType,
    splash: require('../../../../../assets/game/pattern-quest/backgrounds/bg_splash.png') as ImageSourcePropType,
  },

  // Screen Title & Character Plaques (from Pattern Quest Adventure UI Kit)
  plaques: {
    home: require('../../../../../assets/game/pattern-quest/plaques/plaque_home.png') as ImageSourcePropType,
    worldMap: require('../../../../../assets/game/pattern-quest/plaques/plaque_world_map.png') as ImageSourcePropType,
    modeSelection: require('../../../../../assets/game/pattern-quest/plaques/plaque_mode_selection.png') as ImageSourcePropType,
    difficulty: require('../../../../../assets/game/pattern-quest/plaques/plaque_difficulty.png') as ImageSourcePropType,
    patternType: require('../../../../../assets/game/pattern-quest/plaques/plaque_pattern_type.png') as ImageSourcePropType,
    howToPlay: require('../../../../../assets/game/pattern-quest/plaques/plaque_how_to_play.png') as ImageSourcePropType,
    ready: require('../../../../../assets/game/pattern-quest/plaques/plaque_ready.png') as ImageSourcePropType,
    gameplay: require('../../../../../assets/game/pattern-quest/plaques/plaque_pattern_gameplay.png') as ImageSourcePropType,
    correct: require('../../../../../assets/game/pattern-quest/plaques/plaque_correct.png') as ImageSourcePropType,
    wrong: require('../../../../../assets/game/pattern-quest/plaques/plaque_wrong.png') as ImageSourcePropType,
    magicLens: require('../../../../../assets/game/pattern-quest/plaques/plaque_magic_lens.png') as ImageSourcePropType,
    finalResults: require('../../../../../assets/game/pattern-quest/plaques/plaque_final_results.png') as ImageSourcePropType,
    memoryShift: require('../../../../../assets/game/pattern-quest/plaques/plaque_memory_shift.png') as ImageSourcePropType,
    rushMode: require('../../../../../assets/game/pattern-quest/plaques/plaque_rush_mode.png') as ImageSourcePropType,
    pause: require('../../../../../assets/game/pattern-quest/plaques/plaque_pause.png') as ImageSourcePropType,
    levelComplete: require('../../../../../assets/game/pattern-quest/plaques/plaque_level_complete.png') as ImageSourcePropType,
    achievements: require('../../../../../assets/game/pattern-quest/plaques/plaque_achievements.png') as ImageSourcePropType,
    profile: require('../../../../../assets/game/pattern-quest/plaques/plaque_profile.png') as ImageSourcePropType,
    settings: require('../../../../../assets/game/pattern-quest/plaques/plaque_settings.png') as ImageSourcePropType,
    exit: require('../../../../../assets/game/pattern-quest/plaques/plaque_exit.png') as ImageSourcePropType,
  },

  // Main Action Buttons (from Fantasy Game UI Button Atlas)
  buttons: {
    badgeAdventure: require('../../../../../assets/game/pattern-quest/buttons/badge_adventure.png') as ImageSourcePropType,
    playNow: require('../../../../../assets/game/pattern-quest/buttons/btn_play_now.png') as ImageSourcePropType,
    resume: require('../../../../../assets/game/pattern-quest/buttons/btn_resume.png') as ImageSourcePropType,
    restart: require('../../../../../assets/game/pattern-quest/buttons/btn_restart.png') as ImageSourcePropType,
    nextLevel: require('../../../../../assets/game/pattern-quest/buttons/btn_next_level.png') as ImageSourcePropType,
    tryAgain: require('../../../../../assets/game/pattern-quest/buttons/btn_try_again.png') as ImageSourcePropType,
    quit: require('../../../../../assets/game/pattern-quest/buttons/btn_quit.png') as ImageSourcePropType,
    exit: require('../../../../../assets/game/path-mind/buttons/btn_exit.png') as ImageSourcePropType,
    howToPlay: require('../../../../../assets/game/pattern-quest/buttons/btn_how_to_play.png') as ImageSourcePropType,
    hint: require('../../../../../assets/game/pattern-quest/buttons/btn_hint.png') as ImageSourcePropType,
    skip: require('../../../../../assets/game/pattern-quest/buttons/btn_skip.png') as ImageSourcePropType,
    submit: require('../../../../../assets/game/pattern-quest/buttons/btn_submit.png') as ImageSourcePropType,
    clear: require('../../../../../assets/game/pattern-quest/buttons/btn_clear.png') as ImageSourcePropType,
    viewAll: require('../../../../../assets/game/pattern-quest/buttons/btn_view_all.png') as ImageSourcePropType,
    claimReward: require('../../../../../assets/game/pattern-quest/buttons/btn_claim_reward.png') as ImageSourcePropType,
    unlock: require('../../../../../assets/game/pattern-quest/buttons/btn_unlock.png') as ImageSourcePropType,
    edit: require('../../../../../assets/game/pattern-quest/buttons/btn_edit.png') as ImageSourcePropType,
    share: require('../../../../../assets/game/pattern-quest/buttons/btn_share.png') as ImageSourcePropType,
    back: require('../../../../../assets/game/pattern-quest/buttons/btn_back.png') as ImageSourcePropType,
    next: require('../../../../../assets/game/pattern-quest/buttons/btn_next.png') as ImageSourcePropType,
    menu: require('../../../../../assets/game/pattern-quest/buttons/btn_menu.png') as ImageSourcePropType,
    mail: require('../../../../../assets/game/pattern-quest/buttons/btn_mail.png') as ImageSourcePropType,
    
    // Modes
    modePattern: require('../../../../../assets/game/pattern-quest/buttons/btn_mode_pattern.png') as ImageSourcePropType,
    magicLens: require('../../../../../assets/game/pattern-quest/buttons/btn_magic_lens.png') as ImageSourcePropType,
    memoryShift: require('../../../../../assets/game/pattern-quest/buttons/btn_memory_shift.png') as ImageSourcePropType,
    rushMode: require('../../../../../assets/game/pattern-quest/buttons/btn_rush_mode.png') as ImageSourcePropType,

    // Difficulties
    diffEasy: require('../../../../../assets/game/pattern-quest/buttons/btn_diff_easy.png') as ImageSourcePropType,
    diffNormal: require('../../../../../assets/game/pattern-quest/buttons/btn_diff_normal.png') as ImageSourcePropType,
    diffHard: require('../../../../../assets/game/pattern-quest/buttons/btn_diff_hard.png') as ImageSourcePropType,
    diffExpert: require('../../../../../assets/game/pattern-quest/buttons/btn_diff_expert.png') as ImageSourcePropType,

    // Pattern Types
    typeSequence: require('../../../../../assets/game/pattern-quest/buttons/btn_type_sequence.png') as ImageSourcePropType,
    typeShape: require('../../../../../assets/game/pattern-quest/buttons/btn_type_shape.png') as ImageSourcePropType,
    typeColor: require('../../../../../assets/game/pattern-quest/buttons/btn_type_color.png') as ImageSourcePropType,
    typeNumber: require('../../../../../assets/game/pattern-quest/buttons/btn_type_number.png') as ImageSourcePropType,
    typeMixed: require('../../../../../assets/game/pattern-quest/buttons/btn_type_mixed.png') as ImageSourcePropType,

    // Sounds & Controls
    soundOn: require('../../../../../assets/game/pattern-quest/buttons/btn_sound_on.png') as ImageSourcePropType,
    soundOff: require('../../../../../assets/game/pattern-quest/buttons/btn_sound_off.png') as ImageSourcePropType,
    musicOn: require('../../../../../assets/game/pattern-quest/buttons/btn_music_on.png') as ImageSourcePropType,
    musicOff: require('../../../../../assets/game/pattern-quest/buttons/btn_music_off.png') as ImageSourcePropType,
  },

  // Navigation Buttons
  navigation: {
    home: require('../../../../../assets/game/pattern-quest/buttons/nav_home.png') as ImageSourcePropType,
    adventure: require('../../../../../assets/game/pattern-quest/buttons/nav_adventure.png') as ImageSourcePropType,
    modes: require('../../../../../assets/game/pattern-quest/buttons/nav_modes.png') as ImageSourcePropType,
    achievements: require('../../../../../assets/game/pattern-quest/buttons/nav_achievements.png') as ImageSourcePropType,
    profile: require('../../../../../assets/game/pattern-quest/buttons/nav_profile.png') as ImageSourcePropType,
    settings: require('../../../../../assets/game/pattern-quest/buttons/nav_settings.png') as ImageSourcePropType,
  },

  // HUD & Counters
  hud: {
    heartFull: require('../../../../../assets/game/pattern-quest/buttons/hud_heart_full.png') as ImageSourcePropType,
    heartEmpty: require('../../../../../assets/game/pattern-quest/buttons/hud_heart_empty.png') as ImageSourcePropType,
    timer: require('../../../../../assets/game/pattern-quest/buttons/hud_timer.png') as ImageSourcePropType,
    gem: require('../../../../../assets/game/pattern-quest/buttons/hud_gem.png') as ImageSourcePropType,
    coin: require('../../../../../assets/game/pattern-quest/buttons/hud_coin.png') as ImageSourcePropType,
    star: require('../../../../../assets/game/pattern-quest/buttons/hud_star.png') as ImageSourcePropType,
    key: require('../../../../../assets/game/pattern-quest/buttons/hud_key.png') as ImageSourcePropType,
    fire: require('../../../../../assets/game/pattern-quest/buttons/hud_fire.png') as ImageSourcePropType,
    crystal: require('../../../../../assets/game/pattern-quest/buttons/hud_crystal.png') as ImageSourcePropType,
  },

  // Icons & Regional Previews
  icons: {
    home: require('../../../../../assets/game/pattern-quest/icons/icon_home.png') as ImageSourcePropType,
    map: require('../../../../../assets/game/pattern-quest/icons/icon_map.png') as ImageSourcePropType,
    pause: require('../../../../../assets/game/pattern-quest/icons/icon_pause.png') as ImageSourcePropType,
    play: require('../../../../../assets/game/pattern-quest/icons/icon_play.png') as ImageSourcePropType,
    arrowLeft: require('../../../../../assets/game/pattern-quest/icons/icon_arrow_left.png') as ImageSourcePropType,
    arrowRight: require('../../../../../assets/game/pattern-quest/icons/icon_arrow_right.png') as ImageSourcePropType,
    settings: require('../../../../../assets/game/pattern-quest/icons/icon_settings.png') as ImageSourcePropType,
    chestBackpack: require('../../../../../assets/game/pattern-quest/icons/icon_chest_backpack.png') as ImageSourcePropType,
    help: require('../../../../../assets/game/pattern-quest/icons/icon_help.png') as ImageSourcePropType,
    lightbulb: require('../../../../../assets/game/pattern-quest/icons/icon_lightbulb.png') as ImageSourcePropType,
    crown: require('../../../../../assets/game/pattern-quest/icons/icon_crown.png') as ImageSourcePropType,
    lock: require('../../../../../assets/game/pattern-quest/icons/icon_lock.png') as ImageSourcePropType,
    toggleOn: require('../../../../../assets/game/pattern-quest/icons/toggle_on.png') as ImageSourcePropType,
    toggleOff: require('../../../../../assets/game/pattern-quest/icons/toggle_off.png') as ImageSourcePropType,
    treasureChest: require('../../../../../assets/game/pattern-quest/icons/icon_treasure_chest.png') as ImageSourcePropType,
    compass: require('../../../../../assets/game/pattern-quest/icons/icon_compass.png') as ImageSourcePropType,

    // Regions for World Map
    regionJungleGate: require('../../../../../assets/game/pattern-quest/icons/region_jungle_gate.png') as ImageSourcePropType,
    regionCrystalRiver: require('../../../../../assets/game/pattern-quest/icons/region_crystal_river.png') as ImageSourcePropType,
    regionHiddenTemple: require('../../../../../assets/game/pattern-quest/icons/region_hidden_temple.png') as ImageSourcePropType,
    regionCrystalCave: require('../../../../../assets/game/pattern-quest/icons/region_crystal_cave.png') as ImageSourcePropType,
    regionAncientVault: require('../../../../../assets/game/pattern-quest/icons/region_ancient_vault.png') as ImageSourcePropType,
  }
};
