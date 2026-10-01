// ============================================================
// REVERSE MIND — Sequence Row Component (Memory Phase)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { SequenceItem } from '../types';
import { ObjectCard } from './ObjectCard';
import { RMTheme } from '../theme';

interface SequenceRowProps {
  sequence: SequenceItem[];
  isFlipping?: boolean;
}

export const SequenceRow: React.FC<SequenceRowProps> = ({ sequence, isFlipping = false }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sequence.map((item, index) => {
          const isLast = index === sequence.length - 1;

          return (
            <React.Fragment key={item.uid}>
              <View style={styles.cardContainer}>
                <ObjectCard
                  object={item.object}
                  orderNumber={index + 1}
                  size={sequence.length > 5 ? 'sm' : 'md'}
                  isHighlighted={item.isHighlighted}
                />
              </View>

              {!isLast && (
                <View style={styles.arrowWrapper}>
                  <Text style={styles.arrowText}>{isFlipping ? '⟵' : '⟶'}</Text>
                </View>
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Helper Direction Text */}
      <View style={styles.directionBadge}>
        <Text style={styles.directionText}>
          {isFlipping ? 'FLIPPING SEQUENCE ORDER...' : 'ORDER: FIRST  ⟶  LAST'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrapper: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
  },
  directionBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(77, 231, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.3)',
  },
  directionText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.5,
  },
});
