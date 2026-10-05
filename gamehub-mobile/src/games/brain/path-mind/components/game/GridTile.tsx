// ============================================================
// PATH MIND — Component 07: GridTile
// Tactile fantasy stone path tile with rune states & glowing paths
// ============================================================

import React, { useRef } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StarIcon } from '../ui/GameSvgIcons';
import { pmColors } from '../../design-system/colors';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

export type TileState =
  | 'idle'
  | 'highlighted'
  | 'selected'
  | 'start'
  | 'goal'
  | 'correct'
  | 'wrong'
  | 'decoy';

interface GridTileProps {
  row: number;
  col: number;
  size: number;
  state: TileState;
  number?: number;
  symbol?: string;
  disabled?: boolean;
  onPress?: (row: number, col: number) => void;
}

const GridTileComponent: React.FC<GridTileProps> = ({
  row,
  col,
  size,
  state,
  number,
  symbol,
  disabled = false,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.92,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const getTileColors = () => {
    switch (state) {
      case 'highlighted':
        return {
          bg: 'rgba(0, 180, 216, 0.45)',
          border: pmColors.cyan,
          borderBottom: pmColors.tealDark,
          shadow: pmShadows.glowCyan,
        };
      case 'selected':
        return {
          bg: 'rgba(0, 240, 255, 0.35)',
          border: pmColors.cyanGlow,
          borderBottom: pmColors.cyanDim,
          shadow: pmShadows.glowCyan,
        };
      case 'start':
        return {
          bg: 'rgba(255, 215, 0, 0.4)',
          border: pmColors.gold,
          borderBottom: pmColors.goldDark,
          shadow: pmShadows.glowGold,
        };
      case 'goal':
        return {
          bg: 'rgba(46, 204, 113, 0.4)',
          border: pmColors.successGreen,
          borderBottom: '#1B8246',
          shadow: pmShadows.glowGreen,
        };
      case 'correct':
        return {
          bg: 'rgba(46, 204, 113, 0.55)',
          border: pmColors.successGlow,
          borderBottom: '#19703C',
          shadow: pmShadows.glowGreen,
        };
      case 'wrong':
        return {
          bg: 'rgba(255, 71, 87, 0.55)',
          border: pmColors.dangerGlow,
          borderBottom: '#991B24',
          shadow: pmShadows.glowRed,
        };
      case 'decoy':
        return {
          bg: 'rgba(165, 94, 234, 0.35)',
          border: pmColors.relicPurple,
          borderBottom: '#5B2C8C',
          shadow: pmShadows.soft,
        };
      case 'idle':
      default:
        return {
          bg: 'rgba(18, 28, 38, 0.95)',
          border: pmColors.stoneBorder,
          borderBottom: '#162028',
          shadow: pmShadows.soft,
        };
    }
  };

  const colors = getTileColors();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={() => onPress?.(row, col)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            borderBottomColor: colors.borderBottom,
          },
          colors.shadow,
        ]}
      >
        {/* Sacred Ancient Rune Glyph in center of Idle/Active stone */}
        {state === 'idle' && (
          <Svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24">
            <Path
              d="M12 2L2 12l10 10 10-10L12 2zm0 4.8L17.2 12 12 17.2 6.8 12 12 6.8z"
              fill="rgba(255, 255, 255, 0.08)"
            />
          </Svg>
        )}

        {/* Start / Goal Indicators */}
        {state === 'start' && (
          <StarIcon size={size * 0.42} color={pmColors.goldBright} />
        )}
        {state === 'goal' && (
          <Svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24">
            <Path d="M12 2L2 12l10 10 10-10L12 2z" fill={pmColors.successGlow} />
          </Svg>
        )}

        {/* Number Placement */}
        {number !== undefined && (
          <Text
            style={[
              styles.numberText,
              { fontSize: size * 0.44 },
              state === 'highlighted' || state === 'selected'
                ? { color: pmColors.cyan }
                : { color: pmColors.goldBright },
            ]}
          >
            {number}
          </Text>
        )}

        {/* Symbol Placement */}
        {symbol !== undefined && (
          <Text style={[styles.symbolText, { fontSize: size * 0.4 }]}>{symbol}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

export const GridTile = React.memo(GridTileComponent);

const styles = StyleSheet.create({
  container: {
    borderRadius: pmRadii.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  runeBadge: {
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  numberText: {
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  symbolText: {
    fontWeight: '800',
    color: pmColors.textPrimary,
  },
});
