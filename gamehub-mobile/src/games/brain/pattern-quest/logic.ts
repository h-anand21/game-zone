// ============================================================
// PATTERN QUEST — Game Logic Bridge
// ============================================================

import { generatePatternPuzzle } from './utils/patternEngine';
import type { PatternQuestPuzzle, PQDifficulty, PQGameMode } from './types';

export function createPatternQuestChallenge(
  difficulty: PQDifficulty = 'EASY',
  mode: PQGameMode = 'DISCOVER'
): PatternQuestPuzzle {
  return generatePatternPuzzle(difficulty, mode);
}
