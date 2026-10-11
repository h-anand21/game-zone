// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Wooden Header Bar
// Chunky fantasy carved wood frame with golden rivets & ribbon
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { ArrowHaptics } from '../../utils/haptics';

interface WoodHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const WoodHeader: React.FC<WoodHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.outerWoodFrame}>
        <LinearGradient
          colors={[COLORS.woodLight, COLORS.wood, COLORS.woodDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.innerWoodBeam}
        >
          {/* Golden Corner Rivets */}
          <View style={[styles.rivet, styles.rivetTL]} />
          <View style={[styles.rivet, styles.rivetTR]} />
          <View style={[styles.rivet, styles.rivetBL]} />
          <View style={[styles.rivet, styles.rivetBR]} />

          {/* Left Back / Navigation Button */}
          {onBack ? (
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onBack();
              }}
              style={({ pressed }) => [
                styles.navBtn,
                pressed && styles.navBtnPressed,
              ]}
              hitSlop={8}
            >
              <LinearGradient
                colors={['#844319', '#4D240E']}
                style={styles.navBtnGradient}
              >
                <Text style={styles.navBtnText}>◀</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <View style={styles.navPlaceholder} />
          )}

          {/* Center Title Ribbon */}
          <View style={styles.centerRibbon}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Right Action Slot */}
          {rightAction ? (
            <View style={styles.rightSlot}>{rightAction}</View>
          ) : (
            <View style={styles.navPlaceholder} />
          )}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 14,
    paddingBottom: 6,
    zIndex: 10,
  },
  outerWoodFrame: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#3D1C08',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  innerWoodBeam: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.woodHighlight,
  },
  centerRibbon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  navBtnPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  navBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '900',
  },
  navPlaceholder: {
    width: 38,
    height: 38,
  },
  rightSlot: {
    minWidth: 38,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    borderWidth: 1,
    borderColor: '#7E5B10',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  rivetTL: { top: 4, left: 4 },
  rivetTR: { top: 4, right: 4 },
  rivetBL: { bottom: 4, left: 4 },
  rivetBR: { bottom: 4, right: 4 },
});

export default WoodHeader;
