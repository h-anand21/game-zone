// ============================================================
// PATTERN QUEST — PatternTile Component
// Visual Shape, Color, Rotation, Size, and Transformation Tile
// ============================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Polygon, Rect, Path } from 'react-native-svg';
import { pqColors, pqSpacing } from '../../theme';
import { VisualTile } from '../../types';

interface PatternTileProps {
  tile?: VisualTile | null;
  isQuestionMark?: boolean;
  size?: number;
  highlighted?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onPress?: () => void;
}

const PatternTileComponent: React.FC<PatternTileProps> = ({
  tile,
  isQuestionMark = false,
  size = 64,
  highlighted = false,
  isCorrect = false,
  isWrong = false,
}) => {
  const renderShapeIcon = () => {
    if (!tile) return null;

    const iconSize = size * 0.55;
    const strokeWidth = tile.style === 'outline' ? 3.5 : 1.5;
    const fill = tile.style === 'outline' ? 'none' : tile.color;
    const stroke = tile.style === 'outline' ? tile.color : 'rgba(255,255,255,0.7)';
    const opacity = tile.style === 'half' ? 0.6 : 1;

    const scale = tile.size === 'small' ? 0.75 : tile.size === 'large' ? 1.2 : 1.0;

    let shapeElement = null;

    switch (tile.shape) {
      case 'circle':
        shapeElement = (
          <Circle
            cx={iconSize / 2}
            cy={iconSize / 2}
            r={(iconSize / 2 - 3) * scale}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        break;
      case 'square':
        shapeElement = (
          <Rect
            x={(iconSize * (1 - scale)) / 2 + 2}
            y={(iconSize * (1 - scale)) / 2 + 2}
            width={(iconSize - 4) * scale}
            height={(iconSize - 4) * scale}
            rx={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        break;
      case 'triangle':
        shapeElement = (
          <Polygon
            points={`${iconSize / 2},${4} ${iconSize - 4},${iconSize - 4} ${4},${iconSize - 4}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        break;
      case 'diamond':
        shapeElement = (
          <Polygon
            points={`${iconSize / 2},${2} ${iconSize - 2},${iconSize / 2} ${iconSize / 2},${
              iconSize - 2
            } ${2},${iconSize / 2}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        break;
      case 'star':
        shapeElement = (
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            transform={`scale(${iconSize / 24})`}
          />
        );
        break;
      case 'hexagon':
      default:
        shapeElement = (
          <Polygon
            points={`${iconSize * 0.25},${2} ${iconSize * 0.75},${2} ${iconSize - 2},${
              iconSize / 2
            } ${iconSize * 0.75},${iconSize - 2} ${iconSize * 0.25},${iconSize - 2} ${2},${
              iconSize / 2
            }`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        break;
    }

    return (
      <View
        style={{
          width: iconSize,
          height: iconSize,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: `${tile.rotation || 0}deg` }],
        }}
      >
        <Svg width={iconSize} height={iconSize}>
          {shapeElement}
        </Svg>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.tileContainer,
        {
          width: size,
          height: size,
          borderColor: isCorrect
            ? pqColors.successGlow
            : isWrong
            ? pqColors.dangerGlow
            : highlighted
            ? pqColors.crystalCyan
            : '#4A5B6E',
          backgroundColor: isCorrect
            ? 'rgba(46, 204, 113, 0.25)'
            : isWrong
            ? 'rgba(231, 76, 60, 0.25)'
            : isQuestionMark
            ? 'rgba(245, 176, 65, 0.18)'
            : 'rgba(25, 33, 44, 0.95)',
        },
      ]}
    >
      {isQuestionMark ? (
        <View style={styles.questionMarkBox}>
          <Text style={styles.questionMarkText}>?</Text>
        </View>
      ) : (
        renderShapeIcon()
      )}
    </View>
  );
};

export const PatternTile = React.memo(PatternTileComponent);

const styles = StyleSheet.create({
  tileContainer: {
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 2.5,
    borderBottomWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  questionMarkBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMarkText: {
    fontSize: 32,
    fontWeight: '900',
    color: pqColors.gold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
