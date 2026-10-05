// ============================================================
// PATH MIND — Screen 06: WorldMapScreen
// Infinite Level Map with 10-Chamber Exploration Zones
// Every 10 levels unlock a new ancient realm with a Boss Shrine
// Infinite progression independent of difficulty setting
// ============================================================

import React, { useState, useEffect } from 'react';
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
import { LockIcon, StarIcon, CrownIcon } from '../components/ui/GameSvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChamberNode {
  level: number;
  name: string;
  stars: number; // 0..3
  isUnlocked: boolean;
  isBoss?: boolean;
}

const ZONE_NAMES = [
  'SUNSET JUNGLE',
  'CRYSTAL CAVERNS',
  'ANCIENT RUINS',
  'ASTRAL TEMPLE',
  'VOLCANIC SHRINE',
  'CELESTIAL GATEWAY',
  'EMERALD SANCTUARY',
  'SHADOW LABYRINTH',
  'MYSTIC CANYON',
  'TITAN CITADEL',
];

export const WorldMapScreen: React.FC = () => {
  const { setScreen, currentLevel, hearts, coins } = usePathMindStore();

  // Each zone contains 10 levels
  const currentZone = Math.max(1, Math.floor((currentLevel - 1) / 10) + 1);
  const [selectedZone, setSelectedZone] = useState<number>(currentZone);

  // Sync to current player zone if player level advances
  useEffect(() => {
    setSelectedZone(currentZone);
  }, [currentZone]);

  const maxUnlockedZone = currentZone;
  const zoneStart = (selectedZone - 1) * 10 + 1;
  const zoneEnd = selectedZone * 10;
  const zoneTitle =
    selectedZone <= ZONE_NAMES.length
      ? ZONE_NAMES[selectedZone - 1]
      : `EXPEDITION REALM ${selectedZone}`;

  // Generate 10 chambers for the selected zone
  const chambers: ChamberNode[] = Array.from({ length: 10 }).map((_, idx) => {
    const lvl = zoneStart + idx;
    const isUnlocked = lvl <= currentLevel;
    const isCurrent = lvl === currentLevel;
    const stars = lvl < currentLevel ? 3 : isCurrent ? 2 : 0;
    const isBoss = lvl % 10 === 0;

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

  const completedInZone = chambers.filter((c) => c.level < currentLevel).length;

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Authentic Menu Plaque Atlas Title */}
        <TitlePlaque
          imageSource={pmAssets.plaques.maps}
          style={styles.titlePlaque}
        />

        {/* ============================================================ */}
        {/* INFINITE ZONE SELECTOR & CHAPTER BANNER                     */}
        {/* ============================================================ */}
        <View style={styles.zoneNavRow}>
          <Pressable
            onPress={() => setSelectedZone((z) => Math.max(1, z - 1))}
            disabled={selectedZone <= 1}
            style={({ pressed }) => [
              styles.zoneArrowBtn,
              selectedZone <= 1 && styles.zoneArrowDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.zoneArrowText}>◀</Text>
          </Pressable>

          <View style={styles.zoneInfoPlaque}>
            {/* Corner metal rivets */}
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />

            <Text style={styles.zoneNameText} numberOfLines={1}>
              ZONE {selectedZone}: {zoneTitle}
            </Text>
            <View style={styles.zoneSubRow}>
              <Text style={styles.zoneChamberRange}>
                CHAMBERS {zoneStart} - {zoneEnd}
              </Text>
              <View style={styles.zoneProgressPill}>
                <Text style={styles.zoneProgressText}>
                  {completedInZone}/10 CLEARED
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => setSelectedZone((z) => Math.min(maxUnlockedZone + 1, z + 1))}
            disabled={selectedZone >= maxUnlockedZone}
            style={({ pressed }) => [
              styles.zoneArrowBtn,
              selectedZone >= maxUnlockedZone && styles.zoneArrowDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.zoneArrowText}>▶</Text>
          </Pressable>
        </View>

        {/* Trail Nodes Grid (10 Levels per Zone) */}
        <View style={styles.mapGrid}>
          {chambers.map((node) => {
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
                    <LockIcon size={18} color="#8A9BA8" />
                  )}

                  {/* Pulsing indicator on current active level */}
                  {isCurrent && <View style={styles.pulseDot} />}
                </Pressable>

                {/* Stars under chamber */}
                <View style={styles.starRow}>
                  {node.isUnlocked ? (
                    <View style={styles.starIconsGroup}>
                      {[0, 1, 2].map((sIndex) => (
                        <StarIcon
                          key={sIndex}
                          size={10}
                          color="#FFD700"
                          filled={sIndex < node.stars}
                        />
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.lockedText}>LOCKED</Text>
                  )}
                </View>

                {/* Chamber Name */}
                <View style={styles.chamberNameRow}>
                  {node.isBoss && <CrownIcon size={11} color="#FFD700" />}
                  <Text
                    style={[
                      styles.nodeName,
                      isCurrent && { color: pmColors.cyanGlow, fontWeight: '900' },
                      node.isBoss && { color: pmColors.goldBright, fontWeight: '900' },
                    ]}
                    numberOfLines={1}
                  >
                    {node.isBoss ? 'BOSS SHRINE' : `CH. ${node.level}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Play Current Button CTA - Enlaraged Size */}
        <View style={styles.ctaWrap}>
          <GameButton
            imageSource={pmAssets.buttons.letsPlayGold}
            label="ENTER EXPEDITION"
            size="large"
            width={Math.min(SCREEN_WIDTH - 40, 280)}
            height={76}
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
    marginBottom: 12,
    marginTop: 4,
  },

  // Zone Navigation Plaque
  zoneNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Math.min(SCREEN_WIDTH - 32, 360),
    marginBottom: 16,
    gap: 8,
  },
  zoneArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: pmRadii.md,
    backgroundColor: '#2A180E',
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderColor: '#7A4D10',
    alignItems: 'center',
    justifyContent: 'center',
    ...pmShadows.medium,
  },
  zoneArrowDisabled: {
    opacity: 0.35,
    borderColor: '#3D2A1C',
  },
  zoneArrowText: {
    color: '#FFE27A',
    fontSize: 14,
    fontWeight: '900',
  },
  zoneInfoPlaque: {
    flex: 1,
    backgroundColor: 'rgba(16, 26, 36, 0.96)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#4A6278',
    borderRadius: pmRadii.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    position: 'relative',
    ...pmShadows.heavy,
  },
  rivet: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFE066',
    opacity: 0.8,
  },
  rivetTL: { top: 4, left: 4 },
  rivetTR: { top: 4, right: 4 },
  rivetBL: { bottom: 4, left: 4 },
  rivetBR: { bottom: 4, right: 4 },

  zoneNameText: {
    fontFamily: pmTypography.displaySection.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  zoneSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  zoneChamberRange: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: pmColors.cyanGlow,
    letterSpacing: 0.8,
  },
  zoneProgressPill: {
    backgroundColor: 'rgba(0, 168, 204, 0.15)',
    borderWidth: 1,
    borderColor: pmColors.cyanGlow,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  zoneProgressText: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Trail Nodes Grid
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
    borderBottomColor: '#7A4D10',
    backgroundColor: 'rgba(40, 26, 12, 0.95)',
    ...pmShadows.glowGold,
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
  starIconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chamberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
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
    marginTop: 20,
    alignItems: 'center',
  },
});
