import path from "node:path";
import { spawnSync } from "node:child_process";

import { resolveRuntimeOptions, startServer } from "./runtime.js";

const viteBinPath = path.resolve(process.cwd(), "node_modules", "vite", "bin", "vite.js");
const buildResult = spawnSync(process.execPath, [viteBinPath, "build"], {
  cwd: process.cwd(),
  stdio: "inherit",
});

if ((buildResult.status ?? 1) !== 0) {
  process.exit(buildResult.status ?? 1);
}

startServer(resolveRuntimeOptions(process.argv.slice(2)));