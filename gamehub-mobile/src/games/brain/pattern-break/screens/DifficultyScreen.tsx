// ============================================================
// PATTERN BREAKER — 05 Difficulty Screen (Play Section)
// Clean Level Selection, Authentic 3D Badges, Default Random Mode
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { PBDifficulty } from '../types';
import { PBColors, PBRadius, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

interface LevelOption {
  id: PBDifficulty;
  title: string;
  badge: ImageSourcePropType;
  clock: string;
  desc: string;
  color: string;
}

const LEVELS: LevelOption[] = [
  {
    id: 'EASY',
    title: 'EXPLORER',
    badge: uiAssets.difficulty.easy,
    clock: '30s',
    desc: 'Single property rules • Relaxed pace',
    color: '#38E58C',
  },
  {
    id: 'MEDIUM',
    title: 'THINKER',
    badge: uiAssets.difficulty.medium,
    clock: '20s',
    desc: 'Dual-layer relationships • Balanced speed',
    color: '#19D3FF',
  },
  {
    id: 'HARD',
    title: 'BREAKER',
    badge: uiAssets.difficulty.hard,
    clock: '12s',
    desc: 'Multi-vector complexity • Adrenaline rush',
    color: '#FF5C61',
  },
];

export const DifficultyScreen: React.FC = () => {
  const {
    difficulty,
    setDifficulty,
    setScreen,
    goBack,
    startNewRun,
    patternType,
    playMode,
  } = usePatternBreakStore();

  const handleSelect = (diff: PBDifficulty) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setDifficulty(diff);
  };

  const handleStartGame = () => {
    startNewRun();
  };

  const formattedRuleName = patternType === 'RANDOM' ? 'RANDOM SHUFFLE' : patternType;
  const formattedModeName =
    playMode === 'shift' ? 'SHIFT RUN' : playMode === 'daily' ? 'DAILY EXPEDITION' : 'QUICK SOLVE';

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 3D Sculpted Screen Name Badge */}
          <ScreenPlaque type="difficulty" height={95} />

          {/* Level Options List */}
          <View style={styles.levelList}>
            {LEVELS.map((lvl) => {
              const isSelected = difficulty === lvl.id;
              return (
                <Pressable
                  key={lvl.id}
                  onPress={() => handleSelect(lvl.id)}
                  style={[
                    styles.levelCard,
                    isSelected ? styles.levelCardSelected : styles.levelCardUnselected,
                  ]}
                >
                  {/* Left: Authentic 3D Carved Badge */}
                  <View style={styles.badgeHolder}>
                    <Image
                      source={lvl.badge}
                      style={styles.difficultyBadgeImg}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Middle: Title & Description */}
                  <View style={styles.levelInfo}>
                    <View style={styles.levelTitleRow}>
                      <Text
                        style={[
                          styles.levelTitleText,
                          isSelected && { color: PBColors.primary },
                        ]}
                      >
                        {lvl.title}
                      </Text>
                      <View style={[styles.clockBadge, { borderColor: lvl.color }]}>
                        <Text style={[styles.clockBadgeText, { color: lvl.color }]}>
                          ⏱ {lvl.clock}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.levelDescText}>{lvl.desc}</Text>
                  </View>

                  {/* Right: Selected Glow Pip */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Custom Game Mode Section */}
          <View style={styles.customSectionHeader}>
            <View style={styles.cyanPill} />
            <View style={styles.customTextGroup}>
              <Text style={styles.customSectionTitle}>CUSTOM GAMEPLAY MODE</Text>
              <Text style={styles.customSectionSubtitle}>
                Shuffles random rules each round by default
              </Text>
            </View>
          </View>

          {/* Custom Mode Card */}
          <Pressable
            onPress={() => setScreen('pattern_type')}
            style={styles.customCard}
          >
            <View style={styles.customCardLeft}>
              <View style={styles.iconCircle}>
                <Image
                  source={uiAssets.icons.shuffle}
                  style={styles.shuffleIconImg}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.customCardInfo}>
                <Text style={styles.ruleTitleText}>
                  RULE: {formattedRuleName}
                </Text>
                <Text style={styles.ruleSubText}>
                  MODE: {formattedModeName} • Tap to change rules
                </Text>
              </View>
            </View>

            <View style={styles.changeBadge}>
              <Text style={styles.changeBadgeText}>CHANGE ⚙️</Text>
            </View>
          </Pressable>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Primary Action Button */}
        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.start}
            height={66}
            onPress={handleStartGame}
            accessibilityLabel="Start Game"
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  levelList: {
    gap: 10,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: PBRadius.md,
    padding: 10,
    gap: 12,
    borderWidth: 1.5,
  },
  levelCardUnselected: {
    backgroundColor: 'rgba(16, 35, 44, 0.85)',
    borderColor: 'rgba(25, 211, 255, 0.2)',
  },
  levelCardSelected: {
    backgroundColor: 'rgba(25, 211, 255, 0.15)',
    borderColor: PBColors.primary,
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeHolder: {
    width: 100,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyBadgeImg: {
    width: '100%',
    height: '100%',
  },
  levelInfo: {
    flex: 1,
    gap: 4,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  clockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  clockBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  levelDescText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: PBColors.textSecondary,
    lineHeight: 14,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: PBColors.primary,
    backgroundColor: 'rgba(25, 211, 255, 0.2)',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PBColors.primary,
  },

  // Custom Game Mode Section
  customSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  cyanPill: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: PBColors.accent,
  },
  customTextGroup: {
    flex: 1,
  },
  customSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  customSectionSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: PBColors.textSecondary,
  },
  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 35, 44, 0.92)',
    borderRadius: PBRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 213, 74, 0.35)',
    padding: 12,
    gap: 10,
  },
  customCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 213, 74, 0.15)',
    borderWidth: 1,
    borderColor: PBColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleIconImg: {
    width: 22,
    height: 22,
  },
  customCardInfo: {
    flex: 1,
    gap: 2,
  },
  ruleTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  ruleSubText: {
    fontSize: 10,
    color: PBColors.textMuted,
  },
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 213, 74, 0.2)',
    borderWidth: 1,
    borderColor: PBColors.accent,
  },
  changeBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 0.8,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
});
