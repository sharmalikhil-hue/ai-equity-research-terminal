// src/db.js
//
// A deliberately simple, dependency-free persistence layer. Research runs
// are stored as a JSON array on disk. This is not meant to scale to a
// multi-user production service — it's meant to make a demo product feel
// real: runs survive a server restart and can be listed/replayed later.
// Swapping this for Postgres/SQLite later only requires changing this file.

const fs = require("fs");
const path = require("path");
const config = require("./config");
const logger = require("./logger");

function ensureFile() {
  const dir = path.dirname(config.historyFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(config.historyFile)) {
    fs.writeFileSync(config.historyFile, "[]", "utf8");
  }
}

function readAll() {
  ensureFile();
  try {
    const raw = fs.readFileSync(config.historyFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    logger.error("Failed to read history file, starting fresh", { error: err.message });
    return [];
  }
}

function writeAll(runs) {
  ensureFile();
  const trimmed = runs.slice(-config.maxHistoryRuns);
  fs.writeFileSync(config.historyFile, JSON.stringify(trimmed, null, 2), "utf8");
}

function saveRun(run) {
  const runs = readAll();
  runs.push(run);
  writeAll(runs);
  return run;
}

function listRuns({ limit = 20, offset = 0 } = {}) {
  const runs = readAll().slice().reverse(); // most recent first
  return {
    total: runs.length,
    runs: runs.slice(offset, offset + limit).map(summarize),
  };
}

function getRun(id) {
  return readAll().find((r) => r.id === id) || null;
}

function summarize(run) {
  return {
    id: run.id,
    createdAt: run.createdAt,
    companies: run.companies,
    demoMode: run.demoMode,
  };
}

module.exports = { saveRun, listRuns, getRun };
