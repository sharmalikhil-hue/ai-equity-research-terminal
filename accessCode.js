// src/agents/fundamentalsAgent.js
//
// Summarizes current financial fundamentals for a company using live web
// search (Live Mode), or returns labeled simulated output (Demo Mode).

const config = require("../config");
const anthropicClient = require("../services/anthropicClient");
const demoData = require("../services/demoData");

const AGENT_NAME = "fundamentals";

const SYSTEM_PROMPT = `You are the Fundamentals Agent inside a multi-agent equity research pipeline.
Your job: find and summarize the company's current financial fundamentals using web search.
Cover: most recent revenue and revenue growth, profitability/margins, valuation multiple (P/E or
equivalent), and balance sheet health (debt/cash position) if available. Cite approximate figures
and the period they refer to. Write 250-400 words. Do not give investment advice or a buy/sell
opinion — that is handled by a different agent. If reliable current figures cannot be found, say
so plainly rather than inventing numbers.`;

async function run(company) {
  if (config.demoMode) {
    return { agent: AGENT_NAME, company, content: demoData.fundamentals(company), demoMode: true };
  }

  const content = await anthropicClient.complete({
    system: SYSTEM_PROMPT,
    prompt: `Company: ${company}\n\nFind and summarize this company's current financial fundamentals.`,
    useWebSearch: true,
  });

  return { agent: AGENT_NAME, company, content, demoMode: false };
}

module.exports = { name: AGENT_NAME, run };
