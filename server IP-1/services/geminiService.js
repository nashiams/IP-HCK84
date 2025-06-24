import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
   * Prompt Gemini with a structured schema and return parsed JSON.
//    * @param {string} promptText - The prompt combining requirements and code chunk.
//    * @param {object} responseSchema - JSON schema describing expected structure.
//    * @returns {Promise<any>} - Parsed JSON response.
   */
async function generateStructured(promptText, responseSchema) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text);
}

export default generateStructured;
// module.exports = { generateStructured };
