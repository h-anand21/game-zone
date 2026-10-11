// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — In-Game Heads-Up Display (HUD)
// Wood framed status bar with pause, level badge, hearts & move counter
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { ArrowHaptics } from '../../utils/haptics';

interface GameHUDProps {
  levelNumber: number;
  levelName: string;
  moves: number;
  targetMoves: number;
  hearts: number;
  remainingPieces: number;
  onPause: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  levelNumber,
  levelName,
  moves,
  targetMoves,
  hearts,
  remainingPieces,
  onPause,
  onRestart,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.outerWoodBar}>
        <LinearGradient
          colors={[COLORS.woodLight, COLORS.wood, COLORS.woodDark]}
          style={styles.innerWoodBar}
        >
          {/* Pause Button */}
          <Pressable
            onPress={() => {
              ArrowHaptics.buttonPress();
              onPause();
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            hitSlop={8}
            accessibilityLabel="Pause Game"
          >
            <LinearGradient colors={['#844319', '#4D240E']} style={styles.iconBtnGrad}>
              <Text style={styles.iconText}>❚❚</Text>
            </LinearGradient>
          </Pressable>

          {/* Level Info Ribbon */}
          <View style={styles.centerRibbon}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumberText}>LEVEL {levelNumber}</Text>
            </View>
            <Text style={styles.levelNameText} numberOfLines={1}>
              {levelName}
            </Text>
          </View>

          {/* Restart Button */}
          <Pressable
            onPress={() => {
              ArrowHaptics.buttonPress();
              onRestart();
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            hitSlop={8}
            accessibilityLabel="Restart Level"
          >
            <LinearGradient colors={['#844319', '#4D240E']} style={styles.iconBtnGrad}>
              <Text style={styles.iconText}>↻</Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </View>

      {/* Sub HUD Stats Strip */}
      <View style={styles.statsStrip}>
        {/* Hearts / Lives */}
        <View style={styles.statPill}>
          <Text style={styles.heartIcon}>
            {hearts >= 3 ? '❤️❤️❤️' : hearts === 2 ? '❤️❤️🖤' : '❤️🖤🖤'}
          </Text>
        </View>

        {/* Remaining Arrow Pieces */}
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>ARROWS:</Text>
          <Text style={styles.statValue}>{remainingPieces}</Text>
        </View>

        {/* Move Counter vs 3-Star Target */}
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>MOVES:</Text>
          <Text style={[styles.statValue, moves <= targetMoves ? styles.greenValue : styles.goldValue]}>
            {moves}
            <Text style={styles.statSubValue}>/{targetMoves}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 14,
    zIndex: 10,
  },
  outerWoodBar: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#3D1C08',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  innerWoodBar: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.woodHighlight,
  },
  centerRibbon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    backgroundColor: '#071F36',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  levelNumberText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  levelNameText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E2EEF9',
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
  },
  btnPressed: {
    transform: [{ scale: 0.94 }],
  },
  iconBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.gold,
  },
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  statPill: {
    backgroundColor: 'rgba(8, 27, 47, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(32, 191, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartIcon: {
    fontSize: 12,
    letterSpacing: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statSubValue: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '700',
  },
  greenValue: {
    color: COLORS.green,
  },
  goldValue: {
    color: COLORS.gold,
  },
});

export default GameHUD;
