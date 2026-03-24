import { describe, expect, it } from "vitest";

import { getCabanaId, isValidBookingRequest } from "../src/http/booking-request.js";

describe("booking-request helpers", () => {
  it("accepts a complete booking request body", () => {
    expect(isValidBookingRequest({ room: "101", guestName: "Alice Smith" })).toBe(true);
  });

  it("rejects incomplete or blank booking request bodies", () => {
    expect(isValidBookingRequest({ room: "101" })).toBe(false);
    expect(isValidBookingRequest({ room: "101", guestName: "   " })).toBe(false);
    expect(isValidBookingRequest(null)).toBe(false);
  });

  it("extracts cabana id from route params", () => {
    expect(getCabanaId({ cabanaId: "cabana-3-11" })).toBe("cabana-3-11");
    expect(getCabanaId({ cabanaId: ["cabana-3-11", "cabana-4-11"] })).toBe("cabana-3-11");
    expect(getCabanaId({})).toBeUndefined();
  });
});
