import { describe, expect, it } from 'vitest';
import { finishGame, startGame } from './gameHost';
import { createRoom, joinRoom } from './room';

function roomWithPlayers() {
  return joinRoom(
    joinRoom(createRoom({ now: 1000, code: 'FAMILY' }), {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    }),
    {
      playerId: 'p2',
      nickname: '乐乐',
      avatar: 'rocket',
      color: '#4c7dff',
      now: 1300,
    },
  );
}

describe('game host lifecycle', () => {
  it('starts a game session and moves the room to playing', () => {
    const result = startGame(roomWithPlayers(), {
      gameType: 'bomb-pass',
      sessionId: 'game-1',
      now: 2000,
    });

    expect(result.room.status).toBe('playing');
    expect(result.room.currentGameId).toBe('game-1');
    expect(result.session).toMatchObject({
      sessionId: 'game-1',
      gameType: 'bomb-pass',
      status: 'playing',
      startedAt: 2000,
    });
    expect(result.session.players.map((player) => player.playerId)).toEqual(['p1', 'p2']);
  });

  it('rejects starting a game with fewer than two online players', () => {
    const room = joinRoom(createRoom({ now: 1000, code: 'FAMILY' }), {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    });

    expect(() =>
      startGame(room, {
        gameType: 'bomb-pass',
        sessionId: 'game-1',
        now: 2000,
      }),
    ).toThrow('At least two online players are required to start a game.');
  });

  it('finishes a game and moves the room to settlement', () => {
    const started = startGame(roomWithPlayers(), {
      gameType: 'bomb-pass',
      sessionId: 'game-1',
      now: 2000,
    });

    const finished = finishGame(started.room, started.session, 5000);

    expect(finished.room.status).toBe('settlement');
    expect(finished.session.status).toBe('finished');
    expect(finished.session.endedAt).toBe(5000);
  });
});
