import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { storage } from "./storage";
import apiRouter from "./api-router";
import { createServer } from 'http';

console.log('Starting server initialization...');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  store: storage.sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Regular request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Enable CORS first
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Mount API Router with JSON handling and logging
console.log('Mounting API router...');
app.use('/api', (req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.path}`); // Added logging
  res.type('json');
  next();
}, apiRouter);

// API error handling
app.use('/api', (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// API catch-all before Vite setup
app.use('/api/*', (req, res) => {
  console.log(`[404] API endpoint not found: ${req.method} ${req.path}`); // Added logging
  res.status(404).json({ error: 'API endpoint not found' });
});

(async () => {
  try {
    log('Starting server initialization...');
    const server = createServer(app);

    // Set up frontend handling after API routes
    if (app.get("env") === "development") {
      log('Setting up Vite middleware for development...');
      await setupVite(app, server);
    } else {
      log('Setting up static file serving for production...');
      serveStatic(app);
    }

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on port ${port}`);
      log(`Environment: ${app.get("env")}`);
      log(`Health check available at http://localhost:${port}/api/healthz`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();