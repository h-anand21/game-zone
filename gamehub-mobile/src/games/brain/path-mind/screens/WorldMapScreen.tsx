// ============================================================
// PATH MIND — Screen 06: WorldMapScreen
// Chamber Adventure Map with interconnected temple nodes
// Responsive winding trail, star ratings, and chamber launching
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
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

interface ChamberNode {
  level: number;
  name: string;
  stars: number; // 0..3
  isUnlocked: boolean;
  isBoss?: boolean;
}

const TOTAL_LEVELS = 18;

export const WorldMapScreen: React.FC = () => {
  const { setScreen, currentLevel, hearts, coins } = usePathMindStore();

  const chambers: ChamberNode[] = Array.from({ length: TOTAL_LEVELS }).map((_, idx) => {
    const lvl = idx + 1;
    const isUnlocked = lvl <= currentLevel + 1;
    const isCurrent = lvl === currentLevel;
    const stars = lvl < currentLevel ? 3 : isCurrent ? 2 : 0;
    const isBoss = lvl % 5 === 0;

    return {
      level: lvl,
      name: isBoss ? `BOSS SHRINE ${lvl}` : `CHAMBER ${lvl}`,
      stars,
      isUnlocked,
      isBoss,
    };
  });

  const handleSelectChamber = (chamber: ChamberNode) => {
    if (!chamber.isUnlocked) return;
    usePathMindStore.setState({ currentLevel: chamber.level });
    setScreen('gameplay');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitlePlaque
          imageSource={pmAssets.plaques.maps}
          style={styles.titlePlaque}
        />

        {/* Trail Nodes Grid/Timeline */}
        <View style={styles.mapGrid}>
          {chambers.map((node, index) => {
            const isCurrent = node.level === currentLevel;
            const isCompleted = node.level < currentLevel;

            return (
              <View key={node.level} style={styles.nodeWrapper}>
                <Pressable
                  onPress={() => handleSelectChamber(node)}
                  disabled={!node.isUnlocked}
                  style={({ pressed }) => [
                    styles.nodeCircle,
                    node.isBoss && styles.bossCircle,
                    isCurrent && styles.activeCircle,
                    isCompleted && styles.completedCircle,
                    !node.isUnlocked && styles.lockedCircle,
                    pressed && styles.pressed,
                  ]}
                >
                  {node.isUnlocked ? (
                    <Text
                      style={[
                        styles.nodeNumber,
                        isCurrent && styles.activeNumber,
                        isCompleted && styles.completedNumber,
                      ]}
                    >
                      {node.level}
                    </Text>
                  ) : (
                    <Text style={styles.lockIcon}>🔒</Text>
                  )}

                  {/* Pulsing indicator on current */}
                  {isCurrent && <View style={styles.pulseDot} />}
                </Pressable>

                {/* Stars under chamber */}
                <View style={styles.starRow}>
                  {node.isUnlocked ? (
                    <Text style={styles.starText}>
                      {'★'.repeat(node.stars)}
                      {'☆'.repeat(3 - node.stars)}
                    </Text>
                  ) : (
                    <Text style={styles.lockedText}>LOCKED</Text>
                  )}
                </View>

                {/* Chamber Name */}
                <Text
                  style={[
                    styles.nodeName,
                    isCurrent && { color: pmColors.cyanGlow, fontWeight: '900' },
                  ]}
                  numberOfLines={1}
                >
                  {node.isBoss ? '👑 SHRINE' : `CH. ${node.level}`}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Play Current Button CTA */}
        <View style={styles.ctaWrap}>
          <GameButton
            imageSource={pmAssets.buttons.letsPlayGold}
            label="LET'S PLAY"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 250)}
            height={66}
            onPress={() => setScreen('gameplay')}
            accessibilityLabel={`Enter Chamber ${currentLevel}`}
          />
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
  mapGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    paddingVertical: 8,
  },
  nodeWrapper: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 64) / 3,
    marginBottom: 8,
  },
  nodeCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(16, 26, 36, 0.94)',
    borderWidth: 3,
    borderBottomWidth: 5,
    borderColor: pmColors.stoneBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...pmShadows.medium,
  },
  bossCircle: {
    borderColor: pmColors.goldBright,
    backgroundColor: 'rgba(40, 26, 12, 0.95)',
  },
  activeCircle: {
    borderColor: pmColors.cyanGlow,
    backgroundColor: 'rgba(0, 80, 110, 0.95)',
    ...pmShadows.glowCyan,
  },
  completedCircle: {
    borderColor: pmColors.gold,
    backgroundColor: 'rgba(30, 40, 24, 0.95)',
  },
  lockedCircle: {
    opacity: 0.45,
    borderColor: '#1D2A35',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: pmColors.textPrimary,
  },
  activeNumber: {
    color: '#FFFFFF',
  },
  completedNumber: {
    color: pmColors.goldBright,
  },
  lockIcon: {
    fontSize: 16,
  },
  pulseDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: pmColors.cyanGlow,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  starRow: {
    marginTop: 4,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 11,
    color: pmColors.goldBright,
    fontWeight: '900',
  },
  lockedText: {
    fontSize: 8,
    color: pmColors.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nodeName: {
    fontSize: 10,
    color: pmColors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  ctaWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
});
