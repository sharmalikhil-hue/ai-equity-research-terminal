// src/agents/complianceAgent.js
//
// Audits the Synthesis agent's output for unsupported claims, missing
// disclaimers, or language that reads as investment advice. This is the
// last stage of the pipeline and exists to catch problems before research
// is shown to a user, not to add new research content of its own.

const config = require("../config");
const anthropicClient = require("../services/anthropicClient");
const demoData = require("../services/demoData");

const AGENT_NAME = "compliance";

const SYSTEM_PROMPT = `You are the Compliance Agent inside a multi-agent equity research pipeline.
You will be given the Synthesis agent's final narrative about a company. Your job is to audit it,
not to add new research. Check for: (1) any claims stated as fact that aren't clearly grounded in
the research it references, (2) any language that reads as direct investment advice ("you should
buy/sell") rather than descriptive analysis, (3) whether a disclaimer is needed. Output a short
audit (150-250 words) structured as:
- Unverifiable claims: [list or "none found"]
- Advice-language check: [pass/flag, with reason]
- Disclaimer needed: [yes/no]
- Overall compliance verdict: [pass / needs review]`;

async function run(company, { synthesisText }) {
  if (config.demoMode) {
    return { agent: AGENT_NAME, company, content: demoData.compliance(company), demoMode: true };
  }

  const prompt =
    `Company: ${company}\n\n--- SYNTHESIS AGENT OUTPUT TO AUDIT ---\n${synthesisText}\n\n` +
    `Audit the above as instructed.`;

  const content = await anthropicClient.complete({
    system: SYSTEM_PROMPT,
    prompt,
    useWebSearch: false,
  });

  return { agent: AGENT_NAME, company, content, demoMode: false };
}

module.exports = { name: AGENT_NAME, run };
