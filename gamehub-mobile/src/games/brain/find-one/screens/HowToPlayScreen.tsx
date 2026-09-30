// ============================================================
// Find One — Screen 2: How To Play Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOColors, FORadius, FOSpacing } from '../theme';
import {
  GameLogo,
  GameButton,
  WoodenSign,
  PandaIllustration,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';

export const HowToPlayScreen: React.FC = () => {
  const { setScreen, startGame } = useFindOneStore();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const backAction = () => {
      setScreen('home');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [setScreen]);

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20,
    16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={styles.container}
    >
      {/* ── Top Header with Back Button ── */}
      <View style={[styles.topHeader, { paddingTop: topInset + 6 }]}>
        <Pressable
          onPress={() => setScreen('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <WoodenSign text="HOW TO PLAY" size="md" variant="wood" />
        </View>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomInset + 32 },
        ]}
      >
        {/* ── 3 Steps Row: LOOK -> FIND -> TAP ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.stepsCard}
        >
          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepColumn}>
              <View style={[styles.stepBadge, { backgroundColor: '#2488FF' }]}>
                <Text style={styles.stepNum}>1</Text>
                <Text style={styles.stepWord}>LOOK</Text>
              </View>
              <Text style={styles.stepSub}>Observe all the objects carefully.</Text>

              {/* 4x4 Mini Preview */}
              <View style={styles.stepMiniGrid}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <View key={i} style={styles.stepMiniTile}>
                    <Text style={{ fontSize: 11 }}>🐼</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepColumn}>
              <View style={[styles.stepBadge, { backgroundColor: '#3BE35A' }]}>
                <Text style={styles.stepNum}>2</Text>
                <Text style={styles.stepWord}>FIND</Text>
              </View>
              <Text style={styles.stepSub}>Find the one that is different.</Text>

              {/* 4x4 Mini Preview with glowing Fox */}
              <View style={styles.stepMiniGrid}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.stepMiniTile,
                      i === 9 && styles.stepMiniTileOdd,
                    ]}
                  >
                    <Text style={{ fontSize: 11 }}>{i === 9 ? '🦊' : '🐼'}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepColumn}>
              <View style={[styles.stepBadge, { backgroundColor: '#FFC928' }]}>
                <Text style={[styles.stepNum, { color: '#3A2000' }]}>3</Text>
                <Text style={[styles.stepWord, { color: '#3A2000' }]}>TAP</Text>
              </View>
              <Text style={styles.stepSub}>Tap the different one before time runs out.</Text>

              {/* 4x4 Mini Preview with Hand pointer */}
              <View style={styles.stepMiniGrid}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.stepMiniTile,
                      i === 9 && styles.stepMiniTileTapped,
                    ]}
                  >
                    <Text style={{ fontSize: 11 }}>{i === 9 ? '🦊' : '🐼'}</Text>
                    {i === 9 && (
                      <Text style={styles.handPointer}>👆</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Example Section: Bear vs Koala ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.exampleCard}
        >
          <View style={styles.exampleHeaderBadge}>
            <Text style={styles.exampleHeaderBadgeText}>EXAMPLE</Text>
          </View>

          <View style={styles.exampleContentRow}>
            {/* Bear 4x4 Grid */}
            <View style={styles.bearGrid}>
              {Array.from({ length: 16 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.bearTile,
                    i === 10 && styles.koalaTile,
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{i === 10 ? '🐨' : '🐻'}</Text>
                </View>
              ))}
            </View>

            {/* Middle Arrow Note */}
            <View style={styles.arrowNoteContainer}>
              <Text style={styles.arrowNoteText}>
                All are bears but this one is different!
              </Text>
              <Text style={styles.arrowIcon}>⤵</Text>
            </View>

            {/* Right Lightbulb Rules Card */}
            <View style={styles.rulesCard}>
              <View style={styles.rulesTitleRow}>
                <Text style={{ fontSize: 16 }}>💡</Text>
                <Text style={styles.rulesTitleText}>DIFFERENT CAN BE:</Text>
              </View>

              <View style={styles.bulletsList}>
                <Text style={styles.bulletItem}>🟢 Different animal</Text>
                <Text style={styles.bulletItem}>🟢 Different clothes</Text>
                <Text style={styles.bulletItem}>🟡 Different color</Text>
                <Text style={styles.bulletItem}>🔵 Different accessory</Text>
                <Text style={styles.bulletItem}>🟣 Slightly different expression</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Difficulty & Grid Size Section ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.diffCard}
        >
          <View style={styles.diffHeaderBadge}>
            <Text style={styles.diffHeaderBadgeText}>DIFFICULTY & GRID SIZE</Text>
          </View>

          <View style={styles.diffRow}>
            {/* Easy 4x4 */}
            <View style={styles.diffItem}>
              <View style={[styles.diffBadge, { backgroundColor: '#3BE35A' }]}>
                <Text style={styles.diffBadgeText}>EASY</Text>
              </View>
              <View style={styles.miniDiffGrid}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} style={styles.diffTile}>
                    <Text style={{ fontSize: 12 }}>{i === 7 ? '🐥' : '🦆'}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.gridSizeText}>4 × 4</Text>
            </View>

            <Text style={styles.arrowChevron}>›</Text>

            {/* Medium 5x5 */}
            <View style={styles.diffItem}>
              <View style={[styles.diffBadge, { backgroundColor: '#2488FF' }]}>
                <Text style={styles.diffBadgeText}>MEDIUM</Text>
              </View>
              <View style={styles.miniDiffGrid}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} style={styles.diffTile}>
                    <Text style={{ fontSize: 12 }}>{i === 4 ? '🐱' : '🦊'}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.gridSizeText}>5 × 5</Text>
            </View>

            <Text style={styles.arrowChevron}>›</Text>

            {/* Hard 6x6 */}
            <View style={styles.diffItem}>
              <View style={[styles.diffBadge, { backgroundColor: '#FF4B4B' }]}>
                <Text style={styles.diffBadgeText}>HARD</Text>
              </View>
              <View style={styles.miniDiffGrid}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} style={styles.diffTile}>
                    <Text style={{ fontSize: 12 }}>{i === 2 ? '🐢' : '🐸'}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.gridSizeText}>6 × 6</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Tips Bar ── */}
        <View style={styles.tipsBar}>
          <Text style={styles.tipsTitle}>💡 TIPS</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>👁️</Text>
            <Text style={styles.tipText}>Look for small details</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🔍</Text>
            <Text style={styles.tipText}>Take your time (be fast!)</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🧠</Text>
            <Text style={styles.tipText}>Practice to improve</Text>
          </View>
        </View>

        {/* ── Bottom CTA ── */}
        <View style={styles.ctaWrapper}>
          <GameButton
            title="PLAY NOW"
            size="lg"
            variant="gold"
            icon={<Text style={{ fontSize: 24 }}>▶</Text>}
            onPress={startGame}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FOSpacing.md,
    paddingTop: 16,
    paddingBottom: 6,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#12365C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#24629E',
  },
  backArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: FOSpacing.md,
    paddingBottom: 40,
    alignItems: 'center',
  },
  stepsCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 2,
    borderColor: '#1C426B',
    marginBottom: FOSpacing.md,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: FORadius.round,
    gap: 4,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepWord: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepSub: {
    fontSize: 10,
    fontWeight: '600',
    color: FOColors.textMuted,
    textAlign: 'center',
    minHeight: 28,
  },
  stepMiniGrid: {
    width: 82,
    height: 82,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stepMiniTile: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMiniTileOdd: {
    backgroundColor: '#FFEFA8',
    borderColor: '#FFC928',
    borderWidth: 1,
  },
  stepMiniTileTapped: {
    backgroundColor: '#FFEFA8',
    borderColor: '#FFC928',
    borderWidth: 1,
  },
  handPointer: {
    position: 'absolute',
    top: -6,
    right: -10,
    fontSize: 18,
  },
  exampleCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 2,
    borderColor: '#1C426B',
    marginBottom: FOSpacing.md,
    position: 'relative',
  },
  exampleHeaderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3BE35A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: FORadius.round,
    marginBottom: 8,
  },
  exampleHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#083B10',
  },
  exampleContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bearGrid: {
    width: 105,
    height: 105,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bearTile: {
    width: 21,
    height: 21,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  koalaTile: {
    backgroundColor: '#E8F2FF',
    borderWidth: 1,
    borderColor: '#2488FF',
  },
  arrowNoteContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowNoteText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFEAA7',
    textAlign: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#FFEAA7',
  },
  rulesCard: {
    flex: 1.3,
    backgroundColor: '#0E2642',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1F4770',
  },
  rulesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rulesTitleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bulletsList: {
    gap: 2,
  },
  bulletItem: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C7D9EC',
  },
  diffCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 2,
    borderColor: '#1C426B',
    marginBottom: FOSpacing.md,
  },
  diffHeaderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#8A4BFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: FORadius.round,
    marginBottom: 10,
  },
  diffHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diffItem: {
    alignItems: 'center',
    gap: 4,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  miniDiffGrid: {
    width: 66,
    height: 66,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffTile: {
    width: 18,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridSizeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  arrowChevron: {
    fontSize: 22,
    fontWeight: '900',
    color: FOColors.primary,
  },
  tipsBar: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0D2238',
    borderRadius: FORadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: '#193A5E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: FOSpacing.md,
  },
  tipsTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: FOColors.primary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipIcon: {
    fontSize: 12,
  },
  tipText: {
    fontSize: 9,
    fontWeight: '700',
    color: FOColors.textMuted,
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 340,
    marginTop: 4,
  },
});
