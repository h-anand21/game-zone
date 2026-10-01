// ============================================================
// Number Rush — In-Game Power-Up Action Tray
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNumberRushStore } from '../store/numberRushStore';
import { NRTheme } from '../theme';

export const PowerUpTray: React.FC = () => {
  const {
    powerUps,
    useFreeze,
    useEliminate,
    useExtraTime,
    useHint,
    isTimeFrozen,
    hintActive,
    eliminatedOptions,
    isTimerRunning,
  } = useNumberRushStore();

  const items = [
    {
      id: 'freeze',
      icon: '❄️',
      name: 'Freeze',
      count: powerUps.freeze,
      active: isTimeFrozen,
      onPress: useFreeze,
      color: '#00E5FF',
    },
    {
      id: 'eliminate',
      icon: '⚡',
      name: '50:50',
      count: powerUps.eliminate,
      active: eliminatedOptions.length > 0,
      onPress: useEliminate,
      color: '#FFC107',
    },
    {
      id: 'time',
      icon: '⏰',
      name: '+5s',
      count: powerUps.time,
      active: false,
      onPress: useExtraTime,
      color: '#2ED573',
    },
    {
      id: 'hint',
      icon: '💡',
      name: 'Hint',
      count: powerUps.hint,
      active: hintActive,
      onPress: useHint,
      color: '#A55EEA',
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const disabled = item.count <= 0 || item.active || !isTimerRunning;

        return (
          <Pressable
            key={item.id}
            onPress={() => item.onPress()}
            disabled={disabled}
            style={({ pressed }) => [
              styles.powerBtn,
              { borderColor: item.color },
              disabled && styles.btnDisabled,
              item.active && { backgroundColor: item.color + '40' },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnIcon}>{item.icon}</Text>
            <Text style={styles.btnName}>{item.name}</Text>

            {/* Count Badge */}
            <View style={[styles.countBadge, { backgroundColor: item.color }]}>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  powerBtn: {
    width: 62,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#0C2038',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...NRTheme.shadows.card,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  btnName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countText: {
    color: '#071324',
    fontSize: 9,
    fontWeight: '900',
  },
});
