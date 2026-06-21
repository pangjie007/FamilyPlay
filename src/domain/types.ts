export type RoomStatus = 'waiting' | 'ready' | 'playing' | 'paused' | 'finished' | 'settlement';
export type ConnectionStatus = 'online' | 'offline';
export type GameType = 'bomb-pass' | 'monster-race' | 'treasure-brawl' | 'airplane-battle';

export interface Player {
  playerId: string;
  nickname: string;
  avatar: string;
  color: string;
  connectionStatus: ConnectionStatus;
  ready: boolean;
  score: number;
  lastSeenAt: number;
}

export interface Room {
  roomId: string;
  status: RoomStatus;
  createdAt: number;
  updatedAt: number;
  players: Player[];
  currentGameId?: string;
}

export type GameSessionStatus = 'playing' | 'finished';

export interface GameSession {
  sessionId: string;
  gameType: GameType;
  status: GameSessionStatus;
  startedAt: number;
  endedAt?: number;
  players: Player[];
  state: Record<string, unknown>;
}
