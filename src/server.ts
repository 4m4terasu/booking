import { resolveRuntimeOptions, startServer } from "./runtime.js";

startServer(resolveRuntimeOptions(process.argv.slice(2)));