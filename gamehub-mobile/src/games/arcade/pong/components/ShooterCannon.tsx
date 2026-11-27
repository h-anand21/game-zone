// ============================================================
// Woodland Bubble Shooter — Carved Wooden Shooter Pedestal & Boosters
// Displays Shot Count Ring, Tap-to-Swap Orb & Fireball/Lightning/Rainbow Deck
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BubbleSprite } from './BubbleSprite';
import { WOOD_SHOOTER_PALETTE } from './woodTheme';
import {
  FireballPowerIcon,
  LightningPowerIcon,
  RainbowPowerIcon,
  SwapArrowsIcon,
  ComboSparkleIcon,
} from './WoodlandIcons';
import type { BubbleColor, BubbleKind, PowerUpType } from '../types';

interface ShooterCannonProps {
  activeColor: BubbleColor;
  activeKind: BubbleKind;
  nextColor: BubbleColor;
  shotsLeft: number;
  powerUps: Record<PowerUpType, number>;
  selectedPowerUp: PowerUpType | null;
  streakCharge: number; // 0..5 combo meter charging free power-up
  isBusy: boolean;
  onSwapBubbles: () => void;
  onTogglePowerUp: (type: PowerUpType) => void;
}

const POWER_META: {
  key: PowerUpType;
  label: string;
  Icon: React.FC<{ size?: number }>;
}[] = [
  { key: 'fireball', label: 'Bomb', Icon: FireballPowerIcon },
  { key: 'lightning', label: 'Bolt', Icon: LightningPowerIcon },
  { key: 'rainbow', label: 'Prism', Icon: RainbowPowerIcon },
];

export const ShooterCannon: React.FC<ShooterCannonProps> = ({
  activeColor,
  activeKind,
  nextColor,
  shotsLeft,
  powerUps,
  selectedPowerUp,
  streakCharge,
  isBusy,
  onSwapBubbles,
  onTogglePowerUp,
}) => {
  const isLowShots = shotsLeft <= 5;
  const chargeRatio = Math.min(1, streakCharge / 5);

  return (
    <LinearGradient
      colors={WOOD_SHOOTER_PALETTE.deckGradient}
      style={styles.deckContainer}
    >
      {/* Left Power-Up Pair (Fireball & Lightning) */}
      <View style={styles.boosterGroup}>
        {POWER_META.slice(0, 2).map(({ key, label, Icon }) => {
          const count = powerUps[key] || 0;
          const isSelected = selectedPowerUp === key;
          const isDisabled = isBusy || (count <= 0 && !isSelected);

          return (
            <Pressable
              key={key}
              onPress={() => onTogglePowerUp(key)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.boosterBtn,
                isSelected && styles.boosterBtnActive,
                isDisabled && styles.boosterBtnDisabled,
                pressed && !isDisabled && styles.btnPressed,
              ]}
            >
              <Icon size={21} />
              <Text style={styles.boosterLabel}>{label}</Text>
              <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                <Text style={styles.countBadgeText}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Center Carved Wooden Shooter Ring + Active / Swappable Orb + Shots Left */}
      <Pressable
        onPress={onSwapBubbles}
        disabled={isBusy || selectedPowerUp !== null}
        style={({ pressed }) => [
          styles.cannonCenterWrap,
          pressed && !isBusy && styles.btnPressed,
        ]}
      >
        <View style={styles.cannonRingOuter}>
          <View style={styles.activeOrbSeat}>
            <BubbleSprite size={34} color={activeColor} kind={activeKind} />
          </View>

          <View style={styles.shotsCenterBadge}>
            <Text style={[styles.shotsValue, isLowShots && styles.shotsLowText]}>
              {shotsLeft}
            </Text>
          </View>
        </View>

        {/* Secondary Next Orb + Swap Arrows Badge */}
        <View style={styles.swapDock}>
          <BubbleSprite size={22} color={nextColor} kind="normal" />
          <View style={styles.swapIconChip}>
            <SwapArrowsIcon size={11} color="#FDE68A" />
          </View>
        </View>
      </Pressable>

      {/* Right Booster (Rainbow Prism) + Pop Fever Meter */}
      <View style={styles.boosterGroupRight}>
        {POWER_META.slice(2).map(({ key, label, Icon }) => {
          const count = powerUps[key] || 0;
          const isSelected = selectedPowerUp === key;
          const isDisabled = isBusy || (count <= 0 && !isSelected);

          return (
            <Pressable
              key={key}
              onPress={() => onTogglePowerUp(key)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.boosterBtn,
                isSelected && styles.boosterBtnActive,
                isDisabled && styles.boosterBtnDisabled,
                pressed && !isDisabled && styles.btnPressed,
              ]}
            >
              <Icon size={21} />
              <Text style={styles.boosterLabel}>{label}</Text>
              <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                <Text style={styles.countBadgeText}>{count}</Text>
              </View>
            </Pressable>
          );
        })}

        {/* Combo Magic Meter: awards free power orb at 5 streaks */}
        <View style={styles.feverCard}>
          <View style={styles.feverTop}>
            <ComboSparkleIcon size={11} />
            <Text style={styles.feverLabel}>BONUS</Text>
          </View>
          <View style={styles.feverTrack}>
            <View style={[styles.feverFill, { width: `${Math.round(chargeRatio * 100)}%` }]} />
          </View>
          <Text style={styles.feverSub}>{streakCharge}/5</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    width: '100%',
    height: 76,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.deckBorder,
    borderTopColor: WOOD_SHOOTER_PALETTE.frameBevelLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    shadowColor: '#1E0B02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  boosterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  boosterGroupRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  boosterBtn: {
    width: 48,
    height: 54,
    borderRadius: 13,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  boosterBtnActive: {
    borderColor: '#FEF08A',
    backgroundColor: '#7C3E11',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 5,
  },
  boosterBtnDisabled: {
    opacity: 0.45,
  },
  boosterLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textCream,
    marginTop: 1,
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D97706',
    borderWidth: 1.5,
    borderColor: '#3D1B05',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  countBadgeActive: {
    backgroundColor: '#22C55E',
  },
  countBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFDF7',
  },
  cannonCenterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  cannonRingOuter: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: WOOD_SHOOTER_PALETTE.cannonRingBg,
    borderWidth: 2.5,
    borderColor: WOOD_SHOOTER_PALETTE.cannonRingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  activeOrbSeat: {
    marginTop: -6,
  },
  shotsCenterBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: '#2A1204',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9A5B25',
  },
  shotsValue: {
    fontSize: 12,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
  },
  shotsLowText: {
    color: '#FCA5A5',
  },
  swapDock: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1.4,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
  },
  swapIconChip: {
    marginTop: 2,
  },
  feverCard: {
    width: 48,
    height: 54,
    borderRadius: 12,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.4,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 3,
  },
  feverTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  feverLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textGold,
  },
  feverTrack: {
    width: '86%',
    height: 5,
    borderRadius: 3,
    backgroundColor: '#261004',
    overflow: 'hidden',
  },
  feverFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  feverSub: {
    fontSize: 8.5,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textCream,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
