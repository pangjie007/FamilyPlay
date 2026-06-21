import { describe, expect, it } from 'vitest';
import { createBombPassState, passBomb, resolveBombPass } from './bombPass';

const players = ['p1', 'p2', 'p3'];

describe('Bomb Pass', () => {
  it('starts with the first holder and a deadline', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    expect(state.currentHolderId).toBe('p1');
    expect(state.deadlineAt).toBe(31000);
    expect(state.passCount).toBe(0);
    expect(state.status).toBe('active');
  });

  it('passes the bomb to the next player in order', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    const updated = passBomb(state, 'p1', 2000);

    expect(updated.currentHolderId).toBe('p2');
    expect(updated.passCount).toBe(1);
    expect(updated.lastPassedAt).toBe(2000);
  });

  it('ignores pass input from players who do not hold the bomb', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    const updated = passBomb(state, 'p2', 2000);

    expect(updated).toEqual(state);
  });

  it('resolves the holder as the challenge player after the deadline', () => {
    const state = passBomb(createBombPassState({ players, now: 1000, durationMs: 30000 }), 'p1', 2000);

    const resolved = resolveBombPass(state, 31000);

    expect(resolved.status).toBe('finished');
    expect(resolved.challengePlayerId).toBe('p2');
  });
});
