// ============================================================
// Woodland Bubble Shooter — Unlimited World Map & 4-Col Level Grid
// Supports 1..∞ levels with world chapters & "+48 MORE" pagination.
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WOODLAND_WORLDS, generateBubbleLevel } from '../levels';
import { WOOD_SHOOTER_PALETTE } from './woodTheme';
import {
  TrophyWoodIcon,
  StarGoldIcon,
  LockWoodIcon,
  FireflyBadgeIcon,
} from './WoodlandIcons';

interface WoodlandLevelMapModalProps {
  visible: boolean;
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

const PAGE_BATCH = 48;

export const WoodlandLevelMapModal: React.FC<WoodlandLevelMapModalProps> = ({
  visible,
  currentLevel,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  const [extraBatches, setExtraBatches] = useState(0);

  const maxDisplayLevel = useMemo(() => {
    const highest = Math.max(unlockedLevel, currentLevel, 1);
    const baseBatches = Math.max(1, Math.ceil((highest + 16) / PAGE_BATCH));
    return (baseBatches + extraBatches) * PAGE_BATCH;
  }, [unlockedLevel, currentLevel, extraBatches]);

  const levelList = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= maxDisplayLevel; i++) {
      arr.push(i);
    }
    return arr;
  }, [maxDisplayLevel]);

  const activeWorld =
    WOODLAND_WORLDS[(Math.floor((currentLevel - 1) / 25) % WOODLAND_WORLDS.length)];

  const renderLevelTile = ({ item: lvl }: { item: number }) => {
    const isUnlocked = lvl <= unlockedLevel;
    const isCurrent = lvl === currentLevel;
    const stars = levelStars[lvl] || 0;
    const isRescueMilestone = lvl % 3 === 0 || lvl === 7 || lvl === 10 || lvl === 12 || lvl === 15 || lvl === 17 || lvl === 20;

    return (
      <Pressable
        onPress={() => {
          if (isUnlocked) {
            onSelectLevel(lvl);
          }
        }}
        disabled={!isUnlocked}
        style={({ pressed }) => [
          styles.tileWrap,
          pressed && isUnlocked && styles.tilePressed,
        ]}
      >
        <LinearGradient
          colors={
            isCurrent
              ? WOOD_SHOOTER_PALETTE.goldCtaGradient
              : isUnlocked
              ? ['#8D5223', '#60320E']
              : ['#391D09', '#271204']
          }
          style={[
            styles.tileInner,
            isCurrent && styles.tileCurrent,
            !isUnlocked && styles.tileLocked,
          ]}
        >
          <View style={styles.tileTopRow}>
            <Text style={[styles.tileNum, isCurrent && styles.tileNumCurrent]}>
              {lvl}
            </Text>
            {isRescueMilestone && isUnlocked && <FireflyBadgeIcon size={11} />}
          </View>

          {!isUnlocked ? (
            <LockWoodIcon size={14} />
          ) : (
            <View style={styles.starsRow}>
              {[1, 2, 3].map((idx) => (
                <StarGoldIcon key={idx} size={10} filled={stars >= idx} />
              ))}
            </View>
          )}
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={WOOD_SHOOTER_PALETTE.modalCardGradient} style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <TrophyWoodIcon size={22} />
              <View>
                <Text style={styles.title}>WOODLAND JOURNEY</Text>
                <Text style={styles.subtitle}>
                  {activeWorld.name} • Unlocked {unlockedLevel} / ∞
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              hitSlop={12}
            >
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>

          {/* World Chapter Summary Strip */}
          <View style={styles.worldChipsRow}>
            {WOODLAND_WORLDS.map((w) => {
              const isCurrentWorld = w.worldIndex === activeWorld.worldIndex;
              return (
                <View
                  key={w.worldIndex}
                  style={[styles.worldChip, isCurrentWorld && styles.worldChipActive]}
                >
                  <View style={[styles.worldDot, { backgroundColor: w.accentHex }]} />
                  <Text numberOfLines={1} style={styles.worldChipText}>
                    W{w.worldIndex}
                  </Text>
                </View>
              );
            })}
            <Text style={styles.levelNamePreview} numberOfLines={1}>
              #{currentLevel}: {generateBubbleLevel(currentLevel).name}
            </Text>
          </View>

          {/* 4-Column Unlimited Virtualized FlatList */}
          <FlatList
            data={levelList}
            keyExtractor={(item) => `lvl-${item}`}
            numColumns={4}
            renderItem={renderLevelTile}
            initialNumToRender={24}
            maxToRenderPerBatch={24}
            windowSize={5}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrap}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              <Pressable
                onPress={() => setExtraBatches((b) => b + 1)}
                style={({ pressed }) => [styles.loadMoreBtn, pressed && styles.pressed]}
              >
                <LinearGradient
                  colors={WOOD_SHOOTER_PALETTE.oakBtnGradient}
                  style={styles.loadMoreInner}
                >
                  <Text style={styles.loadMoreText}>
                    +48 MORE LEVELS ({maxDisplayLevel + 1}–{maxDisplayLevel + PAGE_BATCH})
                  </Text>
                </LinearGradient>
              </Pressable>
            }
          />
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: WOOD_SHOOTER_PALETTE.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: WOOD_SHOOTER_PALETTE.modalBorder,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 224, 163, 0.18)',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
    letterSpacing: 0.9,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: WOOD_SHOOTER_PALETTE.textGold,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textCream,
  },
  worldChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 10,
  },
  worldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
  },
  worldChipActive: {
    borderColor: WOOD_SHOOTER_PALETTE.textGold,
  },
  worldDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  worldChipText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textCream,
  },
  levelNamePreview: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textGold,
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 12,
  },
  columnWrap: {
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  tileWrap: {
    width: '23%',
    aspectRatio: 1,
  },
  tileInner: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#A96A34',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileCurrent: {
    borderColor: '#FFFBEB',
    borderWidth: 2,
  },
  tileLocked: {
    borderColor: '#4E2A12',
    opacity: 0.72,
  },
  tilePressed: {
    transform: [{ scale: 0.94 }],
  },
  tileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tileNum: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
  },
  tileNumCurrent: {
    color: WOOD_SHOOTER_PALETTE.goldCtaText,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  },
  loadMoreBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.oakBtnBorder,
  },
  loadMoreInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.goldCtaText,
    letterSpacing: 0.8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
