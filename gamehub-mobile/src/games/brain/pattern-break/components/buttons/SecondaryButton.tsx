// ============================================================
// PATTERN BREAKER — Secondary & Glass Action Button
// Dark glass surface with glowing cyan border and tactile spring
// ============================================================

import React from 'react';
import { StyleSheet, Text, Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PBColors, PBTypography, PBRadius } from '../../theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  disabled?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  style,
  icon,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerContainer,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={['rgba(24, 47, 57, 0.85)', 'rgba(16, 35, 44, 0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.buttonBody}
      >
        <View style={styles.topBevel} />
        <View style={styles.innerContent}>
          {icon ? <Text style={styles.iconText}>{icon} </Text> : null}
          <Text style={styles.label}>{title}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: PBRadius.lg,
    overflow: 'hidden',
  },
  buttonBody: {
    borderRadius: PBRadius.lg,
    paddingVertical: 13,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: PBColors.primary,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(25, 211, 255, 0.4)',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    ...PBTypography.buttonLabel,
    color: PBColors.primary,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
});
