// ============================================================
// PATTERN BREAKER — GameCard Component
// Physical tech-stone panel with category badge, description & active glow
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../../theme';

interface GameCardProps {
  title: string;
  subtitle: string;
  icon?: string;
  badge?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  rightContent?: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  selected = false,
  onPress,
  style,
  rightContent,
}) => {
  const handlePress = () => {
    if (!onPress) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.outerContainer,
        selected && PBShadows.cyanGlow,
        selected && styles.selectedContainer,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <LinearGradient
        colors={
          selected
            ? (['#1E3B48', '#132832', '#0D1E27'] as const)
            : (['#182F39', '#10232C', '#0A171E'] as const)
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardBody, selected && styles.selectedBody]}
      >
        {/* Top Sunlit Edge */}
        <View style={[styles.topBevel, selected && styles.selectedTopBevel]} />

        {/* Left Icon or Badge */}
        {icon ? (
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        ) : null}

        {/* Middle Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, selected && styles.selectedTitle]}>{title}</Text>
            {badge ? (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Optional Right Action or Miniature Preview */}
        {rightContent ? <View style={styles.rightArea}>{rightContent}</View> : null}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: PBRadius.lg,
    marginVertical: 6,
    overflow: 'hidden',
  },
  selectedContainer: {
    transform: [{ scale: 1.01 }],
  },
  cardBody: {
    borderRadius: PBRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    position: 'relative',
    gap: 14,
  },
  selectedBody: {
    borderColor: PBColors.primary,
    borderWidth: 2,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  selectedTopBevel: {
    backgroundColor: 'rgba(25, 211, 255, 0.65)',
    height: 2.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(25, 211, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(25, 211, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 20,
    color: PBColors.textPrimary,
  },
  selectedTitle: {
    color: PBColors.primary,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
    color: PBColors.textSecondary,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 213, 74, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 74, 0.5)',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 0.8,
  },
  rightArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});
