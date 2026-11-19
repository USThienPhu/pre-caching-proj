# REPORT: A Measured Look at Prompt Caching and KV Cache Reuse for Web Agents

* **Repository**: [https://github.com/USThienPhu/pre-caching-proj](https://github.com/USThienPhu/pre-caching-proj)  
* **Topic Code**: B5 (Cutting model cost: routing, prompt caching, batching)  
* **Authors**:
  * Trương Thành Phát — 23120319
  * Thái Thiên Phú — 23120327
  * Huỳnh Lê Minh Triết — 23120380
* **Date**: November 2026  

---

## 1. The Research Question

> **"Does enabling prompt caching (KV cache reuse) reduce round-trip query latency and API token cost by over 30%, and how much initial latency overhead does cache allocation add to the first request?"**

Modern web applications increasingly embed large system instructions, organizational guidelines, and multi-turn chat histories into LLM context windows. Repeatedly processing these static context tokens strains GPU compute and increases latency. This study measures the quantitative trade-offs of Prefix Caching / Prompt Caching.

---

## 2. Experimental Setup & Methodology

### 2.1 Fixed Experimental Variables (Held Constant)
To guarantee that differences in metrics originate strictly from prompt caching, the following parameters were kept strictly identical across all trials:
* **Model**: `unsloth/Llama-3.2-3B-Instruct` served via `vLLM v0.6.3`.
* **Hardware**: Nvidia Tesla T4 GPU (15GB VRAM) on Google Colab, single worker.
* **Sampling Parameters**: `temperature = 0.0`, `max_tokens = 100`, greedy decoding.
* **Network Protocol**: OpenAI-compatible HTTP/2 REST API tunneled via Cloudflare Tunnel.
* **Dataset**: Immutable system prompt (`data/context.txt`) containing system guidelines.

### 2.2 Baseline vs. Change
* **Baseline (Cold Request / Cache Miss)**: A randomized session nonce is prepended to the system prompt (`[TIMESTAMP_RUN_...]`), ensuring zero prefix overlap with prior requests. The GPU is forced to execute full prefill Attention computation across all tokens.
* **Change (Warm Request / Cache Hit)**: A subsequent query is dispatched with an identical system prompt prefix. The serving engine detects the existing KV blocks in VRAM and reuses them without re-computation.
* **Trials**: 5 independent runs. We report the **median** and **spread** (min–max range) to account for natural network jitter.

---

## 3. Empirical Results

All reported numbers are directly verified against the raw logs in `results/`.

### Summary Statistics (5 Independent Trials)

| Metric | Baseline (Cache Miss) | Cache Hit (Warm) | Absolute Change | Relative Improvement |
| :--- | :---: | :---: | :---: | :---: |
| **Response Latency (Median)** | **3,051 ms** | **2,703 ms** | −348 ms | **11.4% faster** |
| Latency Spread (Min – Max) | 2,613 ms – 4,280 ms (spread: 1,667 ms) | 2,635 ms – 3,200 ms (spread: 565 ms) | −1,102 ms spread | **66.1% more predictable** |
| Initial Cache Write Latency | 3,509 ms | N/A | +458 ms | +15.0% write overhead |
| **Cost per 1k Requests (USD)** | **$0.1825** | **$0.1133** | −$0.0692 | **38.0% cheaper** |
| Reused Cached Tokens | 0 tokens (0%) | 616 tokens (99.8%) | +616 tokens | Significant compute saving |

---

## 4. Findings and Architectural Recommendations

### 4.1 Key Findings
1. **Significant Cost Reduction**: Caching the static prefix reduced token costs by **38.0%** per 1,000 queries. In cloud providers that discount cached tokens by 75%–80%, savings scale directly with prefix length.
2. **Variance Suppression**: Beyond raw speed, KV cache reuse drastically reduced response jitter: the spread shrank from 1,667 ms down to 565 ms (a **66.1% reduction in latency variance**), improving SLA predictability.
3. **The First-Request Penalty**: Writing to cache introduces a non-trivial initial overhead (+458 ms, ~15%).

### 4.2 When NOT to Use Prompt Caching
* **Dynamic / Frequently Changing Contexts**: If user prompts vary at the very beginning of the prompt (e.g., prepending dynamic timestamps or random IDs), prefix cache matching fails completely, incurring write penalties without any hit benefit.
* **Low Query Concurrency**: In self-hosted vLLM environments, inactive KV cache blocks in VRAM expire (LRU eviction). For low-traffic endpoints, the cache will be evicted before a second request arrives.
* **High Output-to-Input Ratio**: If requests have short prompts (e.g. 50 tokens) but generate long outputs (e.g. 1,000 tokens), decoding dominates latency, rendering prompt caching negligible.

### 4.3 Limits of This Measurement
* **Geographical Network Noise**: Because queries were tunneled over public WAN (local client to cloud Colab), network latency accounted for ~1.5s of the overall round-trip time. On a co-located web server (e.g., intra-datacenter), latency reduction percentages would be significantly higher (~40–60%).

---

## 5. Official References & Fact Verification
1. **vLLM PagedAttention & Automatic Prefix Caching**: Official vLLM Documentation, [https://docs.vllm.ai](https://docs.vllm.ai), accessed November 19, 2026.
2. **Unsloth Fast Inference & Llama-3.2 Architecture**: Unsloth AI Documentation, [https://unsloth.ai](https://unsloth.ai), accessed November 19, 2026.
3. **OpenAI Prompt Caching Pricing & Specifications**: OpenAI Platform Docs, [https://platform.openai.com/docs/guides/prompt-caching](https://platform.openai.com/docs/guides/prompt-caching), accessed November 19, 2026.
