// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 05: Themes Screen
// Board aesthetic collection: unlock, preview & equip kingdom styles
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { THEMES } from '../data/themes';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';
import type { ThemeId } from '../game/types';

interface ThemesScreenProps {
  onBack: () => void;
  onOpenShop: () => void;
}

export const ThemesScreen: React.FC<ThemesScreenProps> = ({
  onBack,
  onOpenShop,
}) => {
  const insets = useSafeAreaInsets();
  const selectedTheme = useGameStore((state) => state.selectedTheme);
  const unlockedThemes = useGameStore((state) => state.unlockedThemes);
  const unlockThemeInStore = useGameStore((state) => state.unlockTheme);
  const selectThemeInStore = useGameStore((state) => state.selectTheme);

  const handleThemeAction = (themeId: ThemeId, cost: number) => {
    if (unlockedThemes.includes(themeId)) {
      ArrowHaptics.buttonPress();
      selectThemeInStore(themeId);
    } else {
      const success = unlockThemeInStore(themeId, cost);
      if (success) {
        ArrowHaptics.victory();
      } else {
        ArrowHaptics.blocked();
      }
    }
  };

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="KINGDOM THEMES"
          subtitle="BOARD STYLES & RUNES"
          onBack={onBack}
          rightAction={<CurrencyBar onOpenShop={onOpenShop} />}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {THEMES.map((t) => {
            const isUnlocked = unlockedThemes.includes(t.id);
            const isEquipped = selectedTheme === t.id;

            return (
              <View
                key={t.id}
                style={[
                  styles.themeCard,
                  isEquipped && styles.equippedCard,
                ]}
              >
                <LinearGradient
                  colors={[t.boardBg, '#061426']}
                  style={styles.cardGradient}
                >
                  {/* Theme Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.iconBox}>
                      <Text style={styles.themeIcon}>{t.icon}</Text>
                    </View>
                    <View style={styles.titleCol}>
                      <Text style={[styles.themeTitle, { color: t.glowColor }]}>
                        {t.name}
                      </Text>
                      <Text style={styles.themeTagline}>{t.tagline}</Text>
                    </View>
                  </View>

                  {/* Board Color Swatch Preview */}
                  <View style={[styles.previewFrame, { borderColor: t.boardBorder }]}>
                    <View style={[styles.previewInner, { backgroundColor: t.boardBg }]}>
                      <View style={[styles.previewRuneDot, { backgroundColor: t.glowColor }]} />
                      <Text style={styles.previewLabel}>RUNIC BOARD PREVIEW</Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <Pressable
                    onPress={() => handleThemeAction(t.id, t.unlockCoins)}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      isEquipped && styles.equippedBtn,
                      pressed && styles.btnPressed,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isEquipped
                          ? ['#20BFFF', '#08639C']
                          : isUnlocked
                          ? ['#78F329', '#22C51D']
                          : ['#FFE259', '#E5A016']
                      }
                      style={styles.actionBtnGrad}
                    >
                      <Text style={styles.actionBtnText}>
                        {isEquipped
                          ? 'EQUIPPED ✓'
                          : isUnlocked
                          ? 'EQUIP'
                          : `UNLOCK (${t.unlockCoins} 🪙)`}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 16,
  },
  themeCard: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  equippedCard: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  cardGradient: {
    padding: 16,
    borderRadius: 17,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 22,
  },
  titleCol: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  themeTagline: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    lineHeight: 15,
  },
  previewFrame: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  previewInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewRuneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  actionBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3D1C08',
  },
  equippedBtn: {
    borderColor: COLORS.gold,
  },
  btnPressed: {
    transform: [{ scale: 0.98 }],
  },
  actionBtnGrad: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
});

export default ThemesScreen;
