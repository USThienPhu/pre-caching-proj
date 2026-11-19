# Seminar Study: Prompt Caching & KV Cache Reuse in Modern Web Applications

> **Course**: CSC13114 - Advanced Web Application Development (CQ2023/3)  
> **Topic**: B5 - Cutting model cost: routing, prompt caching, batching  
> **Repository**: [https://github.com/your-username/seminar-prompt-caching-study](https://github.com/your-username/seminar-prompt-caching-study)  
> **Team Members**: StudentID1, StudentID2, StudentID3  

---

## 1. Quick Start: How to Reproduce

Anyone (teaching assistants, lecturer, or red-team peers) can clone this repository and re-run the benchmark using **exactly one command**, with zero API keys required.

### Prerequisites
* **Node.js**: v18.0.0 or higher (checked on Windows / Linux / macOS).

### Step-by-Step Execution
```bash
# 1. Clone repository
git clone https://github.com/your-username/seminar-prompt-caching-study.git
cd seminar-prompt-caching-study

# 2. Install dependencies (dotenv)
npm install

# 3. Execute the single reproduction command
npm run measure
```

---

## 2. Execution Modes

### Mode A: Deterministic Replay Mode (Default / Red-Team Mode)
* When no external server is connected, `npm run measure` automatically runs in **Replay Mode**.
* It loads empirical response logs stored in [`results/`](./results) and recomputes the **Median**, **Spread**, **Latency Reduction (%)**, and **Cost Reduction (%)**.
* Ensures 100% reproducibility without paying API fees or maintaining an active GPU server.

### Mode B: Live GPU Benchmark Mode (Google Colab / vLLM)
To benchmark directly against a live GPU inference engine running Unsloth / vLLM:
1. Open the provided Colab notebook or follow [`scripts/colab_server_guide.md`](./scripts/colab_server_guide.md).
2. Start vLLM with prefix caching enabled:
   ```bash
   python3 -m vllm.entrypoints.openai.api_server \
       --model unsloth/Llama-3.2-3B-Instruct \
       --port 8000 \
       --enable-prefix-caching
   ```
3. Copy the public tunnel URL into `.env`:
   ```env
   COLAB_VLLM_BASE_URL=https://your-tunnel-url.trycloudflare.com/v1
   COLAB_MODEL_NAME=unsloth/Llama-3.2-3B-Instruct
   ```
4. Run:
   ```bash
   npm run measure
   ```

---

## 3. Project Structure
```text
.
├── data/
│   └── context.txt           # Standardized multi-section system prompt dataset
├── results/                  # Raw empirical benchmark logs (JSON)
├── scripts/
│   └── colab_server_guide.md # Instructions for self-hosting vLLM / Unsloth
├── src/
│   └── measure.js            # Automated benchmark harness (5 trials, median, spread)
├── package.json              # Declares scripts and dependencies
├── REPORT.md                 # 3-page empirical report and architectural findings
├── slides.pdf                # Presentation slide deck
├── TALK.md                   # Video presentation link (<= 8 minutes)
├── AI-LOG.md                 # Assistant audit log with changed/rejected decisions
└── SELF_ASSESSMENT_REPORT.md # Self-grading rubric evidence table
```
