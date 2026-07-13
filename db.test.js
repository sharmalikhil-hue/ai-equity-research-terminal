// src/app.js
//
// Builds and returns the configured Express app, without starting it
// listening. Kept separate from server.js so tests can import the app
// directly (via supertest) without binding a real port.

const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const config = require("./config");
const requestLogger = require("./middleware/requestLogger");
const { errorHandler } = require("./middleware/errorHandler");

const researchRoutes = require("./routes/research");
const historyRoutes = require("./routes/history");
const metaRoutes = require("./routes/meta");

function createApp() {
  const app = express();

  app.use(cors({ origin: config.allowedOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  const researchLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Rate limit exceeded. Please try again later." },
  });

  app.use("/api", metaRoutes);
  app.use("/api", historyRoutes);
  app.use("/api", researchLimiter, researchRoutes);

  // Serve the frontend (static, no build step required)
  const frontendDir = path.join(__dirname, "..", "..", "frontend");
  app.use(express.static(frontendDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDir, "index.html"));
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
