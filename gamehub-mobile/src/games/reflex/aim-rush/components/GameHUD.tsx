// ============================================================
// AIM RUSH — Authentic Sci-Fi GameHUD Component
// Recreated from "Neon Aim Rush_ Target Chain.png" reference
// 100% SVG Vector Icons, Dual-tier Top Telemetry + Progress Rail
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ARColors } from '../theme/colors';
import { GameModeConfig } from '../types';
import {
  SvgPause,
  SvgHeart,
  SvgBulbHint,
  SvgExitDoor,
} from './icons/AimRushIcons';

interface GameHUDProps {
  score: number;
  chain: number;
  timeLeftSeconds: number;
  lives: number;
  maxLives: number;
  mode: GameModeConfig;
  hitsCount: number;
  goalCount: number;
  isRushActive: boolean;
  onPause: () => void;
  onExit: () => void;
  onHint?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  chain,
  timeLeftSeconds,
  lives,
  maxLives,
  mode,
  hitsCount,
  goalCount,
  isRushActive,
  onPause,
  onExit,
  onHint,
}) => {
  const insets = useSafeAreaInsets();
  const isTimeLow = timeLeftSeconds <= 5;
  const timeFormatted = `00:${timeLeftSeconds.toString().padStart(2, '0')}`;

  // Progress rail node count (6 segments)
  const totalNodes = 6;
  const progressRatio = Math.min(1, hitsCount / goalCount);
  const activeNodes = Math.round(progressRatio * totalNodes);

  return (
    <View style={styles.hudOverlay} pointerEvents="box-none">
      {/* 1. TOP TELEMETRY CLUSTER */}
      <View
        style={[
          styles.topCluster,
          { paddingTop: Math.max(10, insets.top + 6) },
        ]}
        pointerEvents="box-none"
      >
        {/* Tier 1 Row: Pause | Score | Title | Chain | Lives */}
        <View style={styles.tier1Row}>
          {/* Pause Button (SVG) */}
          <Pressable style={styles.hudBox} onPress={onPause}>
            <SvgPause size={16} color={ARColors.cyan} />
          </Pressable>

          {/* Score Box */}
          <View style={[styles.hudBox, styles.scoreBox]}>
            <Text style={styles.hudLabel}>SCORE</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
          </View>

          {/* Center Brand Tag */}
          <View style={styles.brandTag}>
            <Text style={styles.brandTitle}>AIM RUSH</Text>
            <Text style={styles.brandSub}>TARGET CHAIN</Text>
          </View>

          {/* Chain Box */}
          <View style={[styles.hudBox, styles.chainBox]}>
            <Text style={[styles.hudLabel, { color: ARColors.gold }]}>CHAIN</Text>
            <Text style={styles.chainNumber}>x{chain}</Text>
          </View>

          {/* Lives Box (SVG Hearts) */}
          <View style={styles.hudBox}>
            <View style={styles.livesRow}>
              {Array.from({ length: maxLives }).map((_, i) => (
                <SvgHeart
                  key={i}
                  size={14}
                  color={i < lives ? ARColors.cyan : 'rgba(255,255,255,0.2)'}
                  fill={i < lives ? ARColors.cyan : 'rgba(255,255,255,0.2)'}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Tier 2 Row: Mode | Time | Target Left */}
        <View style={styles.tier2Row}>
          {/* Mode Box */}
          <View style={[styles.subBox, { borderColor: mode.color }]}>
            <Text style={styles.subLabel}>MODE</Text>
            <Text style={[styles.subValue, { color: mode.color }]}>{mode.title}</Text>
          </View>

          {/* Time Box */}
          <View style={[styles.subBox, isTimeLow && styles.timeLowBox]}>
            <Text style={[styles.subLabel, isTimeLow && { color: ARColors.red }]}>TIME</Text>
            <Text style={[styles.subValue, isTimeLow && { color: ARColors.red }]}>
              {timeFormatted}
            </Text>
          </View>

          {/* Target Left Box */}
          <View style={styles.subBox}>
            <Text style={styles.subLabel}>TARGET LEFT</Text>
            <Text style={styles.subValue}>
              {hitsCount} / {goalCount}
            </Text>
          </View>
        </View>

        {/* Rush Mode Kinetic Banner */}
        {isRushActive && (
          <View style={styles.rushBanner} pointerEvents="none">
            <Text style={styles.rushText}>⚡ RUSH ACTIVE • SPEED ×1.5 ⚡</Text>
          </View>
        )}
      </View>

      {/* 2. BOTTOM TELEMETRY CLUSTER (SAFELY POSITIONED ABOVE GESTURE BAR) */}
      <View
        style={[
          styles.bottomCluster,
          { paddingBottom: Math.max(12, insets.bottom + 8) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.bottomBarRow}>
          {/* Left: Hint Button with SVG Bulb */}
          <Pressable style={styles.bottomActionBtn} onPress={onHint}>
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>3</Text>
            </View>
            <SvgBulbHint size={18} color={ARColors.cyan} />
            <Text style={styles.bottomActionLabel}>HINT</Text>
          </Pressable>

          {/* Center: Target Progress Waypoint Rail */}
          <View style={styles.progressRailBox}>
            <View style={styles.nodesTrack}>
              {Array.from({ length: totalNodes }).map((_, i) => {
                const isLit = i < activeNodes;
                return (
                  <React.Fragment key={i}>
                    <View
                      style={[
                        styles.nodeCircle,
                        isLit && styles.nodeCircleLit,
                      ]}
                    />
                    {i < totalNodes - 1 && (
                      <View
                        style={[
                          styles.nodeLink,
                          isLit && styles.nodeLinkLit,
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
            <Text style={styles.railText}>
              {hitsCount} / {goalCount}
            </Text>
          </View>

          {/* Right: Exit Button with SVG Door */}
          <Pressable style={styles.bottomActionBtn} onPress={onExit}>
            <SvgExitDoor size={18} color={ARColors.cyan} />
            <Text style={styles.bottomActionLabel}>EXIT</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 50,
  },

  // 1. Top Cluster
  topCluster: {
    paddingHorizontal: 14,
    gap: 8,
  },
  tier1Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hudBox: {
    height: 44,
    minWidth: 44,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  scoreBox: {
    minWidth: 68,
  },
  chainBox: {
    minWidth: 60,
    borderColor: ARColors.gold,
  },
  hudLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 0.8,
  },
  scoreNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 0.8,
  },
  chainNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: ARColors.gold,
    letterSpacing: 0.8,
  },
  brandTag: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: ARColors.white,
    fontStyle: 'italic',
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 7,
    fontWeight: '800',
    color: ARColors.lime,
    letterSpacing: 1.2,
  },
  livesRow: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },

  // Tier 2 Sub HUD Row
  tier2Row: {
    flexDirection: 'row',
    gap: 8,
  },
  subBox: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(8, 14, 22, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(53, 231, 255, 0.4)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLowBox: {
    borderColor: ARColors.red,
    backgroundColor: ARColors.redSoft,
  },
  subLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 0.6,
  },
  subValue: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 0.8,
  },

  rushBanner: {
    alignSelf: 'center',
    backgroundColor: ARColors.limeSoft,
    borderWidth: 1.2,
    borderColor: ARColors.lime,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 2,
  },
  rushText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 1.2,
  },

  // 2. Bottom Cluster
  bottomCluster: {
    paddingHorizontal: 14,
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bottomActionBtn: {
    width: 52,
    height: 50,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 2,
  },
  bottomActionLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 0.8,
  },
  hintBadge: {
    position: 'absolute',
    top: -5,
    right: -4,
    backgroundColor: ARColors.cyan,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#07090C',
  },
  progressRailBox: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  nodesTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 3,
  },
  nodeCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.4)',
  },
  nodeCircleLit: {
    backgroundColor: ARColors.cyan,
    borderColor: '#FFFFFF',
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  nodeLink: {
    width: 14,
    height: 2,
    backgroundColor: 'rgba(53, 231, 255, 0.3)',
  },
  nodeLinkLit: {
    backgroundColor: ARColors.cyan,
  },
  railText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1,
  },
});
