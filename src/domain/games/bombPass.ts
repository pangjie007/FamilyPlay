export interface BombPassState {
  playerOrder: string[];
  currentHolderId: string;
  deadlineAt: number;
  passCount: number;
  status: 'active' | 'finished';
  lastPassedAt?: number;
  challengePlayerId?: string;
}

interface CreateBombPassInput {
  players: string[];
  now: number;
  durationMs: number;
}

export function createBombPassState(input: CreateBombPassInput): BombPassState {
  if (input.players.length === 0) {
    throw new Error('Bomb Pass requires at least one player.');
  }

  return {
    playerOrder: input.players,
    currentHolderId: input.players[0],
    deadlineAt: input.now + input.durationMs,
    passCount: 0,
    status: 'active',
  };
}

export function passBomb(state: BombPassState, playerId: string, now: number): BombPassState {
  if (state.status !== 'active' || state.currentHolderId !== playerId) {
    return state;
  }

  const currentIndex = state.playerOrder.indexOf(playerId);
  const nextIndex = (currentIndex + 1) % state.playerOrder.length;

  return {
    ...state,
    currentHolderId: state.playerOrder[nextIndex],
    passCount: state.passCount + 1,
    lastPassedAt: now,
  };
}

export function resolveBombPass(state: BombPassState, now: number): BombPassState {
  if (state.status === 'finished' || now < state.deadlineAt) {
    return state;
  }

  return {
    ...state,
    status: 'finished',
    challengePlayerId: state.currentHolderId,
  };
}
