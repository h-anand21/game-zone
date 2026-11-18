// ============================================================
// Block Blast — Explosive Line Clear Particles
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
      duration: 650,
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
          outputRange: [p.x, p.x + p.vx * 70],
        });

        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [p.y, p.y + p.vy * 70 + 30], // slight gravity
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [1.2, 1.4, 0],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 0.8, 0],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size * 0.3,
                backgroundColor: p.color,
                shadowColor: p.color,
                transform: [{ translateX }, { translateY }, { scale }],
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
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
