import { describe, expect, it } from 'vitest';
import { boostMonster, createMonsterRaceState, finishMonsterRace } from './monsterRace';

describe('Monster Race', () => {
  it('creates racers with zero progress', () => {
    const state = createMonsterRaceState(['p1', 'p2']);

    expect(state.racers).toEqual([
      { playerId: 'p1', progress: 0, taps: 0 },
      { playerId: 'p2', progress: 0, taps: 0 },
    ]);
    expect(state.status).toBe('active');
  });

  it('boosts a monster with capped progress', () => {
    const state = createMonsterRaceState(['p1', 'p2']);

    const boosted = boostMonster(state, 'p1', 35);
    const capped = boostMonster(boosted, 'p1', 90);

    expect(boosted.racers[0]).toEqual({ playerId: 'p1', progress: 35, taps: 1 });
    expect(capped.racers[0].progress).toBe(100);
    expect(capped.racers[0].taps).toBe(2);
  });

  it('finishes with rankings sorted by progress then taps', () => {
    const state = boostMonster(
      boostMonster(createMonsterRaceState(['p1', 'p2']), 'p2', 90),
      'p1',
      90,
    );

    const finished = finishMonsterRace(boostMonster(state, 'p1', 5));

    expect(finished.status).toBe('finished');
    expect(finished.rankings.map((ranking) => ranking.playerId)).toEqual(['p1', 'p2']);
  });
});
