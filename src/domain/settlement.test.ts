import { describe, expect, it } from 'vitest';
import { createSettlement } from './settlement';

describe('settlement', () => {
  it('awards rankings, stars, and titles', () => {
    const settlement = createSettlement({
      gameType: 'monster-race',
      scores: [
        { playerId: 'p1', score: 80 },
        { playerId: 'p2', score: 100 },
      ],
    });

    expect(settlement.rankings.map((ranking) => ranking.playerId)).toEqual(['p2', 'p1']);
    expect(settlement.rankings[0].rank).toBe(1);
    expect(settlement.stars).toEqual({ p2: 3, p1: 1 });
    expect(settlement.titles.p2).toBe('今日飞毛腿');
  });
});
