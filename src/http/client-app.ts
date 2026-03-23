import { existsSync } from "node:fs";
import path from "node:path";

import express, { Express } from "express";

export function registerClientApp(app: Express, staticDir?: string): void {
  const indexFilePath = staticDir ? path.join(staticDir, "index.html") : undefined;
  const canServeClient = !!indexFilePath && existsSync(indexFilePath);

  if (!canServeClient || !staticDir) {
    return;
  }

  app.use(express.static(staticDir));

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
