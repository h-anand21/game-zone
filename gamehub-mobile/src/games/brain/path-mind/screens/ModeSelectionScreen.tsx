// ============================================================
// PATH MIND — Screen 03: ModeSelectionScreen ("CHOOSE YOUR MODE")
// Premium Fantasy Adventure Memory Game — 4 Expedition Disciplines
// Built with GameScreen, GameResourceHUD, GameTitlePlaque, ModeCard
// Staggered entrance, tactile 2.5D stone/wood materials, responsive mobile UI
// ============================================================

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import { GameScreen } from '../components/ui/GameScreen';
import { GameResourceHUD } from '../components/ui/GameResourceHUD';
import { GameTitlePlaque } from '../components/ui/GameTitlePlaque';
import { ModeCard } from '../components/ui/ModeCard';
import { GameButton } from '../components/ui/GameButton';
import { ExplorerCharacter } from '../components/ui/ExplorerCharacter';
import { usePathMindStore } from '../store/pathMindStore';
import { MODES, GameModeConfig, ModeId } from '../modeConfig';
import { pmAssets } from '../design-system/uiAssets';
import { pmShadows } from '../design-system/shadows';

export const ModeSelectionScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const {
    setScreen,
    selectedMode,
    hearts,
    coins,
    crystals,
    hapticsEnabled,
  } = usePathMindStore();

  // Find matching initial mode from store or default to 'classic'
  const initialMode = MODES.find((m) => m.title === selectedMode)?.id || 'classic';
  const [selectedModeId, setSelectedModeId] = useState<ModeId>(initialMode);

  const scrollViewRef = useRef<ScrollView>(null);

  // Staggered entrance animations for title and 4 mode cards
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(MODES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Fade & slide in Title Plaque
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // 2. Staggered entrance for the 4 mode cards
    const cardStagger = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        delay: index * 60,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, cardStagger).start();
  }, [titleAnim, cardAnims]);

  const handleSelectMode = (mode: GameModeConfig) => {
    setSelectedModeId(mode.id);
    usePathMindStore.setState({ selectedMode: mode.title });

    if (hapticsEnabled) {
      Vibration.vibrate(20);
    }

    // Smooth auto-scroll down to make sure proceed CTA is comfortably visible
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleProceed = (mode?: GameModeConfig) => {
    const chosenMode = mode || MODES.find((m) => m.id === selectedModeId);
    if (chosenMode) {
      usePathMindStore.setState({ selectedMode: chosenMode.title });
    }

    if (hapticsEnabled) {
      Vibration.vibrate(35);
    }

    // Direct progression to Difficulty Selection Screen with chosen mode
    setScreen('difficulty');
  };

  return (
    <GameScreen variant="universal" overlayDarkness={0.22}>
      <View style={styles.container}>
        {/* ============================================================ */}
        {/* 1. TOP GLOBAL HUD: Back Button (Left) & Resource HUD (Right) */}
        {/* ============================================================ */}
        <View style={styles.topHudBar}>
          <GameButton
            imageSource={pmAssets.buttons.back}
            label="BACK"
            size="small"
            width={78}
            height={36}
            onPress={() => setScreen('home')}
            accessibilityLabel="Back to Home"
          />

          <GameResourceHUD
            hearts={hearts}
            coins={coins}
            crystals={crystals}
            onCoinsPress={() => {}}
            onHeartsPress={() => {}}
            onCrystalsPress={() => {}}
          />
        </View>

        {/* ============================================================ */}
        {/* 2. SCROLLABLE EXPEDITION DISCIPLINES                         */}
        {/* ============================================================ */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Title Plaque */}
          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-16, 0],
                  }),
                },
              ],
            }}
          >
            <GameTitlePlaque
              title="CHOOSE YOUR MODE"
              subtitle="SELECT EXPEDITION DISCIPLINE"
              style={styles.titlePlaque}
            />
          </Animated.View>

          {/* Four Mode Cards: Classic, Number Trail, Mixed, Challenge */}
          <View style={styles.cardList}>
            {MODES.map((mode, index) => {
              const isSelected = selectedModeId === mode.id;
              const anim = cardAnims[index];

              return (
                <Animated.View
                  key={mode.id}
                  style={{
                    opacity: anim,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <ModeCard
                    mode={mode}
                    isSelected={isSelected}
                    onSelect={handleSelectMode}
                    onProceed={handleProceed}
                  />
                </Animated.View>
              );
            })}
          </View>

          {/* ============================================================ */}
          {/* 3. BOTTOM ACTION AREA: Proceed Button & Environmental Space */}
          {/* ============================================================ */}
          <View style={styles.bottomSection}>
            {/* Primary Proceed CTA Button */}
            <GameButton
              imageSource={pmAssets.buttons.letsPlayGreen}
              label="CONTINUE TO EXPEDITION"
              size="large"
              width={Math.min(width - 48, 255)}
              height={66}
              onPress={() => handleProceed()}
              accessibilityLabel="Continue to Expedition"
            />

            {/* Quick Fantasy Shortcuts: How to Play & World Map */}
            <View style={styles.subActionRow}>
              <GameButton
                imageSource={pmAssets.buttons.howToPlayCyan}
                label="HOW TO PLAY"
                size="small"
                width={138}
                height={46}
                onPress={() => setScreen('how_to_play')}
                accessibilityLabel="How To Play"
              />
              <GameButton
                imageSource={pmAssets.buttons.worldMapWood}
                label="WORLD MAP"
                size="small"
                width={138}
                height={46}
                onPress={() => setScreen('world_map')}
                accessibilityLabel="World Map"
              />
            </View>

            {/* Small Ambient Adventurer in Non-Obtrusive Environmental Space */}
            <View style={styles.characterContainer} pointerEvents="none">
              <ExplorerCharacter size={54} mood="idle" />
            </View>
          </View>
        </ScrollView>
      </View>
    </GameScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHudBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    zIndex: 20,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 40,
    alignItems: 'center',
  },
  titlePlaque: {
    marginTop: 2,
    marginBottom: 10,
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
    position: 'relative',
    gap: 12,
  },
  subActionRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  characterContainer: {
    position: 'absolute',
    left: 4,
    bottom: -8,
    opacity: 0.85,
  },
});
