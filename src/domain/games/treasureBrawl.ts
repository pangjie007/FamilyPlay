export type TreasureKind = 'coins' | 'trap' | 'card';

export interface TreasureBox {
  boxId: string;
  kind: TreasureKind;
  value: number;
  revealedBy?: string;
}

export interface TreasureRanking {
  playerId: string;
  score: number;
}

export interface TreasureBrawlState {
  status: 'active' | 'finished';
  playerOrder: string[];
  currentPlayerId: string;
  turnIndex: number;
  boxes: TreasureBox[];
  scores: Record<string, number>;
  rankings: TreasureRanking[];
}

interface CreateTreasureBrawlInput {
  players: string[];
  boxes: TreasureBox[];
}

export function createTreasureBrawlState(input: CreateTreasureBrawlInput): TreasureBrawlState {
  if (input.players.length === 0) {
    throw new Error('Treasure Brawl requires at least one player.');
  }

  return {
    status: 'active',
    playerOrder: input.players,
    currentPlayerId: input.players[0],
    turnIndex: 0,
    boxes: input.boxes,
    scores: Object.fromEntries(input.players.map((playerId) => [playerId, 0])),
    rankings: [],
  };
}

export function revealTreasure(
  state: TreasureBrawlState,
  playerId: string,
  boxId: string,
): TreasureBrawlState {
  if (state.status !== 'active' || state.currentPlayerId !== playerId) {
    return state;
  }

  const box = state.boxes.find((candidate) => candidate.boxId === boxId);
  if (!box || box.revealedBy) {
    return state;
  }

  const nextTurnIndex = (state.turnIndex + 1) % state.playerOrder.length;

  return {
    ...state,
    turnIndex: nextTurnIndex,
    currentPlayerId: state.playerOrder[nextTurnIndex],
    boxes: state.boxes.map((candidate) =>
      candidate.boxId === boxId ? { ...candidate, revealedBy: playerId } : candidate,
    ),
    scores: {
      ...state.scores,
      [playerId]: state.scores[playerId] + box.value,
    },
  };
}

export function finishTreasureBrawl(state: TreasureBrawlState): TreasureBrawlState {
  const rankings = Object.entries(state.scores)
    .map(([playerId, score]) => ({ playerId, score }))
    .sort((a, b) => b.score - a.score);

  return {
    ...state,
    status: 'finished',
    rankings,
  };
}
