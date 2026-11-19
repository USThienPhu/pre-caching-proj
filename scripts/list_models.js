import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

const ai = new GoogleGenerativeAI(apiKey);

async function check() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Available models for this API key:");
    if (data.models) {
      const generateModels = data.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
      console.log(generateModels);
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error("Check failed:", err);
  }
}

check();
