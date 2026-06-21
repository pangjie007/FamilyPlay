import { describe, expect, it } from 'vitest';
import { createTelemetryEvent, summarizeTelemetry } from './telemetry';

describe('telemetry', () => {
  it('creates timestamped events and summarizes play sessions', () => {
    const events = [
      createTelemetryEvent('room_created', { roomId: 'FAMILY' }, 1000),
      createTelemetryEvent('player_joined', { roomId: 'FAMILY', playerId: 'p1' }, 1200),
      createTelemetryEvent('game_started', { roomId: 'FAMILY', gameType: 'bomb-pass' }, 2000),
      createTelemetryEvent('game_finished', { roomId: 'FAMILY', gameType: 'bomb-pass' }, 5000),
      createTelemetryEvent('play_again', { roomId: 'FAMILY' }, 5200),
    ];

    expect(events[0]).toMatchObject({ type: 'room_created', timestamp: 1000 });
    expect(summarizeTelemetry(events)).toEqual({
      roomsCreated: 1,
      joins: 1,
      gamesStarted: 1,
      gamesFinished: 1,
      playAgainCount: 1,
    });
  });
});
