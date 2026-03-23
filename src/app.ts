import express, { Express } from "express";

import { createApiRouter } from "./http/api-router.js";
import { registerClientApp } from "./http/client-app.js";
import { ResortMapService } from "./resort-map-service.js";

interface CreateAppOptions {
  staticDir?: string;
}

export function createApp(
  resortMapService: ResortMapService,
  options: CreateAppOptions = {},
): Express {
  const app = express();

  app.use(express.json());
  app.use("/api", createApiRouter(resortMapService));

  registerClientApp(app, options.staticDir);

  return app;
}
