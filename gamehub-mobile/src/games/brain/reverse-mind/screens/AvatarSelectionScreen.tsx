// ============================================================
// REVERSE MIND — Avatar & Mascot Selection Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface AvatarSelectionScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppNavScreen) => void;
}

interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  role: string;
  unlocked: boolean;
  costGems?: number;
}

const AVATARS: AvatarOption[] = [
  { id: 'char_boy', name: 'Agent Mind', emoji: '👦', role: 'Curious Scholar', unlocked: true },
  { id: 'char_corgi', name: 'Caped Corgi', emoji: '🐕', role: 'Brave Companion', unlocked: true },
  { id: 'char_cat', name: 'Kitten Scout', emoji: '🐱', role: 'Whiskered Thinker', unlocked: true },
  { id: 'char_astro', name: 'Astro Scout', emoji: '🧑‍🚀', role: 'Space Invertor', unlocked: false, costGems: 15 },
  { id: 'char_robot', name: 'Cyber Core', emoji: '🤖', role: 'Quantum AI', unlocked: false, costGems: 30 },
];

export const AvatarSelectionScreen: React.FC<AvatarSelectionScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  const { playerStats } = useReverseMindStore();
  const [selectedId, setSelectedId] = useState<string>(playerStats.selectedAvatar || 'char_boy');

  return (
    <EnvironmentalBackground theme="collection">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>CHOOSE AVATAR</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {AVATARS.map((avatar) => {
              const isSelected = selectedId === avatar.id;

              return (
                <Pressable
                  key={avatar.id}
                  onPress={() => avatar.unlocked && setSelectedId(avatar.id)}
                  style={({ pressed }) => [
                    styles.avatarCard,
                    isSelected && styles.cardSelected,
                    !avatar.unlocked && styles.cardLocked,
                    pressed && avatar.unlocked && styles.pressed,
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  <Text style={styles.avatarName}>{avatar.name}</Text>
                  <Text style={styles.avatarRole}>{avatar.role}</Text>

                  {isSelected && (
                    <View style={styles.activePill}>
                      <Text style={styles.activeText}>EQUIPPED</Text>
                    </View>
                  )}

                  {!avatar.unlocked && (
                    <View style={styles.lockPill}>
                      <Text style={styles.lockText}>🔒 {avatar.costGems} 💎</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actionWrapper}>
          <GlowButton
            title="CONFIRM AVATAR"
            variant="gold"
            size="lg"
            onPress={() => onNavigate('home')}
          />
        </View>
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  avatarCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: RMTheme.colors.primaryGold,
    shadowColor: RMTheme.colors.primaryGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  cardLocked: {
    opacity: 0.5,
  },
  avatarEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  avatarRole: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    marginTop: 2,
  },
  activePill: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 216, 61, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RMTheme.colors.primaryGold,
  },
  activeText: {
    fontSize: 9,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  lockPill: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
  },
  actionWrapper: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
