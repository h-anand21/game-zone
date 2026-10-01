import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { ReverseMindLogo } from '../components/ReverseMindLogo';
import { RMTheme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onFinish();
    });
  }, [onFinish, progressAnim]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Full Bleed Loading Environment Background */}
      <Image
        source={require('../../../../../assets/images/rm_bg_home_master.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.darkOverlay} />

      <View style={styles.contentContainer}>
        {/* Top Header Logo */}
        <View style={styles.logoWrapper}>
          <ReverseMindLogo size="lg" showSubtitle={true} />
        </View>

        {/* Hero Preview Card */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../../../../assets/images/rm_char_boy_study.jpg')}
            style={styles.heroImg}
            resizeMode="cover"
          />
        </View>

        {/* Loading Progress Bar */}
        <View style={styles.loadingBox}>
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingFill, { width: widthInterpolate }]} />
          </View>
          <Text style={styles.loadingText}>SYNAPSE INVERSION READY...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(7, 17, 31, 0.45)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 55,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginTop: 20,
  },
  heroCard: {
    width: 220,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: RMTheme.colors.cyanNeon,
    shadowColor: RMTheme.colors.cyanNeon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  loadingBox: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    marginBottom: 12,
  },
  loadingFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: RMTheme.colors.primaryGold,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 2,
  },
});
