// ============================================================
// Block Puzzle — Golden Line-Clear Sparkle & Wood Dust Particles
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import type { ParticleItem } from '../types';

interface BlastParticlesProps {
  particles: ParticleItem[];
  onComplete?: () => void;
}

export const BlastParticles: React.FC<BlastParticlesProps> = ({
  particles,
  onComplete,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!particles || particles.length === 0) {
      return;
    }

    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: 620,
      useNativeDriver: true,
    });

    anim.start(({ finished }) => {
      if (finished) {
        onComplete?.();
      }
    });

    return () => anim.stop();
  }, [particles]);

  if (!particles || particles.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => {
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [p.x, p.x + p.vx * 68],
        });

        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [p.y, p.y + p.vy * 68 + 26],
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.25, 1],
          outputRange: [1.1, 1.35, 0],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.65, 1],
          outputRange: [1, 0.85, 0],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size * 0.4,
                backgroundColor: p.color,
                shadowColor: '#FDE047',
                transform: [{ translateX }, { translateY }, { scale }, { rotate: '45deg' }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 5,
  },
});
