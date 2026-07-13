// src/logger.js
//
// Minimal structured logger. Not using a heavy dependency (winston/pino) on
// purpose — this app doesn't need log rotation or transports, just clean,
// consistent, timestamped output for a small product.

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

function ts() {
  return new Date().toISOString();
}

function log(level, msg, meta) {
  if (LEVELS[level] > currentLevel) return;
  const line = `[${ts()}] [${level.toUpperCase()}] ${msg}`;
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  if (meta !== undefined) {
    fn(line, meta);
  } else {
    fn(line);
  }
}

module.exports = {
  error: (msg, meta) => log("error", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  info: (msg, meta) => log("info", msg, meta),
  debug: (msg, meta) => log("debug", msg, meta),
};
