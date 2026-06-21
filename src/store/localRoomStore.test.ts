import { beforeEach, describe, expect, it } from 'vitest';
import { createRoom } from '../domain/room';
import { loadRoom, saveRoom } from './localRoomStore';

describe('local room store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads a room by id', () => {
    const room = createRoom({ now: 1000, code: 'FAMILY' });

    saveRoom(room);

    expect(loadRoom('FAMILY')).toEqual(room);
  });

  it('returns undefined for missing rooms', () => {
    expect(loadRoom('NONE')).toBeUndefined();
  });
});
