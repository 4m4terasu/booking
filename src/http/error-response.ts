import { Response } from "express";

import { BookingError } from "../bookings.js";

const statusByCode = {
  invalid_guest: 400,
  already_booked: 409,
  cabana_not_found: 404,
} as const;

export function sendErrorResponse(error: unknown, response: Response): void {
  if (error instanceof BookingError) {
    response.status(statusByCode[error.code]).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Internal server error." });
}
