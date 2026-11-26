// ============================================================
// Block Puzzle — Carved Wooden Level Selector Dialog Modal
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
import { LEVELS, LevelConfig } from '../levels';
import { WOOD_PALETTE } from './woodTheme';
import { TrophyWoodIcon, StarGoldIcon, LockWoodIcon } from './WoodBlockIcons';

interface LevelSelectModalProps {
  visible: boolean;
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  visible,
  currentLevel,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={WOOD_PALETTE.modalCardGradient}
          style={styles.modalCard}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <TrophyWoodIcon size={22} />
              <View>
                <Text style={styles.title}>SELECT LEVEL</Text>
                <Text style={styles.subtitle}>Handcrafted Wooden Boards</Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              hitSlop={12}
            >
              <Text style={styles.closeBtnText}>X</Text>
            </Pressable>
          </View>

          {/* Level Cards Grid */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          >
            {LEVELS.map((lvl: LevelConfig) => {
              const isUnlocked = lvl.level <= unlockedLevel;
              const isCurrent = lvl.level === currentLevel;
              const stars = levelStars[lvl.level] || 0;

              return (
                <Pressable
                  key={`lvl-${lvl.level}`}
                  onPress={() => {
                    if (isUnlocked) {
                      onSelectLevel(lvl.level);
                    }
                  }}
                  disabled={!isUnlocked}
                  style={({ pressed }) => [
                    styles.levelCard,
                    isCurrent && styles.currentCard,
                    !isUnlocked && styles.lockedCard,
                    pressed && isUnlocked && styles.cardPressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isCurrent
                        ? ['#FDE078', '#E59D26']
                        : isUnlocked
                        ? ['#8F5222', '#643512']
                        : ['#3D1E0B', '#2B1306']
                    }
                    style={styles.cardGradient}
                  >
                    {/* Top Row: Level Num & Stars / Lock */}
                    <View style={styles.cardTop}>
                      <Text style={[styles.levelNum, isCurrent && styles.currentNum]}>
                        #{lvl.level}
                      </Text>
                      {!isUnlocked ? (
                        <LockWoodIcon size={13} />
                      ) : (
                        <View style={styles.starRow}>
                          {[1, 2, 3].map((sIdx) => (
                            <StarGoldIcon key={sIdx} size={10} filled={stars >= sIdx} />
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Level Name */}
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.levelName,
                        isCurrent && styles.currentNameText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {lvl.name}
                    </Text>

                    {/* Target Lines */}
                    <Text
                      style={[
                        styles.targetText,
                        isCurrent && styles.currentTargetText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      Goal: {lvl.targetLines} Lines
                    </Text>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: WOOD_PALETTE.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 36,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: WOOD_PALETTE.modalBorder,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    fontSize: 18,
    fontWeight: '900',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 0.4,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  closeBtnText: {
    fontSize: 14,
    color: WOOD_PALETTE.textCream,
    fontWeight: '900',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  levelCard: {
    width: '31%',
    aspectRatio: 1.05,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.8,
    borderColor: '#A96932',
  },
  currentCard: {
    borderColor: '#FFF3B0',
    borderWidth: 2,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  lockedCard: {
    borderColor: '#4E2A12',
    opacity: 0.75,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
  },
  cardGradient: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelNum: {
    fontSize: 13,
    fontWeight: '900',
    color: WOOD_PALETTE.textGold,
  },
  currentNum: {
    color: WOOD_PALETTE.goldCtaText,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  },
  levelName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 0.2,
  },
  currentNameText: {
    color: WOOD_PALETTE.goldCtaText,
  },
  lockedText: {
    color: '#A17550',
  },
  targetText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: WOOD_PALETTE.textCream,
  },
  currentTargetText: {
    color: '#5C2F0A',
  },
});
