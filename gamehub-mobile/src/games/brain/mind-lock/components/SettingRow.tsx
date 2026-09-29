// ============================================================
// Mind Lock — Setting Row Component with Option Selector
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { MindLockHaptics } from '../services/haptics';

interface SettingRowProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  subtitle: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  iconBgColor = MLColors.primary,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <LinearGradient
      colors={['#172C46', '#0E1D30']}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Option Pills */}
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                MindLockHaptics.buttonTap();
                onSelect(opt.value);
              }}
              style={[
                styles.optionBtn,
                isSelected && styles.optionBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    marginBottom: MLSpacing.sm,
    ...MLShadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MLSpacing.sm,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: MLRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: MLSpacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  subtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  optionsRow: {
    flexDirection: 'row',
    backgroundColor: '#091524',
    borderRadius: MLRadius.pill,
    padding: 3,
    gap: 4,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: MLRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBtnSelected: {
    backgroundColor: MLColors.primary,
    ...MLShadows.glowGold,
  },
  optionText: {
    color: MLColors.textMuted,
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.semibold,
  },
  optionTextSelected: {
    color: '#0A121D',
    fontWeight: MLTypography.black,
  },
});
