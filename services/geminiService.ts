
import { GoogleGenAI } from "@google/genai";
import type { PlateSolveResult } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = "gemini-3-flash-preview";

export async function solvePlate(imageData: string, mimeType: string): Promise<PlateSolveResult> {
  const prompt = `
    You are an expert astronomer and astrophotographer. Your task is to perform a plate solve on the provided astronomical image. Analyze the star patterns, constellations, and any deep-sky objects visible.

    Based on your analysis, provide the following information in a JSON format. Do not include any introductory text, comments, or markdown formatting like \`\`\`json. Your entire response must be only the raw JSON object.

    The JSON object must have the following structure:
    {
      "ra": "string",
      "dec": "string",
      "fov": "string",
      "constellation": "string",
      "objects": ["string"],
      "summary": "string"
    }

    Example values:
    - ra: "05h 34m 31s"
    - dec: "+22° 00' 52\\""
    - fov: "2.5° x 1.8°"
    - constellation: "Orion"
    - objects: ["Orion Nebula (M42)", "Horsehead Nebula (Barnard 33)"]
    - summary: "A detailed description of the objects in the image."
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          parts: [
            { inlineData: { data: imageData, mimeType: mimeType } },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
        throw new Error("The AI returned an empty response. The image might be unidentifiable.");
    }

    const resultText = response.text;
    const parsedResult: PlateSolveResult = JSON.parse(resultText);

    // Basic validation to ensure the result matches the expected structure
    if (
      !parsedResult.ra ||
      !parsedResult.dec ||
      !parsedResult.fov ||
      !parsedResult.constellation ||
      !Array.isArray(parsedResult.objects) ||
      !parsedResult.summary
    ) {
      throw new Error("AI response is malformed or missing required fields.");
    }

    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the AI's response. The model may not have been able to identify the image content.");
    }
    throw new Error("An error occurred while communicating with the AI service.");
  }
}
