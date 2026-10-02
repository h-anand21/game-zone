// ============================================================
// PATTERN QUEST — HUDCounter Component
// Top Game HUD: Lives, Timer, Combo, Score & Pause
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../../theme';

interface HUDCounterProps {
  score: number;
  combo: number;
  timeLeft: number;
  lives: number;
  maxLives?: number;
  onPause: () => void;
  templeTitle?: string;
}

const HUDCounterComponent: React.FC<HUDCounterProps> = ({
  score,
  combo,
  timeLeft,
  lives,
  maxLives = 3,
  onPause,
  templeTitle = 'TEMPLE 01',
}) => {
  return (
    <View style={styles.container}>
      {/* Top Left: Pause + Temple Name */}
      <View style={styles.leftRow}>
        <Pressable onPress={onPause} style={styles.pauseButton}>
          <Image source={pqAssets.icons.pause} style={styles.pauseIcon} resizeMode="contain" />
        </Pressable>
        <View style={styles.templeTag}>
          <Text style={styles.templeText}>{templeTitle}</Text>
        </View>
      </View>

      {/* Center: Combo & Score */}
      <View style={styles.centerBlock}>
        {combo > 1 && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>🔥 x{combo}</Text>
          </View>
        )}
        <Text style={pqTypography.hudValue}>{score} PTS</Text>
      </View>

      {/* Right: Timer & Lives */}
      <View style={styles.rightRow}>
        <View style={styles.timerBadge}>
          <Image source={pqAssets.hud.timer} style={styles.timerIcon} resizeMode="contain" />
          <Text
            style={[
              pqTypography.hudValue,
              timeLeft <= 5 && { color: pqColors.dangerGlow },
            ]}
          >
            {timeLeft}s
          </Text>
        </View>

        <View style={styles.livesRow}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <Image
              key={i}
              source={i < lives ? pqAssets.hud.heartFull : pqAssets.hud.heartEmpty}
              style={styles.heartIcon}
              resizeMode="contain"
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const HUDCounter = React.memo(HUDCounterComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pqSpacing.base,
    paddingVertical: pqSpacing.xs,
    backgroundColor: 'rgba(10, 16, 24, 0.88)',
    borderBottomWidth: 1.5,
    borderBottomColor: '#3A4858',
    zIndex: 10,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pqSpacing.xs,
  },
  pauseButton: {
    padding: 2,
  },
  pauseIcon: {
    width: 32,
    height: 32,
  },
  templeTag: {
    backgroundColor: 'rgba(23, 195, 178, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: pqSpacing.radiusSm,
    borderWidth: 1,
    borderColor: pqColors.turquoise,
  },
  templeText: {
    fontSize: 10,
    fontWeight: '800',
    color: pqColors.turquoiseLight,
    letterSpacing: 0.5,
  },
  centerBlock: {
    alignItems: 'center',
  },
  comboBadge: {
    backgroundColor: 'rgba(230, 126, 34, 0.3)',
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: pqColors.warningOrange,
    marginBottom: 2,
  },
  comboText: {
    fontSize: 11,
    fontWeight: '900',
    color: pqColors.goldBright,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pqSpacing.sm,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 30, 44, 0.9)',
    borderWidth: 1.5,
    borderColor: pqColors.goldDeep,
    borderRadius: pqSpacing.radiusPill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  timerIcon: {
    width: 18,
    height: 18,
  },
  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  heartIcon: {
    width: 22,
    height: 22,
  },
});
