// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Stars Display Component
// 1 to 3 golden stars for level completion & progress
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';

interface StarsDisplayProps {
  stars: number; // 0 to 3
  size?: 'small' | 'medium' | 'large';
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({ stars, size = 'medium' }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const starSize = isSmall ? 16 : isLarge ? 38 : 24;

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((index) => {
        const isFilled = index <= stars;
        return (
          <View
            key={`star-${index}`}
            style={[
              styles.starWrapper,
              index === 2 && isLarge && styles.centerElevated,
            ]}
          >
            <Text
              style={[
                styles.starText,
                { fontSize: starSize },
                isFilled ? styles.starFilled : styles.starEmpty,
              ]}
            >
              {isFilled ? '★' : '☆'}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerElevated: {
    transform: [{ translateY: -6 }],
  },
  starText: {
    textAlign: 'center',
  },
  starFilled: {
    color: COLORS.gold,
    textShadowColor: 'rgba(255, 211, 61, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  starEmpty: {
    color: 'rgba(255, 255, 255, 0.25)',
  },
});

export default StarsDisplay;
