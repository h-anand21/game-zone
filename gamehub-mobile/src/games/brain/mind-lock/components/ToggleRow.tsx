// ============================================================
// Mind Lock — Toggle Row Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { MindLockHaptics } from '../services/haptics';

interface ToggleRowProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: (newValue: boolean) => void;
  showChevron?: boolean;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  iconBgColor = MLColors.primary,
  title,
  description,
  value,
  onToggle,
  showChevron = false,
}) => {
  const handlePress = () => {
    MindLockHaptics.buttonTap();
    onToggle(!value);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <LinearGradient
        colors={['#172C46', '#0E1D30']}
        style={styles.card}
      >
        {/* Left Icon Badge */}
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>

        {/* Custom Game Switch */}
        <View style={[styles.switchTrack, value && styles.switchTrackActive]}>
          <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: MLSpacing.sm,
    borderRadius: MLRadius.lg,
    ...MLShadows.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: MLRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: MLSpacing.md,
    ...MLShadows.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
    marginBottom: 2,
  },
  description: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  switchTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#091523',
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: 'rgba(255, 201, 40, 0.25)',
    borderColor: MLColors.primary,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: MLColors.textDim,
  },
  switchThumbActive: {
    backgroundColor: MLColors.primary,
    alignSelf: 'flex-end',
    ...MLShadows.glowGold,
  },
});
