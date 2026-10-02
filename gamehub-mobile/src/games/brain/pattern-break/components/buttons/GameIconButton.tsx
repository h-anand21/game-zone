// ============================================================
// PATTERN BREAKER — GameIconButton Component
// High-Fidelity Icon Button using authentic Neon Fantasy UI Icons
// Preserves neon glow, metallic bevels & comfortable touch padding
// ============================================================

import React from 'react';
import {
  Pressable,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
  View,
  Text,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface GameIconButtonProps {
  icon: ImageSourcePropType;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  badge?: string | number;
}

export const GameIconButton: React.FC<GameIconButtonProps> = ({
  icon,
  size = 48,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  badge,
}) => {
  const handlePress = () => {
    if (disabled || !onPress) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        { width: size, height: size },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      {badge !== undefined && badge !== null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    position: 'relative',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
