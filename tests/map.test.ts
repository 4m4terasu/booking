import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { parseMapFile } from "../src/map.js";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testsDir, "..");

describe("parseMapFile", () => {
  it("parses the provided resort map and assigns stable cabana ids", () => {
    const resortMap = parseMapFile(path.join(projectRoot, "map.ascii"));

    expect(resortMap.rows).toBe(19);
    expect(resortMap.cols).toBe(20);
    expect(resortMap.cabanas).toHaveLength(47);
    expect(resortMap.cabanas[0]).toMatchObject({
      id: "cabana-3-11",
      x: 3,
      y: 11,
    });
    expect(resortMap.tiles[11][3]).toMatchObject({
      x: 3,
      y: 11,
      type: "cabana",
      cabanaId: "cabana-3-11",
    });
  });
});
