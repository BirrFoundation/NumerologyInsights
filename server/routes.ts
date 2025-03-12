import type { Express } from "express";
import { createServer, type Server } from "http";
import { log } from "./vite";
import apiRouter from "./api-router";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Register API routes
  app.use('/api', apiRouter);

  // Register catch-all route last
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  log("Created HTTP server and registered API routes");

  return httpServer;
}