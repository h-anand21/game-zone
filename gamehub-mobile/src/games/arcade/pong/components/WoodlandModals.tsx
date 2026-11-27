// ============================================================
// Woodland Bubble Shooter — Carved Wooden Result & Pause Modals
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_SHOOTER_PALETTE } from './woodTheme';
import {
  TrophyWoodIcon,
  StarGoldIcon,
  CrownScoreIcon,
  ReplayWoodIcon,
  LevelsGridIcon,
  PlayTriangleIcon,
  GearSettingsIcon,
  BackArrowIcon,
  SoundToggleIcon,
} from './WoodlandIcons';

interface LevelCompleteModalProps {
  visible: boolean;
  level: number;
  levelName: string;
  score: number;
  bonusPoints: number;
  stars: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenMap: () => void;
}

export const WoodlandLevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  level,
  levelName,
  score,
  bonusPoints,
  stars,
  onNextLevel,
  onReplay,
  onOpenMap,
}) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <LinearGradient colors={WOOD_SHOOTER_PALETTE.modalCardGradient} style={styles.card}>
        <View style={styles.badge}>
          <TrophyWoodIcon size={16} />
          <Text style={styles.badgeText}>LEVEL {level} COMPLETE</Text>
        </View>

        <Text style={styles.titleText}>{levelName}</Text>

        <View style={styles.starsRow}>
          <StarGoldIcon size={34} filled={stars >= 1} />
          <View style={styles.centerStarLift}>
            <StarGoldIcon size={44} filled={stars >= 2} />
          </View>
          <StarGoldIcon size={34} filled={stars >= 3} />
        </View>

        <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

        {bonusPoints > 0 && (
          <Text style={styles.bonusSub}>
            +{bonusPoints.toLocaleString()} Unused Shots Bonus
          </Text>
        )}

        <View style={styles.btnCol}>
          <Pressable
            onPress={onNextLevel}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <LinearGradient colors={WOOD_SHOOTER_PALETTE.goldCtaGradient} style={styles.primaryInner}>
              <Text style={styles.primaryText}>LEVEL {level + 1}</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.btnRow}>
            <Pressable
              onPress={onReplay}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <ReplayWoodIcon size={15} />
              <Text style={styles.secondaryText}>REPLAY</Text>
            </Pressable>
            <Pressable
              onPress={onOpenMap}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <LevelsGridIcon size={15} />
              <Text style={styles.secondaryText}>LEVELS</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  </Modal>
);

interface GameOverModalProps {
  visible: boolean;
  reason: 'shots' | 'overflow';
  level: number;
  score: number;
  highScore: number;
  onRetry: () => void;
  onOpenMap: () => void;
  onExit: () => void;
}

export const WoodlandGameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  reason,
  level,
  score,
  highScore,
  onRetry,
  onOpenMap,
  onExit,
}) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <LinearGradient colors={WOOD_SHOOTER_PALETTE.modalCardGradient} style={styles.card}>
        <Text style={styles.failTitle}>
          {reason === 'overflow' ? 'CANOPY BREACHED' : 'OUT OF SHOTS'}
        </Text>
        <Text style={styles.failSub}>
          Level {level} • Aim bank shots & clear upper anchors!
        </Text>

        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

        <View style={styles.bestPill}>
          <CrownScoreIcon size={14} />
          <Text style={styles.bestText}>BEST: {highScore.toLocaleString()}</Text>
        </View>

        <View style={styles.btnCol}>
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <LinearGradient colors={WOOD_SHOOTER_PALETTE.goldCtaGradient} style={styles.primaryInner}>
              <ReplayWoodIcon size={16} color={WOOD_SHOOTER_PALETTE.goldCtaText} />
              <Text style={styles.primaryText}>RETRY LEVEL</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onOpenMap}
            style={({ pressed }) => [styles.secondaryFullBtn, pressed && styles.pressed]}
          >
            <LevelsGridIcon size={15} />
            <Text style={styles.secondaryText}>WORLD MAP</Text>
          </Pressable>

          <Pressable onPress={onExit} style={({ pressed }) => [styles.exitBtn, pressed && styles.pressed]}>
            <Text style={styles.exitText}>Exit Game</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  </Modal>
);

interface PauseModalProps {
  visible: boolean;
  level: number;
  levelName: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenMap: () => void;
  onQuit: () => void;
}

export const WoodlandPauseModal: React.FC<PauseModalProps> = ({
  visible,
  level,
  levelName,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onResume,
  onRestart,
  onOpenMap,
  onQuit,
}) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <LinearGradient colors={WOOD_SHOOTER_PALETTE.modalCardGradient} style={styles.card}>
        <View style={styles.badge}>
          <GearSettingsIcon size={18} color="#FCD34D" />
          <Text style={styles.badgeText}>SETTINGS & PAUSE</Text>
        </View>
        <Text style={styles.failSub}>
          Level {level} • {levelName}
        </Text>

        {/* Audio & Haptic Toggle Row */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={onToggleSound}
            style={({ pressed }) => [styles.toggleBtn, pressed && styles.pressed]}
          >
            <SoundToggleIcon size={16} muted={!soundEnabled} />
            <Text style={styles.toggleText}>Sound: {soundEnabled ? 'ON' : 'OFF'}</Text>
          </Pressable>

          <Pressable
            onPress={onToggleHaptics}
            style={({ pressed }) => [styles.toggleBtn, pressed && styles.pressed]}
          >
            <Text style={styles.toggleText}>Haptics: {hapticsEnabled ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>

        <View style={styles.btnCol}>
          <Pressable
            onPress={onResume}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <LinearGradient colors={WOOD_SHOOTER_PALETTE.goldCtaGradient} style={styles.primaryInner}>
              <PlayTriangleIcon size={15} color={WOOD_SHOOTER_PALETTE.goldCtaText} />
              <Text style={styles.primaryText}>RESUME</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.btnRow}>
            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <ReplayWoodIcon size={15} />
              <Text style={styles.secondaryText}>RESTART</Text>
            </Pressable>
            <Pressable
              onPress={onOpenMap}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <LevelsGridIcon size={15} />
              <Text style={styles.secondaryText}>LEVELS</Text>
            </Pressable>
          </View>

          <Pressable onPress={onQuit} style={({ pressed }) => [styles.exitBtn, pressed && styles.pressed]}>
            <BackArrowIcon size={14} color={WOOD_SHOOTER_PALETTE.textMuted} />
            <Text style={styles.exitText}>Exit to Menu</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: WOOD_SHOOTER_PALETTE.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 344,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: WOOD_SHOOTER_PALETTE.modalBorder,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.cannonRingBorder,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textGold,
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  centerStarLift: {
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textMuted,
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textGold,
    marginBottom: 4,
  },
  bonusSub: {
    fontSize: 11.5,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textGreenLight,
    marginBottom: 14,
  },
  failTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FCA5A5',
    letterSpacing: 1.2,
  },
  failSub: {
    fontSize: 12,
    fontWeight: '700',
    color: WOOD_SHOOTER_PALETTE.textCream,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    marginBottom: 16,
  },
  bestText: {
    fontSize: 12,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textCream,
  },
  toggleRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.4,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textCream,
  },
  btnCol: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.goldCtaBorder,
  },
  primaryInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.goldCtaText,
    letterSpacing: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryFullBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textLight,
    letterSpacing: 0.7,
  },
  exitBtn: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  exitText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: WOOD_SHOOTER_PALETTE.textMuted,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
});
