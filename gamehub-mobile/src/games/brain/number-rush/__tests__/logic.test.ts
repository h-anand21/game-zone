// ============================================================
// Number Rush — Pure Logic Unit Tests
// ============================================================

import {
  generateAnimalCountQuestion,
  generateEmojiCountQuestion,
  generateQuickRushQuestion,
  generateNumberBoxQuestion,
  generateMixedRushQuestion,
  generateQuestionForMode,
} from '../logic';

describe('Number Rush — Challenge Generators', () => {
  describe('Animal Count Generator', () => {
    it('should generate valid animal count question for Easy difficulty', () => {
      const q = generateAnimalCountQuestion('easy', 1);
      expect(q.mode).toBe('animal-count');
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.animalData).toBeDefined();

      const targets = q.animalData!.animals.filter((a) => a.isTarget);
      expect(targets.length).toBe(q.correctAnswer);
      expect(q.animalData!.targetCount).toBe(q.correctAnswer);
    });

    it('should increase animal counts for Hard difficulty', () => {
      const q = generateAnimalCountQuestion('hard', 2);
      expect(q.animalData!.animals.length).toBeGreaterThanOrEqual(11);
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
    });
  });

  describe('Emoji Count Generator', () => {
    it('should generate valid emoji count question with matching target count', () => {
      const q = generateEmojiCountQuestion('easy', 1);
      expect(q.mode).toBe('emoji-count');
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.emojiData).toBeDefined();

      const counted = q.emojiData!.items.filter((item) => item.isTarget).length;
      expect(counted).toBe(q.correctAnswer);
      expect(q.emojiData!.targetCount).toBe(q.correctAnswer);
    });
  });

  describe('Quick Rush Generator', () => {
    it('should generate valid mental math or series questions', () => {
      const q = generateQuickRushQuestion('easy', 1);
      expect(q.mode).toBe('quick-rush');
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(typeof q.correctAnswer).toBe('number');
      expect(q.questionText.length).toBeGreaterThan(0);
    });
  });

  describe('Number Box Matrix Generator', () => {
    it('should generate 3x3 grid with exactly one mystery tile', () => {
      const q = generateNumberBoxQuestion('easy', 1);
      expect(q.mode).toBe('number-box');
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.numberBoxData).toBeDefined();
      expect(q.numberBoxData!.grid).toHaveLength(9);

      const missingTiles = q.numberBoxData!.grid.filter((c) => c.val === null);
      expect(missingTiles).toHaveLength(1);
      expect(missingTiles[0].isTarget).toBe(true);
    });
  });

  describe('Mixed Rush & Mode Selector', () => {
    it('should generate mixed rush questions across diverse modes', () => {
      const q = generateMixedRushQuestion('medium', 3);
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.badgeText).toContain('Mixed Rush');
    });

    it('should route mode ids appropriately in generateQuestionForMode', () => {
      const ac = generateQuestionForMode('animal-count', 'easy', 1);
      expect(ac.mode).toBe('animal-count');

      const ec = generateQuestionForMode('emoji-count', 'easy', 1);
      expect(ec.mode).toBe('emoji-count');

      const nb = generateQuestionForMode('number-box', 'easy', 1);
      expect(nb.mode).toBe('number-box');

      const qr = generateQuestionForMode('quick-rush', 'easy', 1);
      expect(qr.mode).toBe('quick-rush');
    });
  });
});
