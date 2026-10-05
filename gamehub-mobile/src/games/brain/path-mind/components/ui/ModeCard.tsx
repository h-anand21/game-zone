// ============================================================
// PATH MIND — Component: ModeCard
// Master Reusable Mode Card Template for Expedition Disciplines
// Rigid 3-Column Layout: [Artwork] [Content] [Action Button]
// Tactile stone & metal frames, responsive touch springs, selected glow
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { ModeArtwork } from './ModeArtwork';
import { ModeBadge } from './ModeBadge';
import { GameButton } from './GameButton';
import { StarIcon } from './GameSvgIcons';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';
import type { GameModeConfig } from '../../modeConfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ModeCardProps {
  mode: GameModeConfig;
  isSelected: boolean;
  onSelect: (mode: GameModeConfig) => void;
  onProceed: (mode: GameModeConfig) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  isSelected,
  onSelect,
  onProceed,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = () => {
    onSelect(mode);
  };

  const handleActionPress = () => {
    if (isSelected) {
      onProceed(mode);
    } else {
      onSelect(mode);
    }
  };

  const getButtonVariant = () => {
    if (isSelected) {
      if (mode.accent === 'green') return 'green';
      if (mode.accent === 'cyan') return 'cyan';
      if (mode.accent === 'crystal') return 'purple';
      if (mode.accent === 'red') return 'red';
      return 'gold';
    }
    return 'wood';
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.cardFrame,
          {
            borderColor: isSelected ? mode.accentColor : '#2C3D4D',
            shadowColor: isSelected ? mode.accentColor : '#000000',
            backgroundColor: isSelected
              ? 'rgba(12, 22, 32, 0.96)'
              : 'rgba(10, 18, 26, 0.92)',
          },
          isSelected && styles.cardSelected,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${mode.title}. ${mode.description}`}
      >
        {/* Top-Right Star Indicator for Selected State */}
        {isSelected && (
          <View style={[styles.selectedPill, { borderColor: mode.accentColor }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <StarIcon size={10} color={mode.accentColor} />
              <Text style={[styles.selectedPillText, { color: mode.accentColor }]}>
                SELECTED
              </Text>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* RIGID 3-COLUMN LAYOUT: ARTWORK | CONTENT | ACTION BUTTON      */}
        {/* ============================================================ */}
        <View style={styles.rowLayout}>
          {/* COLUMN 1: Fixed Artwork Zone (76px) */}
          <View style={styles.imageZone}>
            <ModeArtwork
              type={mode.iconType}
              accentColor={mode.accentColor}
              glowColor={mode.accentGlow}
              size={64}
            />
          </View>

          {/* COLUMN 2: Flexible Content Zone (Left-aligned) */}
          <View style={styles.contentZone}>
            <ModeBadge label={mode.badge} color={mode.accentColor} />

            <Text
              style={[
                styles.titleText,
                { color: isSelected ? mode.accentColor : '#F0F6FC' },
              ]}
              numberOfLines={1}
            >
              {mode.title}
            </Text>

            <Text style={styles.descText} numberOfLines={2}>
              {mode.description}
            </Text>
          </View>

          {/* COLUMN 3: Fixed Action Zone (108px) */}
          <View style={styles.actionZone}>
            <GameButton
              label={isSelected ? 'PLAY >' : 'SELECT'}
              variant={getButtonVariant()}
              size="small"
              width={102}
              height={40}
              onPress={handleActionPress}
              accessibilityLabel={`${isSelected ? 'Play' : 'Select'} ${mode.title}`}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  cardFrame: {
    width: Math.min(SCREEN_WIDTH - 32, 350),
    minHeight: 96,
    borderRadius: pmRadii.lg,
    borderWidth: 2,
    borderBottomWidth: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'relative',
    ...pmShadows.medium,
  },
  cardSelected: {
    borderLeftWidth: 5,
    elevation: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  selectedPill: {
    position: 'absolute',
    top: -8,
    right: 14,
    backgroundColor: '#09131C',
    borderWidth: 1.5,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    zIndex: 20,
    ...pmShadows.soft,
  },
  selectedPillText: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  imageZone: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentZone: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: pmTypography.displaySection.fontFamily,
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  descText: {
    fontFamily: pmTypography.bodySmall.fontFamily,
    fontSize: 10,
    color: '#8CA1B3',
    lineHeight: 14,
  },
  actionZone: {
    width: 106,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
