// ============================================================
// GameHub — Rock Paper Scissors Logic Tests
// ============================================================

import { getAIChoice, playRPSRound } from '../logic';
import type { Choice } from '../types';

describe('Rock Paper Scissors Logic', () => {
  describe('getAIChoice', () => {
    it('should return a valid choice', () => {
      const validChoices: Choice[] = ['rock', 'paper', 'scissors'];
      for (let i = 0; i < 50; i++) {
        const choice = getAIChoice();
        expect(validChoices).toContain(choice);
      }
    });

    it('should be somewhat random (not always the same)', () => {
      const choices = new Set<Choice>();
      for (let i = 0; i < 100; i++) {
        choices.add(getAIChoice());
      }
      expect(choices.size).toBeGreaterThan(1);
    });
  });

  describe('playRPSRound', () => {
    it('rock beats scissors', () => {
      const result = playRPSRound('rock', 'scissors');
      expect(result.outcome).toBe('WIN');
      expect(result.playerChoice).toBe('rock');
      expect(result.aiChoice).toBe('scissors');
    });

    it('scissors beats paper', () => {
      const result = playRPSRound('scissors', 'paper');
      expect(result.outcome).toBe('WIN');
    });

    it('paper beats rock', () => {
      const result = playRPSRound('paper', 'rock');
      expect(result.outcome).toBe('WIN');
    });

    it('scissors loses to rock', () => {
      const result = playRPSRound('scissors', 'rock');
      expect(result.outcome).toBe('LOSS');
    });

    it('paper loses to scissors', () => {
      const result = playRPSRound('paper', 'scissors');
      expect(result.outcome).toBe('LOSS');
    });

    it('rock loses to paper', () => {
      const result = playRPSRound('rock', 'paper');
      expect(result.outcome).toBe('LOSS');
    });

    it('same choices result in draw', () => {
      expect(playRPSRound('rock', 'rock').outcome).toBe('DRAW');
      expect(playRPSRound('paper', 'paper').outcome).toBe('DRAW');
      expect(playRPSRound('scissors', 'scissors').outcome).toBe('DRAW');
    });
  });
});
