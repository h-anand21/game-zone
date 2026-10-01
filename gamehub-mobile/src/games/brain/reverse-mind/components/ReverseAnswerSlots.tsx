// ============================================================
// REVERSE MIND — Reverse Answer Slots Component (Input Phase)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { GameObject } from '../types';
import { ObjectCard } from './ObjectCard';
import { RMTheme } from '../theme';

interface ReverseAnswerSlotsProps {
  totalSlots: number;
  playerInput: GameObject[];
  isWrong?: boolean;
}

export const ReverseAnswerSlots: React.FC<ReverseAnswerSlotsProps> = ({
  totalSlots,
  playerInput,
  isWrong = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Subtitle instruction */}
      <View style={styles.headerRow}>
        <Text style={styles.subtext}>
          REVERSE SLOTS ({playerInput.length} / {totalSlots})
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slotsRow}
      >
        {Array.from({ length: totalSlots }).map((_, index) => {
          const filledObject = playerInput[index];
          const isNextSlot = index === playerInput.length;
          const isLast = index === totalSlots - 1;

          return (
            <React.Fragment key={index}>
              <View style={styles.slotWrapper}>
                {filledObject ? (
                  <ObjectCard
                    object={filledObject}
                    orderNumber={index + 1}
                    size={totalSlots > 5 ? 'sm' : 'md'}
                    isHighlighted={true}
                    isWrong={isWrong && index === playerInput.length - 1}
                  />
                ) : (
                  <ObjectCard
                    isEmptySlot={true}
                    orderNumber={index + 1}
                    size={totalSlots > 5 ? 'sm' : 'md'}
                    isHighlighted={isNextSlot}
                  />
                )}
              </View>

              {!isLast && (
                <View style={styles.arrowBox}>
                  <Text style={styles.arrow}>⟶</Text>
                </View>
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  headerRow: {
    marginBottom: 6,
  },
  subtext: {
    fontSize: 11,
    fontWeight: '800',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.5,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  slotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBox: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(77, 231, 255, 0.4)',
  },
});
