// src/services/demoData.js
//
// Generates clearly-labeled simulated research content so the product can
// be run and demonstrated with zero setup and zero API cost. Every string
// this module returns is templated with the requested company name but the
// content is fictional — agents and the frontend both surface a "DEMO MODE"
// notice so simulated output can never be mistaken for real research.

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function news(company) {
  const seed = seedFromString(company + "news");
  const angle = pick(
    [
      "announced an expanded partnership aimed at accelerating product delivery in its core markets",
      "reported a leadership change in its regional operations, with analysts split on the near-term impact",
      "unveiled a new product line targeting enterprise customers, drawing cautiously positive trade press coverage",
      "faced a minor supply-chain disruption that management described as temporary",
    ],
    seed
  );
  return (
    `[DEMO MODE \u2014 simulated, not real news]\n\n` +
    `Over the trailing month, ${company} ${angle}. Coverage volume has been moderate, with no single story ` +
    `dominating the news cycle. Trade publications frame the company's positioning as broadly stable, while a ` +
    `handful of opinion pieces raise open questions about competitive intensity in ${company}'s sector.\n\n` +
    `Key simulated headlines:\n` +
    `- "${company} widens enterprise push amid steady demand" (simulated, Business Wire style)\n` +
    `- "Analysts weigh in on ${company}'s latest quarter" (simulated, trade press style)\n` +
    `- "${company} faces measured competitive pressure in core segment" (simulated, opinion style)`
  );
}

function fundamentals(company) {
  const seed = seedFromString(company + "fund");
  const growth = (4 + (seed % 9)).toFixed(1);
  const margin = (15 + (seed % 12)).toFixed(1);
  const pe = 18 + (seed % 20);
  return (
    `[DEMO MODE \u2014 simulated, not real financial data]\n\n` +
    `Illustrative fundamentals for ${company} (figures are fabricated for demonstration only):\n` +
    `- Revenue growth (trailing twelve months): ~${growth}% YoY\n` +
    `- Operating margin: ~${margin}%\n` +
    `- Illustrative P/E multiple: ~${pe}x\n` +
    `- Balance sheet: simulated as net-cash positive with no near-term maturity wall\n\n` +
    `In this simulated scenario, ${company}'s margin profile is broadly in line with sector peers, with revenue ` +
    `growth moderating from prior-year levels. None of these figures are sourced from real filings \u2014 connect a ` +
    `real Anthropic API key to replace this with live, web-sourced fundamentals.`
  );
}

function sentiment(company) {
  const seed = seedFromString(company + "sent");
  const tone = pick(["cautiously optimistic", "mixed", "modestly positive", "neutral-to-positive"], seed);
  const score = 55 + (seed % 30);
  return (
    `[DEMO MODE \u2014 simulated, not real sentiment data]\n\n` +
    `Simulated analyst and market sentiment toward ${company} is currently ${tone}. On a fabricated 0-100 ` +
    `sentiment scale used only for this demo, ${company} scores ~${score}, driven by simulated commentary that ` +
    `highlights steady execution offset by sector-wide multiple compression concerns.\n\n` +
    `Simulated sell-side tone: a slight majority of illustrative analyst notes lean constructive, with a ` +
    `minority flagging valuation as the key risk to the thesis.`
  );
}

function synthesis(company, { newsText, fundamentalsText, sentimentText }) {
  return (
    `[DEMO MODE \u2014 simulated synthesis]\n\n` +
    `Combining the simulated News, Fundamentals, and Sentiment findings above, the illustrative overall read on ` +
    `${company} is: a stable, moderate-growth story with no major simulated red flags, sentiment leaning ` +
    `constructive, and valuation as the primary point of debate in this fabricated scenario.\n\n` +
    `Simulated overall signal: HOLD / NEUTRAL-TO-POSITIVE (illustrative only \u2014 not a real recommendation).\n\n` +
    `This section exists to demonstrate how the Synthesis agent merges the outputs of the three research agents ` +
    `above into one narrative. In Live Mode, this same agent receives your real News/Fundamentals/Sentiment ` +
    `results as context and produces a genuine synthesis grounded in current web search results.`
  );
}

function compliance(company) {
  return (
    `[DEMO MODE \u2014 simulated compliance check]\n\n` +
    `Illustrative compliance audit for the ${company} research above:\n` +
    `- Disclosure check: PASS (simulated) \u2014 demo content is clearly labeled as fabricated throughout\n` +
    `- Unverifiable claims: N/A in demo mode (no real claims were made)\n` +
    `- Recommendation-language check: PASS (simulated) \u2014 output frames itself as illustrative, not advice\n\n` +
    `In Live Mode, this agent reviews the Synthesis agent's actual output for unsupported claims, missing ` +
    `disclaimers, or language that could be mistaken for investment advice, and flags anything that needs a ` +
    `human review before this research is shared.`
  );
}

module.exports = { news, fundamentals, sentiment, synthesis, compliance };
