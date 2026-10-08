// ============================================================
// ONE TAP: PRECISION GAME — FeedbackBanner Component
// Dynamic hit evaluation banners (Good, Great, Perfect, Miss)
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { HitEvaluation } from '../types';
import { OTColors } from '../theme/colors';
import { SvgCrown } from './icons/OneTapIcons';

interface FeedbackBannerProps {
  evaluation: HitEvaluation | null;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ evaluation }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);

  useEffect(() => {
    if (!evaluation) return;

    // Reset values
    scale.value = 0.5;
    opacity.value = 0;
    translateY.value = 15;

    // Pop animation
    scale.value = withSpring(1.05, { damping: 10 });
    opacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 180 })
    );
    translateY.value = withTiming(-5, { duration: 600 });
  }, [evaluation?.timestamp]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!evaluation) {
    return <View style={styles.container} />;
  }

  const { tier, totalPointsAwarded } = evaluation;

  let title = 'GOOD';
  let color = OTColors.green;
  let subText = `+${totalPointsAwarded}`;

  if (tier === 'perfect') {
    title = 'PERFECT';
    color = OTColors.gold;
  } else if (tier === 'great') {
    title = 'GREAT';
    color = OTColors.cyan;
  } else if (tier === 'miss') {
    title = 'MISS';
    color = OTColors.red;
    subText = 'COMBO BROKEN';
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.contentBox, animatedStyle]}>
        {tier === 'perfect' && (
          <View style={styles.crownWrap}>
            <SvgCrown size={28} color={OTColors.gold} />
          </View>
        )}

        <Text
          style={[
            styles.titleText,
            {
              color,
              textShadowColor: color,
            },
          ]}
        >
          {title}
        </Text>

        <Text style={[styles.subText, { color }]}>{subText}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownWrap: {
    marginBottom: 4,
  },
  titleText: {
    fontSize: 34,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 2,
  },
});
