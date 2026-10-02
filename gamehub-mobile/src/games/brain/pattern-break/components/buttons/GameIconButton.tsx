// ============================================================
// PATTERN BREAKER — GameIconButton Component
// High-Fidelity Icon Button using authentic Neon Fantasy UI Icons
// Preserves neon glow, metallic bevels, glass disc & tactile haptics
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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { PBColors, PBShadows } from '../../theme';

interface GameIconButtonProps {
  icon: ImageSourcePropType;
  fallbackVectorName?: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  badge?: string | number;
}

export const GameIconButton: React.FC<GameIconButtonProps> = ({
  icon,
  fallbackVectorName,
  size = 44,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  badge,
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  const handlePress = () => {
    if (disabled || !onPress) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  const iconDimension = Math.round(size * 0.68);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={['rgba(24, 47, 57, 0.95)', 'rgba(12, 26, 34, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.gradientDisc, { borderRadius: size / 2 }]}
      >
        {!imageFailed ? (
          <Image
            source={icon}
            style={{ width: iconDimension, height: iconDimension }}
            resizeMode="contain"
            onError={() => setImageFailed(true)}
          />
        ) : fallbackVectorName ? (
          <Ionicons
            name={fallbackVectorName}
            size={Math.round(size * 0.5)}
            color={PBColors.primary}
          />
        ) : null}

        {badge !== undefined && badge !== null && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.45)',
    backgroundColor: 'rgba(10, 23, 30, 0.8)',
    shadowColor: '#19D3FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientDisc: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
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
