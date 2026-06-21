import { describe, expect, it } from 'vitest';
import { createRoom, joinRoom, leaveRoom, setPlayerReady } from './room';

describe('room lifecycle', () => {
  it('creates a waiting room with a six character code', () => {
    const room = createRoom({ now: 1000, code: 'A1B2C3' });

    expect(room.roomId).toBe('A1B2C3');
    expect(room.status).toBe('waiting');
    expect(room.players).toEqual([]);
    expect(room.createdAt).toBe(1000);
  });

  it('adds players with nickname, avatar, and color', () => {
    const room = createRoom({ now: 1000, code: 'FAMILY' });

    const updated = joinRoom(room, {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    });

    expect(updated.players).toHaveLength(1);
    expect(updated.players[0]).toMatchObject({
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      connectionStatus: 'online',
      ready: false,
      score: 0,
    });
  });

  it('marks an existing player online instead of duplicating them', () => {
    const room = joinRoom(createRoom({ now: 1000, code: 'FAMILY' }), {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    });

    const updated = joinRoom(room, {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 2000,
    });

    expect(updated.players).toHaveLength(1);
    expect(updated.players[0].connectionStatus).toBe('online');
    expect(updated.players[0].lastSeenAt).toBe(2000);
  });

  it('keeps an offline player in the room when they leave', () => {
    const room = joinRoom(createRoom({ now: 1000, code: 'FAMILY' }), {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    });

    const updated = leaveRoom(room, 'p1', 3000);

    expect(updated.players[0].connectionStatus).toBe('offline');
    expect(updated.players[0].lastSeenAt).toBe(3000);
  });

  it('sets ready status without mutating the original room', () => {
    const room = joinRoom(createRoom({ now: 1000, code: 'FAMILY' }), {
      playerId: 'p1',
      nickname: '豆豆',
      avatar: 'dragon',
      color: '#ff7a3d',
      now: 1200,
    });

    const updated = setPlayerReady(room, 'p1', true);

    expect(room.players[0].ready).toBe(false);
    expect(updated.players[0].ready).toBe(true);
  });
});
