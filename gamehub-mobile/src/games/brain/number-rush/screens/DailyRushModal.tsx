// ============================================================
// Number Rush — Screen 15: DAILY RUSH (Visual Vector System)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, GameButton, WoodPanel, MascotIllustration, BottomNavBar } from '../components';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

// Vector SVG Icons
const FlameSvg: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <SvgLinearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#FFF176" />
        <Stop offset="40%" stopColor="#FF9800" />
        <Stop offset="100%" stopColor="#E65100" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M12 2C9.5 6 6 8.5 6 13.5C6 17.09 8.91 20 12.5 20C16.09 20 19 17.09 19 13.5C19 9.5 15.5 6 12 2Z"
      fill="url(#flameGrad)"
    />
    <Path
      d="M12 11C10.5 13 9 14.5 9 16.5C9 18.43 10.57 20 12.5 20C14.43 20 16 18.43 16 16.5C16 14.5 14.5 13 12 11Z"
      fill="#FFF9C4"
      opacity={0.8}
    />
  </Svg>
);

const ChestSvg: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7H4C2.9 7 2 7.9 2 9V11C2 11.55 2.45 12 3 12H21C21.55 12 22 11.55 22 11V9C22 7.9 21.1 7 20 7Z"
      fill="#FFB300"
      stroke="#FFD54F"
      strokeWidth={1.2}
    />
    <Path
      d="M3 12V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H3Z"
      fill="#FFA000"
      stroke="#FFD54F"
      strokeWidth={1.2}
    />
    <Path d="M11 11H13V15H11V11Z" fill="#FFFDE7" />
  </Svg>
);

const CoinSvg: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#FFC107" stroke="#FFE082" strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="7" stroke="#FFA000" strokeWidth="1" strokeDasharray="2 2" />
    <Path d="M12 7V17M9 10H15M9 14H15" stroke="#7A4E00" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const CheckSvg: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#00E676" />
    <Path
      d="M8 12.5L10.5 15L16 9.5"
      stroke="#04160D"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockSvg: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="10" rx="2" fill="#3D5068" stroke="#8CA0BA" strokeWidth="1.2" />
    <Path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#8CA0BA" strokeWidth="1.5" />
  </Svg>
);

export const DailyRushModal: React.FC = () => {
  const { setScreen, startCountdown, stats, claimDailyReward, setSelectedMode } =
    useNumberRushStore();

  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const todayIso = today.toISOString().split('T')[0];
  const isClaimedToday = stats.lastDailyClaimDate === todayIso;
  const currentStreakDay = ((stats.dailyStreak - 1) % 7) + 1;

  const streakDays = [
    { day: 1, amount: 100, claimed: currentStreakDay > 1 || (currentStreakDay === 1 && isClaimedToday), isToday: currentStreakDay === 1 },
    { day: 2, amount: 150, claimed: currentStreakDay > 2 || (currentStreakDay === 2 && isClaimedToday), isToday: currentStreakDay === 2 },
    { day: 3, amount: 200, claimed: currentStreakDay > 3 || (currentStreakDay === 3 && isClaimedToday), isToday: currentStreakDay === 3 },
    { day: 4, amount: 250, claimed: currentStreakDay > 4 || (currentStreakDay === 4 && isClaimedToday), isToday: currentStreakDay === 4 },
    { day: 5, amount: 300, claimed: currentStreakDay > 5 || (currentStreakDay === 5 && isClaimedToday), isToday: currentStreakDay === 5 },
    { day: 6, amount: 400, claimed: currentStreakDay > 6 || (currentStreakDay === 6 && isClaimedToday), isToday: currentStreakDay === 6 },
  ];

  const day7Claimed = currentStreakDay === 7 && isClaimedToday;
  const day7IsToday = currentStreakDay === 7;

  const gauntletProgress = stats.dailyGauntletProgress || 0;

  const rawChallenges: {
    num: number;
    title: string;
    mode: 'animal-count' | 'quick-rush' | 'emoji-count' | 'number-box' | 'mixed-rush';
    modeLabel: string;
    reward: string;
    isBoss?: boolean;
  }[] = [
    { num: 1, title: 'Wild Tiger Sprint', mode: 'animal-count', modeLabel: 'Animal Count', reward: '+100 🪙' },
    { num: 2, title: 'Lightning Arithmetic', mode: 'quick-rush', modeLabel: 'Quick Rush', reward: '+120 🪙' },
    { num: 3, title: 'Emoji Radar', mode: 'emoji-count', modeLabel: 'Emoji Count', reward: '+150 🪙' },
    { num: 4, title: 'Matrix Mystery', mode: 'number-box', modeLabel: 'Number Box', reward: '+180 🪙' },
    { num: 5, title: 'Grand Jungle Finale', mode: 'mixed-rush', modeLabel: 'Mixed Rush', reward: '+250 🪙 + 10 💎', isBoss: true },
  ];

  const challenges = rawChallenges.map((c) => ({
    ...c,
    done: c.num <= gauntletProgress,
    active: c.num === gauntletProgress + 1,
    locked: c.num > gauntletProgress + 1,
  }));

  const activeChallenge = challenges.find((c) => c.active) || challenges[0];

  const handleStartDailyChallenge = () => {
    setSelectedMode(activeChallenge.mode);
    startCountdown(activeChallenge.mode, 'medium');
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="DAILY RUSH" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 3. Daily Rush Header Billboard */}
        <View style={styles.headerBillboard}>
          <View style={styles.mascotHolder}>
            <MascotIllustration size={72} character="tiger" mood="happy" showAura={false} />
          </View>
          <View style={styles.billboardBody}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>📅 TODAY • {formattedToday.toUpperCase()}</Text>
            </View>
            <Text style={styles.billboardTitle}>DAILY RUSH ARENA</Text>
            <Text style={styles.billboardDesc}>
              Conquer 5 mixed discipline challenges to multiply streak coins!
            </Text>
          </View>
        </View>

        {/* 4. 7-Day Streak Rewards System */}
        <WoodPanel style={styles.streakPanel} variant="card" hasRivets={false}>
          {/* Header Row */}
          <View style={styles.streakHeader}>
            <View style={styles.streakLeftInfo}>
              <View style={styles.flameDisk}>
                <FlameSvg size={28} />
              </View>
              <View>
                <Text style={styles.streakTitle}>
                  {stats.dailyStreak} DAY RUSH STREAK
                </Text>
                <Text style={styles.streakSubtitle}>
                  {isClaimedToday ? 'Streak logged for today!' : 'Claim today to keep your streak!'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => claimDailyReward()}
              disabled={isClaimedToday}
              style={[
                styles.claimTodayBtn,
                isClaimedToday && styles.claimTodayBtnDisabled,
              ]}
            >
              <Text style={styles.claimTodayText}>
                {isClaimedToday ? '✓ CLAIMED' : 'CLAIM CHEST'}
              </Text>
            </Pressable>
          </View>

          {/* Days 1 to 6 Grid */}
          <View style={styles.streakGrid}>
            {streakDays.map((item) => (
              <View
                key={item.day}
                style={[
                  styles.dayCard,
                  item.claimed && styles.dayCardClaimed,
                  item.isToday && styles.dayCardToday,
                ]}
              >
                <View style={styles.dayTopRow}>
                  <Text style={[styles.dayLabel, item.isToday && styles.dayLabelToday]}>
                    DAY {item.day}
                  </Text>
                  {item.claimed && <CheckSvg size={14} />}
                </View>

                <View style={styles.dayRewardRow}>
                  <CoinSvg size={14} />
                  <Text style={[styles.dayRewardText, item.isToday && styles.dayRewardTextToday]}>
                    +{item.amount}
                  </Text>
                </View>

                {item.isToday && !item.claimed && (
                  <View style={styles.todayPill}>
                    <Text style={styles.todayPillText}>TODAY</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Day 7: Grand Jackpot Chest Banner */}
          <View
            style={[
              styles.day7Banner,
              day7Claimed && styles.day7Claimed,
              day7IsToday && styles.day7Today,
            ]}
          >
            <View style={styles.day7Left}>
              <ChestSvg size={36} />
              <View style={styles.day7Info}>
                <View style={styles.day7TagRow}>
                  <Text style={styles.day7Tag}>DAY 7 MEGA REWARD</Text>
                  {day7Claimed && <CheckSvg size={16} />}
                </View>
                <Text style={styles.day7RewardTitle}>MYSTERY ARCADE CHEST</Text>
                <Text style={styles.day7Sub}>+500 🪙 & 2x Power-Up Bundle</Text>
              </View>
            </View>
            <View style={styles.day7Badge}>
              <Text style={styles.day7BadgeText}>
                {day7Claimed ? 'CLAIMED' : day7IsToday ? 'READY 🎁' : 'DAY 7 🔒'}
              </Text>
            </View>
          </View>
        </WoodPanel>

        {/* 5. 5-Stage Daily Gauntlet List */}
        <View style={styles.gauntletHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>TODAY'S 5-STAGE GAUNTLET</Text>
          <Text style={styles.gauntletStatus}>{gauntletProgress}/5 COMPLETE</Text>
        </View>

        <View style={styles.challengeList}>
          {challenges.map((c) => (
            <Pressable
              key={c.num}
              disabled={!c.active}
              onPress={() => {
                setSelectedMode(c.mode);
                startCountdown(c.mode, 'medium');
              }}
              style={({ pressed }) => [
                styles.challengeRow,
                c.done && styles.challengeDone,
                c.active && styles.challengeActive,
                c.isBoss && styles.challengeBoss,
                pressed && c.active && { opacity: 0.85 },
              ]}
            >
              <View
                style={[
                  styles.numCircle,
                  c.done && { backgroundColor: '#00E676' },
                  c.active && { backgroundColor: '#FFD700' },
                ]}
              >
                {c.done ? (
                  <CheckSvg size={18} />
                ) : (
                  <Text
                    style={[
                      styles.numCircleText,
                      c.active && { color: '#04160D' },
                    ]}
                  >
                    {c.num}
                  </Text>
                )}
              </View>

              <View style={styles.challengeInfo}>
                <View style={styles.challengeTitleRow}>
                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  {c.isBoss && <Text style={styles.bossBadge}>⚡ BOSS</Text>}
                </View>
                <Text style={styles.challengeMode}>
                  {c.modeLabel} • <Text style={{ color: '#FFD700', fontWeight: '800' }}>{c.reward}</Text>
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  c.done && styles.statusBadgeDone,
                  c.active && styles.statusBadgeActive,
                ]}
              >
                {c.locked ? (
                  <View style={styles.lockRow}>
                    <LockSvg size={14} />
                    <Text style={styles.statusBadgeText}>LOCKED</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.statusBadgeText,
                      c.active && { color: '#04160D', fontWeight: '900' },
                    ]}
                  >
                    {c.done ? 'COMPLETED' : 'PLAY ▶'}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* 6. Primary Action CTA Button */}
        <GameButton
          title={
            gauntletProgress >= 5
              ? 'ALL 5 STAGES COMPLETED! 🏆'
              : `START STAGE ${activeChallenge.num}: ${activeChallenge.title.toUpperCase()} ▶`
          }
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={handleStartDailyChallenge}
          style={styles.startBtn}
          disabled={gauntletProgress >= 5}
        />

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Global Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBillboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.92)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  mascotHolder: {
    marginRight: 10,
  },
  billboardBody: {
    flex: 1,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00E5FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  dateBadgeText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  billboardTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  billboardDesc: {
    color: '#A0B4C8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  streakPanel: {
    padding: 14,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  streakLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flameDisk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 109, 0, 0.2)',
    borderWidth: 1.5,
    borderColor: '#FF9100',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  streakTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  streakSubtitle: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  claimTodayBtn: {
    backgroundColor: '#FF6D00',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  claimTodayBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  claimTodayText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  dayCard: {
    width: '31%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dayCardClaimed: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  dayCardToday: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  dayLabel: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '900',
  },
  dayLabelToday: {
    color: '#FFD700',
  },
  dayRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayRewardText: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
  },
  dayRewardTextToday: {
    color: '#FFD700',
    fontSize: 13,
  },
  todayPill: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 4,
  },
  todayPillText: {
    color: '#04160D',
    fontSize: 8,
    fontWeight: '900',
  },
  day7Banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(66, 33, 8, 0.75)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FF9100',
    padding: 10,
  },
  day7Claimed: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 100, 40, 0.35)',
  },
  day7Today: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
  },
  day7Left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  day7Info: {
    marginLeft: 10,
    flex: 1,
  },
  day7TagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  day7Tag: {
    color: '#FFB300',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  day7RewardTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  day7Sub: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '600',
  },
  day7Badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  day7BadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
  },
  gauntletHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  sectionHeaderTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  gauntletStatus: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '800',
  },
  challengeList: {
    gap: 10,
    marginBottom: 16,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
  },
  challengeDone: {
    borderColor: 'rgba(0, 230, 118, 0.4)',
    backgroundColor: 'rgba(4, 30, 20, 0.75)',
  },
  challengeActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(15, 45, 75, 0.95)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  challengeBoss: {
    borderColor: '#E65100',
  },
  challengeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bossBadge: {
    color: '#FF6D00',
    fontSize: 10,
    fontWeight: '900',
  },
  numCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numCircleText: {
    color: '#8CA0BA',
    fontSize: 13,
    fontWeight: '900',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  challengeMode: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  statusBadgeDone: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  statusBadgeActive: {
    backgroundColor: '#FFD700',
  },
  statusBadgeText: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '800',
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  startBtn: {
    marginTop: 4,
  },
});
