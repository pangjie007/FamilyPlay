# First Iteration MVP Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local web MVP that simulates the smart-screen host and phone/tablet controllers for the first iteration family-play experience.

**Architecture:** Use a Vite + React + TypeScript single-page app with two routes: `/screen` for the smart-screen host and `/controller` for mobile controllers. Keep the game and room logic in pure TypeScript modules tested with Vitest, and use a browser `localStorage` room store for the first runnable prototype so multiple tabs can simulate multiple devices without a backend.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS modules/plain CSS, browser localStorage.

---

## File Structure

- `package.json`: project scripts and dependencies.
- `index.html`: Vite app entry.
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.config.ts`: TypeScript, Vite, and test configuration.
- `src/main.tsx`: React bootstrapping.
- `src/App.tsx`: route selection for `/screen` and `/controller`.
- `src/domain/types.ts`: shared room, player, game, input, settlement, and telemetry types.
- `src/domain/room.ts`: pure room creation, joining, leaving, and player update functions.
- `src/domain/gameHost.ts`: pure game lifecycle and dispatch logic.
- `src/domain/games/bombPass.ts`: Bomb Pass game logic.
- `src/domain/games/monsterRace.ts`: Monster Race game logic.
- `src/domain/games/treasureBrawl.ts`: Treasure Brawl game logic.
- `src/domain/settlement.ts`: shared settlement and reward calculation.
- `src/domain/telemetry.ts`: local telemetry event creation and aggregation.
- `src/store/localRoomStore.ts`: localStorage-backed room persistence and cross-tab sync.
- `src/ui/screen/ScreenApp.tsx`: smart-screen host UI.
- `src/ui/controller/ControllerApp.tsx`: mobile controller UI.
- `src/ui/components/*.tsx`: reusable lobby, player, game, and settlement components.
- `src/styles.css`: responsive visual styling for TV and mobile views.
- `src/domain/**/*.test.ts`: domain tests.
- `src/ui/**/*.test.tsx`: UI tests.

## Task 1: Scaffold Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create project configuration**

Create `package.json`:

```json
{
  "name": "family-play",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^3.0.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Family Play</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
```

Create `vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 2: Create minimal app shell**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export function App() {
  const path = window.location.pathname;
  const mode = path.includes('controller') ? 'controller' : 'screen';

  return (
    <main className={`app app-${mode}`}>
      <h1>{mode === 'screen' ? '家庭派对智慧屏' : '手机控制器'}</h1>
      <p>Family Play MVP is bootstrapped.</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #241f2b;
  background: #f7fbff;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app {
  min-height: 100vh;
  padding: 32px;
}

.app-screen {
  background: linear-gradient(135deg, #fff7e8, #eaf4ff);
}

.app-controller {
  background: #10131d;
  color: #fff;
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Verify build and tests**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

Run: `npm test`

Expected: Vitest runs with no test files or reports no tests found only if Vitest exits successfully. If Vitest fails because no test files exist, add `src/test/setup.ts` with `import '@testing-library/jest-dom/vitest';` and add the first test in Task 2 before running `npm test`.

- [ ] **Step 5: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.config.ts src/main.tsx src/App.tsx src/styles.css
git commit -m "chore: scaffold family play web app"
```

## Task 2: Domain Types and Room Lifecycle

**Files:**
- Create: `src/test/setup.ts`
- Create: `src/domain/types.ts`
- Create: `src/domain/room.ts`
- Test: `src/domain/room.test.ts`

- [ ] **Step 1: Write failing room tests**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `src/domain/room.test.ts`:

```ts
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
```

- [ ] **Step 2: Run room tests and verify RED**

Run: `npm test -- src/domain/room.test.ts`

Expected: FAIL because `src/domain/room.ts` does not exist.

- [ ] **Step 3: Implement domain types and room functions**

Create `src/domain/types.ts`:

```ts
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
```

Create `src/domain/room.ts`:

```ts
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
```

- [ ] **Step 4: Run room tests and verify GREEN**

Run: `npm test -- src/domain/room.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit room lifecycle**

Run:

```bash
git add src/test/setup.ts src/domain/types.ts src/domain/room.ts src/domain/room.test.ts vitest.config.ts
git commit -m "feat: add room lifecycle domain"
```

## Task 3: Game Host Lifecycle

**Files:**
- Modify: `src/domain/types.ts`
- Create: `src/domain/gameHost.ts`
- Test: `src/domain/gameHost.test.ts`

- [ ] **Step 1: Write failing game host tests**

Create `src/domain/gameHost.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createRoom, joinRoom } from './room';
import { finishGame, startGame } from './gameHost';

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
```

- [ ] **Step 2: Run game host tests and verify RED**

Run: `npm test -- src/domain/gameHost.test.ts`

Expected: FAIL because `src/domain/gameHost.ts` does not exist.

- [ ] **Step 3: Add game session types**

Modify `src/domain/types.ts` to include:

```ts
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
```

- [ ] **Step 4: Implement game host**

Create `src/domain/gameHost.ts`:

```ts
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
```

- [ ] **Step 5: Run game host tests and verify GREEN**

Run: `npm test -- src/domain/gameHost.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit game host lifecycle**

Run:

```bash
git add src/domain/types.ts src/domain/gameHost.ts src/domain/gameHost.test.ts
git commit -m "feat: add game host lifecycle"
```

## Task 4: Bomb Pass Game Logic

**Files:**
- Create: `src/domain/games/bombPass.ts`
- Test: `src/domain/games/bombPass.test.ts`

- [ ] **Step 1: Write failing Bomb Pass tests**

Create `src/domain/games/bombPass.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createBombPassState, passBomb, resolveBombPass } from './bombPass';

const players = ['p1', 'p2', 'p3'];

describe('Bomb Pass', () => {
  it('starts with the first holder and a deadline', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    expect(state.currentHolderId).toBe('p1');
    expect(state.deadlineAt).toBe(31000);
    expect(state.passCount).toBe(0);
    expect(state.status).toBe('active');
  });

  it('passes the bomb to the next player in order', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    const updated = passBomb(state, 'p1', 2000);

    expect(updated.currentHolderId).toBe('p2');
    expect(updated.passCount).toBe(1);
    expect(updated.lastPassedAt).toBe(2000);
  });

  it('ignores pass input from players who do not hold the bomb', () => {
    const state = createBombPassState({ players, now: 1000, durationMs: 30000 });

    const updated = passBomb(state, 'p2', 2000);

    expect(updated).toEqual(state);
  });

  it('resolves the holder as the challenge player after the deadline', () => {
    const state = passBomb(createBombPassState({ players, now: 1000, durationMs: 30000 }), 'p1', 2000);

    const resolved = resolveBombPass(state, 31000);

    expect(resolved.status).toBe('finished');
    expect(resolved.challengePlayerId).toBe('p2');
  });
});
```

- [ ] **Step 2: Run Bomb Pass tests and verify RED**

Run: `npm test -- src/domain/games/bombPass.test.ts`

Expected: FAIL because `bombPass.ts` does not exist.

- [ ] **Step 3: Implement Bomb Pass**

Create `src/domain/games/bombPass.ts`:

```ts
export interface BombPassState {
  playerOrder: string[];
  currentHolderId: string;
  deadlineAt: number;
  passCount: number;
  status: 'active' | 'finished';
  lastPassedAt?: number;
  challengePlayerId?: string;
}

interface CreateBombPassInput {
  players: string[];
  now: number;
  durationMs: number;
}

export function createBombPassState(input: CreateBombPassInput): BombPassState {
  if (input.players.length === 0) {
    throw new Error('Bomb Pass requires at least one player.');
  }

  return {
    playerOrder: input.players,
    currentHolderId: input.players[0],
    deadlineAt: input.now + input.durationMs,
    passCount: 0,
    status: 'active',
  };
}

export function passBomb(state: BombPassState, playerId: string, now: number): BombPassState {
  if (state.status !== 'active' || state.currentHolderId !== playerId) {
    return state;
  }

  const currentIndex = state.playerOrder.indexOf(playerId);
  const nextIndex = (currentIndex + 1) % state.playerOrder.length;

  return {
    ...state,
    currentHolderId: state.playerOrder[nextIndex],
    passCount: state.passCount + 1,
    lastPassedAt: now,
  };
}

export function resolveBombPass(state: BombPassState, now: number): BombPassState {
  if (state.status === 'finished' || now < state.deadlineAt) {
    return state;
  }

  return {
    ...state,
    status: 'finished',
    challengePlayerId: state.currentHolderId,
  };
}
```

- [ ] **Step 4: Run Bomb Pass tests and verify GREEN**

Run: `npm test -- src/domain/games/bombPass.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Bomb Pass**

Run:

```bash
git add src/domain/games/bombPass.ts src/domain/games/bombPass.test.ts
git commit -m "feat: add bomb pass game logic"
```

## Task 5: Monster Race Game Logic

**Files:**
- Create: `src/domain/games/monsterRace.ts`
- Test: `src/domain/games/monsterRace.test.ts`

- [ ] **Step 1: Write failing Monster Race tests**

Create `src/domain/games/monsterRace.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createMonsterRaceState, boostMonster, finishMonsterRace } from './monsterRace';

describe('Monster Race', () => {
  it('creates racers with zero progress', () => {
    const state = createMonsterRaceState(['p1', 'p2']);

    expect(state.racers).toEqual([
      { playerId: 'p1', progress: 0, taps: 0 },
      { playerId: 'p2', progress: 0, taps: 0 },
    ]);
    expect(state.status).toBe('active');
  });

  it('boosts a monster with capped progress', () => {
    const state = createMonsterRaceState(['p1', 'p2']);

    const boosted = boostMonster(state, 'p1', 35);
    const capped = boostMonster(boosted, 'p1', 90);

    expect(boosted.racers[0]).toEqual({ playerId: 'p1', progress: 35, taps: 1 });
    expect(capped.racers[0].progress).toBe(100);
    expect(capped.racers[0].taps).toBe(2);
  });

  it('finishes with rankings sorted by progress then taps', () => {
    const state = boostMonster(boostMonster(createMonsterRaceState(['p1', 'p2']), 'p2', 90), 'p1', 90);

    const finished = finishMonsterRace(boostMonster(state, 'p1', 5));

    expect(finished.status).toBe('finished');
    expect(finished.rankings.map((ranking) => ranking.playerId)).toEqual(['p1', 'p2']);
  });
});
```

- [ ] **Step 2: Run Monster Race tests and verify RED**

Run: `npm test -- src/domain/games/monsterRace.test.ts`

Expected: FAIL because `monsterRace.ts` does not exist.

- [ ] **Step 3: Implement Monster Race**

Create `src/domain/games/monsterRace.ts`:

```ts
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
```

- [ ] **Step 4: Run Monster Race tests and verify GREEN**

Run: `npm test -- src/domain/games/monsterRace.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Monster Race**

Run:

```bash
git add src/domain/games/monsterRace.ts src/domain/games/monsterRace.test.ts
git commit -m "feat: add monster race game logic"
```

## Task 6: Treasure Brawl Game Logic

**Files:**
- Create: `src/domain/games/treasureBrawl.ts`
- Test: `src/domain/games/treasureBrawl.test.ts`

- [ ] **Step 1: Write failing Treasure Brawl tests**

Create `src/domain/games/treasureBrawl.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createTreasureBrawlState, finishTreasureBrawl, revealTreasure } from './treasureBrawl';

describe('Treasure Brawl', () => {
  it('creates boxes and starts with the first player turn', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    expect(state.currentPlayerId).toBe('p1');
    expect(state.boxes[0].revealedBy).toBeUndefined();
    expect(state.scores).toEqual({ p1: 0, p2: 0 });
  });

  it('reveals a box for the current player and advances turn', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    const updated = revealTreasure(state, 'p1', 'b1');

    expect(updated.boxes[0].revealedBy).toBe('p1');
    expect(updated.scores.p1).toBe(5);
    expect(updated.currentPlayerId).toBe('p2');
  });

  it('rejects out-of-turn reveals and already revealed boxes', () => {
    const state = createTreasureBrawlState({
      players: ['p1', 'p2'],
      boxes: [
        { boxId: 'b1', kind: 'coins', value: 5 },
        { boxId: 'b2', kind: 'trap', value: -2 },
      ],
    });

    expect(revealTreasure(state, 'p2', 'b1')).toEqual(state);

    const revealed = revealTreasure(state, 'p1', 'b1');
    expect(revealTreasure(revealed, 'p2', 'b1')).toEqual(revealed);
  });

  it('finishes with rankings sorted by score', () => {
    const state = revealTreasure(
      revealTreasure(
        createTreasureBrawlState({
          players: ['p1', 'p2'],
          boxes: [
            { boxId: 'b1', kind: 'coins', value: 5 },
            { boxId: 'b2', kind: 'trap', value: -2 },
          ],
        }),
        'p1',
        'b1',
      ),
      'p2',
      'b2',
    );

    const finished = finishTreasureBrawl(state);

    expect(finished.status).toBe('finished');
    expect(finished.rankings.map((ranking) => ranking.playerId)).toEqual(['p1', 'p2']);
  });
});
```

- [ ] **Step 2: Run Treasure Brawl tests and verify RED**

Run: `npm test -- src/domain/games/treasureBrawl.test.ts`

Expected: FAIL because `treasureBrawl.ts` does not exist.

- [ ] **Step 3: Implement Treasure Brawl**

Create `src/domain/games/treasureBrawl.ts`:

```ts
export type TreasureKind = 'coins' | 'trap' | 'card';

export interface TreasureBox {
  boxId: string;
  kind: TreasureKind;
  value: number;
  revealedBy?: string;
}

export interface TreasureRanking {
  playerId: string;
  score: number;
}

export interface TreasureBrawlState {
  status: 'active' | 'finished';
  playerOrder: string[];
  currentPlayerId: string;
  turnIndex: number;
  boxes: TreasureBox[];
  scores: Record<string, number>;
  rankings: TreasureRanking[];
}

interface CreateTreasureBrawlInput {
  players: string[];
  boxes: TreasureBox[];
}

export function createTreasureBrawlState(input: CreateTreasureBrawlInput): TreasureBrawlState {
  if (input.players.length === 0) {
    throw new Error('Treasure Brawl requires at least one player.');
  }

  return {
    status: 'active',
    playerOrder: input.players,
    currentPlayerId: input.players[0],
    turnIndex: 0,
    boxes: input.boxes,
    scores: Object.fromEntries(input.players.map((playerId) => [playerId, 0])),
    rankings: [],
  };
}

export function revealTreasure(
  state: TreasureBrawlState,
  playerId: string,
  boxId: string,
): TreasureBrawlState {
  if (state.status !== 'active' || state.currentPlayerId !== playerId) {
    return state;
  }

  const box = state.boxes.find((candidate) => candidate.boxId === boxId);
  if (!box || box.revealedBy) {
    return state;
  }

  const nextTurnIndex = (state.turnIndex + 1) % state.playerOrder.length;

  return {
    ...state,
    turnIndex: nextTurnIndex,
    currentPlayerId: state.playerOrder[nextTurnIndex],
    boxes: state.boxes.map((candidate) =>
      candidate.boxId === boxId ? { ...candidate, revealedBy: playerId } : candidate,
    ),
    scores: {
      ...state.scores,
      [playerId]: state.scores[playerId] + box.value,
    },
  };
}

export function finishTreasureBrawl(state: TreasureBrawlState): TreasureBrawlState {
  const rankings = Object.entries(state.scores)
    .map(([playerId, score]) => ({ playerId, score }))
    .sort((a, b) => b.score - a.score);

  return {
    ...state,
    status: 'finished',
    rankings,
  };
}
```

- [ ] **Step 4: Run Treasure Brawl tests and verify GREEN**

Run: `npm test -- src/domain/games/treasureBrawl.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Treasure Brawl**

Run:

```bash
git add src/domain/games/treasureBrawl.ts src/domain/games/treasureBrawl.test.ts
git commit -m "feat: add treasure brawl game logic"
```

## Task 7: Settlement and Telemetry

**Files:**
- Create: `src/domain/settlement.ts`
- Create: `src/domain/telemetry.ts`
- Test: `src/domain/settlement.test.ts`
- Test: `src/domain/telemetry.test.ts`

- [ ] **Step 1: Write failing settlement tests**

Create `src/domain/settlement.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createSettlement } from './settlement';

describe('settlement', () => {
  it('awards rankings, stars, and titles', () => {
    const settlement = createSettlement({
      gameType: 'monster-race',
      scores: [
        { playerId: 'p1', score: 80 },
        { playerId: 'p2', score: 100 },
      ],
    });

    expect(settlement.rankings.map((ranking) => ranking.playerId)).toEqual(['p2', 'p1']);
    expect(settlement.rankings[0].rank).toBe(1);
    expect(settlement.stars).toEqual({ p2: 3, p1: 1 });
    expect(settlement.titles.p2).toBe('今日飞毛腿');
  });
});
```

Create `src/domain/telemetry.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/domain/settlement.test.ts src/domain/telemetry.test.ts`

Expected: FAIL because `settlement.ts` and `telemetry.ts` do not exist.

- [ ] **Step 3: Implement settlement and telemetry**

Create `src/domain/settlement.ts`:

```ts
import type { GameType } from './types';

export interface ScoreInput {
  playerId: string;
  score: number;
}

export interface Ranking {
  playerId: string;
  score: number;
  rank: number;
}

export interface Settlement {
  rankings: Ranking[];
  stars: Record<string, number>;
  titles: Record<string, string>;
}

const titleByGame: Record<GameType, string> = {
  'bomb-pass': '气氛担当',
  'monster-race': '今日飞毛腿',
  'treasure-brawl': '幸运宝箱王',
  'airplane-battle': '天空守护者',
};

export function createSettlement(input: { gameType: GameType; scores: ScoreInput[] }): Settlement {
  const rankings = [...input.scores]
    .sort((a, b) => b.score - a.score)
    .map((score, index) => ({ ...score, rank: index + 1 }));

  const stars = Object.fromEntries(rankings.map((ranking) => [ranking.playerId, ranking.rank === 1 ? 3 : 1]));
  const titles = rankings[0] ? { [rankings[0].playerId]: titleByGame[input.gameType] } : {};

  return { rankings, stars, titles };
}
```

Create `src/domain/telemetry.ts`:

```ts
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
```

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/domain/settlement.test.ts src/domain/telemetry.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit settlement and telemetry**

Run:

```bash
git add src/domain/settlement.ts src/domain/telemetry.ts src/domain/settlement.test.ts src/domain/telemetry.test.ts
git commit -m "feat: add settlement and telemetry domain"
```

## Task 8: Local Room Store

**Files:**
- Create: `src/store/localRoomStore.ts`
- Test: `src/store/localRoomStore.test.ts`

- [ ] **Step 1: Write failing local store tests**

Create `src/store/localRoomStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { createRoom } from '../domain/room';
import { loadRoom, saveRoom } from './localRoomStore';

describe('local room store', () => {
  beforeEach(() => {
    localStorage.clear();
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
```

- [ ] **Step 2: Run local store tests and verify RED**

Run: `npm test -- src/store/localRoomStore.test.ts`

Expected: FAIL because `localRoomStore.ts` does not exist.

- [ ] **Step 3: Implement local room store**

Create `src/store/localRoomStore.ts`:

```ts
import type { Room } from '../domain/types';

const keyForRoom = (roomId: string) => `family-play-room:${roomId}`;

export function saveRoom(room: Room): void {
  localStorage.setItem(keyForRoom(room.roomId), JSON.stringify(room));
}

export function loadRoom(roomId: string): Room | undefined {
  const raw = localStorage.getItem(keyForRoom(roomId));
  return raw ? (JSON.parse(raw) as Room) : undefined;
}
```

- [ ] **Step 4: Run local store tests and verify GREEN**

Run: `npm test -- src/store/localRoomStore.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit local room store**

Run:

```bash
git add src/store/localRoomStore.ts src/store/localRoomStore.test.ts
git commit -m "feat: add local room store"
```

## Task 9: Screen and Controller UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/ui/screen/ScreenApp.tsx`
- Create: `src/ui/controller/ControllerApp.tsx`
- Test: `src/ui/screen/ScreenApp.test.tsx`
- Test: `src/ui/controller/ControllerApp.test.tsx`

- [ ] **Step 1: Write failing UI tests**

Create `src/ui/screen/ScreenApp.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScreenApp } from './ScreenApp';

describe('ScreenApp', () => {
  it('shows room creation, game list, and airplane battle coming soon', () => {
    render(<ScreenApp />);

    expect(screen.getByRole('heading', { name: '家庭派对智慧屏' })).toBeInTheDocument();
    expect(screen.getByText('创建房间')).toBeInTheDocument();
    expect(screen.getByText('炸弹传传传')).toBeInTheDocument();
    expect(screen.getByText('家庭怪兽赛跑')).toBeInTheDocument();
    expect(screen.getByText('宝藏大乱斗')).toBeInTheDocument();
    expect(screen.getByText('飞机大战')).toBeInTheDocument();
    expect(screen.getByText('即将上线')).toBeInTheDocument();
  });
});
```

Create `src/ui/controller/ControllerApp.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ControllerApp } from './ControllerApp';

describe('ControllerApp', () => {
  it('shows join form and controller actions', () => {
    render(<ControllerApp />);

    expect(screen.getByRole('heading', { name: '手机控制器' })).toBeInTheDocument();
    expect(screen.getByLabelText('房间码')).toBeInTheDocument();
    expect(screen.getByLabelText('昵称')).toBeInTheDocument();
    expect(screen.getByText('加入房间')).toBeInTheDocument();
    expect(screen.getByText('传递')).toBeInTheDocument();
    expect(screen.getByText('冲刺')).toBeInTheDocument();
    expect(screen.getByText('选择宝箱')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run UI tests and verify RED**

Run: `npm test -- src/ui/screen/ScreenApp.test.tsx src/ui/controller/ControllerApp.test.tsx`

Expected: FAIL because UI components do not exist.

- [ ] **Step 3: Implement screen and controller UI**

Create `src/ui/screen/ScreenApp.tsx`:

```tsx
const games = [
  { title: '炸弹传传传', description: '倒计时传递炸弹，时间到触发温和挑战。', status: '可试玩' },
  { title: '家庭怪兽赛跑', description: '点击或摇一摇，让怪兽冲向终点。', status: '可试玩' },
  { title: '宝藏大乱斗', description: '轮流打开宝箱，收集金币和惊喜。', status: '可试玩' },
  { title: '飞机大战', description: '方向控制和协作射击 Spike。', status: '即将上线' },
];

export function ScreenApp() {
  return (
    <section className="screen-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">智慧屏主画面</p>
          <h1>家庭派对智慧屏</h1>
          <p>创建房间，让手机和平板成为全家的控制器。</p>
        </div>
        <button className="primary-action" type="button">创建房间</button>
      </header>

      <section className="game-grid" aria-label="游戏列表">
        {games.map((game) => (
          <article className="game-card" key={game.title}>
            <span>{game.status}</span>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
```

Create `src/ui/controller/ControllerApp.tsx`:

```tsx
export function ControllerApp() {
  return (
    <section className="controller-shell">
      <h1>手机控制器</h1>
      <form className="join-form">
        <label>
          房间码
          <input name="roomId" placeholder="FAMILY" />
        </label>
        <label>
          昵称
          <input name="nickname" placeholder="豆豆" />
        </label>
        <button type="button">加入房间</button>
      </form>

      <section className="control-pad" aria-label="控制面板">
        <button type="button">传递</button>
        <button type="button">冲刺</button>
        <button type="button">选择宝箱</button>
      </section>
    </section>
  );
}
```

Modify `src/App.tsx`:

```tsx
import { ControllerApp } from './ui/controller/ControllerApp';
import { ScreenApp } from './ui/screen/ScreenApp';

export function App() {
  const path = window.location.pathname;
  return path.includes('controller') ? <ControllerApp /> : <ScreenApp />;
}
```

Replace `src/styles.css` with:

```css
:root {
  color: #241f2b;
  background: #f7fbff;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

button {
  border: 0;
  cursor: pointer;
}

.screen-shell {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #fff7e8 0%, #eaf4ff 100%);
}

.hero-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto 24px;
  padding: 28px;
  border: 1px solid rgba(36, 31, 43, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
}

.eyebrow {
  margin: 0 0 8px;
  color: #6a4bc4;
  font-size: 14px;
  font-weight: 800;
}

.hero-panel h1,
.controller-shell h1 {
  margin: 0 0 8px;
  font-size: clamp(32px, 5vw, 56px);
  line-height: 1.05;
}

.hero-panel p {
  margin: 0;
  color: #5f5a66;
}

.primary-action {
  min-width: 136px;
  min-height: 48px;
  border-radius: 8px;
  background: #ff7a3d;
  color: white;
  font-weight: 800;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.game-card {
  min-height: 220px;
  padding: 20px;
  border-radius: 8px;
  background: #211d2d;
  color: white;
}

.game-card span {
  display: inline-flex;
  margin-bottom: 42px;
  color: #ffd35a;
  font-size: 13px;
  font-weight: 800;
}

.game-card h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.game-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

.controller-shell {
  min-height: 100vh;
  padding: 24px;
  background: #10131d;
  color: white;
}

.join-form {
  display: grid;
  gap: 14px;
  max-width: 420px;
  margin-top: 24px;
}

.join-form label {
  display: grid;
  gap: 8px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 700;
}

.join-form input {
  min-height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.join-form button,
.control-pad button {
  min-height: 48px;
  border-radius: 8px;
  background: #4c7dff;
  color: white;
  font-weight: 800;
}

.control-pad {
  display: grid;
  grid-template-columns: repeat(3, minmax(96px, 1fr));
  gap: 12px;
  max-width: 520px;
  margin-top: 24px;
}

@media (max-width: 760px) {
  .screen-shell {
    padding: 16px;
  }

  .hero-panel {
    display: grid;
    padding: 20px;
  }

  .game-grid {
    grid-template-columns: 1fr;
  }

  .control-pad {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run UI tests and verify GREEN**

Run: `npm test -- src/ui/screen/ScreenApp.test.tsx src/ui/controller/ControllerApp.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 6: Commit UI shell**

Run:

```bash
git add src/App.tsx src/styles.css src/ui/screen/ScreenApp.tsx src/ui/controller/ControllerApp.tsx src/ui/screen/ScreenApp.test.tsx src/ui/controller/ControllerApp.test.tsx
git commit -m "feat: add screen and controller ui shell"
```

## Task 10: Final Verification and Push

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README**

Add commands:

```md
## Development

```bash
npm install
npm run dev
npm test
npm run build
```

Open `/screen` for the smart-screen host and `/controller` for the mobile controller.
```

- [ ] **Step 2: Run full verification**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: build PASS.

- [ ] **Step 3: Commit README**

Run:

```bash
git add README.md
git commit -m "docs: add development commands"
```

- [ ] **Step 4: Push branch**

Run: `git push`

Expected: branch pushes to `origin/main`.

## Self-Review Notes

- Spec coverage:
  - Room creation, player join, and player list sync are covered by Tasks 2 and 8.
  - Unified game lifecycle is covered by Task 3.
  - Three first-priority games are covered by Tasks 4, 5, and 6.
  - Settlement and telemetry are covered by Task 7.
  - Smart-screen and controller views are covered by Task 9.
  - Airplane Battle is represented as a first-stage coming-soon/Spike entry in Task 9, matching the approved scope that it is not a first-iteration playable blocker.
- Intentional scope reduction:
  - No backend service in this first code pass. The localStorage store simulates multi-tab devices and keeps the first runnable slice small.
  - No full real-time sync in this first code pass. A later task can replace the local store with WebSocket/WebRTC without changing pure domain modules.
- Placeholder scan:
  - No TBD/TODO/placeholders remain. Task 9 includes exact CSS.
