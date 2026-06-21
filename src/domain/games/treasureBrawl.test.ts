import { describe, expect, it } from 'vitest';
import { createTreasureBrawlState, finishTreasureBrawl, revealTreasure } from './treasureBrawl';

describe('Treasure Brawl', () => {
  it('creates boxes and starts with the first player turn', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    expect(state.currentPlayerId).toBe('p1');
    expect(state.boxes[0].revealedBy).toBeUndefined();
    expect(state.scores).toEqual({ p1: 0, p2: 0 });
  });

  it('reveals a box for the current player and advances turn', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    const updated = revealTreasure(state, 'p1', 'b1');

    expect(updated.boxes[0].revealedBy).toBe('p1');
    expect(updated.scores.p1).toBe(5);
    expect(updated.currentPlayerId).toBe('p2');
  });

  it('rejects out-of-turn reveals and already revealed boxes', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    expect(revealTreasure(state, 'p2', 'b1')).toEqual(state);

    const revealed = revealTreasure(state, 'p1', 'b1');
    expect(revealTreasure(revealed, 'p2', 'b1')).toEqual(revealed);
  });

  it('finishes with rankings sorted by score', () => {
    const state = revealTreasure(
      revealTreasure(
        createTreasureBrawlState({
          players: ['p1', 'p2'],
          boxes: [
            { boxId: 'b1', kind: 'coins', value: 5 },
            { boxId: 'b2', kind: 'trap', value: -2 },
          ],
        }),
        'p1',
        'b1',
      ),
      'p2',
      'b2',
    );

    const finished = finishTreasureBrawl(state);

    expect(finished.status).toBe('finished');
    expect(finished.rankings.map((ranking) => ranking.playerId)).toEqual(['p1', 'p2']);
  });
});
