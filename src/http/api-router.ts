import { Router } from "express";

import { ResortMapService } from "../resort-map-service.js";
import { getCabanaId, isValidBookingRequest } from "./booking-request.js";
import { sendErrorResponse } from "./error-response.js";

export function createApiRouter(resortMapService: ResortMapService): Router {
  const router = Router();

  router.get("/map", (_request, response) => {
    response.json(resortMapService.getMap());
  });

  router.post("/cabanas/:cabanaId/book", (request, response) => {
    const cabanaId = getCabanaId(request.params);

    if (!cabanaId) {
      response.status(400).json({ message: "Cabana id is required." });
      return;
    }

    if (!isValidBookingRequest(request.body)) {
      response.status(400).json({ message: "Please provide both room and guestName." });
      return;
    }

    try {
      const cabana = resortMapService.bookCabana(cabanaId, request.body.room, request.body.guestName);

      response.status(201).json({
        message: "Cabana booked successfully.",
        cabana,
      });
    } catch (error) {
      sendErrorResponse(error, response);
    }
  });

  return router;
}
