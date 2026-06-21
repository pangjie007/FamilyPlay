export interface RacerState {
  playerId: string;
  progress: number;
  taps: number;
}

export interface MonsterRaceState {
  status: 'active' | 'finished';
  racers: RacerState[];
  rankings: RacerState[];
}

export function createMonsterRaceState(playerIds: string[]): MonsterRaceState {
  return {
    status: 'active',
    racers: playerIds.map((playerId) => ({ playerId, progress: 0, taps: 0 })),
    rankings: [],
  };
}

export function boostMonster(state: MonsterRaceState, playerId: string, amount: number): MonsterRaceState {
  if (state.status !== 'active') {
    return state;
  }

  return {
    ...state,
    racers: state.racers.map((racer) =>
      racer.playerId === playerId
        ? {
            ...racer,
            progress: Math.min(100, racer.progress + amount),
            taps: racer.taps + 1,
          }
        : racer,
    ),
  };
}

export function finishMonsterRace(state: MonsterRaceState): MonsterRaceState {
  const rankings = [...state.racers].sort((a, b) => b.progress - a.progress || b.taps - a.taps);

  return {
    ...state,
    status: 'finished',
    rankings,
  };
}
