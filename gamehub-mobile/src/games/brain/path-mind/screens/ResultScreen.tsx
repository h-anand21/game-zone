// ============================================================
// PATH MIND — Screen 17: ResultScreen
// Chamber Conquered Celebration, 3-Star Rating & Rewards Dossier
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ResultScreen: React.FC = () => {
  const {
    setScreen,
    currentLevel,
    score,
    combo,
    hearts,
    coins,
    addCoins,
  } = usePathMindStore();

  const handleNextLevel = () => {
    usePathMindStore.setState({ currentLevel: currentLevel + 1 });
    addCoins(25);
    setScreen('gameplay');
  };

  const handleReplay = () => {
    setScreen('gameplay');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('world_map')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <View style={styles.container}>
        <TitlePlaque
          imageSource={pmAssets.plaques.results}
          style={styles.titlePlaque}
        />

        {/* 3 Golden Stars Plaque */}
        <View style={styles.starRow}>
          <Text style={styles.starLarge}>★</Text>
          <Text style={[styles.starLarge, styles.starCenter]}>★</Text>
          <Text style={styles.starLarge}>★</Text>
        </View>

        {/* Rewards Panel */}
        <GamePanel variant="stone" style={styles.rewardPanel}>
          <Text style={styles.panelTitle}>CHAMBER SUMMARY</Text>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CHAMBER SCORE</Text>
              <Text style={[styles.statValue, { color: pmColors.goldBright }]}>
                {score > 0 ? score : 1450}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MAX COMBO</Text>
              <Text style={[styles.statValue, { color: pmColors.cyanGlow }]}>
                x{combo > 0 ? combo : 5}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HEARTS SAVED</Text>
              <Text style={[styles.statValue, { color: pmColors.dangerRed }]}>
                {'♥ '.repeat(hearts || 3)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>COINS EARNED</Text>
              <Text style={[styles.statValue, { color: pmColors.goldBright }]}>
                +35 ◉
              </Text>
            </View>
          </View>
        </GamePanel>

        {/* Primary Action Buttons */}
        <View style={styles.buttonStack}>
          <GameButton
            imageSource={pmAssets.buttons.next}
            label="NEXT CHAMBER"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 250)}
            height={66}
            onPress={handleNextLevel}
            accessibilityLabel="Next Chamber"
          />

          <View style={styles.actionRow}>
            <GameButton
              imageSource={pmAssets.buttons.restart}
              label="REPLAY"
              size="small"
              width={130}
              height={46}
              onPress={handleReplay}
              accessibilityLabel="Replay Chamber"
            />

            <GameButton
              imageSource={pmAssets.buttons.worldMapGreen}
              label="WORLD MAP"
              size="small"
              width={136}
              height={46}
              onPress={() => setScreen('world_map')}
              accessibilityLabel="World Map"
            />
          </View>

          <GameButton
            imageSource={pmAssets.buttons.home}
            label="RETURN HOME"
            size="small"
            width={130}
            height={42}
            onPress={() => setScreen('home')}
            accessibilityLabel="Return Home"
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  starLarge: {
    fontSize: 44,
    color: pmColors.goldBright,
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  starCenter: {
    fontSize: 56,
    marginBottom: 12,
  },
  rewardPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 16,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: pmColors.textCyan,
    letterSpacing: 1,
    marginBottom: 12,
  },
  statGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(6, 12, 18, 0.85)',
    borderRadius: pmRadii.md,
    borderWidth: 1,
    borderColor: pmColors.stoneBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: pmColors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  buttonStack: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
});
