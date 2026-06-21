import type { Player, Room } from './types';

interface CreateRoomInput {
  now: number;
  code: string;
}

interface JoinRoomInput {
  playerId: string;
  nickname: string;
  avatar: string;
  color: string;
  now: number;
}

export function createRoom(input: CreateRoomInput): Room {
  return {
    roomId: input.code,
    status: 'waiting',
    createdAt: input.now,
    updatedAt: input.now,
    players: [],
  };
}

export function joinRoom(room: Room, input: JoinRoomInput): Room {
  const existingPlayer = room.players.find((player) => player.playerId === input.playerId);

  if (existingPlayer) {
    return {
      ...room,
      updatedAt: input.now,
      players: room.players.map((player) =>
        player.playerId === input.playerId
          ? {
              ...player,
              nickname: input.nickname,
              avatar: input.avatar,
              color: input.color,
              connectionStatus: 'online',
              lastSeenAt: input.now,
            }
          : player,
      ),
    };
  }

  const player: Player = {
    playerId: input.playerId,
    nickname: input.nickname,
    avatar: input.avatar,
    color: input.color,
    connectionStatus: 'online',
    ready: false,
    score: 0,
    lastSeenAt: input.now,
  };

  return {
    ...room,
    updatedAt: input.now,
    players: [...room.players, player],
  };
}

export function leaveRoom(room: Room, playerId: string, now: number): Room {
  return {
    ...room,
    updatedAt: now,
    players: room.players.map((player) =>
      player.playerId === playerId
        ? { ...player, connectionStatus: 'offline', lastSeenAt: now }
        : player,
    ),
  };
}

export function setPlayerReady(room: Room, playerId: string, ready: boolean): Room {
  return {
    ...room,
    updatedAt: Date.now(),
    players: room.players.map((player) =>
      player.playerId === playerId ? { ...player, ready } : player,
    ),
  };
}
