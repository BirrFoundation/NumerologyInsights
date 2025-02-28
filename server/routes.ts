import type { Express } from "express";
import { createServer, type Server } from "http";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  log("Created HTTP server");

  return httpServer;
}