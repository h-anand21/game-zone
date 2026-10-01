// ============================================================
// Number Rush — Wooden Jungle Sign Header with Tiger Mascot
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NRTheme } from '../theme';
import { NRHaptics } from '../services/haptics';
import { NRAudio } from '../services/audio';

const TIGER_IMAGE = require('@/../assets/images/jungle/tiger_mascot.png');

interface TigerMascotHeaderProps {
  title?: string;
  subtitle?: string;
  onBackPress: () => void;
}

export const TigerMascotHeader: React.FC<TigerMascotHeaderProps> = ({
  title = 'SETTINGS',
  subtitle = 'Customize Your Game Experience',
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    onBackPress();
  };

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Wooden Sign Board Container */}
      <View style={styles.signBoard}>
        {/* Sign Board Corner Screws/Rivets */}
        <View style={[styles.rivet, styles.rivetTL]} />
        <View style={[styles.rivet, styles.rivetBL]} />

        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        {/* Text Center Column */}
        <View style={styles.textColumn}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        {/* Transparent Cartoon Tiger Mascot Character partially overlapping the header */}
        <View style={styles.tigerWrapper} pointerEvents="none">
          <ExpoImage
            source={TIGER_IMAGE}
            style={styles.tigerImage}
            contentFit="contain"
            transition={150}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 20,
  },
  signBoard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#381C0F',
    borderRadius: NRTheme.radius.xl,
    borderWidth: 3,
    borderColor: '#7A3F1D',
    paddingVertical: 14,
    paddingHorizontal: 16,
    overflow: 'visible', // Allows tiger to overlap top/right gracefully
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#522A14',
    borderWidth: 2,
    borderColor: '#FFD42A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  backBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
  backArrow: {
    color: '#FFE082',
    fontSize: 22,
    fontWeight: '900',
  },
  textColumn: {
    flex: 1,
    paddingRight: 50, // Reserve space for overlapping mascot
  },
  headerTitle: {
    color: '#FFD42A',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: '#D8E2DD',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tigerWrapper: {
    position: 'absolute',
    right: 4,
    bottom: -6,
    width: 82,
    height: 88,
  },
  tigerImage: {
    width: '100%',
    height: '100%',
  },
  rivet: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFE082',
    borderWidth: 1,
    borderColor: '#C67C00',
  },
  rivetTL: { top: 6, left: 6 },
  rivetBL: { bottom: 6, left: 6 },
});
