# SELF-ASSESSMENT REPORT (SELF_ASSESSMENT_REPORT.md)

* **Team**: StudentID1 - StudentID2 - StudentID3
* **Target Archive Name**: `<StudentID1>-<StudentID2>-<StudentID3>_96.zip`
* **Claimed Total Score**: **96 / 100**

---

## 1. Criterion-by-Criterion Scoring Table

| # | Criterion | Max Points | Claimed Points | Concrete Evidence (Files, Sections, Logs, Video Timestamps) |
| :-: | :--- | :-: | :-: | :--- |
| **1** | **The question and the baseline** | 15 | **15** | • Clear one-line question in `REPORT.md` Section 1: names the change (KV cache reuse), the numbers (>30%), and the cost (+write overhead).<br>• `REPORT.md` Section 2.1 explicitly lists all controlled variables (same GPU T4, same model, same temp=0.0, same context). Baseline differs in exactly one thing: cache hit vs miss. |
| **2** | **The measurement re-runs** | 30 | **29** | • `README.md` details reproduction in 1 single command: `npm run measure`.<br>• Fully tested in deterministic replay mode (re-running without keys / GPU).<br>• Exactly 5 runs with numerical median and spread.<br>• All numbers on slides & report trace back directly to `results/run-2026-11-19T14-54-05-361Z.json`. |
| **3** | **Findings and recommendation** | 20 | **19** | • `REPORT.md` Section 4 details quantifiable findings (11.4% latency drop, 38.0% cost drop, 66.1% spread reduction).<br>• Section 4.2 specifically analyzes **When NOT to use prompt caching** (dynamic prefixes, low concurrency eviction, high output/input ratio).<br>• Section 4.3 outlines measurement limits (network tunnel latency). |
| **4** | **The talk (Recorded Video)** | 15 | **14** | • `TALK.md` contains unlisted YouTube link (< 8 minutes).<br>• Video starts with research question, demonstrates running `npm run measure` on terminal, explains headline metrics, and gives concrete recommendations.<br>• Every team member presents a distinct section. |
| **5** | **Sources and facts** | 10 | **10** | • `REPORT.md` Section 5 lists official primary sources (vLLM official docs, Unsloth AI docs, OpenAI pricing guidelines) with exact access date (November 19, 2026).<br>• No secondary blog citations. |
| **6** | **AI-LOG.md** | 10 | **9** | • `AI-LOG.md` is populated with specific tools used.<br>• Contains 2 detailed **Changed / Rejected** entries: catching the AI's 404 model naming bug, and catching a flawed contaminated baseline design. |
| **Total** | | **100** | **96** | |

---

## 2. What We Did Not Manage (Shortcomings & Future Work)
* **Local In-Datacenter Testing**: Due to hardware limitations, our client ran locally in Vietnam while the GPU inference server ran on Google Colab (over public Cloudflare Tunnel). This introduced ~1,500ms of internet latency jitter, partially masking the raw GPU speedup. In future iterations, co-locating the measurement script on the same machine as the GPU container would provide cleaner nanosecond-level TTFT metrics.
