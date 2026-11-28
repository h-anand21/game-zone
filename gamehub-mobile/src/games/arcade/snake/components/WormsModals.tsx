// ============================================================
// Worms Zone 3D Arena — Launch Wardrobe, Shop, Pause & Game Over Modals
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ALL_SKIN_IDS, BOOSTER_PRICES, WORM_SKINS } from '../skins';
import {
  SmileyCoinIcon,
  ArenaCrownIcon,
  MagnetBoosterIcon,
  TurboBoosterIcon,
  ScopeBoosterIcon,
  WardrobePaletteIcon,
  ReplayCircleIcon,
  ArenaPlayIcon,
  ArenaGearIcon,
  BackChevronIcon,
  SoundSpeakerIcon,
  TreasureChestIcon,
} from './WormsIcons';
import type { ArenaMode, BoosterType, WormSkinConfig, WormSkinId } from '../types';

/**
 * Miniature 3D Worm Preview for Skin Selection Cards
 */
const MiniSkinWormPreview: React.FC<{ skin: WormSkinConfig }> = ({ skin }) => {
  const gradId = `mini-${skin.id}`;
  return (
    <Svg width={68} height={26} viewBox="0 0 68 26">
      <Defs>
        <RadialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <Stop offset="0%" stopColor={skin.highlight} />
          <Stop offset="55%" stopColor={skin.primary} />
          <Stop offset="100%" stopColor={skin.shadow} />
        </RadialGradient>
      </Defs>
      {[12, 20, 28, 36, 44, 52].map((cx, idx) => (
        <Circle
          key={cx}
          cx={cx}
          cy={13 + Math.sin(idx * 0.9) * 2.2}
          r={idx === 5 ? 9.5 : 7.8 + idx * 0.25}
          fill={idx % skin.stripeEvery === 0 && idx < 5 ? skin.stripeColor : `url(#${gradId})`}
          stroke={skin.shadow}
          strokeWidth={0.7}
        />
      ))}
      <Ellipse cx={59} cy={12} rx={2.5} ry={1.6} fill={skin.mouthColor} />
      <Circle cx={55} cy={9.5} r={2.8} fill="#FFFFFF" stroke="#0F172A" strokeWidth={0.7} />
      <Circle cx={55} cy={15} r={2.8} fill="#FFFFFF" stroke="#0F172A" strokeWidth={0.7} />
      <Circle cx={55.9} cy={9.5} r={1.3} fill="#0F172A" />
      <Circle cx={55.9} cy={15} r={1.3} fill="#0F172A" />
    </Svg>
  );
};

interface HubModalProps {
  visible: boolean;
  mode: ArenaMode;
  coins: number;
  bestWeight: number;
  selectedSkin: WormSkinId;
  unlockedSkins: WormSkinId[];
  boosterInventory: Record<BoosterType, number>;
  onSelectMode: (m: ArenaMode) => void;
  onSelectOrUnlockSkin: (id: WormSkinId) => void;
  onBuyBooster: (type: BoosterType) => void;
  onPlay: () => void;
  onExit: () => void;
}

const ARENA_MODES: { key: ArenaMode; title: string; sub: string }[] = [
  { key: 'infinity', title: 'Infinity', sub: 'Endless survival' },
  { key: 'time_rush', title: 'Time Rush', sub: '2:30 (1.5x mass)' },
  { key: 'treasure', title: 'Treasure', sub: '3x Gold coins' },
];

export const WormHubModal: React.FC<HubModalProps> = ({
  visible,
  mode,
  coins,
  bestWeight,
  selectedSkin,
  unlockedSkins,
  boosterInventory,
  onSelectMode,
  onSelectOrUnlockSkin,
  onBuyBooster,
  onPlay,
  onExit,
}) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <LinearGradient colors={['#153B6E', '#0B203E']} style={styles.hubCard}>
        {/* Top Row: Back + Title + Coin Balance */}
        <View style={styles.hubHeader}>
          <Pressable
            onPress={onExit}
            style={({ pressed }) => [styles.smallNavBtn, pressed && styles.pressed]}
          >
            <BackChevronIcon size={18} />
          </Pressable>

          <View style={styles.hubTitleCol}>
            <Text style={styles.hubTitle}>WORMS ZONE 3D</Text>
            <View style={styles.bestRow}>
              <ArenaCrownIcon size={13} />
              <Text style={styles.bestLabel}>Best: {bestWeight.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.coinBadge}>
            <SmileyCoinIcon size={16} />
            <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          {/* 1. Arena Mode Selector */}
          <Text style={styles.sectionLabel}>GAME MODE</Text>
          <View style={styles.modeRow}>
            {ARENA_MODES.map((item) => {
              const active = mode === item.key;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => onSelectMode(item.key)}
                  style={({ pressed }) => [
                    styles.modeCard,
                    active && styles.modeCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.modeTitle, active && styles.modeTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.modeSub}>{item.sub}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* 2. 3D Worm Skin Wardrobe */}
          <Text style={styles.sectionLabel}>3D WORM SKINS</Text>
          <View style={styles.skinGrid}>
            {ALL_SKIN_IDS.map((id) => {
              const skin = WORM_SKINS[id];
              const isUnlocked = unlockedSkins.includes(id);
              const isEquipped = selectedSkin === id;
              const canAfford = coins >= skin.cost;

              return (
                <Pressable
                  key={id}
                  onPress={() => onSelectOrUnlockSkin(id)}
                  style={({ pressed }) => [
                    styles.skinCard,
                    isEquipped && styles.skinEquipped,
                    !isUnlocked && !canAfford && styles.skinCantAfford,
                    pressed && styles.pressed,
                  ]}
                >
                  <MiniSkinWormPreview skin={skin} />
                  <Text numberOfLines={1} style={styles.skinName}>
                    {skin.name}
                  </Text>
                  {isEquipped ? (
                    <Text style={styles.equippedTag}>EQUIPPED</Text>
                  ) : isUnlocked ? (
                    <Text style={styles.unlockedTag}>SELECT</Text>
                  ) : (
                    <View style={styles.priceRow}>
                      <SmileyCoinIcon size={11} />
                      <Text style={styles.priceText}>{skin.cost}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* 3. Booster Refill Shop */}
          <Text style={styles.sectionLabel}>ARENA BOOSTERS</Text>
          <View style={styles.shopRow}>
            {(
              [
                { key: 'magnet' as BoosterType, label: 'Magnet', Icon: MagnetBoosterIcon },
                { key: 'turbo' as BoosterType, label: 'Turbo 2x', Icon: TurboBoosterIcon },
                { key: 'scope' as BoosterType, label: 'Zoom Out', Icon: ScopeBoosterIcon },
              ] as const
            ).map(({ key, label, Icon }) => {
              const price = BOOSTER_PRICES[key];
              const count = boosterInventory[key] || 0;
              const canBuy = coins >= price;

              return (
                <Pressable
                  key={key}
                  onPress={() => onBuyBooster(key)}
                  disabled={!canBuy}
                  style={({ pressed }) => [
                    styles.shopCard,
                    !canBuy && styles.shopDisabled,
                    pressed && canBuy && styles.pressed,
                  ]}
                >
                  <Icon size={20} />
                  <Text style={styles.shopLabel}>
                    {label} ({count})
                  </Text>
                  <View style={styles.priceRow}>
                    <SmileyCoinIcon size={11} />
                    <Text style={styles.priceText}>+{price}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Enter Arena Primary CTA */}
        <Pressable
          onPress={onPlay}
          style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
        >
          <LinearGradient colors={['#4ADE80', '#16A34A']} style={styles.playBtnInner}>
            <ArenaPlayIcon size={16} color="#052E16" />
            <Text style={styles.playBtnText}>ENTER ARENA</Text>
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </View>
  </Modal>
);

interface GameOverProps {
  visible: boolean;
  reason: 'wall' | 'enemy' | 'time_up' | null;
  killedByName?: string;
  finalWeight: number;
  bestWeight: number;
  kills: number;
  coinsEarned: number;
  chestsOpened: number;
  onPlayAgain: () => void;
  onOpenWardrobe: () => void;
  onExit: () => void;
}

export const WormGameOverModal: React.FC<GameOverProps> = ({
  visible,
  reason,
  killedByName,
  finalWeight,
  bestWeight,
  kills,
  coinsEarned,
  chestsOpened,
  onPlayAgain,
  onOpenWardrobe,
  onExit,
}) => {
  const headline =
    reason === 'time_up'
      ? 'TIME RUSH COMPLETE!'
      : reason === 'wall'
      ? 'HIT ARENA WALL!'
      : killedByName
      ? `CAUGHT BY ${killedByName.toUpperCase()}`
      : 'ELIMINATED!';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={['#153B6E', '#0B203E']} style={styles.resultCard}>
          <Text style={[styles.resultTitle, reason === 'time_up' && styles.timeWinTitle]}>
            {headline}
          </Text>

          <Text style={styles.weightLabel}>FINAL WEIGHT</Text>
          <Text style={styles.weightVal}>{Math.round(finalWeight).toLocaleString()}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <ArenaCrownIcon size={14} />
              <Text style={styles.statVal}>{bestWeight.toLocaleString()}</Text>
              <Text style={styles.statCap}>BEST</Text>
            </View>
            <View style={styles.statBox}>
              <SmileyCoinIcon size={15} />
              <Text style={styles.statVal}>+{coinsEarned}</Text>
              <Text style={styles.statCap}>COINS</Text>
            </View>
            <View style={styles.statBox}>
              <TreasureChestIcon size={15} />
              <Text style={styles.statVal}>{kills}</Text>
              <Text style={styles.statCap}>KO / {chestsOpened} CHESTS</Text>
            </View>
          </View>

          <Pressable
            onPress={onPlayAgain}
            style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
          >
            <LinearGradient colors={['#FACC15', '#D97706']} style={styles.playBtnInner}>
              <ReplayCircleIcon size={17} color="#451A03" />
              <Text style={[styles.playBtnText, { color: '#451A03' }]}>PLAY AGAIN</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={onOpenWardrobe}
              style={({ pressed }) => [styles.secBtn, pressed && styles.pressed]}
            >
              <WardrobePaletteIcon size={16} />
              <Text style={styles.secText}>SKINS & SHOP</Text>
            </Pressable>
            <Pressable
              onPress={onExit}
              style={({ pressed }) => [styles.secBtn, pressed && styles.pressed]}
            >
              <BackChevronIcon size={15} />
              <Text style={styles.secText}>EXIT</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

interface PauseModalProps {
  visible: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenWardrobe: () => void;
  onExit: () => void;
}

export const WormPauseModal: React.FC<PauseModalProps> = ({
  visible,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onResume,
  onRestart,
  onOpenWardrobe,
  onExit,
}) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <LinearGradient colors={['#153B6E', '#0B203E']} style={styles.resultCard}>
        <View style={styles.pauseHeader}>
          <ArenaGearIcon size={20} color="#FDE047" />
          <Text style={styles.pauseTitle}>PAUSED</Text>
        </View>

        <View style={styles.toggleRow}>
          <Pressable
            onPress={onToggleSound}
            style={({ pressed }) => [styles.toggleBtn, pressed && styles.pressed]}
          >
            <SoundSpeakerIcon size={16} muted={!soundEnabled} />
            <Text style={styles.toggleText}>Sound: {soundEnabled ? 'ON' : 'OFF'}</Text>
          </Pressable>

          <Pressable
            onPress={onToggleHaptics}
            style={({ pressed }) => [styles.toggleBtn, pressed && styles.pressed]}
          >
            <Text style={styles.toggleText}>Haptics: {hapticsEnabled ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onResume}
          style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
        >
          <LinearGradient colors={['#4ADE80', '#16A34A']} style={styles.playBtnInner}>
            <ArenaPlayIcon size={15} color="#052E16" />
            <Text style={styles.playBtnText}>RESUME</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.secondaryRow}>
          <Pressable
            onPress={onRestart}
            style={({ pressed }) => [styles.secBtn, pressed && styles.pressed]}
          >
            <ReplayCircleIcon size={15} color="#FFFFFF" />
            <Text style={styles.secText}>RESTART</Text>
          </Pressable>
          <Pressable
            onPress={onOpenWardrobe}
            style={({ pressed }) => [styles.secBtn, pressed && styles.pressed]}
          >
            <WardrobePaletteIcon size={15} />
            <Text style={styles.secText}>SKINS</Text>
          </Pressable>
        </View>

        <Pressable onPress={onExit} style={({ pressed }) => [styles.exitLink, pressed && styles.pressed]}>
          <Text style={styles.exitLinkText}>Exit to Menu</Text>
        </Pressable>
      </LinearGradient>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 15, 32, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  hubCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitleCol: {
    alignItems: 'center',
  },
  hubTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  bestLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE047',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.45)',
  },
  coinText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FEF08A',
  },
  scrollBody: {
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(147, 197, 253, 0.2)',
    alignItems: 'center',
  },
  modeCardActive: {
    borderColor: '#4ADE80',
    backgroundColor: 'rgba(22, 163, 74, 0.25)',
  },
  modeTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#E2E8F0',
  },
  modeTitleActive: {
    color: '#86EFAC',
  },
  modeSub: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  skinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  skinCard: {
    width: '31%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 13,
    padding: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(147, 197, 253, 0.2)',
    alignItems: 'center',
    gap: 3,
  },
  skinEquipped: {
    borderColor: '#FACC15',
    backgroundColor: 'rgba(250, 204, 21, 0.16)',
  },
  skinCantAfford: {
    opacity: 0.68,
  },
  skinName: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  equippedTag: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#4ADE80',
  },
  unlockedTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#93C5FD',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FACC15',
  },
  shopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shopCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 64, 175, 0.45)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1.2,
    borderColor: 'rgba(147, 197, 253, 0.35)',
    alignItems: 'center',
    gap: 3,
  },
  shopDisabled: {
    opacity: 0.52,
  },
  shopLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  playBtn: {
    width: '100%',
    height: 48,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1.8,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  playBtnInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#052E16',
    letterSpacing: 1,
  },
  resultCard: {
    width: '100%',
    maxWidth: 344,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FCA5A5',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
  },
  timeWinTitle: {
    color: '#86EFAC',
  },
  weightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1,
  },
  weightVal: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FACC15',
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.2)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statCap: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  secBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pauseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  pauseTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  exitLink: {
    marginTop: 12,
    paddingVertical: 6,
  },
  exitLinkText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
