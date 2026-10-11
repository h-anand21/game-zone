// ============================================================
// STACK MASTER — Screen 06: Tower Themes
// 8 distinct tower environments with visual previews & equipping
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { TOWER_THEMES } from '../data/themes';
import { useStackStore } from '../store/stackStore';
import { COLORS } from '../theme/colors';
import { StackHaptics } from '../utils/haptics';

interface TowerThemesScreenProps {
  onBack: () => void;
}

export const TowerThemesScreen: React.FC<TowerThemesScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const selectedThemeId = useStackStore((state) => state.selectedThemeId);
  const unlockedThemes = useStackStore((state) => state.unlockedThemes);
  const equipTheme = useStackStore((state) => state.equipTheme);

  const [previewThemeId, setPreviewThemeId] = useState(selectedThemeId);
  const previewTheme = TOWER_THEMES.find((t) => t.id === previewThemeId) || TOWER_THEMES[0];
  const isUnlocked = unlockedThemes.includes(previewTheme.id);
  const isEquipped = selectedThemeId === previewTheme.id;

  return (
    <ScreenBackground type={previewTheme.bgKey} dimAmount={0.4}>
      <View style={styles.container}>
        <GameHeader
          title="TOWER THEMES"
          subtitle="ENVIRONMENT SKINS"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Large Hero Preview Card */}
          <LinearGradient
            colors={['#102E56', '#091C38']}
            style={[styles.heroCard, { borderColor: previewTheme.primaryColor }]}
          >
            <View style={[styles.heroIconBox, { backgroundColor: previewTheme.primaryColor }]}>
              <Text style={styles.heroIcon}>{previewTheme.icon}</Text>
            </View>

            <Text style={styles.heroTitle}>{previewTheme.name}</Text>
            <Text style={styles.heroDesc}>{previewTheme.description}</Text>

            {/* Simulated 3D Tower Stack preview */}
            <View style={styles.stackPreviewBox}>
              <View style={[styles.previewBlock, { width: 100, backgroundColor: previewTheme.primaryColor }]} />
              <View style={[styles.previewBlock, { width: 110, backgroundColor: previewTheme.accentColor }]} />
              <View style={[styles.previewBlock, { width: 120, backgroundColor: previewTheme.primaryColor }]} />
            </View>

            {/* Equip or Locked indicator */}
            <View style={styles.heroActionWrap}>
              {isEquipped ? (
                <View style={styles.equippedBadge}>
                  <Text style={styles.equippedText}>✓ EQUIPPED</Text>
                </View>
              ) : isUnlocked ? (
                <PrimaryButton
                  title="EQUIP THEME"
                  variant="gold"
                  onPress={() => equipTheme(previewTheme.id)}
                />
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedTitle}>🔒 LOCKED</Text>
                  <Text style={styles.lockedReq}>{previewTheme.unlockRequirement}</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Theme Grid Selector */}
          <Text style={styles.sectionHeader}>AVAILABLE THEMES</Text>
          <View style={styles.gridContainer}>
            {TOWER_THEMES.map((theme) => {
              const themeUnlocked = unlockedThemes.includes(theme.id);
              const isSelected = previewThemeId === theme.id;

              return (
                <Pressable
                  key={theme.id}
                  onPress={() => {
                    StackHaptics.buttonPress();
                    setPreviewThemeId(theme.id);
                  }}
                  style={({ pressed }) => [
                    styles.themeTile,
                    isSelected && { borderColor: theme.primaryColor, borderWidth: 2.5 },
                    pressed && { transform: [{ scale: 0.95 }] },
                  ]}
                >
                  <LinearGradient
                    colors={themeUnlocked ? ['#153A68', '#0D2444'] : ['#1C2636', '#0E1624']}
                    style={styles.tileGrad}
                  >
                    <Text style={styles.tileIcon}>{theme.icon}</Text>
                    <Text style={styles.tileName} numberOfLines={1}>{theme.name}</Text>
                    {!themeUnlocked && (
                      <Text style={styles.tileLock}>🔒</Text>
                    )}
                    {selectedThemeId === theme.id && (
                      <View style={styles.dotEquipped} />
                    )}
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
  heroCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroIcon: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  stackPreviewBox: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 16,
  },
  previewBlock: {
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroActionWrap: {
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
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.error,
  },
  lockedReq: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeTile: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#244B82',
    overflow: 'hidden',
  },
  tileGrad: {
    padding: 14,
    alignItems: 'center',
  },
  tileIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  tileName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  tileLock: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 12,
  },
  dotEquipped: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
});
