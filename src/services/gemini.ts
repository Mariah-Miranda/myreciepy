import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tips: string[];
}

export async function generateRecipe(params: {
  ingredients?: string;
  cuisine?: string;
  diet?: string;
  mood?: string;
}): Promise<Recipe> {
  const prompt = `Generate a unique and delicious recipe based on the following preferences:
${params.ingredients ? `- Ingredients on hand: ${params.ingredients}` : ""}
${params.cuisine ? `- Cuisine style: ${params.cuisine}` : ""}
${params.diet ? `- Dietary restrictions: ${params.diet}` : ""}
${params.mood ? `- Mood/Occasion: ${params.mood}` : ""}

Provide a creative recipe that is easy to follow.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cookingTime: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            enum: ["Easy", "Medium", "Hard"]
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "description", "ingredients", "instructions", "cookingTime", "difficulty"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as Recipe;
  } catch (e) {
    console.error("Failed to parse recipe JSON", e);
    throw new Error("Could not generate a valid recipe. Please try again.");
  }
}
