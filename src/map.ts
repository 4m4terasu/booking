import { readFileSync } from "node:fs";

import { Cabana, ResortMap, Tile, TileType } from "./types.js";

const TILE_TYPE_BY_SYMBOL: Record<string, TileType> = {
  ".": "empty",
  "#": "path",
  p: "pool",
  c: "chalet",
  W: "cabana",
};

function createCabanaId(x: number, y: number): string {
  return `cabana-${x}-${y}`;
}

export function parseMapFile(mapPath: string): ResortMap {
  const rawMap = readFileSync(mapPath, "utf8").trimEnd();
  const rows = rawMap.split(/\r?\n/);

  if (rows.length === 0) {
    throw new Error("Map file is empty.");
  }

  const cols = rows[0].length;
  const tiles: Tile[][] = [];
  const cabanas: Cabana[] = [];

  rows.forEach((row, y) => {
    if (row.length !== cols) {
      throw new Error("Map rows must all have the same width.");
    }

    const tileRow = row.split("").map((symbol, x) => {
      const type = TILE_TYPE_BY_SYMBOL[symbol];

      if (!type) {
        throw new Error(`Unsupported map symbol "${symbol}" at ${x},${y}.`);
      }

      if (type !== "cabana") {
        return { x, y, type };
      }

      const cabanaId = createCabanaId(x, y);
      const cabana: Cabana = {
        id: cabanaId,
        x,
        y,
        isAvailable: true,
      };

      cabanas.push(cabana);

      return {
        x,
        y,
        type,
        cabanaId,
        isAvailable: cabana.isAvailable,
      };
    });

    tiles.push(tileRow);
  });

  return {
    rows: rows.length,
    cols,
    tiles,
    cabanas,
  };
}