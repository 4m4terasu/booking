# Improvements

## Summary

This revision focuses on the two issues highlighted in the review:

- `app.ts` had too many responsibilities.
- `ResortMapService.getMap()` mixed static map layout with derived booking state in a way that duplicated availability logic.

The goal of the update was to keep the existing behavior intact while making the code easier to understand, test, and extend.

## Root Causes Addressed

### Mixed responsibilities in the HTTP entrypoint

The original `app.ts` knew about too many unrelated concerns at once:

- Express app composition,
- API route definitions,
- request validation,
- error-to-response mapping,
- static frontend serving.

That made the module harder to read and harder to change safely because transport concerns and application wiring were coupled together.

### Duplicated derived state in `getMap()`

The original `getMap()` independently derived cabana availability for both:

- the `cabanas` collection, and
- cabana tiles inside `tiles`.

That meant the same current-state information was being recalculated in two separate places inside one response-building flow. Even though both paths used the same booking service, the method still carried two parallel derivations of the same concept, which made the code harder to reason about and easier to drift over time.

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
- projects cabana tiles from those computed cabana views.

This removed the duplicated availability derivation inside `getMap()` and made the intent of the method more explicit: project the current booking state onto a static map layout.

### 3. Strengthened automated tests

I updated and extended tests to cover the refactor:

- parsing tests now validate the layout-oriented map model,
- new service tests verify that cabana availability stays consistent between the `cabanas` list and the map tiles,
- new service tests also verify that `getMap()` returns fresh snapshots instead of mutating previously returned responses,
- new helper tests cover booking request validation and cabana id extraction,
- existing API and frontend tests still pass unchanged.

## Result

The application behavior remains the same from a user perspective, but the code is now:

- more focused per module,
- easier to reason about,
- less prone to availability drift inside the map response,
- better covered by tests around the reviewed areas.
