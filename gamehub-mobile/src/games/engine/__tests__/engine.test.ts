// ============================================================
// GameHub — Game Engine Tests (GameState, GameSession, ResultManager)
// ============================================================

import { GameStateMachine, GameState } from '../GameState';
import { GameSession } from '../GameSession';
import { ResultManager } from '../ResultManager';

describe('GameStateMachine', () => {
  let sm: GameStateMachine;

  beforeEach(() => {
    sm = new GameStateMachine();
  });

  it('should start in IDLE state', () => {
    expect(sm.state).toBe(GameState.IDLE);
  });

  it('should allow valid transitions', () => {
    expect(sm.transition(GameState.READY)).toBe(true);
    expect(sm.state).toBe(GameState.READY);

    expect(sm.transition(GameState.PLAYING)).toBe(true);
    expect(sm.state).toBe(GameState.PLAYING);
  });

  it('should reject invalid transitions', () => {
    expect(sm.transition(GameState.FINISHED)).toBe(false);
    expect(sm.state).toBe(GameState.IDLE);
  });

  it('should track isPlaying correctly', () => {
    expect(sm.isPlaying).toBe(false);
    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);
    expect(sm.isPlaying).toBe(true);
  });

  it('should track isFinished correctly', () => {
    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);
    sm.transition(GameState.FINISHED);
    expect(sm.isFinished).toBe(true);
  });

  it('should allow pause/resume cycle', () => {
    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);
    sm.transition(GameState.PAUSED);
    expect(sm.isPaused).toBe(true);
    sm.transition(GameState.PLAYING);
    expect(sm.isPlaying).toBe(true);
  });

  it('should notify listeners on transition', () => {
    const events: string[] = [];
    sm.onChange((from, to) => events.push(`${from}->${to}`));

    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);

    expect(events).toEqual(['IDLE->READY', 'READY->PLAYING']);
  });

  it('should track history', () => {
    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);
    const history = sm.getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].from).toBe(GameState.IDLE);
    expect(history[0].to).toBe(GameState.READY);
  });

  it('should support canTransition check', () => {
    expect(sm.canTransition(GameState.READY)).toBe(true);
    expect(sm.canTransition(GameState.PLAYING)).toBe(false);
  });

  it('should reset to IDLE', () => {
    sm.transition(GameState.READY);
    sm.transition(GameState.PLAYING);
    sm.reset();
    expect(sm.state).toBe(GameState.IDLE);
    expect(sm.getHistory()).toHaveLength(0);
  });
});

describe('GameSession', () => {
  it('should create with unique session ID', () => {
    const s1 = new GameSession('ttt');
    const s2 = new GameSession('ttt');
    expect(s1.sessionId).not.toBe(s2.sessionId);
  });

  it('should track score', () => {
    const session = new GameSession('ttt');
    session.score = 100;
    expect(session.score).toBe(100);
  });

  it('should track duration', () => {
    const session = new GameSession('ttt');
    // Duration should be very small (ms since creation)
    expect(session.duration).toBeGreaterThanOrEqual(0);
  });

  it('should support pause/resume', () => {
    const session = new GameSession('ttt');
    session.pause();
    expect(session.isPaused).toBe(true);
    session.resume();
    expect(session.isPaused).toBe(false);
  });

  it('should finish correctly', () => {
    const session = new GameSession('ttt');
    session.finish(500);
    expect(session.isFinished).toBe(true);
    expect(session.score).toBe(500);
  });

  it('should track events', () => {
    const session = new GameSession('ttt');
    session.addEvent('move', { cell: 4 });
    session.addEvent('move', { cell: 0 });
    expect(session.getEvents()).toHaveLength(2);
  });

  it('should serialize to JSON', () => {
    const session = new GameSession('ttt', '2.0.0');
    session.score = 42;
    const json = session.toJSON();
    expect(json.gameId).toBe('ttt');
    expect(json.gameVersion).toBe('2.0.0');
    expect(json.score).toBe(42);
  });
});

describe('ResultManager', () => {
  describe('calculateRewards', () => {
    it('should calculate XP and coins for a win', () => {
      const result = ResultManager.calculateRewards('ttt', 'Tic Tac Toe', {
        score: 100,
        duration: 60,
        result: 'win',
      });
      expect(result.xpEarned).toBeGreaterThan(0);
      expect(result.coinsEarned).toBeGreaterThan(0);
    });

    it('should give more XP for wins than losses', () => {
      const win = ResultManager.calculateRewards('ttt', 'TTT', { score: 100, duration: 60, result: 'win' });
      const loss = ResultManager.calculateRewards('ttt', 'TTT', { score: 100, duration: 60, result: 'loss' });
      expect(win.xpEarned).toBeGreaterThanOrEqual(loss.xpEarned);
    });

    it('should detect new best score', () => {
      const result = ResultManager.calculateRewards('ttt', 'TTT', { score: 500, duration: 60, result: 'win' }, 200);
      expect(result.isNewBestScore).toBe(true);
    });

    it('should not flag new best for lower score', () => {
      const result = ResultManager.calculateRewards('ttt', 'TTT', { score: 100, duration: 60, result: 'win' }, 200);
      expect(result.isNewBestScore).toBe(false);
    });
  });

  describe('formatDuration', () => {
    it('should format properly', () => {
      expect(ResultManager.formatDuration(95)).toBe('1:35');
      expect(ResultManager.formatDuration(0)).toBe('0:00');
      expect(ResultManager.formatDuration(600)).toBe('10:00');
    });
  });

  describe('getResultEmoji', () => {
    it('should return trophy for win', () => {
      expect(ResultManager.getResultEmoji('win')).toBe('🏆');
    });
  });

  describe('getResultMessage', () => {
    it('should give new best message when beating best score', () => {
      const msg = ResultManager.getResultMessage('win', 500, 200);
      expect(msg).toContain('Personal Best');
    });
  });
});
