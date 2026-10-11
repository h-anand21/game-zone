// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 03: World Map
// Scrollable fantasy progression map with branching paths & level nodes
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
import { LEVELS } from '../data/levels';
import { ArrowHaptics } from '../utils/haptics';

interface WorldMapScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenShop: () => void;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  onBack,
  onSelectLevel,
  onOpenShop,
}) => {
  const insets = useSafeAreaInsets();
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);
  const completedLevels = useGameStore((state) => state.completedLevels);

  // Group levels by world
  const world1Levels = LEVELS.filter((l) => l.worldId === 1);
  const world2Levels = LEVELS.filter((l) => l.worldId === 2);

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="KINGDOM MAP"
          subtitle="CAMPAIGN PROGRESSION"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 30, 48) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── WORLD 2: CRYSTAL COAST (Top Area) ── */}
          <View style={styles.worldSection}>
            <View style={styles.worldBanner}>
              <Text style={styles.worldIcon}>🌊</Text>
              <Text style={styles.worldTitle}>WORLD 2: CRYSTAL COAST</Text>
            </View>

            <View style={styles.nodesContainer}>
              {world2Levels.map((lvl, idx) => {
                const isUnlocked = lvl.id <= unlockedLevels;
                const isCurrent = lvl.id === unlockedLevels;
                const record = completedLevels[lvl.id];
                const stars = record ? record.stars : 0;

                // Alternate zigzag offsets
                const xOffset = (idx % 2 === 0 ? -36 : 36);

                return (
                  <View key={lvl.id} style={[styles.nodeRow, { transform: [{ translateX: xOffset }] }]}>
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
                            ? ['#20BFFF', '#08639C']
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
          </View>

          {/* Dividing Mountain Pass */}
          <View style={styles.worldDivider}>
            <Text style={styles.dividerIcon}>⛰️ 🌲 🏰 🌲 ⛰️</Text>
          </View>

          {/* ── WORLD 1: WHISPERING FOREST (Lower Area) ── */}
          <View style={styles.worldSection}>
            <View style={[styles.worldBanner, styles.forestBanner]}>
              <Text style={styles.worldIcon}>🌲</Text>
              <Text style={[styles.worldTitle, { color: COLORS.arrowGreen }]}>
                WORLD 1: WHISPERING FOREST
              </Text>
            </View>

            <View style={styles.nodesContainer}>
              {world1Levels.map((lvl, idx) => {
                const isUnlocked = lvl.id <= unlockedLevels;
                const isCurrent = lvl.id === unlockedLevels;
                const record = completedLevels[lvl.id];
                const stars = record ? record.stars : 0;

                const xOffset = (idx % 2 === 0 ? 36 : -36);

                return (
                  <View key={lvl.id} style={[styles.nodeRow, { transform: [{ translateX: xOffset }] }]}>
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
                            ? ['#49E67A', '#137031']
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
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
});

export default WorldMapScreen;
