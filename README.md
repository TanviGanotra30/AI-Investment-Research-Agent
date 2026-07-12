# AI Investment Research Agent

An AI agent that takes a public company's name, researches it, and returns an
**INVEST / HOLD / PASS** recommendation with the reasoning behind it — built with
**Next.js, LangGraph.js, and Google Gemini**.

---

## Overview

The app takes a company name from the user (e.g. `Tesla`, `Apple`, `Infosys`), then:

1. Looks up the company's stock fundamentals (market cap, P/E, EPS, margins, 52-week range, etc.)
2. Gathers a market-sentiment signal
3. Feeds both into an LLM (Gemini) acting as a "Senior Investment Research Analyst," which returns a
   structured verdict: decision, confidence score, reasoning, pros, cons, and risk level

The result is shown on a simple web UI: the company, the final decision (color-coded), and the AI's
written reasoning.

This is a single Next.js app — the React frontend and the API/agent backend live in the same project.

---

## How to Run It

### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A free [Alpha Vantage](https://www.alphavantage.co/support/#api-key) API key (stock fundamentals)

Open [https://ai-investment-agentt.vercel.app/], type a company name into the search box, and
click **Analyze**.

> **Note:** Alpha Vantage's free tier is rate-limited (5 requests/min, 25/day at time of writing).
> If you hit the limit, the agent falls back to noting that financial data isn't available and still
> produces a recommendation from the LLM's own knowledge.

---

## How It Works

### Architecture

```
User Input (company name)
        │
        ▼
  SearchBox (React) ──POST /api/research──▶ API Route (route.ts)
                                                    │
                                                    ▼
                                          investmentService()
                                                    │
                                                    ▼
                                     LangGraph StateGraph (investmentGraph.ts)

                        START → financeNode → newsNode → analysisNode → END
                                    │             │              │
                                    ▼             ▼              ▼
                          Alpha Vantage API   sentiment      Gemini LLM
                          (company fundamentals)  signal   (structured JSON verdict)
                                                    │
                                                    ▼
                                        recommendation JSON
                                                    │
                                                    ▼
                                UI: DecisionCard + ReasoningCard
```

### The pieces

- **`src/graph/state.ts`** — the shared LangGraph state: `company`, `financialData`, `news`,
  `recommendation`.
- **`src/graph/nodes/financeNode.ts`** — maps the company name to a ticker (`symbolMapper.ts`, a small
  hardcoded lookup table for common names, falling back to uppercasing the input as a ticker guess),
  then calls Alpha Vantage's `OVERVIEW` endpoint (`tools/financeTool.ts`) to pull fundamentals
  (sector, market cap, P/E, EPS, profit margin, dividend yield, 52-week range, description).
- **`src/graph/nodes/newsNode.ts`** — supplies a market-sentiment signal to the analysis step.
- **`src/graph/nodes/analysisNode.ts`** — the reasoning step. Sends the company name, financial data,
  and sentiment to Gemini (`lib/gemini.ts`, via `@langchain/google-genai`) with a prompt that asks for
  a strict JSON verdict (`company`, `decision`, `confidence`, `reasoning`, `pros`, `cons`, `riskLevel`)
  and explicitly instructs the model to keep its decision, risk level, and confidence internally
  consistent. The response is stripped of markdown/code-fence formatting and parsed as JSON.
- **`src/graph/investmentGraph.ts`** — wires the three nodes into a single linear LangGraph pipeline.
- **`src/services/investmentService.ts`** — invokes the graph with the company name and returns just
  the final `recommendation` object.
- **`src/app/api/research/route.ts`** — a single `POST` endpoint that the frontend calls with
  `{ company }` and that returns the recommendation JSON (or a 500 with error details on failure).
- **`src/app/page.tsx`** + **`src/components/*`** — the UI: `Header`, `SearchBox` (input + Analyze
  button), a `Loading` spinner while the agent runs, then `ResearchCard` (company name),
  `DecisionCard` (color-coded decision), and `ReasoningCard` (the AI's written reasoning).
- **`src/schemas/investmentSchema.ts`** — a Zod schema describing the expected shape of the LLM's
  output (used as documentation/typing; see trade-offs below for where it isn't yet wired in).

---

## Key Decisions & Trade-offs

- **Single Next.js app instead of separate frontend/backend.** The assignment allows Next.js for both
  layers, so I used API routes for the "backend" instead of standing up a separate Node/Express
  service. Simpler to run, still satisfies the required stack.
- **Linear LangGraph pipeline instead of a looping/tool-calling agent.** `financeNode → newsNode →
  analysisNode` is a fixed sequence rather than an LLM deciding which tools to call. This is easier to
  reason about, debug, and keep deterministic and cheap for a first version, at the cost of the
  flexibility a true agentic loop (e.g., the model deciding to fetch more data, or skip a step) would
  give.
- **Alpha Vantage for fundamentals.** Chosen because it has a free tier and a single `OVERVIEW` call
  returns most of what's needed for a quick research snapshot. Trade-off: the free tier is
  rate-limited, and I did not add caching or a paid fallback provider.
- **Static ticker map instead of a real symbol-lookup API.** `symbolMapper.ts` hardcodes a handful of
  well-known companies (Apple, Tesla, Microsoft, Google, Amazon, Nvidia, Meta, Infosys, TCS, Wipro)
  and otherwise just uppercases whatever the user typed and assumes it's a valid ticker. This works
  for common names but will silently fail (or return the wrong company) for anything not in the map or
  not already a correct ticker. A proper symbol-search endpoint would fix this, but I left it out to
  keep the finance step to a single, fast, free API call.
- **News/sentiment step is a stubbed signal, not a live news pull.** Given the 7-day scope, I
  prioritized a working, structured end-to-end decision pipeline (fundamentals → LLM → verdict) over
  wiring up a live news/sentiment API for every run. This is the single biggest simplification in the
  project, and it's the first thing I'd fix — see below.
- **Strict prompt-engineered JSON instead of LangChain's structured-output/tool-calling API.** The
  `analysisNode` asks Gemini for JSON in the prompt text and manually strips code fences before
  `JSON.parse`, rather than using a structured-output method that enforces the schema at the API
  level. Simpler to implement, but less robust — a malformed response from the model will throw
  instead of being caught and retried.
- **Minimal UI.** The response includes `confidence`, `pros`, `cons`, and `riskLevel` (and the schema
  models them), but the current UI only surfaces the company, the decision, and the reasoning text. I
  chose to get one clean, working "search → verdict" flow shipped rather than build out every field's
  presentation.
- **No deployment yet.** Given the time available I focused on a solid local implementation over
  standing it up on Vercel; it's on the "what I'd improve" list below.

---

## Example Runs
<img width="1897" height="860" alt="Screenshot 2026-07-12 222139" src="https://github.com/user-attachments/assets/43d5cccc-ceba-4721-ae9d-b37494f57d54" />

<!--
  Fill this in with 2–3 actual runs of your agent before submitting, e.g.:

  ### Tesla
  - Decision: ...
  - Confidence: ...
  - Reasoning: "..."
  - Risk Level: ...

  ### Infosys
  - Decision: ...
  ...

  (Paste real output from your terminal/browser here — screenshots or copied JSON both work.)
-->

<img width="1758" height="787" alt="Screenshot 2026-07-12 221719" src="https://github.com/user-attachments/assets/1e6c9a80-d4e4-4c56-993f-f83389618798" />
<img width="1901" height="862" alt="Screenshot 2026-07-12 221708" src="https://github.com/user-attachments/assets/404f1dd6-76d1-4073-b069-b4d0177b1f97" />

---

## What I Would Improve With More Time

- **Real news/sentiment.** Replace the stubbed `newsNode` with a live news or sentiment API (e.g., a
  news search API or an LLM web-search tool) so the "market sentiment" input is actually current.
- **Enforce the output schema.** Wire `investmentSchema.ts` into `analysisNode` (e.g., via
  `.withStructuredOutput()` or a `zod` `.parse()` with retry-on-failure) instead of manually stripping
  markdown and trusting `JSON.parse` — the current approach breaks if the model ever wraps or reflows
  its answer unexpectedly.
- **Better ticker resolution.** Replace the hardcoded `symbolMapper` with a real symbol-search call so
  the agent works for any public company, not just the ~10 in the lookup table.
- **Richer UI.** Surface `confidence`, `pros`, `cons`, and `riskLevel` — all already returned by the
  model — instead of just the decision and reasoning.
- **Error/edge-case handling.** Friendly UI states for an unrecognized company, a rate-limited finance
  API, or a malformed LLM response, instead of a raw 500.
- **Streaming/progress UI.** Since the graph has distinct steps, stream progress ("Fetching
  financials…", "Checking sentiment…", "Analyzing…") instead of one opaque loading spinner.
- **Tests.** Unit tests for the graph nodes (especially prompt-output parsing) and an integration test
  for the API route.

---
