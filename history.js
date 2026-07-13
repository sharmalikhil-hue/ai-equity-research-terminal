// src/services/pipeline.js
//
// Orchestrates the 5-agent research pipeline for 1-3 companies. This is the
// core "product logic" of the app: everything else (HTTP routes, SSE
// streaming, the frontend) is just a way of triggering this and displaying
// its output.
//
// Design notes:
// - News, Fundamentals, and Sentiment run in parallel per company (they're
//   independent). Synthesis then runs over their combined output, and
//   Compliance runs last over Synthesis's output.
// - Companies are processed one at a time so progress events stay easy to
//   follow in the UI. (Bounded concurrency across companies could be added
//   later without changing the agent modules at all.)
// - If one agent fails, the pipeline does not abort the whole run. It
//   records the error, substitutes a clear placeholder, and continues, so a
//   single flaky web-search call doesn't sink an entire multi-company run.

const crypto = require("crypto");
const config = require("../config");
const logger = require("../logger");
const db = require("../db");

const newsAgent = require("../agents/newsAgent");
const fundamentalsAgent = require("../agents/fundamentalsAgent");
const sentimentAgent = require("../agents/sentimentAgent");
const synthesisAgent = require("../agents/synthesisAgent");
const complianceAgent = require("../agents/complianceAgent");

const PLACEHOLDER = "[This agent could not complete \u2014 see error above. Downstream agents proceeded without it.]";

function validateCompanies(input) {
  if (!Array.isArray(input)) throw new Error("companies must be an array");
  const cleaned = input
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c) => c.length > 0);

  if (cleaned.length === 0) throw new Error("Provide at least one company name.");
  if (cleaned.length > config.maxCompanies) {
    throw new Error(`Provide at most ${config.maxCompanies} companies.`);
  }
  for (const c of cleaned) {
    if (c.length > config.maxInputLength) {
      throw new Error(`Company name too long: "${c.slice(0, 40)}..."`);
    }
  }
  return cleaned;
}

async function runAgentSafely(agentPromise, { onEvent, company, agentName }) {
  onEvent?.({ type: "status", company, agent: agentName, state: "running" });
  try {
    const result = await agentPromise;
    onEvent?.({ type: "status", company, agent: agentName, state: "done" });
    onEvent?.({ type: "agent_result", company, agent: agentName, content: result.content, demoMode: result.demoMode });
    return result;
  } catch (err) {
    logger.error(`Agent ${agentName} failed for ${company}`, { error: err.message });
    onEvent?.({ type: "status", company, agent: agentName, state: "error", message: err.message });
    onEvent?.({ type: "agent_result", company, agent: agentName, content: null, error: err.message });
    return { agent: agentName, company, content: null, error: err.message };
  }
}

async function researchCompany(company, onEvent) {
  const [newsResult, fundamentalsResult, sentimentResult] = await Promise.all([
    runAgentSafely(newsAgent.run(company), { onEvent, company, agentName: "news" }),
    runAgentSafely(fundamentalsAgent.run(company), { onEvent, company, agentName: "fundamentals" }),
    runAgentSafely(sentimentAgent.run(company), { onEvent, company, agentName: "sentiment" }),
  ]);

  const newsText = newsResult.content || PLACEHOLDER;
  const fundamentalsText = fundamentalsResult.content || PLACEHOLDER;
  const sentimentText = sentimentResult.content || PLACEHOLDER;

  const synthesisResult = await runAgentSafely(
    synthesisAgent.run(company, { newsText, fundamentalsText, sentimentText }),
    { onEvent, company, agentName: "synthesis" }
  );
  const synthesisText = synthesisResult.content || PLACEHOLDER;

  const complianceResult = await runAgentSafely(
    complianceAgent.run(company, { synthesisText }),
    { onEvent, company, agentName: "compliance" }
  );

  onEvent?.({ type: "company_done", company });

  return {
    company,
    news: newsResult,
    fundamentals: fundamentalsResult,
    sentiment: sentimentResult,
    synthesis: synthesisResult,
    compliance: complianceResult,
  };
}

async function runResearch(companiesInput, onEvent) {
  const companies = validateCompanies(companiesInput);

  const results = {};
  for (const company of companies) {
    results[company] = await researchCompany(company, onEvent);
  }

  const run = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    companies,
    demoMode: config.demoMode,
    results,
  };

  db.saveRun(run);
  onEvent?.({ type: "run_complete", runId: run.id });

  return run;
}

module.exports = { runResearch, validateCompanies };
