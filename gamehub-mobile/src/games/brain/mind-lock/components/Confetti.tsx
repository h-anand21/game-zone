// ============================================================
// Mind Lock — Confetti & Celebration Particles Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Polygon } from 'react-native-svg';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  isStar: boolean;
}

export const Confetti: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#FFC928', '#FF4B4B', '#2997FF', '#55D63F', '#FFF4DE', '#A855F7'];
    const count = 35;
    const items: Particle[] = [];

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * (height * 0.7),
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        isStar: Math.random() > 0.5,
      });
    }

    setParticles(items);
  }, [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {particles.map((p) => {
          if (p.isStar) {
            return (
              <Polygon
                key={p.id}
                points={`${p.x},${p.y - p.size} ${p.x + p.size * 0.4},${p.y - p.size * 0.3} ${p.x + p.size},${p.y} ${p.x + p.size * 0.4},${p.y + p.size * 0.3} ${p.x},${p.y + p.size} ${p.x - p.size * 0.4},${p.y + p.size * 0.3} ${p.x - p.size},${p.y} ${p.x - p.size * 0.4},${p.y - p.size * 0.3}`}
                fill={p.color}
                opacity={0.85}
              />
            );
          }
          return (
            <Rect
              key={p.id}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size * 1.6}
              fill={p.color}
              rx={2}
              transform={`rotate(${p.id * 15}, ${p.x + p.size / 2}, ${p.y + p.size / 2})`}
              opacity={0.8}
            />
          );
        })}
      </Svg>
    </View>
  );
};
