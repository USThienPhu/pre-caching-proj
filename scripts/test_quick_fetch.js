import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

console.log("Testing direct HTTP fetch to Gemini API...");
const t0 = performance.now();

try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello! Reply with 1 word." }] }]
    }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);
  const data = await res.json();
  const latency = Math.round(performance.now() - t0);
  console.log(`Success in ${latency}ms! Status code: ${res.status}`);
  console.log("Full response data:", JSON.stringify(data, null, 2));
} catch (err) {
  console.error("Fetch failed or timed out:", err.message);
}
