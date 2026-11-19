# Self-assessment — Seminar: A Measured Look at Something New

Submitted by:
* 23120319 — Trương Thành Phát
* 23120327 — Thái Thiên Phú
* 23120380 — Huỳnh Lê Minh Triết

Target Zip Name: `23120319-23120327-23120380_93.zip`  
Total we claim: **93 / 100**

| Criterion | Max | We claim | Evidence |
| :--- | :---: | :---: | :--- |
| **1. The question and the baseline** | 15 | **14** | `REPORT.md` §1 names the one-line question with the change (KV cache reuse), metric (latency reduction, cost per 1k requests) and cost (+458 ms initial write penalty). Repository link is on line 3 of `REPORT.md` (https://github.com/USThienPhu/pre-caching-proj). `REPORT.md` §2.1 explicitly lists all controlled variables held constant (same GPU T4, same model `Llama-3.2-3B-Instruct`, greedy decoding `temp=0.0`, same context text). The baseline differs in only one thing: forced cache miss via unique prefix nonce vs. warm prefix cache hit. |
| **2. The measurement re-runs** | 30 | **28** | `README.md` details reproduction from a fresh clone with exactly one command (`npm run measure`). Implements deterministic replay mode reading directly from `results/run-2026-11-19T14-54-05-361Z.json` without requiring API keys or active servers. Measures 5 independent runs reporting numerical median and min-max spread. Every number in `REPORT.md` §3 maps directly to the raw JSON logs. |
| **3. Findings and recommendation** | 20 | **18** | `REPORT.md` §3 & §4 report headline numbers: 11.4% latency drop (median 3,051 ms down to 2,703 ms), 38.0% cost reduction ($0.1825 down to $0.1133), and 66.1% spread variance reduction. `REPORT.md` §4.2 specifically analyzes when **NOT** to use prompt caching (dynamic prefix nonces, low-concurrency LRU eviction, and high output-to-input ratios). §4.3 details the limits of public WAN tunneling. |
| **4. The talk** | 15 | **14** | `TALK.md` contains public video link (< 8 minutes). The talk structure starts with the core research question, shows terminal live screencast of `npm run measure` and JSON logs, presents headline figures with spread, and ends with architectural recommendations. All team members present. Slides provided in `slides.pdf`. |
| **5. Sources and facts** | 10 | **10** | `REPORT.md` §5 cites official primary documentation: vLLM PagedAttention documentation (`docs.vllm.ai`), Unsloth AI inference architecture (`unsloth.ai`), and OpenAI Prompt Caching official specification, all with the exact access date (November 19, 2026). No secondary blogs or unverified claims. |
| **6. AI-LOG.md** | 10 | **9** | `AI-LOG.md` documents tool used (Antigravity / Gemini 3.8 Flash). Features 2 concrete **Changed / Rejected** entries: (1) catching and rejecting hallucinated model IDs resulting in HTTP 404 errors, and (2) identifying and correcting a flawed baseline design that contaminated measurements with unintended cache hits. |

---

## What we did not manage

* **In-datacenter / Local TTFT Profiling**: Our client script ran locally in Vietnam while the GPU inference server was hosted remotely on Google Colab via a public Cloudflare Tunnel. Consequently, the measured round-trip latency included ~1,500 ms of transatlantic WAN network overhead. While the 616 reused tokens successfully demonstrated a 38.0% cost reduction and an 11.4% end-to-end latency reduction, we did not isolate pure GPU Time-To-First-Token (TTFT) at the microsecond level due to lack of local high-VRAM hardware.
* **Large Context Scaling (>8,000 tokens)**: Due to Google Colab T4 GPU memory boundaries (15GB VRAM) and vLLM KV cache block allocation limits, we restricted our dataset context to ~1,000 tokens. We did not run benchmarks on contexts exceeding 16,000 tokens where prompt caching would exhibit its most dramatic speedups (>60%).

---

## What we would do differently

* **Benchmark Multiple Context Lengths Upfront**: We should have structured our automated harness to evaluate three distinct context tiers (500 tokens, 2,000 tokens, and 4,000 tokens) in a single run. That would have provided a clean XY curve showing how latency reduction scales non-linearly with prefix length.
* **Stream Responses for Precise TTFT Capture**: Instead of measuring full HTTP request-to-response duration, streaming the Server-Sent Events (SSE) response and logging the timestamp of the very first incoming chunk would have eliminated decode-phase variance from our latency numbers.
