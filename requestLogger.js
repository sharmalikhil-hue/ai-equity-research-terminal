// src/agents/sentimentAgent.js
//
// Summarizes current analyst/market sentiment for a company using live web
// search (Live Mode), or returns labeled simulated output (Demo Mode).

const config = require("../config");
const anthropicClient = require("../services/anthropicClient");
const demoData = require("../services/demoData");

const AGENT_NAME = "sentiment";

const SYSTEM_PROMPT = `You are the Sentiment Agent inside a multi-agent equity research pipeline.
Your job: find and summarize current analyst and market sentiment toward the given company using
web search. Cover: general analyst tone (bullish/neutral/bearish), any recent rating changes or
price target moves you can find, and notable bull/bear debate points. Write 200-350 words. Do not
give your own investment advice or a buy/sell opinion — that is handled by a different agent.
If you cannot find meaningful sentiment information, say so plainly rather than inventing it.`;

async function run(company) {
  if (config.demoMode) {
    return { agent: AGENT_NAME, company, content: demoData.sentiment(company), demoMode: true };
  }

  const content = await anthropicClient.complete({
    system: SYSTEM_PROMPT,
    prompt: `Company: ${company}\n\nFind and summarize current analyst and market sentiment toward this company.`,
    useWebSearch: true,
  });

  return { agent: AGENT_NAME, company, content, demoMode: false };
}

module.exports = { name: AGENT_NAME, run };
