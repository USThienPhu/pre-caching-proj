# Presentation Video Link (TALK.md)

* **Course**: CSC13114 - Advanced Web Application Development (CQ2023/3)
* **Topic**: B5 - Cutting model cost: routing, prompt caching, batching
* **Repository**: [https://github.com/USThienPhu/pre-caching-proj](https://github.com/USThienPhu/pre-caching-proj)
* **Team Members**:
  * Trương Thành Phát — 23120319
  * Thái Thiên Phú — 23120327
  * Huỳnh Lê Minh Triết — 23120380

---

## Video Information

* **Talk Duration**: Under 8 minutes (compliant with rubric).
* **Public Video Link**: [https://youtu.be/YOUR_RECORDED_TALK_LINK_HERE](https://youtu.be/YOUR_RECORDED_TALK_LINK_HERE)  
  *(Or Google Drive link with access set to "Anyone with the link can view")*

---

## Presentation Structure in Video
1. **[00:00 - 01:15] Research Question & Problem Statement**: Why web applications with large system prompts suffer from latency and token costs.
2. **[01:15 - 03:00] Architecture & Controlled Baseline**: Explaining the vLLM / Unsloth engine on GPU T4 and how KV Cache reuse works.
3. **[03:00 - 05:00] Terminal Live Demo**: Screencast running `npm run measure`, explaining the 5 trials and the JSON log output.
4. **[05:00 - 06:45] Key Statistical Findings**: Presenting the Headline Numbers (38% cost reduction, 11.4% latency drop, 66% spread reduction).
5. **[06:45 - 07:50] Architectural Recommendations & Trade-offs**: When NOT to use prompt caching (write overhead + dynamic prefixes).
