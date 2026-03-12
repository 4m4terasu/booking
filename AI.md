# AI Workflow

## Tools Used

- Codex desktop agent
- Node.js tooling through the terminal
- TypeScript compiler
- Vitest and Testing Library

## High-Level Workflow

1. Read the assignment files and infer the required backend and frontend behavior.
2. Implement the backend domain layer first: map parsing, cabana ids, booking validation, and REST endpoints.
3. Add backend tests for parsing, booking rules, and API behavior.
4. Implement the frontend map, selection flow, and booking form against the real API.
5. Add frontend tests for loading the map and successful/unavailable booking scenarios.
6. Refine startup so one command builds the frontend and launches the app.
7. Verify with typecheck, automated tests, production frontend build, and live smoke checks.

## Prompt / Agent Style

The work was driven in small, practical steps with prompts focused on:

- analyze first, do not overengineer
- implement backend before frontend
- keep the solution idiomatic TypeScript
- prefer short, testable modules
- add meaningful tests for core behavior
- make the final reviewer experience a single command

## Approximate Iterations

- Analysis and architecture: 1 pass
- Backend implementation and tests: 2 passes
- Frontend implementation and tests: 2 passes
- Startup and docs polish: 1 pass

## Notes

- The provided sample booking data is authoritative for validation.
- Several smoke checks were run against a live local server to confirm that valid guest data can successfully book an available cabana.