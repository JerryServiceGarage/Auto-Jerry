import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: "Find 5 real 5-star Google reviews for 'Jerry Service Garage' in Ile Perrot, Quebec (or nearby). Return ONLY a JSON array of objects with 'name' (First name and first initial of last name, e.g., 'John D.'), 'text' (the review text), and 'rating' (5). Do not use markdown formatting, just output the raw JSON array.",
      config: { tools: [{ googleSearch: {} }] }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
