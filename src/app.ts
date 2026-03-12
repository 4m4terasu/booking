import { existsSync } from "node:fs";
import path from "node:path";

import express, { Express, Request, Response } from "express";

import { BookingError } from "./bookings.js";
import { ResortMapService } from "./resort-map-service.js";
import { BookCabanaRequest } from "./types.js";

interface CreateAppOptions {
  staticDir?: string;
}

function isValidBookingRequest(body: unknown): body is BookCabanaRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Partial<BookCabanaRequest>;

  return (
    typeof candidate.room === "string" &&
    candidate.room.trim().length > 0 &&
    typeof candidate.guestName === "string" &&
    candidate.guestName.trim().length > 0
  );
}

function getCabanaId(params: Request["params"]): string | undefined {
  const value = params.cabanaId;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

function sendBookingError(error: unknown, response: Response): void {
  if (error instanceof BookingError) {
    const statusByCode = {
      invalid_guest: 400,
      already_booked: 409,
      cabana_not_found: 404,
    } as const;

    response.status(statusByCode[error.code]).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Internal server error." });
}

export function createApp(
  resortMapService: ResortMapService,
  options: CreateAppOptions = {},
): Express {
  const app = express();
  const indexFilePath = options.staticDir
    ? path.join(options.staticDir, "index.html")
    : undefined;
  const canServeClient = !!indexFilePath && existsSync(indexFilePath);

  app.use(express.json());

  app.get("/api/map", (_request, response) => {
    response.json(resortMapService.getMap());
  });

  app.post("/api/cabanas/:cabanaId/book", (request: Request, response: Response) => {
    const cabanaId = getCabanaId(request.params);

    if (!cabanaId) {
      response.status(400).json({ message: "Cabana id is required." });
      return;
    }

    if (!isValidBookingRequest(request.body)) {
      response.status(400).json({
        message: "Please provide both room and guestName.",
      });
      return;
    }

    try {
      const cabana = resortMapService.bookCabana(
        cabanaId,
        request.body.room,
        request.body.guestName,
      );

      response.status(201).json({
        message: "Cabana booked successfully.",
        cabana,
      });
    } catch (error) {
      sendBookingError(error, response);
    }
  });

  if (canServeClient && options.staticDir) {
    app.use(express.static(options.staticDir));

    app.use((request, response, next) => {
      if (request.path.startsWith("/api/")) {
        next();
        return;
      }

      if (!request.accepts("html")) {
        next();
        return;
      }

      response.sendFile(indexFilePath);
    });
  }

  return app;
}