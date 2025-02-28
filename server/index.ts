import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { storage } from "./storage";
import apiRouter from "./api-router";

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

// Enable CORS for all origins (adjust as needed for production)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Early middleware to handle API routes
app.use('/api', (req, res, next) => {
  log(`[API Gateway] Processing ${req.method} ${req.path}`);
  // Force JSON content type for all API routes
  res.setHeader('Content-Type', 'application/json');
  next();
}, apiRouter);

// API error handling
app.use('/api', (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// Regular request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

(async () => {
  try {
    // Create HTTP server
    const server = await registerRoutes(app);

    // Set up frontend handling after API routes
    if (app.get("env") === "development") {
      // Add a middleware to skip Vite for API routes
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
          log(`[Vite Bypass] Skipping Vite middleware for API route: ${req.path}`);
          return next('route');
        }
        next();
      });

      await setupVite(app, server);
    } else {
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