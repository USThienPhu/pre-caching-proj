# AI Collaboration & Audit Log (AI-LOG.md)

* **Course**: CSC13114 - Advanced Web Application Development (CQ2023/3)
* **Team**: StudentID1, StudentID2, StudentID3
* **AI Tool Utilized**: Antigravity (Powered by Google Gemini 3.8 Flash)

---

## 1. Scope of AI Usage

| Stage / Component | How AI was used |
| :--- | :--- |
| **Measurement Harness** | Generated boilerplate JavaScript script (`measure.js`) to call OpenAI-compatible endpoints with high-resolution timers (`performance.now()`). |
| **Statistical Calculations** | Synthesized functions to compute numerical median and spread (min-max) across 5 independent trials. |
| **Report Drafting** | Structured initial draft of `REPORT.md` following academic empirical paper guidelines. |

---

## 2. Changed / Rejected Log (Critical Requirement - Rubric Criterion 6)

The rubric strictly demands documenting instances where the AI generated incorrect facts, flawed benchmarks, or broken APIs, and how our team detected and corrected them:

### Incident 1: Hallucinated / Outdated Model Identifier (API 404 Error)
* **Prompt to AI**: "Write a script to call Google Gemini API to test Prompt Caching."
* **AI Output**: The assistant initially configured `gemini-1.5-flash-001` and later `gemini-2.5-flash`.
* **Issue Detected**: When executed in the terminal, Google API returned:
  ```text
  [404 Not Found] This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash.
  ```
* **Team Action & Correction**: We rejected the hardcoded model names, inspected the available model catalog via `ModelService.ListModels`, and ultimately transitioned our architecture to a self-hosted **Unsloth / vLLM** server on Google Colab to maintain complete sovereignty over our KV cache memory and avoid third-party rate limits.

### Incident 2: Flawed Baseline with Contaminated Prefix Cache
* **Prompt to AI**: "Measure the baseline by running the prompt 5 times in a loop."
* **AI Output**: The assistant originally proposed sending the identical prompt 5 times in a row for the baseline.
* **Flaw Detected by Team**: Running the same prompt repeatedly in vLLM causes the 2nd, 3rd, 4th, and 5th runs of the "baseline" to hit the prefix cache automatically. This contaminated the baseline data (mixing cache hits into the baseline).
* **Team Action & Correction**: We forced the assistant to prepend a unique run nonce `[TIMESTAMP_RUN_${runIndex}_${Date.now()}]` to the baseline system prompt. This mathematically guaranteed that the baseline is always a 100% Cache Miss (cold evaluation), isolating prompt caching as the single independent variable.
