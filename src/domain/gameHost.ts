import type { GameSession, GameType, Room } from './types';

interface StartGameInput {
  gameType: GameType;
  sessionId: string;
  now: number;
}

export function startGame(room: Room, input: StartGameInput): { room: Room; session: GameSession } {
  const onlinePlayers = room.players.filter((player) => player.connectionStatus === 'online');

  if (onlinePlayers.length < 2) {
    throw new Error('At least two online players are required to start a game.');
  }

  const session: GameSession = {
    sessionId: input.sessionId,
    gameType: input.gameType,
    status: 'playing',
    startedAt: input.now,
    players: onlinePlayers,
    state: {},
  };

  return {
    room: {
      ...room,
      status: 'playing',
      currentGameId: input.sessionId,
      updatedAt: input.now,
    },
    session,
  };
}

export function finishGame(
  room: Room,
  session: GameSession,
  now: number,
): { room: Room; session: GameSession } {
  return {
    room: {
      ...room,
      status: 'settlement',
      updatedAt: now,
    },
    session: {
      ...session,
      status: 'finished',
      endedAt: now,
    },
  };
}
