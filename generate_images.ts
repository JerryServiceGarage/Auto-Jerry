import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImage(prompt, filename) {
  try {
    console.log(`Generating image for: ${filename}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      },
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const buffer = Buffer.from(base64Data, 'base64');
          const dir = path.join(process.cwd(), 'public', 'images');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, filename), buffer);
          console.log(`Saved ${filename}`);
          return;
        }
      }
    }
    console.log(`Failed to generate ${filename}`);
  } catch (e) {
    console.error(`Error generating ${filename}:`, e);
  }
}

async function run() {
  const basePrompt = "A vintage auto repair garage, clean retro aesthetic, featuring a color palette of cream/beige background, teal/aqua accents, coral red highlights, and dark brown. Vector art style, flat design, highly detailed, nostalgic feel.";
  
  await generateImage(`${basePrompt} Showing a classic car being repaired.`, "hero.png");
  await generateImage(`${basePrompt} Showing a retro mechanic's toolbox and tools.`, "services.png");
  await generateImage(`${basePrompt} Showing the exterior of a classic 1950s service station.`, "about.png");
}

run();
