const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const os = require("os");

process.env.ANTHROPIC_API_KEY = ""; // force demo mode regardless of local .env
process.env.HISTORY_FILE = path.join(os.tmpdir(), `eq-terminal-pipeline-test-${Date.now()}.json`);

const pipeline = require("../src/services/pipeline");

test("runResearch produces all 5 agent results per company in demo mode", async () => {
  const events = [];
  const run = await pipeline.runResearch(["TestCorp"], (e) => events.push(e));

  assert.strictEqual(run.demoMode, true);
  assert.deepStrictEqual(run.companies, ["TestCorp"]);

  const result = run.results.TestCorp;
  for (const agent of ["news", "fundamentals", "sentiment", "synthesis", "compliance"]) {
    assert.ok(result[agent], `missing ${agent} result`);
    assert.ok(result[agent].content.length > 0, `${agent} content should not be empty`);
    assert.match(result[agent].content, /DEMO MODE/);
  }

  const doneEvents = events.filter((e) => e.type === "status" && e.state === "done");
  assert.strictEqual(doneEvents.length, 5);

  const completeEvent = events.find((e) => e.type === "run_complete");
  assert.ok(completeEvent);
  assert.strictEqual(completeEvent.runId, run.id);
});

test("runResearch rejects more than 3 companies", async () => {
  await assert.rejects(
    () => pipeline.runResearch(["A", "B", "C", "D"], null),
    /at most 3 companies/
  );
});

test("runResearch rejects empty company list", async () => {
  await assert.rejects(() => pipeline.runResearch([], null), /at least one company/);
});

test("runResearch handles multiple companies independently", async () => {
  const run = await pipeline.runResearch(["Alpha", "Beta"], null);
  assert.deepStrictEqual(Object.keys(run.results).sort(), ["Alpha", "Beta"]);
  assert.strictEqual(run.results.Alpha.company, "Alpha");
  assert.strictEqual(run.results.Beta.company, "Beta");
});
