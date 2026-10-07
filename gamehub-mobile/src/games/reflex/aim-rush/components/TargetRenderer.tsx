// ============================================================
// AIM RUSH — TargetRenderer Component
// Programmatic vector target with concentric rings, crosshair & lifetime ring
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { TargetItem } from '../types';
import { ARColors } from '../theme/colors';

interface TargetRendererProps {
  target: TargetItem;
}

export const TargetRenderer: React.FC<TargetRendererProps> = ({ target }) => {
  const scaleAnim = useSharedValue(0.2);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // 1. Initial spring spawn
    scaleAnim.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.back(1.4)),
    });

    // 2. Subtle rhythmic pulse
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 250, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.96, { duration: 250, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value * pulseAnim.value }],
  }));

  const size = target.radius * 2;
  const cx = target.radius;
  const cy = target.radius;

  const isDanger = target.type === 'danger';
  const isPerfectBonus = target.type === 'perfect';
  const isMoving = target.type === 'moving';

  const primaryColor = isDanger
    ? ARColors.red
    : isPerfectBonus
    ? ARColors.lime
    : ARColors.cyan;

  const innerColor = isDanger
    ? '#FF2244'
    : isPerfectBonus
    ? '#FFFFFF'
    : ARColors.lime;

  return (
    <View
      style={[
        styles.container,
        {
          left: target.x - target.radius,
          top: target.y - target.radius,
          width: size,
          height: size,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={animatedStyle}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <RadialGradient id={`tgtGrad_${target.id}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
              <Stop offset="70%" stopColor={primaryColor} stopOpacity="0.12" />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* 1. Atmospheric Ambient Glow */}
          <Circle cx={cx} cy={cy} r={target.radius - 2} fill={`url(#tgtGrad_${target.id})`} />

          {/* 2. Outer Perimeter Ring */}
          <Circle
            cx={cx}
            cy={cy}
            r={target.radius - 3}
            stroke={primaryColor}
            strokeWidth={2.2}
            strokeDasharray={isMoving ? '6, 4' : undefined}
            fill="none"
          />

          {/* 3. Crosshair Reticle Ticks */}
          {!isDanger ? (
            <>
              <Line
                x1={cx - target.radius + 1}
                y1={cy}
                x2={cx - target.radius + 8}
                y2={cy}
                stroke={primaryColor}
                strokeWidth={2}
              />
              <Line
                x1={cx + target.radius - 8}
                y1={cy}
                x2={cx + target.radius - 1}
                y2={cy}
                stroke={primaryColor}
                strokeWidth={2}
              />
              <Line
                x1={cx}
                y1={cy - target.radius + 1}
                x2={cx}
                y2={cy - target.radius + 8}
                stroke={primaryColor}
                strokeWidth={2}
              />
              <Line
                x1={cx}
                y1={cy + target.radius - 8}
                x2={cx}
                y2={cy + target.radius - 1}
                stroke={primaryColor}
                strokeWidth={2}
              />
            </>
          ) : (
            // Danger Diagonal Cross
            <>
              <Line
                x1={cx - target.radius * 0.45}
                y1={cy - target.radius * 0.45}
                x2={cx + target.radius * 0.45}
                y2={cy + target.radius * 0.45}
                stroke={ARColors.red}
                strokeWidth={2.5}
              />
              <Line
                x1={cx + target.radius * 0.45}
                y1={cy - target.radius * 0.45}
                x2={cx - target.radius * 0.45}
                y2={cy + target.radius * 0.45}
                stroke={ARColors.red}
                strokeWidth={2.5}
              />
            </>
          )}

          {/* 4. Concentric Sweet-Spot Ring (Inner Target Zone) */}
          <Circle
            cx={cx}
            cy={cy}
            r={target.radius * 0.38}
            stroke={innerColor}
            strokeWidth={1.8}
            fill="none"
            opacity={0.85}
          />

          {/* 5. Dead-Center Sweet-Spot Dot */}
          <Circle
            cx={cx}
            cy={cy}
            r={Math.max(3, target.radius * 0.14)}
            fill={innerColor}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
