// ============================================================
// Mind Lock — Game Card Component
// ============================================================

import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing } from '../theme';

interface GameCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  active?: boolean;
  activeColor?: string;
  onPress?: () => void;
  padding?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  children,
  style,
  active = false,
  activeColor = MLColors.primary,
  onPress,
  padding = MLSpacing.base,
}) => {
  const content = (
    <LinearGradient
      colors={['#16283F', '#0D1B2A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.card,
        { padding },
        active && { borderColor: activeColor, borderWidth: 1.5 },
        active && {
          shadowColor: activeColor,
          shadowRadius: 10,
          shadowOpacity: 0.6,
          elevation: 8,
        },
        style,
      ]}
    >
      {/* Top subtle highlight reflection */}
      <View style={styles.topBevel} />
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.wrapper}>{content}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: MLRadius.xl,
    ...MLShadows.md,
  },
  card: {
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
