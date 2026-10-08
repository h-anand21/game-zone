// ============================================================
// ONE TAP: PRECISION GAME — TimingTrack Component
// Horizontal futuristic timing rail, dynamic target zone & moving needle
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { TargetZoneData } from '../types';
import { OTColors } from '../theme/colors';

interface TimingTrackProps {
  needlePos: SharedValue<number>; // 0.0 to 1.0 (normalized UI thread position)
  target: TargetZoneData;
  isFeverActive: boolean;
  onTrackLayout?: (width: number) => void;
}

export const TimingTrack: React.FC<TimingTrackProps> = ({
  needlePos,
  target,
  isFeverActive,
  onTrackLayout,
}) => {
  const [trackWidth, setTrackWidth] = React.useState(320);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setTrackWidth(w);
      if (onTrackLayout) onTrackLayout(w);
    }
  };

  // Reanimated style for the moving needle (UI thread 60fps)
  const needleAnimatedStyle = useAnimatedStyle(() => {
    const x = needlePos.value * trackWidth;
    return {
      transform: [{ translateX: x - 14 }], // center needle circle (28px width)
    };
  });

  const accentColor = isFeverActive ? OTColors.feverHot : OTColors.cyan;
  const targetBg = isFeverActive ? 'rgba(255, 0, 127, 0.22)' : 'rgba(0, 229, 255, 0.16)';
  const targetBorder = isFeverActive ? OTColors.feverHot : OTColors.cyan;

  const targetPixelLeft = target.start * trackWidth;
  const targetPixelWidth = target.width * trackWidth;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Target Zone Label Bracket Above Track */}
      <View
        style={[
          styles.bracketContainer,
          {
            left: targetPixelLeft,
            width: targetPixelWidth,
          },
        ]}
      >
        <Text style={[styles.targetLabel, { color: accentColor }]}>TARGET ZONE</Text>
        <View style={styles.bracketLineRow}>
          <View style={[styles.bracketArm, { backgroundColor: accentColor }]} />
          <View style={[styles.bracketCenterTick, { backgroundColor: accentColor }]} />
          <View style={[styles.bracketArm, { backgroundColor: accentColor }]} />
        </View>
      </View>

      {/* Main Track Rail Surface */}
      <View style={styles.trackRail}>
        {/* Subtle Tick Marks Along Rail */}
        <View style={styles.ticksOverlay}>
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((tick) => (
            <View
              key={tick}
              style={[
                styles.tickMark,
                {
                  left: `${tick * 100}%`,
                  height: tick === 0.5 ? 16 : 10,
                  opacity: tick === 0.5 ? 0.7 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        {/* Dynamic Target Zone Box */}
        <View
          style={[
            styles.targetZoneBox,
            {
              left: targetPixelLeft,
              width: targetPixelWidth,
              backgroundColor: targetBg,
              borderColor: targetBorder,
            },
          ]}
        >
          {/* Target Center Crosshair & Sweetspot Dot */}
          <View style={[styles.sweetspotLine, { backgroundColor: accentColor }]} />
          <View style={[styles.sweetspotDot, { backgroundColor: accentColor }]} />
        </View>

        {/* Moving Needle Marker (Animated on UI Thread) */}
        <Animated.View style={[styles.needleMarker, needleAnimatedStyle]}>
          <Svg width={28} height={28} viewBox="0 0 28 28">
            {/* Outer Soft Halo */}
            <Circle
              cx={14}
              cy={14}
              r={12}
              stroke={isFeverActive ? OTColors.feverHot : OTColors.cyan}
              strokeWidth={1.8}
              fill="none"
              opacity={0.8}
            />
            {/* Inner Glowing White Orb */}
            <Circle cx={14} cy={14} r={6.5} fill="#FFFFFF" />
            {/* Central Glow Core */}
            <Circle
              cx={14}
              cy={14}
              r={3}
              fill={isFeverActive ? OTColors.feverHot : OTColors.cyan}
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 18,
    position: 'relative',
    justifyContent: 'center',
  },
  bracketContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 2,
  },
  bracketLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 6,
    justifyContent: 'space-between',
  },
  bracketArm: {
    flex: 1,
    height: 1.5,
    opacity: 0.6,
  },
  bracketCenterTick: {
    width: 2,
    height: 6,
    marginHorizontal: 2,
    opacity: 0.9,
  },
  trackRail: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(10, 14, 20, 0.85)',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ticksOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  tickMark: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: '#FFFFFF',
    top: '50%',
    transform: [{ translateY: -5 }],
  },
  targetZoneBox: {
    position: 'absolute',
    height: '100%',
    borderWidth: 1.8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sweetspotLine: {
    position: 'absolute',
    width: 1.5,
    height: '100%',
    opacity: 0.7,
  },
  sweetspotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  needleMarker: {
    position: 'absolute',
    top: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
