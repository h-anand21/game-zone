// ============================================================
// Find One — Category Selector Card Component
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { FOColors, FORadius } from '../theme';
import type { CategoryType } from '../types';

interface CategoryCardProps {
  id: CategoryType;
  name: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.92, { duration: 60 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View
        style={[
          styles.cardHalo,
          isSelected && styles.cardHaloSelected,
        ]}
      >
        <LinearGradient
          colors={
            isSelected
              ? ['#1B406A', '#132F52', '#0C2038']
              : ['#142B45', '#0E2034', '#081624']
          }
          style={styles.cardInner}
        >
          <Text style={styles.icon}>{icon}</Text>
        </LinearGradient>
      </View>

      <Text style={[styles.name, isSelected && styles.nameSelected]}>
        {name}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    width: 66,
  },
  cardHalo: {
    width: 62,
    height: 62,
    borderRadius: FORadius.lg,
    padding: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHaloSelected: {
    borderColor: FOColors.primary,
    shadowColor: FOColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  cardInner: {
    width: '100%',
    height: '100%',
    borderRadius: FORadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 3,
    borderBottomColor: '#05111E',
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    color: FOColors.textMuted,
    textAlign: 'center',
  },
  nameSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
