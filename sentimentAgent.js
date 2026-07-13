// src/agents/synthesisAgent.js
//
// Combines the News, Fundamentals, and Sentiment agents' outputs into one
// coherent narrative. Does not use web search — it reasons purely over the
// other three agents' already-researched content, which keeps it fast and
// keeps its conclusions traceable back to a specific upstream agent.

const config = require("../config");
const anthropicClient = require("../services/anthropicClient");
const demoData = require("../services/demoData");

const AGENT_NAME = "synthesis";

const SYSTEM_PROMPT = `You are the Synthesis Agent inside a multi-agent equity research pipeline.
You will be given three research notes about the same company: News, Fundamentals, and Sentiment.
Your job: synthesize them into one coherent narrative (300-450 words) that explains how they fit
together — where they reinforce each other, where they're in tension, and what the overall picture
looks like. End with a single clearly-labeled "Overall signal" line (e.g. "Overall signal: neutral,
leaning constructive") that reflects the balance of the evidence — not your own outside opinion.
Explicitly note if any of the three inputs said information could not be found.`;

async function run(company, { newsText, fundamentalsText, sentimentText }) {
  if (config.demoMode) {
    return {
      agent: AGENT_NAME,
      company,
      content: demoData.synthesis(company, { newsText, fundamentalsText, sentimentText }),
      demoMode: true,
    };
  }

  const prompt =
    `Company: ${company}\n\n` +
    `--- NEWS AGENT FINDINGS ---\n${newsText}\n\n` +
    `--- FUNDAMENTALS AGENT FINDINGS ---\n${fundamentalsText}\n\n` +
    `--- SENTIMENT AGENT FINDINGS ---\n${sentimentText}\n\n` +
    `Synthesize the above into one coherent narrative as instructed.`;

  const content = await anthropicClient.complete({
    system: SYSTEM_PROMPT,
    prompt,
    useWebSearch: false,
  });

  return { agent: AGENT_NAME, company, content, demoMode: false };
}

module.exports = { name: AGENT_NAME, run };
