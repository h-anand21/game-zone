// ============================================================
// Worms Zone 3D Arena — Screenshot-Matched Live Arena HUD
// Top-Left Leaderboard, Top-Center Treasure Chest Weight Goal,
// Top-Right Coins & Live Radar Minimap, Bottom 3 Booster Circles,
// Floating Virtual Analog Joystick & Sprint Boost Pedal.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import {
  TreasureChestIcon,
  SmileyCoinIcon,
  MagnetBoosterIcon,
  TurboBoosterIcon,
  ScopeBoosterIcon,
  SprintBoltIcon,
  ArenaGearIcon,
  MiniPlayerIcon,
} from './WormsIcons';
import type {
  ArenaState,
  BoosterType,
  LeaderboardEntry,
  Vec2,
} from '../types';

interface ArenaHudProps {
  state: ArenaState;
  totalCoins: number;
  totalArenaCount: number;
  topEntries: LeaderboardEntry[];
  playerEntry: LeaderboardEntry;
  boosterInventory: Record<BoosterType, number>;
  joyOrigin: Vec2 | null;
  joyKnob: Vec2 | null;
  isBoostingPressed: boolean;
  onActivateBooster: (type: BoosterType) => void;
  onBoostStart: () => void;
  onBoostEnd: () => void;
  onPausePress: () => void;
}

const MINIMAP_SIZE = 74;

function formatTimeMs(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const ArenaHud: React.FC<ArenaHudProps> = ({
  state,
  totalCoins,
  totalArenaCount,
  topEntries,
  playerEntry,
  boosterInventory,
  joyOrigin,
  joyKnob,
  isBoostingPressed,
  onActivateBooster,
  onBoostStart,
  onBoostEnd,
  onPausePress,
}) => {
  const insets = useSafeAreaInsets();
  const playerWeight = Math.round(state.player.weight);
  const goalProgress = Math.min(1, playerWeight / Math.max(1, state.currentGoalWeight));

  const playerHead = state.player.segments[0] || { x: 0, y: 0 };
  const mapHalf = MINIMAP_SIZE / 2;
  const mapScale = (MINIMAP_SIZE * 0.44) / state.arenaRadius;

  const isPlayerInTopList = topEntries.some((e) => e.isPlayer);
  const displayedTop = topEntries.slice(0, 6);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* 1. TOP HUD ROW */}
      <View
        pointerEvents="box-none"
        style={[styles.topHudRow, { paddingTop: Math.max(8, insets.top + 4) }]}
      >
        {/* Top-Left: Live Arena Leaderboard Panel */}
        <View style={styles.leaderboardCard} pointerEvents="none">
          <Text style={styles.lbHeader}>Top players (in arena: {totalArenaCount})</Text>
          {displayedTop.map((entry) => (
            <View key={entry.id} style={styles.lbRow}>
              <Text
                numberOfLines={1}
                style={[styles.lbName, entry.isPlayer && styles.lbPlayerHighlight]}
              >
                {entry.rank}. {entry.name}
              </Text>
              <View style={styles.lbScoreWrap}>
                <MiniPlayerIcon
                  size={9}
                  color={entry.isPlayer ? '#86EFAC' : '#93C5FD'}
                />
                <Text style={[styles.lbWeight, entry.isPlayer && styles.lbPlayerHighlight]}>
                  {entry.weight.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
          {!isPlayerInTopList && (
            <View style={[styles.lbRow, styles.lbSelfRow]}>
              <Text numberOfLines={1} style={[styles.lbName, styles.lbPlayerHighlight]}>
                {playerEntry.rank}. {playerEntry.name}
              </Text>
              <View style={styles.lbScoreWrap}>
                <MiniPlayerIcon size={9} color="#86EFAC" />
                <Text style={[styles.lbWeight, styles.lbPlayerHighlight]}>
                  {playerEntry.weight.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Top-Center: Treasure Chest Weight Goal */}
        <View style={styles.centerHudStack} pointerEvents="none">
          <View style={styles.chestGoalCard}>
            <TreasureChestIcon size={24} />
            <View style={styles.chestInfo}>
              <Text style={styles.chestTitle} numberOfLines={1}>
                Weight {state.currentGoalWeight.toLocaleString()}
              </Text>
              <View style={styles.chestBarTrack}>
                <View
                  style={[styles.chestBarFill, { width: `${Math.round(goalProgress * 100)}%` }]}
                />
              </View>
              <Text style={styles.chestNumbers}>
                {playerWeight.toLocaleString()} / {state.currentGoalWeight.toLocaleString()}
              </Text>
            </View>
          </View>

          {state.mode === 'time_rush' && (
            <View style={styles.timerPill}>
              <Text style={styles.timerText}>{formatTimeMs(state.timeRemainingMs)}</Text>
            </View>
          )}
        </View>

        {/* Top-Right: Gold Coin Balance + Pause Gear + Live Radar Minimap */}
        <View style={styles.topRightCol} pointerEvents="box-none">
          <View style={styles.coinGearRow}>
            <View style={styles.coinPill}>
              <SmileyCoinIcon size={18} />
              <Text style={styles.coinVal}>{totalCoins.toLocaleString()}</Text>
            </View>
            <Pressable
              onPress={onPausePress}
              hitSlop={10}
              style={({ pressed }) => [styles.gearBtn, pressed && styles.pressed]}
            >
              <ArenaGearIcon size={18} />
            </Pressable>
          </View>

          {/* Live Square Radar Minimap */}
          <View style={styles.minimapBox} pointerEvents="none">
            <Svg width={MINIMAP_SIZE} height={MINIMAP_SIZE}>
              <Circle
                cx={mapHalf}
                cy={mapHalf}
                r={MINIMAP_SIZE * 0.44}
                fill="none"
                stroke="rgba(147, 197, 253, 0.25)"
                strokeWidth={1}
              />
              {state.foods.slice(0, 90).map((f) => (
                <Circle
                  key={`mm-${f.id}`}
                  cx={mapHalf + f.x * mapScale}
                  cy={mapHalf + f.y * mapScale}
                  r={f.isLootDrop ? 1.8 : 0.9}
                  fill={f.isLootDrop ? '#FDE047' : 'rgba(255, 255, 255, 0.72)'}
                />
              ))}
              {state.bots.map((b) => {
                const bh = b.segments[0];
                if (!bh) return null;
                return (
                  <Circle
                    key={`mb-${b.id}`}
                    cx={mapHalf + bh.x * mapScale}
                    cy={mapHalf + bh.y * mapScale}
                    r={1.9}
                    fill="#F87171"
                  />
                );
              })}
              <Circle
                cx={mapHalf + playerHead.x * mapScale}
                cy={mapHalf + playerHead.y * mapScale}
                r={3.2}
                fill="#22C55E"
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            </Svg>
          </View>
        </View>
      </View>

      {/* 2. FLOATING VIRTUAL JOYSTICK OVERLAY */}
      {joyOrigin && joyKnob && (
        <View
          pointerEvents="none"
          style={[
            styles.joystickBase,
            { left: joyOrigin.x - 42, top: joyOrigin.y - 42 },
          ]}
        >
          <View
            style={[
              styles.joystickKnob,
              {
                transform: [
                  { translateX: joyKnob.x - joyOrigin.x },
                  { translateY: joyKnob.y - joyOrigin.y },
                ],
              },
            ]}
          />
        </View>
      )}

      {/* 3. BOTTOM DECK: 3 CIRCULAR BOOSTER BUTTONS + SPRINT BOOST PEDAL */}
      <View
        pointerEvents="box-none"
        style={[styles.bottomBar, { paddingBottom: Math.max(12, insets.bottom + 6) }]}
      >
        <View style={styles.leftHintChip} pointerEvents="none">
          <Text style={styles.hintLabel}>Drag to Steer</Text>
        </View>

        <View style={styles.boosterRow}>
          {(
            [
              {
                key: 'magnet' as BoosterType,
                Icon: MagnetBoosterIcon,
                activeMs: state.boosters.magnetMs,
              },
              {
                key: 'turbo' as BoosterType,
                Icon: TurboBoosterIcon,
                activeMs: state.boosters.turboMs,
              },
              {
                key: 'scope' as BoosterType,
                Icon: ScopeBoosterIcon,
                activeMs: state.boosters.scopeMs,
              },
            ] as const
          ).map(({ key, Icon, activeMs }) => {
            const count = boosterInventory[key] || 0;
            const isActive = activeMs > 0;
            return (
              <Pressable
                key={key}
                onPress={() => onActivateBooster(key)}
                disabled={count <= 0 && !isActive}
                style={({ pressed }) => [
                  styles.boosterCircle,
                  isActive && styles.boosterCircleActive,
                  count <= 0 && !isActive && styles.boosterEmpty,
                  pressed && styles.pressed,
                ]}
              >
                <Icon size={22} />
                <View style={[styles.countPill, isActive && styles.countPillActive]}>
                  <Text style={styles.countPillText}>
                    {isActive ? `${Math.ceil(activeMs / 1000)}s` : count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Right-Hand Hold-to-Sprint Boost Pedal */}
        <Pressable
          onPressIn={onBoostStart}
          onPressOut={onBoostEnd}
          style={({ pressed }) => [
            styles.sprintBtn,
            (isBoostingPressed || pressed || state.boosters.turboMs > 0) && styles.sprintBtnActive,
          ]}
        >
          <SprintBoltIcon size={24} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHudRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    gap: 6,
  },
  leaderboardCard: {
    width: 126,
    backgroundColor: 'rgba(11, 30, 56, 0.72)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.22)',
  },
  lbHeader: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#CBD5E1',
    marginBottom: 2,
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0.8,
  },
  lbSelfRow: {
    marginTop: 2,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
    paddingTop: 2,
  },
  lbName: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: '700',
    color: '#F1F5F9',
    marginRight: 4,
  },
  lbScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  lbWeight: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  lbPlayerHighlight: {
    color: '#A3E635',
  },
  centerHudStack: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chestGoalCard: {
    width: '100%',
    maxWidth: 152,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(11, 30, 56, 0.76)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.24)',
  },
  chestInfo: {
    flex: 1,
  },
  chestTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  chestBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    overflow: 'hidden',
    marginVertical: 2,
  },
  chestBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  chestNumbers: {
    fontSize: 8,
    fontWeight: '900',
    color: '#E2E8F0',
  },
  timerPill: {
    backgroundColor: 'rgba(220, 38, 38, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  timerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  topRightCol: {
    alignItems: 'flex-end',
    gap: 5,
  },
  coinGearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(11, 30, 56, 0.78)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.4)',
  },
  coinVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gearBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 30, 56, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimapBox: {
    width: MINIMAP_SIZE,
    height: MINIMAP_SIZE,
    backgroundColor: 'rgba(10, 28, 52, 0.72)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.25)',
    overflow: 'hidden',
  },
  joystickBase: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 2,
    borderColor: 'rgba(147, 197, 253, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickKnob: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(250, 204, 21, 0.85)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  leftHintChip: {
    backgroundColor: 'rgba(11, 30, 56, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 8,
  },
  hintLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#BAE6FD',
  },
  boosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boosterCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E4C90',
    borderWidth: 2.2,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  boosterCircleActive: {
    borderColor: '#FDE047',
    backgroundColor: '#0F766E',
  },
  boosterEmpty: {
    opacity: 0.65,
  },
  countPill: {
    position: 'absolute',
    bottom: -3,
    right: -4,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F2744',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  countPillActive: {
    backgroundColor: '#FACC15',
  },
  countPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  sprintBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1E40AF',
    borderWidth: 2.5,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 7,
  },
  sprintBtnActive: {
    backgroundColor: '#D97706',
    transform: [{ scale: 0.94 }],
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
