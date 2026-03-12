import path from "node:path";
import { parseArgs } from "node:util";

import { createApp } from "./app.js";
import { BookingService } from "./bookings.js";
import { parseMapFile } from "./map.js";
import { ResortMapService } from "./resort-map-service.js";

export interface RuntimeOptions {
  mapPath: string;
  bookingsPath: string;
  port: number;
  staticDir: string;
}

export function resolveRuntimeOptions(
  args = process.argv.slice(2),
  cwd = process.cwd(),
): RuntimeOptions {
  const { values } = parseArgs({
    args,
    options: {
      map: {
        type: "string",
        default: path.resolve(cwd, "map.ascii"),
      },
      bookings: {
        type: "string",
        default: path.resolve(cwd, "bookings.json"),
      },
      port: {
        type: "string",
        default: "3000",
      },
    },
  });

  return {
    mapPath: values.map,
    bookingsPath: values.bookings,
    port: Number(values.port),
    staticDir: path.resolve(cwd, "dist/client"),
  };
}

export function startServer(options: RuntimeOptions) {
  const resortMap = parseMapFile(options.mapPath);
  const bookingService = BookingService.fromFile(options.bookingsPath);
  const resortMapService = new ResortMapService(resortMap, bookingService);
  const app = createApp(resortMapService, { staticDir: options.staticDir });

  return app.listen(options.port, () => {
    console.log(`Server is running on http://localhost:${options.port}`);
  });
}