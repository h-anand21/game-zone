// ============================================================
// REVERSE MIND — Mind Shift Rules Catalog & Modifiers
// ============================================================

import type { MindShiftRule } from '../types';
import { RMTheme } from '../theme';

export const MIND_SHIFT_RULES: Record<string, MindShiftRule> = {
  none: {
    id: 'none',
    title: 'CLASSIC REVERSE',
    subtitle: 'Standard Order Inversion',
    instruction: 'Memorize the order, then tap every item in REVERSE!',
    ruleTag: 'STANDARD',
    badgeColor: RMTheme.colors.cyanNeon,
    description: 'Reverse the full sequence from last to first.',
  },
  ignore_red: {
    id: 'ignore_red',
    title: 'MIND SHIFT: IGNORE RED',
    subtitle: 'Color Suppression Rule',
    instruction: 'Tap in REVERSE order, but DO NOT tap any RED objects! Skip them completely.',
    ruleTag: 'REVERSE + NO RED',
    badgeColor: RMTheme.colors.coralRed,
    description: 'Any red object in the sequence must be skipped during reverse input.',
  },
  ignore_category: {
    id: 'ignore_category',
    title: 'MIND SHIFT: NO FOOD',
    subtitle: 'Category Filter Rule',
    instruction: 'Tap in REVERSE order, but SKIP all FOOD items!',
    ruleTag: 'REVERSE - FOOD',
    badgeColor: RMTheme.colors.orangeNeon,
    ignoredCategory: 'food',
    description: 'Food objects must be bypassed when reversing the sequence.',
  },
  reverse_only_highlighted: {
    id: 'reverse_only_highlighted',
    title: 'MIND SHIFT: HIGHLIGHTS ONLY',
    subtitle: 'Selective Attention Rule',
    instruction: 'Only reverse the glowing HIGHLIGHTED items! Ignore normal items.',
    ruleTag: 'GLOW ONLY',
    badgeColor: RMTheme.colors.primaryGold,
    description: 'Only sequence items marked with a golden glow are entered in reverse.',
  },
};
