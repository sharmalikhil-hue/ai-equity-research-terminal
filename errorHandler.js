// src/agents/newsAgent.js
//
// Gathers and summarizes recent news for a company using live web search
// (Live Mode), or returns labeled simulated output (Demo Mode).

const config = require("../config");
const anthropicClient = require("../services/anthropicClient");
const demoData = require("../services/demoData");

const AGENT_NAME = "news";

const SYSTEM_PROMPT = `You are the News Agent inside a multi-agent equity research pipeline.
Your job: find and summarize the most relevant recent news for the given company.
Use web search to find current information. Prioritize the last 30-60 days.
Write a concise, factual summary (250-400 words) covering: major announcements, leadership
or strategy changes, notable partnerships or deals, and any controversies or risks in the news.
Do not give investment advice or a buy/sell opinion — that is handled by a different agent.
If you cannot find meaningful recent news, say so plainly rather than inventing details.`;

async function run(company) {
  if (config.demoMode) {
    return { agent: AGENT_NAME, company, content: demoData.news(company), demoMode: true };
  }

  const content = await anthropicClient.complete({
    system: SYSTEM_PROMPT,
    prompt: `Company: ${company}\n\nFind and summarize the most relevant recent news for this company.`,
    useWebSearch: true,
  });

  return { agent: AGENT_NAME, company, content, demoMode: false };
}

module.exports = { name: AGENT_NAME, run };
