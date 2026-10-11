// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Fantasy Kingdom Background
// Atmospheric dark fantasy gradient with stars, mountains,
// castle silhouettes, and floating magical embers
// ============================================================

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Polygon, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

interface Props {
  children?: React.ReactNode;
}

export const FantasyBackground: React.FC<Props> = ({ children }) => {
  // Deterministic star field
  const stars = useMemo(() => {
    const list: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 45; i++) {
      const x = ((i * 37 + 13) % 100);
      const y = ((i * 43 + 29) % 75);
      const r = (i % 5 === 0) ? 2 : (i % 2 === 0) ? 1.5 : 1;
      const o = 0.3 + ((i % 7) * 0.1);
      list.push({ x, y, r, o });
    }
    return list;
  }, []);

  // Floating mystical embers
  const embers = useMemo(() => {
    return [
      { x: 15, y: 35, r: 2.5, c: COLORS.blue },
      { x: 82, y: 25, r: 3, c: COLORS.gold },
      { x: 30, y: 55, r: 2, c: COLORS.pink },
      { x: 70, y: 65, r: 3.5, c: COLORS.gem },
      { x: 45, y: 20, r: 2, c: COLORS.arrowGreen },
      { x: 88, y: 78, r: 2.5, c: COLORS.blue },
    ];
  }, []);

  return (
    <View style={styles.container}>
      {/* Base Fantasy Blue Sky Gradient */}
      <LinearGradient
        colors={[COLORS.background, COLORS.background2, '#0B233D']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Atmospheric Starfield & Fantasy Silhouette Layer */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Stars */}
        {stars.map((s, idx) => (
          <Circle
            key={`star-${idx}`}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#FFFFFF"
            opacity={s.o}
          />
        ))}

        {/* Distant Mountain Silhouettes */}
        <Polygon
          points="-20,550 80,380 200,520 320,360 450,560"
          fill="rgba(6, 26, 48, 0.45)"
        />
        <Polygon
          points="20,560 160,420 280,540 380,440 500,570"
          fill="rgba(4, 18, 35, 0.65)"
        />

        {/* Castle Turrets Silhouette (center-right horizon) */}
        <Path
          d="M260,470 L260,430 L275,430 L275,410 L285,410 L285,430 L300,430 L300,470 Z"
          fill="rgba(3, 14, 27, 0.75)"
        />
        <Path
          d="M270,410 L280,390 L290,410 Z"
          fill="rgba(3, 14, 27, 0.85)"
        />

        {/* Magical Embers */}
        {embers.map((e, idx) => (
          <Circle
            key={`ember-${idx}`}
            cx={`${e.x}%`}
            cy={`${e.y}%`}
            r={e.r}
            fill={e.c}
            opacity={0.65}
          />
        ))}

        {/* Forest Pine Silhouettes at base */}
        <Polygon points="0,850 40,780 80,850" fill="rgba(3, 14, 27, 0.9)" />
        <Polygon points="60,860 110,795 160,860" fill="rgba(3, 14, 27, 0.85)" />
        <Polygon points="140,860 190,770 240,860" fill="rgba(3, 14, 27, 0.9)" />
        <Polygon points="260,860 310,785 360,860" fill="rgba(3, 14, 27, 0.85)" />
        <Polygon points="340,850 390,775 440,850" fill="rgba(3, 14, 27, 0.9)" />
      </Svg>

      {/* Foreground Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default FantasyBackground;
