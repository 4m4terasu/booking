# Improvements

## Summary

This revision focuses on the two issues highlighted in the review:

- `app.ts` had too many responsibilities.
- `ResortMapService.getMap()` mixed layout data with derived booking state in a way that duplicated availability logic.

The goal of the update was to keep the existing behavior intact while making the code easier to understand, test, and extend.

## What Changed

### 1. Split HTTP responsibilities out of `app.ts`

`app.ts` is now a thin composition module.

The previous responsibilities were separated into small modules:

- `src/http/api-router.ts`
  Handles API routes only.
- `src/http/booking-request.ts`
  Handles booking request validation and cabana id extraction.
- `src/http/error-response.ts`
  Maps domain errors to HTTP responses.
- `src/http/client-app.ts`
  Handles static frontend serving.

This keeps the app bootstrap focused on wiring and removes transport-specific details from a single large module.

### 2. Refactored map generation to use a clearer source of truth

The map parser now returns a layout model (`ResortMapLayout`) that contains only structural map data.

`ResortMapService.getMap()` now:

- builds the current cabana view once,
- uses that result as the source of truth for cabana availability,
- derives cabana tiles from those computed cabana views.

This avoids recalculating availability independently for both `cabanas` and `tiles`, which reduced duplication and made the response generation more explicit.

### 3. Strengthened automated tests

I updated and extended tests to cover the refactor:

- parsing tests now validate the layout-oriented map model,
- new service tests verify that cabana availability stays consistent between the `cabanas` list and the map tiles,
- new service tests also verify that `getMap()` returns fresh snapshots instead of mutating previously returned responses,
- existing API and frontend tests still pass unchanged.

## Result

The application behavior remains the same from a user perspective, but the code is now:

- more focused per module,
- easier to reason about,
- less prone to availability drift inside the map response,
- better covered by tests around the reviewed areas.
