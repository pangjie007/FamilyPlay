export type TelemetryType =
  | 'room_created'
  | 'player_joined'
  | 'game_started'
  | 'game_finished'
  | 'player_left'
  | 'play_again';

export interface TelemetryEvent {
  type: TelemetryType;
  payload: Record<string, string | number | boolean>;
  timestamp: number;
}

export interface TelemetrySummary {
  roomsCreated: number;
  joins: number;
  gamesStarted: number;
  gamesFinished: number;
  playAgainCount: number;
}

export function createTelemetryEvent(
  type: TelemetryType,
  payload: TelemetryEvent['payload'],
  timestamp: number,
): TelemetryEvent {
  return { type, payload, timestamp };
}

export function summarizeTelemetry(events: TelemetryEvent[]): TelemetrySummary {
  return {
    roomsCreated: events.filter((event) => event.type === 'room_created').length,
    joins: events.filter((event) => event.type === 'player_joined').length,
    gamesStarted: events.filter((event) => event.type === 'game_started').length,
    gamesFinished: events.filter((event) => event.type === 'game_finished').length,
    playAgainCount: events.filter((event) => event.type === 'play_again').length,
  };
}
