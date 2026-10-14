// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 04: Level Select (3-Column Grid)
// 3-column fantasy level tiles with stars, locks & current glow
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { StarsDisplay } from '../components/ui/StarsDisplay';
import { useGameStore } from '../store/gameStore';
import { getAllAvailableLevels } from '../data/levels';
import { ArrowHaptics } from '../utils/haptics';

interface LevelSelectScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenWorldMap: () => void;
  onOpenShop: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onBack,
  onSelectLevel,
  onOpenWorldMap,
  onOpenShop,
}) => {
  const insets = useSafeAreaInsets();
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);
  const completedLevels = useGameStore((state) => state.completedLevels);
  const availableLevels = getAllAvailableLevels(Math.max(unlockedLevels + 8, 12));

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="SELECT LEVEL"
          subtitle="CHOOSE YOUR ARENA"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        {/* View Toggle Bar (Grid vs World Map) */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={() => {
              ArrowHaptics.buttonPress();
              onOpenWorldMap();
            }}
            style={styles.togglePill}
          >
            <Text style={styles.toggleText}>🗺️ WORLD MAP VIEW</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollGrid,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {availableLevels.map((lvl) => {
              const isUnlocked = lvl.id <= unlockedLevels;
              const isCurrent = lvl.id === unlockedLevels;
              const record = completedLevels[lvl.id];
              const stars = record ? record.stars : 0;

              return (
                <Pressable
                  key={lvl.id}
                  onPress={() => {
                    if (!isUnlocked) return;
                    ArrowHaptics.buttonPress();
                    onSelectLevel(lvl.id);
                  }}
                  disabled={!isUnlocked}
                  style={({ pressed }) => [
                    styles.levelTile,
                    isCurrent && styles.tileCurrent,
                    !isUnlocked && styles.tileLocked,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isCurrent
                        ? ['#FFE259', '#E5A016']
                        : isUnlocked
                        ? ['#20BFFF', '#08639C']
                        : ['#1A2533', '#0E1620']
                    }
                    style={styles.tileGrad}
                  >
                    {/* Level Number */}
                    <Text style={[styles.tileNumber, !isUnlocked && styles.numberLocked]}>
                      {isUnlocked ? lvl.id : '🔒'}
                    </Text>

                    {/* Level Name */}
                    {isUnlocked && (
                      <Text style={styles.tileName} numberOfLines={1}>
                        {lvl.name}
                      </Text>
                    )}

                    {/* Stars Badge */}
                    <View style={styles.starsBox}>
                      {isUnlocked ? (
                        <StarsDisplay stars={stars} size="small" />
                      ) : (
                        <Text style={styles.lockedLabel}>LOCKED</Text>
                      )}
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleRow: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 6,
  },
  togglePill: {
    backgroundColor: 'rgba(8, 27, 47, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  scrollGrid: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  levelTile: {
    width: '31%',
    aspectRatio: 0.95,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
  },
  tileCurrent: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    transform: [{ scale: 1.04 }],
  },
  tileLocked: {
    borderColor: '#1C2633',
    opacity: 0.55,
  },
  tilePressed: {
    transform: [{ scale: 0.95 }],
  },
  tileGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 15,
  },
  tileNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  numberLocked: {
    fontSize: 18,
    color: '#63798E',
  },
  tileName: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF8E7',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  starsBox: {
    minHeight: 16,
    justifyContent: 'center',
  },
  lockedLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#63798E',
    letterSpacing: 1,
  },
});

export default LevelSelectScreen;
