import { readFileSync } from "node:fs";

import { GuestBooking } from "./types.js";

export type BookingErrorCode = "invalid_guest" | "already_booked" | "cabana_not_found";

export class BookingError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

export class BookingService {
  private readonly guests: GuestBooking[];
  private readonly bookedCabanaIds = new Set<string>();

  constructor(guests: GuestBooking[]) {
    this.guests = guests;
  }

  static fromFile(bookingsPath: string): BookingService {
    const rawBookings = readFileSync(bookingsPath, "utf8");
    const guests = JSON.parse(rawBookings) as GuestBooking[];

    if (!Array.isArray(guests)) {
      throw new Error("Bookings file must contain an array of guests.");
    }

    return new BookingService(guests);
  }

  isCabanaAvailable(cabanaId: string): boolean {
    return !this.bookedCabanaIds.has(cabanaId);
  }

  getCabanaAvailability(cabanaId: string): boolean {
    return this.isCabanaAvailable(cabanaId);
  }

  bookCabana(cabanaId: string, room: string, guestName: string): void {
    if (!this.isGuestValid(room, guestName)) {
      throw new BookingError(
        "invalid_guest",
        "Room number and guest name do not match a current guest.",
      );
    }

    if (!this.isCabanaAvailable(cabanaId)) {
      throw new BookingError("already_booked", "This cabana is already booked.");
    }

    this.bookedCabanaIds.add(cabanaId);
  }

  private isGuestValid(room: string, guestName: string): boolean {
    const normalizedRoom = normalizeValue(room);
    const normalizedGuestName = normalizeValue(guestName);

    return this.guests.some((guest) => {
      return (
        normalizeValue(guest.room) === normalizedRoom &&
        normalizeValue(guest.guestName) === normalizedGuestName
      );
    });
  }
}