// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Wooden Modals
// Pause, Level Complete, Screw Jam / Time Up, and Level Selector
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOOD_UI_COLORS } from '../colors';
import type { GameStatus } from '../types';
import {
  ArrowRightWoodIcon,
  CloseWoodIcon,
  HeartBadgeIcon,
  LockWoodIcon,
  ScrewdriverBoostIcon,
  StarWoodIcon,
  TrophyWoodIcon,
  UndoWoodIcon,
} from './WoodIcons';

// ============================================================
// 1. LEVEL COMPLETE / VICTORY MODAL
// ============================================================

interface WoodVictoryModalProps {
  visible: boolean;
  level: number;
  stars: number;
  moves: number;
  timeRemaining: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevels: () => void;
  onClose: () => void;
}

export const WoodVictoryModal: React.FC<WoodVictoryModalProps> = ({
  visible,
  level,
  stars,
  moves,
  timeRemaining,
  onNextLevel,
  onReplay,
  onOpenLevels,
  onClose,
}) => {
  const [scaleAnim] = useState(() => new Animated.Value(0.84));

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 95,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.84);
    }
  }, [visible, scaleAnim]);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalFrame, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[WOOD_UI_COLORS.boardTop, WOOD_UI_COLORS.boardBottom]}
            style={styles.woodCard}
          >
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <CloseWoodIcon size={14} color="#FFFFFF" />
            </Pressable>

            <View style={styles.bannerPill}>
              <Text style={styles.bannerText}>LEVEL {level} SOLVED!</Text>
            </View>

            <View style={styles.trophyWrap}>
              <TrophyWoodIcon size={48} />
            </View>

            <View style={styles.starsRow}>
              <StarWoodIcon size={30} filled={stars >= 1} />
              <View style={styles.starCenterLift}>
                <StarWoodIcon size={38} filled={stars >= 2} />
              </View>
              <StarWoodIcon size={30} filled={stars >= 3} />
            </View>

            <View style={styles.statsBox}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>MOVES</Text>
                <Text style={styles.statValue}>{moves}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>TIME LEFT</Text>
                <Text style={styles.statValue}>{formattedTime}</Text>
              </View>
            </View>

            {/* Primary Next Level 3D Button */}
            <Pressable
              onPress={onNextLevel}
              style={({ pressed }) => [styles.primaryBtnOuter, pressed && styles.btnPressed]}
            >
              <LinearGradient
                colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
                style={styles.primaryBtnFace}
              >
                <Text style={styles.primaryBtnText}>NEXT LEVEL</Text>
                <ArrowRightWoodIcon size={18} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>

            <View style={styles.secondaryRow}>
              <Pressable
                onPress={onReplay}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.secondaryBtnText}>REPLAY</Text>
              </Pressable>
              <Pressable
                onPress={onOpenLevels}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.secondaryBtnText}>LEVELS</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============================================================
// 2. PAUSE MODAL
// ============================================================

interface WoodPauseModalProps {
  visible: boolean;
  level: number;
  hearts: number;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevels: () => void;
  onExit: () => void;
}

export const WoodPauseModal: React.FC<WoodPauseModalProps> = ({
  visible,
  level,
  hearts,
  onResume,
  onRestart,
  onOpenLevels,
  onExit,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={onResume}
  >
    <View style={styles.overlay}>
      <View style={styles.modalFrame}>
        <LinearGradient
          colors={[WOOD_UI_COLORS.boardTop, WOOD_UI_COLORS.boardBottom]}
          style={styles.woodCard}
        >
          <View style={styles.bannerPill}>
            <Text style={styles.bannerText}>GAME PAUSED</Text>
          </View>

          <Text style={styles.pauseLevelTitle}>Level {level}</Text>

          <View style={styles.heartsRow}>
            {Array.from({ length: 5 }, (_, idx) => (
              <View key={`heart-${idx}`} style={{ opacity: idx < hearts ? 1 : 0.25 }}>
                <HeartBadgeIcon size={20} />
              </View>
            ))}
          </View>

          <Pressable
            onPress={onResume}
            style={({ pressed }) => [styles.greenBtnOuter, pressed && styles.btnPressed]}
          >
            <LinearGradient colors={['#78E81E', '#38990C']} style={styles.primaryBtnFace}>
              <Text style={styles.primaryBtnText}>RESUME</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onOpenLevels}
            style={({ pressed }) => [styles.primaryBtnOuter, pressed && styles.btnPressed]}
          >
            <LinearGradient
              colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
              style={styles.primaryBtnFace}
            >
              <Text style={styles.primaryBtnText}>SELECT LEVEL</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.secondaryBtnText}>RESTART</Text>
            </Pressable>
            <Pressable
              onPress={onExit}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.secondaryBtnText}>EXIT</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  </Modal>
);

// ============================================================
// 3. SCREW JAM / TIME UP RECOVERY MODAL
// ============================================================

interface WoodOutModalProps {
  visible: boolean;
  status: GameStatus;
  canUndo: boolean;
  hasScrewdriver: boolean;
  onUndo: () => void;
  onUseScrewdriver: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const WoodOutModal: React.FC<WoodOutModalProps> = ({
  visible,
  status,
  canUndo,
  hasScrewdriver,
  onUndo,
  onUseScrewdriver,
  onRestart,
  onExit,
}) => {
  const isJam = status === 'lost_jam';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalFrame}>
          <LinearGradient
            colors={[WOOD_UI_COLORS.boardTop, WOOD_UI_COLORS.boardBottom]}
            style={styles.woodCard}
          >
            <View style={[styles.bannerPill, { backgroundColor: '#991B1B' }]}>
              <Text style={styles.bannerText}>
                {isJam ? 'NO HOLES LEFT!' : "TIME'S UP!"}
              </Text>
            </View>

            <Text style={styles.outSubtext}>
              {isJam
                ? 'All reachable holes are blocked! Undo your last move, unscrew a bolt with the screwdriver, or restart.'
                : 'Timer ran out! Give this wooden puzzle another try.'}
            </Text>

            {isJam && canUndo && (
              <Pressable
                onPress={onUndo}
                style={({ pressed }) => [styles.silverWideBtnOuter, pressed && styles.btnPressed]}
              >
                <LinearGradient
                  colors={[WOOD_UI_COLORS.silverBtnTop, WOOD_UI_COLORS.silverBtnBottom]}
                  style={styles.primaryBtnFace}
                >
                  <UndoWoodIcon size={22} />
                  <Text style={styles.primaryBtnText}>UNDO LAST MOVE</Text>
                </LinearGradient>
              </Pressable>
            )}

            {isJam && hasScrewdriver && (
              <Pressable
                onPress={onUseScrewdriver}
                style={({ pressed }) => [styles.primaryBtnOuter, pressed && styles.btnPressed]}
              >
                <LinearGradient
                  colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
                  style={styles.primaryBtnFace}
                >
                  <ScrewdriverBoostIcon size={22} />
                  <Text style={styles.primaryBtnText}>REMOVE 1 SCREW</Text>
                </LinearGradient>
              </Pressable>
            )}

            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [styles.greenBtnOuter, pressed && styles.btnPressed]}
            >
              <LinearGradient colors={['#78E81E', '#38990C']} style={styles.primaryBtnFace}>
                <Text style={styles.primaryBtnText}>TRY AGAIN</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={onExit}
              style={({ pressed }) => [styles.exitLinkBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.exitLinkText}>Exit to Menu</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
// 4. UNLIMITED LEVEL SELECT MODAL
// ============================================================

interface WoodLevelSelectModalProps {
  visible: boolean;
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (lvl: number) => void;
  onClose: () => void;
}

export const WoodLevelSelectModal: React.FC<WoodLevelSelectModalProps> = ({
  visible,
  currentLevel,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  const [extraPages, setExtraPages] = useState<number>(0);

  const baseCount = Math.max(48, Math.ceil((unlockedLevel + 24) / 12) * 12);
  const displayedCount = baseCount + extraPages * 48;
  const levelList = Array.from({ length: displayedCount }, (_, i) => i + 1);
  const totalStars = Object.values(levelStars).reduce((sum, s) => sum + s, 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalFrame, styles.levelModalFrame]}>
          <LinearGradient
            colors={[WOOD_UI_COLORS.boardTop, WOOD_UI_COLORS.boardBottom]}
            style={[styles.woodCard, styles.levelWoodCard]}
          >
            <View style={styles.levelModalHeader}>
              <View>
                <Text style={styles.levelModalTitle}>LEVELS SECTION</Text>
                <Text style={styles.levelModalSubtitle}>
                  Handcrafted (1–10) + Unlimited Puzzles (11–∞)
                </Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtnInline} hitSlop={10}>
                <CloseWoodIcon size={14} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Clear Level Progress Summary Bar */}
            <View style={styles.levelSummaryStrip}>
              <View style={styles.levelSummaryCol}>
                <Text style={styles.levelSummaryLabel}>UNLOCKED</Text>
                <Text style={styles.levelSummaryVal}>{unlockedLevel}</Text>
              </View>
              <View style={styles.levelSummarySep} />
              <View style={styles.levelSummaryCol}>
                <Text style={styles.levelSummaryLabel}>STARS</Text>
                <View style={styles.summaryStarsRow}>
                  <Text style={styles.levelSummaryVal}>{totalStars}</Text>
                  <StarWoodIcon size={13} filled />
                </View>
              </View>
              <View style={styles.levelSummarySep} />
              <View style={styles.levelSummaryCol}>
                <Text style={styles.levelSummaryLabel}>TOTAL</Text>
                <Text style={styles.levelSummaryVal}>∞</Text>
              </View>
            </View>

            {/* Strict 4-Column Virtualized Grid (never clips or wraps to 3 columns) */}
            <FlatList
              data={levelList}
              keyExtractor={(lvl) => `wood-lvl-${lvl}`}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              style={styles.levelListFlex}
              contentContainerStyle={styles.levelGridContent}
              columnWrapperStyle={styles.levelGridRow}
              renderItem={({ item: lvl }) => {
                const isUnlocked = lvl <= unlockedLevel;
                const isCurrent = lvl === currentLevel;
                const stars = levelStars[lvl] || 0;

                return (
                  <Pressable
                    disabled={!isUnlocked}
                    onPress={() => isUnlocked && onSelectLevel(lvl)}
                    style={({ pressed }) => [
                      styles.levelCell,
                      isCurrent && styles.levelCellCurrent,
                      !isUnlocked && styles.levelCellLocked,
                      pressed && isUnlocked && styles.btnPressed,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isCurrent
                          ? ['#78E81E', '#38990C']
                          : isUnlocked
                          ? [WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]
                          : ['#6B3614', '#4B240C']
                      }
                      style={styles.levelCellGrad}
                    >
                      <Text
                        style={[
                          styles.levelCellText,
                          !isUnlocked && { color: '#C28D58' },
                        ]}
                      >
                        {lvl}
                      </Text>

                      {!isUnlocked ? (
                        <View style={{ marginTop: 2 }}>
                          <LockWoodIcon size={11} color="#C28D58" />
                        </View>
                      ) : stars > 0 ? (
                        <View style={styles.cellStarsRow}>
                          {Array.from({ length: stars }, (_, sIdx) => (
                            <StarWoodIcon key={`cs-${sIdx}`} size={10} filled />
                          ))}
                        </View>
                      ) : null}
                    </LinearGradient>
                  </Pressable>
                );
              }}
            />

            {/* Pinned Bottom Footer (always visible, never clipped) */}
            <View style={styles.levelModalFooter}>
              <Text style={styles.levelFooterCount}>
                Showing 1–{displayedCount} of ∞
              </Text>
              <Pressable
                onPress={() => setExtraPages((p) => p + 1)}
                style={({ pressed }) => [styles.loadMoreLevelsBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.loadMoreLevelsText}>+48 MORE</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 14, 3, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalFrame: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 24,
    borderWidth: 3.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.boardShadow,
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
  },
  woodCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnInline: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerPill: {
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  trophyWrap: {
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  starCenterLift: {
    marginBottom: 8,
  },
  statsBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(107, 54, 20, 0.16)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.boardBorder,
    paddingVertical: 10,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1.5,
    backgroundColor: WOOD_UI_COLORS.boardBorder,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B3614',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3B1A06',
    marginTop: 2,
  },
  primaryBtnOuter: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.amberBtnLip,
    paddingBottom: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  greenBtnOuter: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: '#256707',
    paddingBottom: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  silverWideBtnOuter: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.silverBtnLip,
    paddingBottom: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  primaryBtnFace: {
    flex: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#421F07',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
    letterSpacing: 0.8,
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  pauseLevelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4E270D',
    marginBottom: 8,
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    backgroundColor: 'rgba(107, 54, 20, 0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WOOD_UI_COLORS.boardBorder,
  },
  outSubtext: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4E270D',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  exitLinkBtn: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  exitLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B3614',
    textDecorationLine: 'underline',
  },
  levelModalFrame: {
    height: '82%',
    maxHeight: 680,
  },
  levelWoodCard: {
    flex: 1,
    paddingBottom: 12,
  },
  levelModalHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: WOOD_UI_COLORS.boardBorder,
  },
  levelModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#421F07',
    letterSpacing: 0.8,
  },
  levelModalSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#7A390E',
  },
  levelListFlex: {
    flex: 1,
    width: '100%',
  },
  levelGridContent: {
    paddingBottom: 8,
  },
  levelGridRow: {
    gap: 8,
    marginBottom: 8,
  },
  levelCell: {
    flex: 1,
    maxWidth: '24%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.amberBtnLip,
    paddingBottom: 3,
    overflow: 'hidden',
  },
  levelCellCurrent: {
    backgroundColor: '#256707',
  },
  levelCellLocked: {
    backgroundColor: '#3B1A06',
    opacity: 0.72,
  },
  levelCellGrad: {
    flex: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCellText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#421F07',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cellStarsRow: {
    flexDirection: 'row',
    gap: 1.5,
    marginTop: 2,
  },
  levelSummaryStrip: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(107, 54, 20, 0.16)',
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: WOOD_UI_COLORS.boardBorder,
    paddingVertical: 7,
    marginBottom: 12,
  },
  levelSummaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  levelSummarySep: {
    width: 1.5,
    backgroundColor: WOOD_UI_COLORS.boardBorder,
  },
  levelSummaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7A390E',
    letterSpacing: 0.6,
  },
  levelSummaryVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#3B1A06',
  },
  summaryStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  levelModalFooter: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: WOOD_UI_COLORS.boardBorder,
  },
  levelFooterCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4E270D',
  },
  loadMoreLevelsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreLevelsText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FDE68A',
    letterSpacing: 0.5,
  },
});
