import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./test-helpers.js";

describe("resort map API", () => {
  it("returns the parsed resort map", async () => {
    const app = createTestApp();

    const response = await request(app).get("/api/map");

    expect(response.status).toBe(200);
    expect(response.body.rows).toBe(19);
    expect(response.body.cols).toBe(20);
    expect(response.body.cabanas).toHaveLength(47);
  });

  it("books an available cabana and reflects the updated availability", async () => {
    const app = createTestApp();

    const bookingResponse = await request(app)
      .post("/api/cabanas/cabana-3-11/book")
      .send({ room: "101", guestName: "Alice Smith" });

    expect(bookingResponse.status).toBe(201);
    expect(bookingResponse.body.message).toBe("Cabana booked successfully.");
    expect(bookingResponse.body.cabana).toMatchObject({
      id: "cabana-3-11",
      isAvailable: false,
    });

    const mapResponse = await request(app).get("/api/map");
    const bookedCabana = mapResponse.body.cabanas.find(
      (cabana: { id: string }) => cabana.id === "cabana-3-11",
    );

    expect(bookedCabana.isAvailable).toBe(false);
  });

  it("returns 400 for invalid guest credentials", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/cabanas/cabana-3-11/book")
      .send({ room: "999", guestName: "Mallory" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Room number and guest name do not match a current guest.");
  });

  it("returns 404 for an unknown cabana id", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/cabanas/cabana-999-999/book")
      .send({ room: "101", guestName: "Alice Smith" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Cabana was not found.");
  });

  it("returns 409 when the cabana is already booked", async () => {
    const app = createTestApp();

    await request(app)
      .post("/api/cabanas/cabana-3-11/book")
      .send({ room: "101", guestName: "Alice Smith" });

    const response = await request(app)
      .post("/api/cabanas/cabana-3-11/book")
      .send({ room: "102", guestName: "Bob Jones" });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("This cabana is already booked.");
  });

  it("returns 400 when the booking payload is incomplete", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/cabanas/cabana-3-11/book")
      .send({ room: "101" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide both room and guestName.");
  });
});