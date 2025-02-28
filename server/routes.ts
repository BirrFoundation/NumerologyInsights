import type { Express } from "express";
import { createServer, type Server } from "http";
import apiRouter from "./api-router";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Mount API routes first, before any other middleware
  log("Registering API routes");
  app.use('/api', (req, res, next) => {
    log(`API request received: ${req.method} ${req.path}`);
    // Force JSON content type for all API routes
    res.type('application/json');
    next();
  }, apiRouter);

  return httpServer;
}