// ============================================================
// Mind Lock — Procedural Level Map World Progression Component
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { LevelNode } from './LevelNode';
import { WoodenSign } from './WoodenSign';
import { useMindLockStore } from '../store/mindLockStore';

export const LevelMap: React.FC = () => {
  const { width } = useWindowDimensions();
  const { levels, startLevel } = useMindLockStore();
  const [selectedWorld, setSelectedWorld] = useState(1);

  const worlds = [
    { id: 1, name: 'BRAIN FOREST', icon: '🌲', unlocked: true },
    { id: 2, name: 'PUZZLE DESERT', icon: '🏜️', unlocked: false },
    { id: 3, name: 'NEON CITY', icon: '🏙️', unlocked: false },
    { id: 4, name: 'SPACE MIND', icon: '🪐', unlocked: false },
  ];

  // Coordinates along an organic winding vertical S-curve path
  const nodePositions = [
    { x: width * 0.24, y: 70 },
    { x: width * 0.50, y: 130 },
    { x: width * 0.76, y: 190 },
    { x: width * 0.82, y: 290 },
    { x: width * 0.60, y: 380 },
    { x: width * 0.32, y: 460 },
    { x: width * 0.20, y: 550 },
    { x: width * 0.40, y: 640 },
    { x: width * 0.68, y: 720 },
    { x: width * 0.78, y: 820 },
  ];

  // Build smooth curved path connecting all nodes
  const mapPathD = nodePositions.reduce((acc, pos, idx) => {
    if (idx === 0) return `M ${pos.x} ${pos.y}`;
    const prev = nodePositions[idx - 1];
    const midY = (prev.y + pos.y) / 2;
    return `${acc} C ${prev.x} ${midY}, ${pos.x} ${midY}, ${pos.x} ${pos.y}`;
  }, '');

  return (
    <View style={styles.container}>
      {/* Top World Selector Tabs */}
      <View style={styles.worldTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {worlds.map((w) => {
            const isSelected = selectedWorld === w.id;
            return (
              <Pressable
                key={w.id}
                onPress={() => w.unlocked && setSelectedWorld(w.id)}
                style={[
                  styles.worldTab,
                  isSelected && styles.worldTabSelected,
                  !w.unlocked && styles.worldTabLocked,
                ]}
              >
                <Text style={styles.worldIcon}>{w.icon}</Text>
                <View>
                  <Text style={[styles.worldIdText, isSelected && { color: MLColors.primary }]}>
                    WORLD {w.id}
                  </Text>
                  <Text style={[styles.worldNameText, isSelected && { color: MLColors.white }]}>
                    {w.name}
                  </Text>
                </View>
                {!w.unlocked && <Text style={{ fontSize: 12 }}>🔒</Text>}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Procedural Scrollable Map Container */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mapScroll}
      >
        <LinearGradient
          colors={['#0F241C', '#0C1C24', '#08121A']}
          style={[styles.proceduralWorld, { width }]}
        >
          {/* Wooden Sign Title */}
          <WoodenSign subtitle="WORLD 1" title="BRAIN FOREST" />

          {/* SVG Procedural Floating Islands & Winding Path */}
          <View style={styles.pathCanvasContainer}>
            <Svg width={width} height={960} style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgLinearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#2E6A3E" />
                  <Stop offset="30%" stopColor="#1B4228" />
                  <Stop offset="100%" stopColor="#0E2316" />
                </SvgLinearGradient>

                <SvgLinearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#68B6FF" />
                  <Stop offset="100%" stopColor="#126CD6" stopOpacity="0.2" />
                </SvgLinearGradient>

                <SvgLinearGradient id="pathGlowGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFF2A3" />
                  <Stop offset="100%" stopColor="#FFC928" />
                </SvgLinearGradient>
              </Defs>

              {/* Procedural Floating Landmasses / Islands */}
              {/* Top Island */}
              <Path
                d={`M20,60 Q${width * 0.5},30 ${width - 20},60 Q${width},180 ${width * 0.7},220 Q${width * 0.3},210 20,160 Z`}
                fill="url(#islandGrad)"
                stroke="#479E5E"
                strokeWidth="2"
              />

              {/* Middle Island */}
              <Path
                d={`M40,320 Q${width * 0.4},280 ${width - 30},330 Q${width - 10},500 ${width * 0.5},520 Q20,480 40,320 Z`}
                fill="url(#islandGrad)"
                stroke="#479E5E"
                strokeWidth="2"
              />

              {/* Waterfall streaming from cliff */}
              <Path
                d={`M${width * 0.52},200 L${width * 0.50},320 L${width * 0.54},320 L${width * 0.56},200 Z`}
                fill="url(#waterfallGrad)"
              />

              {/* Bottom Island */}
              <Path
                d={`M30,600 Q${width * 0.5},570 ${width - 30},610 Q${width},860 ${width * 0.5},900 Q20,850 30,600 Z`}
                fill="url(#islandGrad)"
                stroke="#479E5E"
                strokeWidth="2"
              />

              {/* Suspension Bridge lines between landmasses */}
              <Path
                d={`M${width * 0.3},480 Q${width * 0.25},530 ${width * 0.24},570`}
                stroke="#8A562B"
                strokeWidth="6"
                strokeDasharray="4 2"
              />

              {/* Winding Golden Dashed Path connecting level nodes */}
              {/* Shadow stroke */}
              <Path
                d={mapPathD}
                fill="none"
                stroke="#060C14"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Glowing Dashed Yellow Road */}
              <Path
                d={mapPathD}
                fill="none"
                stroke="url(#pathGlowGrad)"
                strokeWidth="6"
                strokeDasharray="10 8"
                strokeLinecap="round"
              />
            </Svg>

            {/* Real Interactive Level Nodes Over Path */}
            {levels.map((lvl, index) => {
              const pos = nodePositions[index] || { x: width * 0.5, y: index * 90 };
              return (
                <View
                  key={lvl.id}
                  style={[
                    styles.nodePos,
                    { left: pos.x - 36, top: pos.y - 32 },
                  ]}
                >
                  {lvl.status === 'current' && (
                    <View style={styles.hereBubble}>
                      <Text style={styles.hereText}>You are here!</Text>
                      <View style={styles.bubbleTail} />
                    </View>
                  )}
                  <LevelNode
                    levelNumber={lvl.levelNumber}
                    stars={lvl.stars}
                    status={lvl.status}
                    onPress={() => startLevel(lvl.id)}
                  />
                </View>
              );
            })}

            {/* Bottom Reward Gateway Card */}
            <View style={[styles.chestCard, { top: 880, left: width * 0.5 - 130 }]}>
              <LinearGradient
                colors={['#172C46', '#0E1D30']}
                style={styles.chestInner}
              >
                <Text style={styles.chestIcon}>🎁</Text>
                <View style={styles.chestInfo}>
                  <Text style={styles.chestTitle}>World 2 Gateway</Text>
                  <Text style={styles.chestSub}>Complete Level 10 to unlock</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  worldTabs: {
    paddingVertical: MLSpacing.sm,
    backgroundColor: '#091523',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 244, 222, 0.08)',
  },
  tabsScroll: {
    paddingHorizontal: MLSpacing.base,
    gap: MLSpacing.sm,
  },
  worldTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122338',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    gap: 8,
  },
  worldTabSelected: {
    borderColor: MLColors.primary,
    backgroundColor: '#1A3352',
    ...MLShadows.glowGold,
  },
  worldTabLocked: {
    opacity: 0.6,
  },
  worldIcon: {
    fontSize: 18,
  },
  worldIdText: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  worldNameText: {
    color: MLColors.textMuted,
    fontSize: 11,
    fontWeight: MLTypography.black,
  },
  mapScroll: {
    minHeight: 1040,
  },
  proceduralWorld: {
    minHeight: 1040,
    position: 'relative',
    paddingTop: MLSpacing.sm,
  },
  pathCanvasContainer: {
    position: 'relative',
    height: 980,
  },
  nodePos: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  hereBubble: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: MLRadius.pill,
    position: 'absolute',
    top: -28,
    zIndex: 20,
    ...MLShadows.md,
  },
  hereText: {
    color: '#0A121D',
    fontSize: 10,
    fontWeight: MLTypography.black,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -4,
    left: '45%',
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  chestCard: {
    position: 'absolute',
    width: 260,
    borderRadius: MLRadius.xl,
    ...MLShadows.md,
    zIndex: 15,
  },
  chestInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1.5,
    borderColor: MLColors.primary,
    gap: MLSpacing.sm,
  },
  chestIcon: {
    fontSize: 30,
  },
  chestInfo: {
    flex: 1,
  },
  chestTitle: {
    color: MLColors.primary,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  chestSub: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
});
