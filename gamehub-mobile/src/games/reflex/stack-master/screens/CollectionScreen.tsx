// ============================================================
// STACK MASTER — Screen 13: Block Cosmetics Collection
// Collectible block materials with 3D previews & equipping
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { BLOCK_COSMETICS } from '../data/cosmetics';
import { useStackStore } from '../store/stackStore';
import { COLORS } from '../theme/colors';
import { StackHaptics } from '../utils/haptics';

interface CollectionScreenProps {
  onBack: () => void;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const selectedCosmeticId = useStackStore((state) => state.selectedCosmeticId);
  const unlockedCosmetics = useStackStore((state) => state.unlockedCosmetics);
  const equipCosmetic = useStackStore((state) => state.equipCosmetic);

  const [previewId, setPreviewId] = useState(selectedCosmeticId);
  const preview = BLOCK_COSMETICS.find((c) => c.id === previewId) || BLOCK_COSMETICS[0];
  const isUnlocked = unlockedCosmetics.includes(preview.id);
  const isEquipped = selectedCosmeticId === preview.id;

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="BLOCK VAULT"
          subtitle="COSMETIC MATERIALS"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Preview Box */}
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={styles.featuredCard}
          >
            {/* 3D Block Render Preview */}
            <View style={styles.previewContainer}>
              <LinearGradient
                colors={preview.colors}
                style={styles.largeBlock}
              >
                <View style={styles.blockShine} />
              </LinearGradient>
            </View>

            <View style={styles.rarityPill}>
              <Text style={styles.rarityText}>{preview.rarity.toUpperCase()}</Text>
            </View>

            <Text style={styles.previewName}>{preview.name}</Text>
            <Text style={styles.previewDesc}>{preview.description}</Text>

            {/* Equip or Unlock button */}
            <View style={styles.actionWrap}>
              {isEquipped ? (
                <View style={styles.equippedBadge}>
                  <Text style={styles.equippedText}>✓ EQUIPPED</Text>
                </View>
              ) : isUnlocked ? (
                <PrimaryButton
                  title="EQUIP MATERIAL"
                  variant="cyan"
                  onPress={() => equipCosmetic(preview.id)}
                />
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedTitle}>🔒 LOCKED</Text>
                  <Text style={styles.lockedReq}>{preview.unlockRequirement}</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Grid of Collectibles */}
          <Text style={styles.sectionTitle}>ALL MATERIALS</Text>
          <View style={styles.grid}>
            {BLOCK_COSMETICS.map((item) => {
              const itemUnlocked = unlockedCosmetics.includes(item.id);
              const isSelected = previewId === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    StackHaptics.buttonPress();
                    setPreviewId(item.id);
                  }}
                  style={({ pressed }) => [
                    styles.gridCard,
                    isSelected && styles.selectedGridCard,
                    pressed && { transform: [{ scale: 0.96 }] },
                  ]}
                >
                  <LinearGradient
                    colors={itemUnlocked ? ['#153A68', '#0D2444'] : ['#1C2636', '#0E1624']}
                    style={styles.gridCardGrad}
                  >
                    <LinearGradient
                      colors={item.colors}
                      style={styles.miniBlock}
                    />
                    <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.miniRarity}>{item.rarity}</Text>
                    {!itemUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
                    {selectedCosmeticId === item.id && <View style={styles.equippedDot} />}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  featuredCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#244B82',
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  largeBlock: {
    width: 140,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  blockShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  rarityPill: {
    backgroundColor: 'rgba(32, 217, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  previewDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  actionWrap: {
    width: '100%',
    alignItems: 'center',
  },
  equippedBadge: {
    backgroundColor: '#0D3823',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  equippedText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.success,
    letterSpacing: 1,
  },
  lockedBox: {
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.error,
  },
  lockedReq: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#244B82',
    overflow: 'hidden',
  },
  selectedGridCard: {
    borderColor: COLORS.cyan,
    borderWidth: 2.5,
  },
  gridCardGrad: {
    padding: 14,
    alignItems: 'center',
  },
  miniBlock: {
    width: 60,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  miniName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  miniRarity: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.muted,
    marginTop: 2,
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 12,
  },
  equippedDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
});
