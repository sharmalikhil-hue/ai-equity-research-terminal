// src/middleware/requestLogger.js
//
// Tiny request logger (method, path, status, duration). Not using morgan
// to keep dependencies minimal — this one file does everything this
// project needs.

const logger = require("../logger");

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}

module.exports = requestLogger;
