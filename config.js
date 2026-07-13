// src/services/anthropicClient.js
//
// Thin, resilient wrapper around the Anthropic Messages API. Centralizing
// this means every agent gets the same timeout/retry/error-handling
// behavior for free instead of duplicating fetch logic five times.
//
// This module is only ever called when config.demoMode is false — agents
// are responsible for branching to demo data themselves (see
// services/demoData.js), keeping this file focused purely on talking to
// the real API.

const config = require("../config");
const logger = require("../logger");

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 800;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class AnthropicError extends Error {
  constructor(message, { status, retryable = false } = {}) {
    super(message);
    this.name = "AnthropicError";
    this.status = status;
    this.retryable = retryable;
  }
}

async function complete({ system, prompt, useWebSearch = false, maxTokens }) {
  const body = {
    model: config.anthropicModel,
    max_tokens: maxTokens || (useWebSearch ? 2200 : 1200),
    system: system || undefined,
    messages: [{ role: "user", content: prompt }],
  };
  if (useWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];
  }

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutMs = useWebSearch ? 45000 : 30000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(config.anthropicBaseUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.anthropicApiKey,
          "anthropic-version": config.anthropicVersion,
        },
        body: JSON.stringify(body),
      });
      clearTimeout(timer);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.error?.message || `Anthropic API returned HTTP ${res.status}`;
        const retryable = res.status === 429 || res.status >= 500;
        throw new AnthropicError(message, { status: res.status, retryable });
      }

      const text = (data?.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      if (!text) {
        throw new AnthropicError(
          `Agent returned an empty response (stop_reason: ${data?.stop_reason || "unknown"})`,
          { retryable: false }
        );
      }

      return text;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;

      const isAbort = err.name === "AbortError";
      const isRetryable = isAbort || err.retryable;

      if (attempt < MAX_RETRIES && isRetryable) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        logger.warn(`Anthropic call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms`, {
          error: err.message,
        });
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  if (lastErr && lastErr.name === "AbortError") {
    throw new AnthropicError("Request to Anthropic API timed out.", { retryable: false });
  }
  throw lastErr instanceof AnthropicError
    ? lastErr
    : new AnthropicError(lastErr?.message || "Unknown error calling Anthropic API");
}

module.exports = { complete, AnthropicError };
