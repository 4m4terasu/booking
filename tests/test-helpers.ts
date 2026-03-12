import path from "node:path";
import { fileURLToPath } from "node:url";

import { createApp } from "../src/app.js";
import { BookingService } from "../src/bookings.js";
import { parseMapFile } from "../src/map.js";
import { ResortMapService } from "../src/resort-map-service.js";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testsDir, "..");

export function createTestResortMapService(): ResortMapService {
  const mapPath = path.join(projectRoot, "map.ascii");
  const bookingsPath = path.join(projectRoot, "bookings.json");

  const resortMap = parseMapFile(mapPath);
  const bookingService = BookingService.fromFile(bookingsPath);

  return new ResortMapService(resortMap, bookingService);
}

export function createTestApp() {
  return createApp(createTestResortMapService());
}