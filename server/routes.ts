import type { Express } from "express";
import { createServer, type Server } from "http";
import { log } from "./vite";
import apiRouter from "./api-router";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Register API routes
  app.use('/api', apiRouter);

  // Log all incoming requests for debugging
  app.use((req, res, next) => {
    log(`[Request] ${req.method} ${req.path}`);
    next();
  });

  // Register catch-all route last
  app.use('*', (req, res) => {
    log(`[404] ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Endpoint not found' });
  });

  log("Created HTTP server and registered API routes");

  return httpServer;
}