// ============================================================
// PATTERN QUEST — Screen 03: WorldMapScreen
// Mystic Island Adventure Map with 6 connected regions,
// stars, lock states, regional artwork, and expedition flow
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WorldMapScreen: React.FC = () => {
  const { currentScreen, setScreen, mapRegions, selectRegion, startNewGame } = usePatternQuestStore();

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

        <View style={styles.mapPillarsContainer}>
          {mapRegions.map((region, idx) => {
            const isUnlocked = region.unlocked;
            return (
              <Pressable
                key={region.id}
                onPress={() => handleRegionPress(idx)}
                style={[
                  styles.regionCard,
                  !isUnlocked && styles.regionCardLocked,
                  isUnlocked && { borderColor: region.color },
                ]}
              >
                {/* Region Image Frame */}
                <View style={styles.imageFrame}>
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
                    <Text style={[pqTypography.h3, { color: isUnlocked ? pqColors.textGold : pqColors.textMuted }]}>
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
                </View>
              </Pressable>
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
    paddingBottom: 110,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  mapPillarsContainer: {
    width: '100%',
    gap: pqSpacing.md,
  },
  regionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2,
    borderColor: '#C5832B',
    padding: pqSpacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  regionCardLocked: {
    borderColor: '#374151',
    backgroundColor: 'rgba(15, 20, 28, 0.85)',
    opacity: 0.7,
  },
  imageFrame: {
    width: 86,
    height: 68,
    borderRadius: pqSpacing.radiusSm,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#4A5B6E',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  },
});
