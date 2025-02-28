import type { Express } from "express";
import { createServer, type Server } from "http";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Register catch-all route last
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  log("Created HTTP server");

  return httpServer;
}