import { Request } from "express";

import { BookCabanaRequest } from "../types.js";

export function isValidBookingRequest(body: unknown): body is BookCabanaRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Partial<BookCabanaRequest>;

  return (
    typeof candidate.room === "string" &&
    candidate.room.trim().length > 0 &&
    typeof candidate.guestName === "string" &&
    candidate.guestName.trim().length > 0
  );
}

export function getCabanaId(params: Request["params"]): string | undefined {
  const value = params.cabanaId;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}
