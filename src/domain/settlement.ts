import type { GameType } from './types';

export interface ScoreInput {
  playerId: string;
  score: number;
}

export interface Ranking {
  playerId: string;
  score: number;
  rank: number;
}

export interface Settlement {
  rankings: Ranking[];
  stars: Record<string, number>;
  titles: Record<string, string>;
}

const titleByGame: Record<GameType, string> = {
  'bomb-pass': '气氛担当',
  'monster-race': '今日飞毛腿',
  'treasure-brawl': '幸运宝箱王',
  'airplane-battle': '天空守护者',
};

export function createSettlement(input: { gameType: GameType; scores: ScoreInput[] }): Settlement {
  const rankings = [...input.scores]
    .sort((a, b) => b.score - a.score)
    .map((score, index) => ({ ...score, rank: index + 1 }));

  const stars = Object.fromEntries(rankings.map((ranking) => [ranking.playerId, ranking.rank === 1 ? 3 : 1]));
  const titles = rankings[0] ? { [rankings[0].playerId]: titleByGame[input.gameType] } : {};

  return { rankings, stars, titles };
}
