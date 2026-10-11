// ============================================================
// STACK MASTER — Screen Background
// Displays the requested background artwork with ambient styling
// ============================================================

import React from 'react';
import { StyleSheet, View, ImageBackground, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';

// Asset map for requested backgrounds
export const BG_IMAGES: Record<string, ImageSourcePropType> = {
  splash: require('@/assets/game/backgrounds/Skylands Block Tower.png'),
  home: require('@/assets/game/backgrounds/Enchanted Floating Islands at Twilight.png'),
  gameplay: require('@/assets/game/backgrounds/Neon Celestial Floating Canyon.png'),
  sunrise: require('@/assets/game/backgrounds/Whimsical Floating Islands at Sunrise.png'),
};

interface ScreenBackgroundProps {
  type?: 'splash' | 'home' | 'gameplay' | 'sunrise';
  children: React.ReactNode;
  dimAmount?: number;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  type = 'home',
  children,
  dimAmount = 0.45,
}) => {
  const bgSource = BG_IMAGES[type] || BG_IMAGES.home;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgSource}
        style={styles.imageBg}
        resizeMode="cover"
      >
        {/* Soft vignette overlay */}
        <LinearGradient
          colors={[
            `rgba(7, 19, 41, ${dimAmount * 0.8})`,
            `rgba(7, 19, 41, ${dimAmount})`,
            `rgba(7, 19, 41, ${Math.min(dimAmount + 0.35, 0.9)})`,
          ]}
          style={StyleSheet.absoluteFill}
        />

        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
