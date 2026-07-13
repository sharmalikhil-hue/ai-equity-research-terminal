// src/routes/research.js
//
// Two ways to trigger a research run:
//   POST /api/research         -> waits for the full run, returns JSON
//   GET  /api/research/stream  -> Server-Sent Events, streams agent-by-agent
//                                  progress live as the pipeline runs
//
// The frontend uses the streaming version for the live status grid; the
// plain POST version exists because it's simpler to script/test against
// (e.g. curl, Postman) and useful for any future non-browser client.

const express = require("express");
const pipeline = require("../services/pipeline");
const accessCode = require("../middleware/accessCode");
const { asyncRoute } = require("../middleware/errorHandler");

const router = express.Router();

router.post(
  "/research",
  accessCode,
  asyncRoute(async (req, res) => {
    const { companies } = req.body || {};
    const run = await pipeline.runResearch(companies, null);
    res.json(run);
  })
);

router.get("/research/stream", async (req, res) => {
  const companiesParam = req.query.companies || "";
  const companies = companiesParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  // Checked here (after SSE headers are already sent) rather than via the
  // shared accessCode middleware, so a bad/missing code arrives to the
  // browser as a proper SSE error event instead of breaking EventSource
  // with a plain, unparseable 401 JSON response.
  if (!accessCode.isValid(req)) {
    send({ type: "error", message: "Invalid or missing access code." });
    return res.end();
  }

  const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 15000);

  try {
    await pipeline.runResearch(companies, send);
  } catch (err) {
    send({ type: "error", message: err.message });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
});

module.exports = router;
