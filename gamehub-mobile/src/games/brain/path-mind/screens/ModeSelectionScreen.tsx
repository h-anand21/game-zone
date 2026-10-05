// ============================================================
// PATH MIND — Screen 03: ModeSelectionScreen
// Choose Your Mode: Classic, Number Trail, Mixed, Challenge, Daily
// Auto-scroll on selection, authentic button assets, responsive layout
// ============================================================

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameModeItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  color: string;
}

const MODES: GameModeItem[] = [
  {
    id: 'classic',
    title: 'CLASSIC PATH',
    desc: 'Watch the sacred glowing runes and retrace the path from start to goal.',
    badge: 'CORE EXPEDITION',
    color: pmColors.gold,
  },
  {
    id: 'number_trail',
    title: 'NUMBER TRAIL',
    desc: 'Follow the ancient sequence numbers in ascending order 1 → 2 → 3.',
    badge: 'SEQUENCE MEMORY',
    color: pmColors.cyan,
  },
  {
    id: 'mixed_path',
    title: 'MIXED PATH',
    desc: 'Dual challenge: combine rune color transformations with path recall.',
    badge: 'ADVANCED MIND',
    color: pmColors.relicPurple,
  },
  {
    id: 'challenge_path',
    title: 'CHALLENGE PATH',
    desc: 'Rapid memory shift with decoys, moving obstacles, and tight timer.',
    badge: 'HARDCORE RUN',
    color: pmColors.dangerRed,
  },
  {
    id: 'daily_path',
    title: 'DAILY PATH',
    desc: "Today's global ancient puzzle with special rewards and streak stars.",
    badge: 'DAILY REWARD',
    color: pmColors.successGreen,
  },
];

export const ModeSelectionScreen: React.FC = () => {
  const { setScreen, selectedMode, hearts, coins } = usePathMindStore();
  const [activeMode, setActiveMode] = useState<string>(selectedMode || 'CLASSIC PATH');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelectMode = (mode: GameModeItem) => {
    setActiveMode(mode.title);
    usePathMindStore.setState({ selectedMode: mode.title });

    // Smooth auto-scroll down to the proceed action button
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleProceed = () => {
    usePathMindStore.setState({ selectedMode: activeMode });
    if (activeMode === 'DAILY PATH') {
      setScreen('daily');
    } else {
      setScreen('difficulty');
    }
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('home')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TitlePlaque
          imageSource={pmAssets.plaques.gameplay}
          style={styles.titlePlaque}
        />

        <View style={styles.cardContainer}>
          {MODES.map((mode) => {
            const isSelected = activeMode === mode.title;

            return (
              <Pressable
                key={mode.id}
                onPress={() => handleSelectMode(mode)}
                style={({ pressed }) => [
                  styles.modeCard,
                  { borderColor: isSelected ? mode.color : pmColors.stoneBorder },
                  isSelected && {
                    backgroundColor: 'rgba(12, 28, 40, 0.96)',
                    borderLeftWidth: 6,
                    borderLeftColor: mode.color,
                  },
                  pressed && styles.pressed,
                ]}
              >
                {/* Header row in card */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.badgePill, { borderColor: mode.color }]}>
                    <Text style={[styles.badgeText, { color: mode.color }]}>
                      {mode.badge}
                    </Text>
                  </View>
                  {isSelected && (
                    <Text style={[styles.selectedStar, { color: mode.color }]}>★ SELECTED</Text>
                  )}
                </View>

                {/* Title */}
                <Text style={[styles.modeTitle, { color: mode.color }]}>
                  {mode.title}
                </Text>

                {/* Description */}
                <Text style={styles.modeDesc}>{mode.desc}</Text>

                {/* Bottom Action Indicator */}
                <View style={styles.cardActionRow}>
                  <Text style={[styles.enterText, { color: mode.color }]}>
                    {isSelected ? 'TAP PROCEED BELOW ↓' : 'SELECT MODE →'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Custom Builder Promo Banner */}
        <Pressable
          style={styles.builderBanner}
          onPress={() => setScreen('builder')}
        >
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>🛠️ BUILD YOUR OWN PATH</Text>
            <Text style={styles.bannerSub}>Create, edit and share custom puzzles</Text>
          </View>
          <Text style={styles.bannerArrow}>→</Text>
        </Pressable>

        {/* Next / Proceed Action Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            imageSource={pmAssets.buttons.letsPlayGreen}
            label="LET'S PLAY"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 250)}
            height={66}
            onPress={handleProceed}
            accessibilityLabel="Proceed to Expedition"
          />

          <View style={styles.subRow}>
            <GameButton
              imageSource={pmAssets.buttons.howToPlayCyan}
              label="HOW TO PLAY"
              size="small"
              width={145}
              height={48}
              onPress={() => setScreen('how_to_play')}
              accessibilityLabel="How To Play"
            />
            <GameButton
              imageSource={pmAssets.buttons.worldMapWood}
              label="WORLD MAP"
              size="small"
              width={145}
              height={48}
              onPress={() => setScreen('world_map')}
              accessibilityLabel="World Map"
            />
          </View>
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginBottom: 16,
    marginTop: 4,
  },
  cardContainer: {
    width: '100%',
    gap: 12,
  },
  modeCard: {
    width: '100%',
    backgroundColor: 'rgba(14, 22, 30, 0.92)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: pmRadii.lg,
    padding: 16,
    ...pmShadows.medium,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgePill: {
    borderWidth: 1,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  selectedStar: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modeDesc: {
    ...pmTypography.bodyMedium,
    color: pmColors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  enterText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  builderBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 40, 16, 0.9)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: pmColors.woodHighlight,
    borderRadius: pmRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    ...pmShadows.medium,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.8,
  },
  bannerSub: {
    fontSize: 11,
    color: pmColors.textWood,
    marginTop: 2,
  },
  bannerArrow: {
    fontSize: 20,
    fontWeight: '900',
    color: pmColors.goldBright,
    marginLeft: 8,
  },
  ctaWrap: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  subRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
});
