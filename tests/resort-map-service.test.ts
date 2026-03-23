import { describe, expect, it } from "vitest";

import { createTestResortMapService } from "./test-helpers.js";

describe("ResortMapService", () => {
  it("keeps cabana availability consistent between the cabana list and the map tiles", () => {
    const service = createTestResortMapService();

    const initialMap = service.getMap();
    const initialCabana = initialMap.cabanas.find((cabana) => cabana.id === "cabana-3-11");
    const initialTile = initialMap.tiles[11][3];

    expect(initialCabana?.isAvailable).toBe(true);
    expect(initialTile).toMatchObject({
      type: "cabana",
      cabanaId: "cabana-3-11",
      isAvailable: true,
    });

    service.bookCabana("cabana-3-11", "101", "Alice Smith");

    const updatedMap = service.getMap();
    const updatedCabana = updatedMap.cabanas.find((cabana) => cabana.id === "cabana-3-11");
    const updatedTile = updatedMap.tiles[11][3];

    expect(updatedCabana?.isAvailable).toBe(false);
    expect(updatedTile).toMatchObject({
      type: "cabana",
      cabanaId: "cabana-3-11",
      isAvailable: false,
    });
  });

  it("returns fresh map snapshots instead of mutating earlier responses", () => {
    const service = createTestResortMapService();

    const firstMap = service.getMap();

    service.bookCabana("cabana-3-11", "101", "Alice Smith");

    const secondMap = service.getMap();

    expect(firstMap.cabanas.find((cabana) => cabana.id === "cabana-3-11")?.isAvailable).toBe(true);
    expect(firstMap.tiles[11][3]).toMatchObject({
      cabanaId: "cabana-3-11",
      isAvailable: true,
    });
    expect(secondMap.cabanas.find((cabana) => cabana.id === "cabana-3-11")?.isAvailable).toBe(false);
    expect(secondMap.tiles[11][3]).toMatchObject({
      cabanaId: "cabana-3-11",
      isAvailable: false,
    });
  });
});
