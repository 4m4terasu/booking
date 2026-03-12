import { describe, expect, it } from "vitest";

import { BookingError, BookingService } from "../src/bookings.js";

describe("BookingService", () => {
  it("accepts a valid guest with case-insensitive matching and marks the cabana unavailable", () => {
    const service = new BookingService([
      { room: "101", guestName: "Alice Smith" },
    ]);

    service.bookCabana("cabana-1-1", " 101 ", " alice smith ");

    expect(service.getCabanaAvailability("cabana-1-1")).toBe(false);
  });

  it("rejects an invalid guest", () => {
    const service = new BookingService([
      { room: "101", guestName: "Alice Smith" },
    ]);

    expect(() => {
      service.bookCabana("cabana-1-1", "999", "Mallory");
    }).toThrowError(new BookingError("invalid_guest", "Room number and guest name do not match a current guest."));
  });

  it("rejects booking the same cabana twice", () => {
    const service = new BookingService([
      { room: "101", guestName: "Alice Smith" },
      { room: "102", guestName: "Bob Jones" },
    ]);

    service.bookCabana("cabana-1-1", "101", "Alice Smith");

    expect(() => {
      service.bookCabana("cabana-1-1", "102", "Bob Jones");
    }).toThrowError(new BookingError("already_booked", "This cabana is already booked."));
  });
});