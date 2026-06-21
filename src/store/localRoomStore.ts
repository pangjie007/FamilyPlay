import type { Room } from '../domain/types';

const keyForRoom = (roomId: string) => `family-play-room:${roomId}`;

export function saveRoom(room: Room): void {
  window.localStorage.setItem(keyForRoom(room.roomId), JSON.stringify(room));
}

export function loadRoom(roomId: string): Room | undefined {
  const raw = window.localStorage.getItem(keyForRoom(roomId));
  return raw ? (JSON.parse(raw) as Room) : undefined;
}
