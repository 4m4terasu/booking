import { ResortMapTile } from "./types.js";

interface PathAppearance {
  assetPath: string;
  rotation: number;
}

function isPathTile(tiles: ResortMapTile[][], x: number, y: number): boolean {
  return tiles[y]?.[x]?.type === "path";
}

export function getPathAppearance(
  tiles: ResortMapTile[][],
  x: number,
  y: number,
): PathAppearance {
  const north = isPathTile(tiles, x, y - 1);
  const east = isPathTile(tiles, x + 1, y);
  const south = isPathTile(tiles, x, y + 1);
  const west = isPathTile(tiles, x - 1, y);
  const key = [north ? "N" : "", east ? "E" : "", south ? "S" : "", west ? "W" : ""].join("");

  switch (key) {
    case "NS":
      return { assetPath: "/assets/arrowStraight.png", rotation: 0 };
    case "EW":
      return { assetPath: "/assets/arrowStraight.png", rotation: 90 };
    case "NE":
      return { assetPath: "/assets/arrowCornerSquare.png", rotation: 0 };
    case "ES":
      return { assetPath: "/assets/arrowCornerSquare.png", rotation: 90 };
    case "SW":
      return { assetPath: "/assets/arrowCornerSquare.png", rotation: 180 };
    case "NW":
      return { assetPath: "/assets/arrowCornerSquare.png", rotation: 270 };
    case "NESW":
      return { assetPath: "/assets/arrowCrossing.png", rotation: 0 };
    case "NES":
      return { assetPath: "/assets/arrowSplit.png", rotation: 0 };
    case "ESW":
      return { assetPath: "/assets/arrowSplit.png", rotation: 90 };
    case "NSW":
      return { assetPath: "/assets/arrowSplit.png", rotation: 180 };
    case "NEW":
      return { assetPath: "/assets/arrowSplit.png", rotation: 270 };
    case "S":
      return { assetPath: "/assets/arrowEnd.png", rotation: 0 };
    case "W":
      return { assetPath: "/assets/arrowEnd.png", rotation: 90 };
    case "N":
      return { assetPath: "/assets/arrowEnd.png", rotation: 180 };
    case "E":
      return { assetPath: "/assets/arrowEnd.png", rotation: 270 };
    default:
      return { assetPath: "/assets/arrowStraight.png", rotation: 0 };
  }
}