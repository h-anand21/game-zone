import React, { useMemo } from 'react';
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
import { getWorldInfoForLevel } from '../data/levelGenerator';
import { ArrowHaptics } from '../utils/haptics';

interface WorldMapScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenShop: () => void;
  onOpenLevelSelect?: () => void;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  onBack,
  onSelectLevel,
  onOpenShop,
  onOpenLevelSelect,
}) => {
  const insets = useSafeAreaInsets();
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);
  const completedLevels = useGameStore((state) => state.completedLevels);

  // Dynamically calculate how many worlds to display:
  // Shows all worlds up to the next upcoming world (at least 2 worlds)
  const currentWorldId = Math.floor((unlockedLevels - 1) / 10) + 1;
  const maxWorldToShow = Math.max(2, currentWorldId + 1);
  const maxLevelsToShow = maxWorldToShow * 10;

  const allLevels = useMemo(() => {
    return getAllAvailableLevels(maxLevelsToShow);
  }, [maxLevelsToShow]);

  // Group by worlds, from highest (top of map) down to World 1 (start)
  const worldsList = useMemo(() => {
    const list = [];
    for (let w = maxWorldToShow; w >= 1; w--) {
      const worldLevels = allLevels.filter((l) => l.worldId === w);
      const info = getWorldInfoForLevel((w - 1) * 10 + 1);
      list.push({
        ...info,
        levels: worldLevels,
      });
    }
    return list;
  }, [allLevels, maxWorldToShow]);

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="KINGDOM MAP"
          subtitle="CAMPAIGN PROGRESSION"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        {onOpenLevelSelect && (
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onOpenLevelSelect();
              }}
              style={styles.togglePill}
            >
              <Text style={styles.toggleText}>🔢 GRID VIEW</Text>
            </Pressable>
          </View>
        )}

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 30, 48) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Pinnacle Castle */}
          <View style={styles.topCastle}>
            <Text style={styles.castleEmoji}>🏰</Text>
            <Text style={styles.citadelText}>THE ENDLESS RUNIC CITADEL</Text>
          </View>

          {worldsList.map((world, wIdx) => (
            <View key={`world-${world.worldId}`} style={styles.worldSection}>
              {/* World Banner */}
              <View style={[styles.worldBanner, { borderColor: world.themeColor }]}>
                <Text style={styles.worldIcon}>{world.worldIcon}</Text>
                <Text style={[styles.worldTitle, { color: world.themeColor }]}>
                  WORLD {world.worldId}: {world.worldName.toUpperCase()}
                </Text>
              </View>

              {/* Levels in this World */}
              <View style={styles.nodesContainer}>
                {world.levels.map((lvl, idx) => {
                  const isUnlocked = lvl.id <= unlockedLevels;
                  const isCurrent = lvl.id === unlockedLevels;
                  const record = completedLevels[lvl.id];
                  const stars = record ? record.stars : 0;

                  // Alternate zigzag offsets
                  const xOffset = idx % 2 === 0 ? -36 : 36;

                  return (
                    <View
                      key={lvl.id}
                      style={[styles.nodeRow, { transform: [{ translateX: xOffset }] }]}
                    >
                      <Pressable
                        onPress={() => {
                          if (!isUnlocked) return;
                          ArrowHaptics.buttonPress();
                          onSelectLevel(lvl.id);
                        }}
                        disabled={!isUnlocked}
                        style={({ pressed }) => [
                          styles.nodeCircle,
                          isCurrent && styles.nodeCurrent,
                          !isUnlocked && styles.nodeLocked,
                          pressed && styles.nodePressed,
                        ]}
                      >
                        <LinearGradient
                          colors={
                            isCurrent
                              ? ['#FFE259', '#E5A016']
                              : isUnlocked
                              ? [world.themeColor, '#084870']
                              : ['#1C2633', '#0F151E']
                          }
                          style={styles.nodeGradient}
                        >
                          <Text style={[styles.nodeNumber, !isUnlocked && styles.nodeLockedText]}>
                            {isUnlocked ? lvl.id : '🔒'}
                          </Text>
                        </LinearGradient>
                      </Pressable>

                      {/* Level Stars Badge */}
                      {record && record.stars > 0 ? (
                        <View style={styles.starsBadge}>
                          <StarsDisplay stars={stars} size="small" />
                        </View>
                      ) : null}

                      {/* Level Label */}
                      <Text style={[styles.nodeLabel, !isUnlocked && styles.labelLocked]}>
                        {lvl.name}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Divider between worlds */}
              {wIdx < worldsList.length - 1 && (
                <View style={styles.worldDivider}>
                  <Text style={styles.dividerIcon}>⛰️ 🌊 🏰 🌲 ⛰️</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
  },
  topCastle: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(5, 16, 28, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE259',
    shadowColor: '#FFE259',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  castleEmoji: {
    fontSize: 42,
    marginBottom: 4,
  },
  citadelText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFE259',
    letterSpacing: 2,
  },
  worldSection: {
    width: '100%',
    alignItems: 'center',
  },
  worldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 27, 47, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    marginBottom: 20,
    gap: 8,
  },
  forestBanner: {
    borderColor: COLORS.arrowGreen,
  },
  worldIcon: {
    fontSize: 18,
  },
  worldTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1.5,
  },
  nodesContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 22,
  },
  nodeRow: {
    alignItems: 'center',
  },
  nodeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3.5,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  nodeCurrent: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    transform: [{ scale: 1.08 }],
  },
  nodeLocked: {
    borderColor: '#1C2633',
    opacity: 0.6,
  },
  nodePressed: {
    transform: [{ scale: 0.94 }],
  },
  nodeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nodeLockedText: {
    fontSize: 16,
    color: '#63798E',
  },
  starsBadge: {
    marginTop: 4,
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E2EEF9',
    letterSpacing: 0.8,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  labelLocked: {
    color: '#63798E',
  },
  worldDivider: {
    marginVertical: 32,
    alignItems: 'center',
  },
  dividerIcon: {
    fontSize: 22,
    letterSpacing: 4,
  },
  toggleRow: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  togglePill: {
    backgroundColor: '#0F3152',
    borderWidth: 2,
    borderColor: '#20BFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#20BFFF',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});

export default WorldMapScreen;
