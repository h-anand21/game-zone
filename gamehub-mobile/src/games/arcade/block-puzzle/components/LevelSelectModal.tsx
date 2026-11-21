// ============================================================
// Block Blast — Level Selector Dialog Modal
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
          colors={['#0F2138', '#07111F']}
          style={styles.modalCard}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>SELECT LEVEL</Text>
              <Text style={styles.subtitle}>Handcrafted Pre-Laid Jewel Layouts</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              hitSlop={12}
            >
              <Text style={styles.closeBtnText}>✕</Text>
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
                        ? ['#00E5FF33', '#0091EA22']
                        : isUnlocked
                        ? ['#162E4E', '#0B1A2C']
                        : ['#0A121C', '#060B12']
                    }
                    style={styles.cardGradient}
                  >
                    {/* Top Row: Level Num & Lock */}
                    <View style={styles.cardTop}>
                      <Text style={[styles.levelNum, isCurrent && styles.currentNum]}>
                        #{lvl.level}
                      </Text>
                      {!isUnlocked ? (
                        <Text style={styles.lockIcon}>🔒</Text>
                      ) : (
                        <Text style={styles.starText}>
                          {stars > 0 ? '⭐'.repeat(stars) : '✦'}
                        </Text>
                      )}
                    </View>

                    {/* Level Name */}
                    <Text
                      numberOfLines={1}
                      style={[styles.levelName, !isUnlocked && styles.lockedText]}
                    >
                      {lvl.name}
                    </Text>

                    {/* Target Lines */}
                    <Text style={styles.targetText}>
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
    backgroundColor: 'rgba(2, 6, 14, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 36,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1D3B62',
    padding: 18,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00E5FF',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  closeBtnText: {
    fontSize: 14,
    color: '#94A3B8',
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
    borderWidth: 1.5,
    borderColor: '#1C3558',
  },
  currentCard: {
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  lockedCard: {
    borderColor: '#111E2E',
    opacity: 0.6,
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
    color: '#E2E8F0',
  },
  currentNum: {
    color: '#00E5FF',
  },
  lockIcon: {
    fontSize: 11,
  },
  starText: {
    fontSize: 9,
  },
  levelName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  lockedText: {
    color: '#64748B',
  },
  targetText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
