// ============================================================
// PATTERN QUEST — Screen 03: WorldMapScreen
// Mystic Island Adventure Map with 6 connected regions,
// authentic SVG Expedition Flag checkpoint markers,
// stars, lock states, regional artwork, and expedition flow
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { ExpeditionFlagSvg } from '../components/common/ExpeditionFlagSvg';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WorldMapScreen: React.FC = () => {
  const { currentScreen, setScreen, mapRegions, selectRegion } = usePatternQuestStore();

  const getRegionImage = (id: string) => {
    switch (id) {
      case 'jungle_gate':
        return pqAssets.icons.regionJungleGate;
      case 'crystal_river':
        return pqAssets.icons.regionCrystalRiver;
      case 'hidden_temple':
        return pqAssets.icons.regionHiddenTemple;
      case 'crystal_cave':
        return pqAssets.icons.regionCrystalCave;
      case 'sky_ruins':
        return pqAssets.icons.regionHiddenTemple;
      case 'ancient_vault':
      default:
        return pqAssets.icons.regionAncientVault;
    }
  };

  const handleRegionPress = (index: number) => {
    const region = mapRegions[index];
    if (!region.unlocked) return;
    selectRegion(index);
    setScreen('ready');
  };

  // Calculate campaign metrics
  const unlockedCount = mapRegions.filter((r) => r.unlocked).length;
  const totalStars = mapRegions.reduce((sum, r) => sum + r.stars, 0);
  const maxStars = mapRegions.reduce((sum, r) => sum + r.maxStars, 0);

  // Identify currently active expedition checkpoint
  const activeIndex = (() => {
    const uncompleted = mapRegions.findIndex((r) => r.unlocked && r.stars < r.maxStars);
    if (uncompleted !== -1) return uncompleted;
    return mapRegions.reduce((last, r, i) => (r.unlocked ? i : last), 0);
  })();

  return (
    <GameBackground screen="world_map" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('home')}
        onSettings={() => setScreen('settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenPlaque screen="world_map" width={270} height={135} style={styles.plaque} />

        {/* Expedition Progress HUD Banner with SVG Checkpoint Flag */}
        <View style={styles.expeditionHudCard}>
          <View style={styles.hudLeftFlagArea}>
            <View style={styles.flagPedestalCircle}>
              <ExpeditionFlagSvg size={38} idPrefix="hud_flag" />
            </View>
          </View>
          <View style={styles.hudCenterInfo}>
            <View style={styles.hudTopTagRow}>
              <Text style={styles.hudSubtitle}>✦ ACTIVE EXPEDITION ROUTE ✦</Text>
              <View style={styles.starPill}>
                <Image source={pqAssets.hud.star} style={styles.starSmall} resizeMode="contain" />
                <Text style={styles.starPillText}>
                  {totalStars}/{maxStars}
                </Text>
              </View>
            </View>
            <Text style={styles.hudTitle}>MYSTIC TEMPLE REALM</Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(unlockedCount / mapRegions.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              TEMPLE 0{mapRegions[activeIndex]?.templeNumber || 1} IN PROGRESS • {unlockedCount}/{mapRegions.length} UNLOCKED
            </Text>
          </View>
        </View>

        {/* Expedition Temple Checkpoints Trail */}
        <View style={styles.mapPillarsContainer}>
          {mapRegions.map((region, idx) => {
            const isUnlocked = region.unlocked;
            const isActive = idx === activeIndex;
            const isCompleted = isUnlocked && region.stars === region.maxStars;

            return (
              <React.Fragment key={region.id}>
                {/* Connecting Trail Steps between Temples */}
                {idx > 0 && (
                  <View style={styles.trailConnector}>
                    <View style={[styles.trailDot, isUnlocked && styles.trailDotActive]} />
                    <View style={[styles.trailDot, isUnlocked && styles.trailDotActive]} />
                    <View style={[styles.trailDiamond, isUnlocked && styles.trailDiamondActive]}>
                      <Text style={[styles.trailRune, isUnlocked && styles.trailRuneActive]}>◈</Text>
                    </View>
                    <View style={[styles.trailDot, isUnlocked && styles.trailDotActive]} />
                    <View style={[styles.trailDot, isUnlocked && styles.trailDotActive]} />
                  </View>
                )}

                <Pressable
                  onPress={() => handleRegionPress(idx)}
                  style={[
                    styles.regionCard,
                    !isUnlocked && styles.regionCardLocked,
                    isUnlocked && { borderColor: region.color },
                    isActive && styles.regionCardActive,
                  ]}
                >
                  {/* Active Expedition Flag Badge planted on current temple */}
                  {isActive && (
                    <View style={styles.activeFlagBadge}>
                      <ExpeditionFlagSvg size={22} idPrefix={`card_flag_${region.id}`} />
                      <Text style={styles.activeFlagText}>EXPEDITION ACTIVE</Text>
                    </View>
                  )}

                  {/* Completed Ribbon Badge */}
                  {isCompleted && !isActive && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓ MASTERED</Text>
                    </View>
                  )}

                  {/* Region Image Frame */}
                  <View style={[styles.imageFrame, isActive && styles.imageFrameActive]}>
                    <Image
                      source={getRegionImage(region.id)}
                      style={[styles.regionImage, !isUnlocked && styles.imageLocked]}
                      resizeMode="cover"
                    />
                    {!isUnlocked && (
                      <View style={styles.lockOverlay}>
                        <Image
                          source={pqAssets.icons.lock}
                          style={styles.lockIcon}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </View>

                  {/* Region Details */}
                  <View style={styles.regionInfo}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          pqTypography.h3,
                          {
                            color: isActive
                              ? '#00F0FF'
                              : isUnlocked
                              ? pqColors.textGold
                              : pqColors.textMuted,
                          },
                        ]}
                      >
                        TEMPLE 0{region.templeNumber}
                      </Text>

                      {/* Stars */}
                      {isUnlocked && (
                        <View style={styles.starRow}>
                          {Array.from({ length: region.maxStars }).map((_, sIdx) => (
                            <Image
                              key={sIdx}
                              source={pqAssets.hud.star}
                              style={[
                                styles.starIcon,
                                sIdx >= region.stars && { opacity: 0.25 },
                              ]}
                              resizeMode="contain"
                            />
                          ))}
                        </View>
                      )}
                    </View>

                    <Text style={[pqTypography.bodyBold, styles.regionName]}>
                      {region.name}
                    </Text>

                    <Text style={[pqTypography.caption, styles.regionDesc]} numberOfLines={2}>
                      {region.description}
                    </Text>

                    {/* Active CTA Callout */}
                    {isActive && (
                      <View style={styles.enterTempleBtn}>
                        <Text style={styles.enterTempleText}>ENTER TEMPLE ▶</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 120, // Prevents bottom tab overlap
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.sm,
  },

  // Expedition HUD Banner
  expeditionHudCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 32, 0.95)',
    borderWidth: 2,
    borderColor: '#C5832B',
    borderRadius: 16,
    padding: 12,
    marginBottom: pqSpacing.md,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  hudLeftFlagArea: {
    marginRight: 12,
  },
  flagPedestalCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudCenterInfo: {
    flex: 1,
  },
  hudTopTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hudSubtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 1.2,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(197, 131, 43, 0.25)',
    borderWidth: 1,
    borderColor: '#FFE27A',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  starSmall: {
    width: 12,
    height: 12,
  },
  starPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFE27A',
  },
  hudTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 1,
    marginTop: 2,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFE27A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0B2C6',
    letterSpacing: 0.5,
  },

  // Trail Connector
  trailConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    gap: 3,
  },
  trailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(120, 140, 160, 0.4)',
  },
  trailDotActive: {
    backgroundColor: '#00F0FF',
  },
  trailDiamond: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailDiamondActive: {},
  trailRune: {
    fontSize: 9,
    color: 'rgba(120, 140, 160, 0.5)',
  },
  trailRuneActive: {
    color: '#FFE27A',
    textShadowColor: '#FFE27A',
    textShadowRadius: 4,
  },

  // Map Pillars & Region Cards
  mapPillarsContainer: {
    width: '100%',
  },
  regionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 24, 34, 0.95)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2,
    borderColor: '#C5832B',
    padding: pqSpacing.sm,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  regionCardActive: {
    borderColor: '#00F0FF',
    borderWidth: 2.5,
    backgroundColor: 'rgba(14, 28, 42, 0.98)',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  regionCardLocked: {
    borderColor: '#374151',
    backgroundColor: 'rgba(15, 20, 28, 0.85)',
    opacity: 0.7,
  },

  // Active Flag Badge on Card
  activeFlagBadge: {
    position: 'absolute',
    top: -12,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    borderWidth: 1.5,
    borderColor: '#FFE27A',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  activeFlagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // Completed Badge
  completedBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#1E4620',
    borderWidth: 1.5,
    borderColor: '#2ECC71',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
  },
  completedBadgeText: {
    color: '#2ECC71',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  imageFrame: {
    width: 86,
    height: 72,
    borderRadius: pqSpacing.radiusSm,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#4A5B6E',
  },
  imageFrameActive: {
    borderColor: '#00F0FF',
    borderWidth: 2,
  },
  regionImage: {
    width: '100%',
    height: '100%',
  },
  imageLocked: {
    tintColor: '#555555',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    width: 28,
    height: 28,
  },
  regionInfo: {
    flex: 1,
    marginLeft: pqSpacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  regionName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 2,
  },
  regionDesc: {
    marginTop: 2,
    color: '#A0B2C6',
  },
  enterTempleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#00F0FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  enterTempleText: {
    color: '#00F0FF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
