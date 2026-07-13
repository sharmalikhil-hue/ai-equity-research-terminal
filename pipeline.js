// src/middleware/errorHandler.js
//
// Centralized Express error handler. Any route that calls next(err)
// (or throws inside an async handler wrapped with asyncRoute below) ends
// up here, so error response shape stays consistent across the whole API.

const logger = require("../logger");

function asyncRoute(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error on ${req.method} ${req.path}`, { error: err.message });
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}

module.exports = { errorHandler, asyncRoute };
