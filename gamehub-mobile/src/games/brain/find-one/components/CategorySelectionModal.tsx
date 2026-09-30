// ============================================================
// Find One — Category Selection Modal
// ============================================================

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { FOColors, FORadius, FOSpacing, FOTypography } from '../theme';
import { ALL_CATEGORIES_DATA } from '../logic';
import { useFindOneStore } from '../store/findOneStore';
import type { CategoryType } from '../types';

interface CategorySelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  visible,
  onClose,
}) => {
  const { selectedCategory, setCategory } = useFindOneStore();

  const handleSelect = (categoryId: CategoryType) => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {}
    setCategory(categoryId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCardWrapper}>
          <LinearGradient
            colors={['#142E4C', '#0B1C30', '#061322']}
            style={styles.modalCard}
          >
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.titleBadge}>
                <Text style={styles.titleIcon}>📂</Text>
                <Text style={styles.modalTitle}>CATEGORIES</Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.subtitle}>
              Pick a category or play All in Random mode to test your perception!
            </Text>

            {/* Category List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            >
              {ALL_CATEGORIES_DATA.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleSelect(cat.id)}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      isSelected && styles.selectedCategoryCard,
                      pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isSelected
                          ? ['#204E78', '#113354']
                          : ['#0E2640', '#091A2E']
                      }
                      style={styles.categoryInner}
                    >
                      {/* Icon */}
                      <View
                        style={[
                          styles.iconHolder,
                          { borderColor: cat.color },
                          isSelected && { backgroundColor: `${cat.color}25` },
                        ]}
                      >
                        <Text style={styles.catEmoji}>{cat.icon}</Text>
                      </View>

                      {/* Details */}
                      <View style={styles.catDetails}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.catName,
                              isSelected && { color: '#FFD700' },
                            ]}
                          >
                            {cat.name}
                          </Text>
                          {cat.pairsCount && (
                            <View style={styles.pairsBadge}>
                              <Text style={styles.pairsText}>
                                {cat.id === 'all'
                                  ? '21 Pairs'
                                  : `${cat.pairsCount} Pairs`}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.catDesc} numberOfLines={2}>
                          {cat.description}
                        </Text>
                      </View>

                      {/* Checkmark or radio */}
                      <View
                        style={[
                          styles.checkCircle,
                          isSelected && styles.selectedCheckCircle,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkMark}>✓</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 14, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: FOSpacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
  },
  modalCard: {
    width: '100%',
    borderRadius: FORadius.xl,
    padding: FOSpacing.lg,
    borderWidth: 2,
    borderColor: '#FFC928',
    borderTopColor: '#FFE57F',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0E243C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4973',
  },
  closeIcon: {
    fontSize: 16,
    color: '#A8C5DE',
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    color: '#8CA5BD',
    marginBottom: FOSpacing.md,
    lineHeight: 16,
  },
  listContainer: {
    gap: 10,
    paddingBottom: 8,
  },
  categoryCard: {
    borderRadius: FORadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#16385C',
  },
  selectedCategoryCard: {
    borderColor: '#FFC928',
    borderWidth: 2,
  },
  categoryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  iconHolder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#081729',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  catEmoji: {
    fontSize: 26,
  },
  catDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pairsBadge: {
    backgroundColor: '#0F2F4F',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F5385',
  },
  pairsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#65B2F5',
  },
  catDesc: {
    fontSize: 11,
    color: '#7F9BB6',
    lineHeight: 15,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0A1C2E',
    borderWidth: 1.5,
    borderColor: '#1E466E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckCircle: {
    backgroundColor: '#FFC928',
    borderColor: '#FFE57F',
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '900',
    color: '#061322',
  },
});
