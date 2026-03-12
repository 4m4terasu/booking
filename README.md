# Resort Cabana Booking

A TypeScript full-stack web app for browsing a resort map, checking live cabana availability, and booking a cabana for a current guest.

## Stack

- Backend: Node.js, Express, TypeScript
- Frontend: React, Vite, TypeScript
- Tests: Vitest, Supertest, Testing Library

## Requirements

- Node.js 22+

## Run

Single command from the project root:

```bash
npm start -- --map ./map.ascii --bookings ./bookings.json --port 3000
```

Notes:

- `npm start` builds the frontend and then starts one Express server.
- `--map` and `--bookings` are optional; by default the app reads `map.ascii` and `bookings.json` from the project root.
- Open [http://localhost:3000](http://localhost:3000).

For backend-only development without rebuilding the frontend bundle each time:

```bash
npm run dev -- --port 3000
```

## Test

```bash
npm test
npm run typecheck
```

## How Booking Validation Works

Booking is allowed only when `room` and `guestName` match an entry in `bookings.json`.

Examples of valid pairs from the sample data:

- `101` + `Alice Smith`
- `102` + `Bob Jones`
- `201` + `Uma Lopez`

If the guest pair is valid and the cabana is still available, the booking succeeds and the map updates immediately.

## API

- `GET /api/map`
  Returns the parsed map grid and current cabana availability.
- `POST /api/cabanas/:cabanaId/book`
  Body:

```json
{
  "room": "101",
  "guestName": "Alice Smith"
}
```

## Design Notes

- Cabanas use stable ids based on coordinates, for example `cabana-14-12`.
- Booking state is kept in memory, which keeps the solution simple and matches the assignment.
- The frontend uses CSS Grid for the map, which is easier to reason about and test than a canvas-based renderer for this task.
- The Express app serves both the REST API and the built frontend bundle, so reviewers only need one command.

## Trade-offs

- There is no persistent storage, auth, or concurrency control beyond in-memory checks.
- The visual map focuses on clarity and asset reuse instead of pixel-perfect game-style rendering.
- The booking flow is intentionally one-step and minimal.