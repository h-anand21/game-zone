// ============================================================
// Color Bloom Sort — Level Selector Dialog Modal
// Choose and replay from 500+ deterministic puzzle levels
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CloseIcon, LockIcon, StarIcon } from './GameIcons';

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
  // Unlimited level list: dynamically expands with player progression
  const displayedCount = Math.max(60, Math.ceil((unlockedLevel + 24) / 12) * 12);
  const levelNumbers = Array.from({ length: displayedCount }, (_, i) => i + 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>SELECT LEVEL</Text>
              <Text style={styles.subtitle}>Unlimited Solvable Puzzle Challenges</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <CloseIcon size={15} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Level Numbers Grid */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          >
            {levelNumbers.map((lvl) => {
              const isUnlocked = lvl <= unlockedLevel;
              const isCurrent = lvl === currentLevel;
              const stars = levelStars[lvl] || 0;

              return (
                <Pressable
                  key={`lvl-${lvl}`}
                  onPress={() => isUnlocked && onSelectLevel(lvl)}
                  disabled={!isUnlocked}
                  style={({ pressed }) => [
                    styles.levelBox,
                    isCurrent && styles.currentBox,
                    !isUnlocked && styles.lockedBox,
                    pressed && isUnlocked && styles.pressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isCurrent
                        ? ['#00CFFF33', '#0284C733']
                        : isUnlocked
                        ? ['#16243D', '#0B1424']
                        : ['#0A0E18', '#05070D']
                    }
                    style={styles.boxGradient}
                  >
                    <Text style={[styles.levelNum, isCurrent && styles.currentNum]}>
                      {lvl}
                    </Text>

                    {!isUnlocked ? (
                      <View style={styles.lockIconWrap}>
                        <LockIcon size={12} color="#64748B" />
                      </View>
                    ) : stars > 0 ? (
                      <View style={styles.starsMiniRow}>
                        {Array.from({ length: stars }, (_, idx) => (
                          <StarIcon key={`star-${idx}`} size={10} filled />
                        ))}
                      </View>
                    ) : (
                      <View style={styles.unearnedDot} />
                    )}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 5, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#0C1222',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#00CFFF',
    padding: 18,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
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
    color: '#00CFFF',
    letterSpacing: 0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    paddingBottom: 12,
  },
  levelBox: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#1D304C',
  },
  currentBox: {
    borderColor: '#00CFFF',
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  lockedBox: {
    borderColor: '#0E1724',
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  boxGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  levelNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E2E8F0',
  },
  currentNum: {
    color: '#00CFFF',
  },
  lockIconWrap: {
    marginTop: 4,
  },
  starsMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: 4,
  },
  unearnedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(148, 163, 184, 0.45)',
    marginTop: 6,
  },
});
